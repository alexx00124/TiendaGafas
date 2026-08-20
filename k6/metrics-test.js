import http from 'k6/http';
import { check } from 'k6';

const METRICS_URL = __ENV.METRICS_URL || 'http://localhost:9091';

export const options = {
  scenarios: {
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
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<200'],
  },
};

export default function () {
  const health = http.get(`${METRICS_URL}/health`);
  check(health, {
    'health status 200': (r) => r.status === 200,
    'health retorna ok': (r) => r.json('status') === 'ok',
  });

  const metrics = http.get(`${METRICS_URL}/metrics`);
  check(metrics, {
    'metrics status 200': (r) => r.status === 200,
    'metrics es texto plano': (r) => r.headers['Content-Type'].includes('text/plain'),
  });

  sleep(0.5);
}