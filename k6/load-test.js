import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const SCENARIO = __ENV.SCENARIO || 'smoke';

const SCENARIOS = {
  smoke: {
    executor: 'constant-vus',
    vus: 5,
    duration: '1m',
  },
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 50 },
      { duration: '5m', target: 50 },
      { duration: '2m', target: 0 },
    ],
  },
  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 25 },
      { duration: '2m', target: 50 },
      { duration: '2m', target: 100 },
      { duration: '2m', target: 150 },
      { duration: '5m', target: 150 },
      { duration: '2m', target: 0 },
    ],
  },
  soak: {
    executor: 'constant-vus',
    vus: 30,
    duration: '30m',
  },
};

export const options = {
  scenarios: {
    run: SCENARIOS[SCENARIO] || SCENARIOS.smoke,
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

const routes = [
  '/',
  '/shop',
  '/featured',
  '/recommended',
  '/signin',
  '/signup',
];

export function setup() {
  const probe = http.get(BASE_URL);
  check(probe, {
    'servidor responde en BASE_URL': (r) => r.status < 500,
  });
  if (probe.status >= 500 || probe.status === 0) {
    throw new Error(`El servidor no responde en ${BASE_URL}. Levanta la app primero (yarn dev) o pasa -e BASE_URL=...`);
  }
  return { ok: true };
}

export default function () {
  const page = routes[__VU % routes.length];
  const res = http.get(`${BASE_URL}${page}`);

  check(res, {
    'status es 200': (r) => r.status === 200,
    'status es 2xx': (r) => r.status >= 200 && r.status < 300,
  });

  sleep(1);
}