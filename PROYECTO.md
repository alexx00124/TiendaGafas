# TIENDA DE GAFAS — Documento del Proyecto

Proyecto académico de ingeniería de software sobre una aplicación de **e-commerce de gafas** (React 17 + Vite + Firebase). El objetivo es demostrar un pipeline completo de calidad: código, pruebas, seguridad, CI/CD, métricas ágiles y observabilidad.

---

## 1. Descripción del proyecto

| Aspecto | Detalle |
|---------|---------|
| **Aplicación** | `ecommerce-react` (boilerplate "Salinaka") |
| **Stack** | React 17, Vite 3, Redux, Redux-Saga, Ant Design |
| **Backend** | Firebase (Auth, Firestore, Storage, Functions) |
| **Estado repo** | Clonado de `github.com/jgudo/ecommerce-react` |
| **Entorno** | Node v25.9.0, npm 11, Docker disponible, sin Java |

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
```

### Roles
- **USER**: ve la tienda completa (nav, login, carrito)
- **ADMIN**: ve un panel dedicado (por diseño, no es bug). Se activa cambiando `role: "USER"` → `"ADMIN"` en Firestore (colección `users`).

---

## 2. Decisión técnica: bases de datos e imágenes

- El proyecto usa **Cloud Firestore**, NO Realtime Database.
- El campo `image` de cada producto es una **URL** (de Firebase Storage normalmente).
- Para desarrollo sin Storage (plan Spark gratuito, sin bucket), se poblaron **12 productos de ejemplo** cuya `image`/`imageCollection` apuntan a **URLs públicas**.
- Script de seed: `scripts/seed-public-images.js` (usa `service-account.json`, ya ignorado en git).

---

## 3. Plan de trabajo (fases)

### FASE 0 — Repositorio en GitHub
- Crear repo personal (no usar el clonado del autor)
- Re-apuntar `origin` y subir código
- Asegurar `.gitignore`: `node_modules/`, `.env*`, `service-account.json`, `dist/`, `coverage/`

### FASE 1 — Corrección de código (A1–A8 + limpieza)
**Críticos**
| ID | Problema | Fix |
|----|----------|-----|
| A1 | `public/index.html` pisa la app en build | Eliminar placeholder de Firebase Hosting |
| A2 | ESLint inejecutable (`babel-eslint` no instalado) | Añadir dep + script `lint` + plugins |
| A3 | CI usa `FIREBASE_*` sin prefijo `VITE_` | Cambiar a `VITE_FIREBASE_*` |
| A4 | `yarn test` roto (ruta inexistente) | Corregir import + adapter React 17 |

**Mayores**
| ID | Problema | Fix |
|----|----------|-----|
| A5 | `setBasketItems` duplicado (`authSaga.js:150-151`) | Eliminar duplicado |
| A6 | `handleError` sin `yield` (`authSaga.js:139`, `productSaga.js:49`) | Añadir `yield` |
| A7 | `process.env.NODE_ENV` en browser (`index.jsx:35`) | Usar `import.meta.env.PROD` |
| A8 | `profileSaga.js:14` `setLoading(false)` en UPDATE_EMAIL | Cambiar a `true` |

**Limpieza menor**
- Eliminar dependencias muertas (webpack, `moment`)
- Borrar código comentado en reducers/selectors/firebase.js/utils.js
- `alert(x,'error')` → `displayActionMessage` (`useFileHandler.js:26,29`)
- Alinear `.eslintrc`, arreglar deps de hooks, `snap.ref.id` → `snap.id`

> Barandilla: NO se altera el comportamiento de roles, layout ni checkout — solo calidad estática.

### FASE 2 — Cobertura de pruebas
- `jest --coverage` → carpeta `coverage/`
- Conectar **Coveralls** (badge + dashboard)

### FASE 3 — CI/CD: GitHub Actions
- `.github/workflows/ci.yml`: install → lint → build → test(con cobertura) → Coveralls → Snyk → Semgrep
- Variables con prefijo `VITE_`
- Badges en README

### FASE 4 — Seguridad (DevSecOps)
- **Snyk**: `snyk test` + `snyk monitor` (CVEs de dependencias, licencias)
- **Semgrep**: análisis estático de seguridad (inyección, control de acceso)
> JaCoCo / OWASP descartados (requieren Java, no disponible).

### FASE 5 — Calidad: SonarQube (Docker)
- `docker-compose.yml` con SonarQube
- `sonar-project.properties`:
  ```properties
  sonar.projectKey=tienda-de-gafas
  sonar.sources=src
  sonar.exclusions=node_modules/**,dist/**,static/**,coverage/**,test/**
  ```
- `sonar-scanner` vía Docker → reporte

### FASE 6 — Gestión ágil: GitHub Projects + Issues + Milestones
Tablero **Kanban** y **milestones** por fase:
- **M1 — Fundación**: repo propio (F0)
- **M2 — Calidad de Código**: A1–A8 + limpieza (F1)
- **M3 — CI & Cobertura**: Coveralls + Actions (F2, F3)
- **M4 — DevSecOps**: Snyk, Semgrep (F4)
- **M5 — SonarQube**: reporte de calidad (F5)
- **M6 — Observabilidad**: Grafana + Prometheus (F7)

Columnas: **To Do → In Progress → Done** con labels por dominio (`calidad`, `ci`, `seguridad`, `observabilidad`, `agil`).

### FASE 7 — Observabilidad: metrics-server + Prometheus + Grafana
- `metrics-server/` (Node + Express + `prom-client`) expone `/metrics` (visitas, latencia, memoria del proceso)
- `prometheus.yml` + Grafana en el mismo `docker-compose.yml`
- Dashboard Grafana inicial (scrape de métricas de la app)

---

## 4. Herramientas elegidas (1 por dominio, open-source/gratis)

| Dominio | Herramienta |
|---------|-------------|
| Calidad de código | SonarQube (Docker) |
| Gestión ágil | GitHub Projects/Issues/Milestones |
| CI/CD + DevOps | GitHub Actions |
| Cobertura | Jest → Istanbul/c8 → Coveralls |
| Seguridad | Snyk + Semgrep |
| Observabilidad | Node metrics-server + Prometheus + Grafana |

**Descartadas a propósito:** JaCoCo y OWASP (requieren Java); Jenkins/CircleCI/Harness (vs GitHub Actions); Checkmarx/Veracode (de pago).

---

## 5. Orden de ejecución

```
F0 (repo) → F1 (A1-A8 + limpieza) → F2 (cobertura) → F3 (CI) → F4 (seguridad)
→ F5 (SonarQube) → F6 (tablero GitHub) → F7 (observabilidad)
```

---

## 6. Acciones que requieren cuenta/credenciales del usuario

1. Crear/vincular el repo personal en GitHub.
2. Secretos en GitHub Actions: `COVERALLS_REPO_TOKEN`, `SNYK_TOKEN`, `VITE_FIREBASE_*`.
3. Primer login de SonarQube local (`admin` / `admin`).

---

## 7. Estado actual del proyecto (inventario)

- ✅ Frontend desplegado en local (`yarn dev` → localhost:3000)
- ✅ Auth funcionando (email/password)
- ✅ 12 productos de ejemplo con imágenes públicas en Firestore
- ✅ Admin disponible (cambiando role en Firestore)
- ⚠️ Checkout: botón "Confirm" es placeholder ("Feature not ready yet")
- ⚠️ Esqueleto se muestra si Firestore no tiene productos con `image`
- 🔜 Pendiente: correcciones A1–A8, pipeline CI, SonarQube, seguridad, tablero GitHub, observabilidad