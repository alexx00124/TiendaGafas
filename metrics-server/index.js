const express = require('express');
const client = require('prom-client');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 9091;
const DEPLOY_LOG = process.env.DORA_DEPLOY_LOG || path.join(__dirname, '..', 'dora', 'deploy-log.json');

// Habilitar CORS para Prometheus
app.use(cors());

// Recolectar métricas básicas del sistema
client.collectDefaultMetrics({ prefix: 'tienda_' });

// Contador de visitas por ruta
const httpRequestsTotal = new client.Counter({
  name: 'tienda_http_requests_total',
  help: 'Total de peticiones HTTP',
  labelNames: ['method', 'route', 'status']
});

// Histograma de latencia
const httpRequestDuration = new client.Histogram({
  name: 'tienda_http_request_duration_seconds',
  help: 'Duración de peticiones HTTP en segundos',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

// Gauge de conexiones activas
const activeConnections = new client.Gauge({
  name: 'tienda_active_connections',
  help: 'Conexiones activas actualmente'
});

// Contador de errores
const errorsTotal = new client.Counter({
  name: 'tienda_errors_total',
  help: 'Total de errores',
  labelNames: ['type', 'route']
});

// ---- Métricas DORA (proceso de entrega) ----
const doraDeploysTotal = new client.Counter({
  name: 'tienda_dora_deploys_total',
  help: 'Despliegues por resultado',
  labelNames: ['success']
});

const doraDeploymentFrequency = new client.Gauge({
  name: 'tienda_dora_deployment_frequency',
  help: 'Deploys por semana (DORA deployment frequency)'
});

const doraLeadTimeDays = new client.Gauge({
  name: 'tienda_dora_lead_time_days',
  help: 'Lead time for change en días'
});

const doraChangeFailureRate = new client.Gauge({
  name: 'tienda_dora_change_failure_rate',
  help: 'Change failure rate en porcentaje (0-100)'
});

const doraMttrHours = new client.Gauge({
  name: 'tienda_dora_mttr_hours',
  help: 'MTTR en horas'
});

function readDeployLog() {
  try {
    return JSON.parse(fs.readFileSync(DEPLOY_LOG, 'utf-8'));
  } catch {
    return [];
  }
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function refreshDoraMetrics() {
  const deploys = readDeployLog();
  doraDeploysTotal.reset();
  for (const d of deploys) {
    doraDeploysTotal.inc({ success: d.success ? 'ok' : 'failed' });
  }

  const recentWindow = 30 * 24 * 60 * 60 * 1000;
  const recent = deploys.filter((d) => Date.now() - new Date(d.timestamp).getTime() < recentWindow);
  const failed = recent.filter((d) => !d.success).length;
  doraChangeFailureRate.set(recent.length ? (failed / recent.length) * 100 : 0);

  const sorted = [...deploys].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  let failureStart = null;
  const restoreTimes = [];
  for (const d of sorted) {
    if (!d.success) {
      if (failureStart === null) failureStart = new Date(d.timestamp).getTime();
    } else if (failureStart !== null) {
      restoreTimes.push(new Date(d.timestamp).getTime() - failureStart);
      failureStart = null;
    }
  }
  const mttrH = median(restoreTimes);
  doraMttrHours.set(mttrH === null ? 0 : mttrH / 3600000);

  // Frecuencia semanal basada en git log (deploys = commits a master)
  try {
    const { execSync } = require('child_process');
    const out = execSync('git log master --format=%ct --since="84 days ago"', {
      encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const weeks = {};
    for (const ts of out.split('\n').filter(Boolean)) {
      const week = Math.floor((now - (+ts * 1000)) / weekMs);
      if (week <= 12) weeks[week] = (weeks[week] || 0) + 1;
    }
    const counts = Object.values(weeks);
    doraDeploymentFrequency.set(counts.length ? counts.reduce((a, b) => a + b, 0) / Math.min(counts.length, 12) : 0);
  } catch {
    doraDeploymentFrequency.set(0);
  }

  // Lead time (proxy): mediana del gap entre commits consecutivos
  try {
    const { execSync } = require('child_process');
    const out = execSync('git log master --format=%ct', {
      encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    const ts = out.split('\n').filter(Boolean).map(Number);
    const gaps = [];
    for (let i = 1; i < ts.length; i++) {
      const g = ts[i - 1] - ts[i];
      if (g > 0) gaps.push(g);
    }
    const lt = median(gaps);
    doraLeadTimeDays.set(lt === null ? 0 : lt / 86400);
  } catch {
    doraLeadTimeDays.set(0);
  }
}

refreshDoraMetrics();

// Middleware para métricas
app.use((req, res, next) => {
  const start = Date.now();
  activeConnections.inc();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    const labels = { method: req.method, route, status: res.statusCode };

    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, duration);
    activeConnections.dec();

    if (res.statusCode >= 400) {
      errorsTotal.inc({ type: 'http', route });
    }
  });

  next();
});

// Endpoint de métricas para Prometheus
app.get('/metrics', async (req, res) => {
  try {
    refreshDoraMetrics();
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

// Info endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Tienda de Gafas - Metrics Server',
    version: '1.0.0',
    endpoints: {
      metrics: '/metrics',
      health: '/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Metrics server running on port ${PORT}`);
  console.log(`Metrics: http://localhost:${PORT}/metrics`);
  console.log(`Health:  http://localhost:${PORT}/health`);
});
