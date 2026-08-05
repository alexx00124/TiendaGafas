# TIENDA DE GAFAS — Documento del Proyecto

Proyecto académico de ingeniería de software sobre una aplicación de **e-commerce de gafas** (React 17 + Vite + Firebase). El objetivo es demostrar un pipeline completo de calidad: código, pruebas, seguridad, CI/CD, métricas ágiles y observabilidad.

---

## 1. Descripción del proyecto

| Aspecto | Detalle |
|---------|---------|
| **Aplicación** | `ecommerce-react` (boilerplate "Salinaka") |
| **Stack** | React 17, Vite 3, Redux, Redux-Saga, Ant Design |
| **Backend** | Firebase (Auth, Firestore, Storage, Functions) |
| **Repo** | [github.com/alexx00124/TiendaGafas](https://github.com/alexx00124/TiendaGafas) |
| **Entorno** | Node v25.9.0, npm 11, Docker disponible |

### Funcionalidades
- Catálogo de productos (búsqueda, filtros por marca/precio, destacados, recomendados)
- Autenticación (email/password + Google/Facebook/GitHub)
- Carrito + checkout (parcial — la confirmación de compra es placeholder)
- Panel Admin (CRUD de productos, subir imágenes a Storage)
- Perfil de usuario y edición
- Cloud Function `lowercaseProductName`

### Cómo correrlo local
```bash
# 1. Dependencias
yarn install

# 2. Variable de entorno (.env en la raíz)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DB_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MSG_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# 3. Servidor de desarrollo
yarn dev   # → http://localhost:3000

# 4. Tests
yarn test

# 5. Tests con cobertura
yarn test:coverage

# 6. Build de producción
yarn build

# 7. Lint
yarn lint
```

### Roles
- **USER**: ve la tienda completa (nav, login, carrito)
- **ADMIN**: ve un panel dedicado. Se activa cambiando `role: "USER"` → `"ADMIN"` en Firestore (colección `users`).

### Docker
```bash
docker compose up app          # App en puerto 8080
docker compose up dev          # Dev en puerto 3000
docker compose up test         # Ejecutar tests
docker compose up sonarqube    # SonarQube en puerto 9000
docker compose up metrics-server prometheus grafana  # Observabilidad
docker compose up --build      # Todo
```

---

## 2. Decisión técnica: bases de datos e imágenes

- El proyecto usa **Cloud Firestore**, NO Realtime Database.
- El campo `image` de cada producto es una **URL** (de Firebase Storage normalmente).
- Para desarrollo sin Storage (plan Spark gratuito, sin bucket), se poblaron **12 productos de ejemplo** cuya `image`/`imageCollection` apuntan a **URLs públicas**.
- Script de seed: `scripts/seed-public-images.js` (usa `service-account.json`, ya ignorado en git).

---

## 3. Plan de trabajo — Estado de fases

### FASE 0 — Repositorio en GitHub ✅ COMPLETADA
- [x] Repo personal: [alexx00124/TiendaGafas](https://github.com/alexx00124/TiendaGafas)
- [x] `.gitignore` configurado (`node_modules/`, `.env*`, `service-account.json`, `dist/`, `coverage/`)
- [x] `.env.example` con variables requeridas

### FASE 1 — Corrección de código (A1–A8 + limpieza) ✅ COMPLETADA

**Críticos**
| ID | Problema | Fix |
|----|----------|-----|
| A1 | `public/index.html` pisa la app en build | Eliminado placeholder de Firebase Hosting |
| A2 | ESLint inejecutable (`babel-eslint` no instalado) | `@babel/eslint-parser` + plugins + script `lint` |
| A3 | CI usa `FIREBASE_*` sin prefijo `VITE_` | Cambiado a `VITE_FIREBASE_*` en workflow |
| A4 | `yarn test` roto (ruta inexistente) | Import corregido + `enzyme-adapter-react-17` + jest config |

**Mayores**
| ID | Problema | Fix |
|----|----------|-----|
| A5 | `setBasketItems` duplicado (`authSaga.js:150-151`) | Eliminado duplicado |
| A6 | `handleError` sin `yield` (`authSaga.js:139`, `productSaga.js:49`) | Añadido `yield` |
| A7 | `process.env.NODE_ENV` en browser (`index.jsx:35`) | Usar `import.meta.env.PROD` |
| A8 | `profileSaga.js:14` `setLoading(false)` en UPDATE_EMAIL | Cambiado a `true` |

**Limpieza menor**
- [x] Eliminadas dependencias muertas: 20 paquetes webpack + `moment` + `live-server` + `enzyme-adapter-react-16`
- [x] Código comentado eliminado de `authReducer.js`, `profileReducer.js`, `userReducer.js`, `firebase.js`, `selector.js`
- [x] `alert()` → `displayActionMessage()` en `useFileHandler.js` y `ProductForm.jsx`
- [x] `.eslintrc.json` alineado a 2 espacios
- [x] `react-hooks/exhaustive-deps` como warning (patrón `didMount` intencional)
- [x] `snap.ref.id` → `snap.id` en 3 hooks
- [x] `jsconfig.json`: `ignoreDeprecations: "6.0"` para `baseUrl`

> Barandilla: NO se altera el comportamiento de roles, layout ni checkout — solo calidad estática.

### FASE 2 — Cobertura de pruebas ✅ COMPLETADA
- [x] `jest --coverage` → carpeta `coverage/` con reporte lcov
- [x] Script `yarn test:coverage`
- [x] Mock de `import.meta.env` en `test/setup.js` para Jest
- [x] Coveralls integrado (dependencia + script + badge en README)
- [x] `coverage/` agregado a `.gitignore`

### FASE 3 — CI/CD: GitHub Actions ✅ COMPLETADA
- [x] `.github/workflows/ci.yml`: lint → build → test+coverage → Coveralls → Snyk → Semgrep
- [x] Variables con prefijo `VITE_*` (secrets en GitHub)
- [x] Badge de CI en README

**Pipeline CI:**
```
push/PR a master → lint → build + test (paralelo) → Snyk + Semgrep
```

### FASE 4 — Seguridad (DevSecOps) ✅ COMPLETADA
- [x] **Snyk**: `.snyk` con política de exclusiones para dev deps
- [x] **Semgrep**: `.semgrep.yml` con 6 reglas SAST:
  - `no-eval` (ERROR) — inyección de código
  - `no-innerhtml` (WARNING) — XSS
  - `no-document-write` (WARNING) — XSS
  - `no-console-log` (WARNING) — info sensible
  - `no-hardcoded-urls` (WARNING) — secrets
  - `no-dangerously-set-innerhtml` (WARNING) — XSS
- [x] `SECURITY.md` con documentación de proceso de reporte

### FASE 5 — Calidad: SonarQube (Docker) ✅ COMPLETADA
- [x] `sonar-project.properties`:
  ```properties
  sonar.projectKey=tienda-de-gafas
  sonar.sources=src
  sonar.tests=test
  sonar.javascript.lcov.reportPaths=coverage/lcov.info
  sonar.exclusions=node_modules/**,dist/**,static/**,coverage/**,test/**
  ```
- [x] Servicio `sonarqube` en `docker-compose.yml` (puerto 9000)
- [x] Servicio `sonar-scanner` para escaneo automático
- [x] Script `scripts/sonar-scan.sh` para escaneo local

### FASE 6 — Gestión ágil: GitHub Projects + Issues + Milestones ✅ COMPLETADA

**Milestones:**
| # | Milestone | Estado |
|---|-----------|--------|
| M1 | Fundación | ✅ Closed |
| M2 | Calidad de Código | ✅ Closed |
| M3 | CI & Cobertura | ✅ Closed |
| M4 | DevSecOps | ✅ Closed |
| M5 | SonarQube | ✅ Closed |
| M6 | Observabilidad | 🔵 Open |

**Labels:** `calidad`, `ci`, `seguridad`, `observabilidad`, `agil`, `fase-0` a `fase-7`

**Issues creados:** 14 issues (13 cerrados, 1 abierto para F7)

### FASE 7 — Observabilidad: metrics-server + Prometheus + Grafana ✅ COMPLETADA

**Metrics Server** (`metrics-server/`):
| Métrica | Tipo | Descripción |
|---------|------|-------------|
| `tienda_http_requests_total` | Counter | Total peticiones HTTP |
| `tienda_http_request_duration_seconds` | Histogram | Latencia por ruta |
| `tienda_active_connections` | Gauge | Conexiones activas |
| `tienda_errors_total` | Counter | Errores totales |
| `process_resident_memory_bytes` | Gauge | Memoria RSS |
| `process_cpu_seconds_total` | Counter | CPU |

**Endpoints:**
- `/metrics` — Métricas para Prometheus
- `/health` — Health check con uptime y memoria

**Prometheus** (`prometheus.yml`):
- Scrape de `metrics-server:9091` cada 15s

**Grafana** (`grafana/`):
- Datasource: Prometheus auto-configurado
- Dashboard: "Tienda de Gafas - Metrics" con 8 paneles:
  - Request Rate, Latency P95/P50, Conexiones Activas
  - Errores Totales, Memoria, CPU, Uptime, Requests by Method

---

## 4. Herramientas elegidas (1 por dominio, open-source/gratis)

| Dominio | Herramienta | Estado |
|---------|-------------|--------|
| Calidad de código | SonarQube (Docker) | ✅ Configurado |
| Gestión ágil | GitHub Projects/Issues/Milestones | ✅ Configurado |
| CI/CD + DevOps | GitHub Actions | ✅ Configurado |
| Cobertura | Jest → Istanbul/c8 → Coveralls | ✅ Configurado |
| Seguridad | Snyk + Semgrep | ✅ Configurado |
| Observabilidad | Node metrics-server + Prometheus + Grafana | ✅ Configurado |

**Descartadas a propósito:** JaCoCo y OWASP (requieren Java); Jenkins/CircleCI/Harness (vs GitHub Actions); Checkmarx/Veracode (de pago).

---

## 5. Orden de ejecución

```
F0 (repo) ✅ → F1 (A1-A8 + limpieza) ✅ → F2 (cobertura) ✅ → F3 (CI) ✅
→ F4 (seguridad) ✅ → F5 (SonarQube) ✅ → F6 (tablero GitHub) ✅
→ F7 (observabilidad) ✅
```

---

## 6. Acciones que requieren cuenta/credenciales del usuario

1. ~~Crear/vincular el repo personal en GitHub.~~ ✅
2. Secretos en GitHub Actions:
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.
   - `COVERALLS_REPO_TOKEN` (de [coveralls.io](https://coveralls.io))
   - `SNYK_TOKEN` (de [snyk.io](https://snyk.io))
3. ~~Primer login de SonarQube local (`admin` / `admin`).~~ ✅
4. Crear tablero Kanban en GitHub Projects (ver `GITHUB_PROJECT.md`)

---

## 7. Estado actual del proyecto — COMPLETADO ✅

### Infraestructura
- ✅ Frontend desplegado en local (`yarn dev` → localhost:3000)
- ✅ Docker multi-stage (producción, dev, tests)
- ✅ Docker Compose completo (app, dev, test, sonarqube, metrics-server, prometheus, grafana)

### Funcionalidad
- ✅ Auth funcionando (email/password)
- ✅ 12 productos de ejemplo con imágenes públicas en Firestore
- ✅ Admin disponible (cambiando role en Firestore)
- ⚠️ Checkout: botón "Confirm" es placeholder ("Feature not ready yet")

### Calidad
- ✅ Lint configurado (`yarn lint`)
- ✅ Tests ejecutables (`yarn test`)
- ✅ Cobertura de código (`yarn test:coverage`)
- ✅ Pipeline CI/CD (GitHub Actions)
- ✅ Análisis de seguridad (Snyk + Semgrep)
- ✅ SonarQube configurado
- ✅ GitHub Projects con milestones e issues

### Observabilidad
- ✅ Metrics server con prom-client
- ✅ Prometheus para scraping
- ✅ Grafana con dashboard pre-configurado

---

## 8. Estructura del proyecto

```
ecommerce-react/
├── .github/workflows/
│   ├── main.yml          # Firebase Deploy
│   └── ci.yml            # CI Pipeline
├── grafana/
│   ├── dashboards/       # Dashboard JSON
│   └── provisioning/     # Datasource + dashboard config
├── metrics-server/       # Node + Express + prom-client
├── scripts/
│   ├── seed-public-images.js
│   └── sonar-scan.sh
├── src/                  # Código fuente React
├── test/                 # Tests Jest + Enzyme
├── docker-compose.yml    # Todos los servicios
├── Dockerfile            # Multi-stage build
├── Dockerfile.dev        # Dev con hot-reload
├── Dockerfile.test       # Tests en contenedor
├── nginx.conf            # SPA routing
├── prometheus.yml        # Config Prometheus
├── sonar-project.properties
├── .snyk                 # Política Snyk
├── .semgrep.yml          # Reglas SAST
└── PROYECTO.md           # Este documento
```

---

## 9. Comandos rápidos

| Comando | Descripción |
|---------|-------------|
| `yarn dev` | Servidor de desarrollo |
| `yarn build` | Build de producción |
| `yarn test` | Ejecutar tests |
| `yarn test:coverage` | Tests con cobertura |
| `yarn lint` | Verificar lint |
| `yarn coveralls` | Enviar cobertura a Coveralls |
| `./scripts/sonar-scan.sh` | Escaneo SonarQube local |
| `docker compose up app` | App en Docker (puerto 8080) |
| `docker compose up grafana` | Grafana (puerto 3001) |
