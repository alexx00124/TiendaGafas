const express = require('express');
const client = require('prom-client');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 9091;

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
