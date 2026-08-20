import http from 'k6/http';
import { check, sleep } from 'k6';

const METRICS_URL = __ENV.METRICS_URL || 'http://localhost:9091';
const SCENARIO = __ENV.SCENARIO || 'smoke';

const SCENARIOS = {
  smoke: {
    executor: 'constant-vus',
    vus: 2,
    duration: '30s',
  },
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 20 },
      { duration: '3m', target: 20 },
      { duration: '1m', target: 0 },
    ],
  },
};

export const options = {
  scenarios: {
    run: SCENARIOS[SCENARIO] || SCENARIOS.smoke,
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<200'],
  },
};

export function setup() {
  const probe = http.get(`${METRICS_URL}/health`);
  check(probe, {
    'servidor responde en METRICS_URL': (r) => r.status < 500,
  });
  if (probe.status >= 500 || probe.status === 0) {
    throw new Error(`El server de métricas no responde en ${METRICS_URL}. Levanta el metrics-server primero (docker compose up -d metrics-server) o pasa -e METRICS_URL=...`);
  }
  return { ok: true };
}

export default function () {
  const health = http.get(`${METRICS_URL}/health`);
  check(health, {
    'health status 200': (r) => r.status === 200,
    'health retorna ok': (r) => r.status === 200 && r.json('status') === 'ok',
  });

  const metrics = http.get(`${METRICS_URL}/metrics`);
  check(metrics, {
    'metrics status 200': (r) => r.status === 200,
    'metrics es texto plano': (r) => r.status === 200 && r.headers['Content-Type'] && r.headers['Content-Type'].includes('text/plain'),
  });

  sleep(0.5);
}