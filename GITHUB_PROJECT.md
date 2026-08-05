# GitHub Projects — Tablero Kanban

## Tablero: "Tienda de Gafas - Kanban"
URL: https://github.com/alexx00124/TiendaGafas/projects

### Columnas
1. **To Do** — Tareas pendientes
2. **In Progress** — En ejecución
3. **Done** — Completadas

### Milestones (6)

| # | Milestone | Estado | Issues |
|---|-----------|--------|--------|
| M1 | Fundación | ✅ Closed | F0 |
| M2 | Calidad de Código | ✅ Closed | A1-A8 + limpieza |
| M3 | CI & Cobertura | ✅ Closed | Coveralls + Actions |
| M4 | DevSecOps | ✅ Closed | Snyk + Semgrep |
| M5 | SonarQube | ✅ Closed | Reporte calidad |
| M6 | Observabilidad | 🔵 Open | F7 |

### Labels

| Label | Color | Dominio |
|-------|-------|---------|
| `calidad` | 🟢 | Calidad de código |
| `ci` | 🔵 | CI/CD |
| `seguridad` | 🔴 | DevSecOps |
| `observabilidad` | 🟣 | Monitoreo |
| `agil` | 🟡 | Gestión ágil |
| `fase-0` a `fase-7` | ⚪ | Por fase |

### Issues creados

| # | Issue | Estado | Milestone |
|---|-------|--------|-----------|
| 2 | A1: public/index.html placeholder | Closed | M2 |
| 3 | A2: ESLint inejecutable | Closed | M2 |
| 4 | A3: CI sin prefijo VITE_ | Closed | M2 |
| 5 | A4: yarn test roto | Closed | M2 |
| 6 | A5: setBasketItems duplicado | Closed | M2 |
| 7 | A6: yarn build funciona | Closed | M2 |
| 8 | A7-A8: Docker + limpieza | Closed | M2 |
| 9 | F2: Configurar jest --coverage | Closed | M2 |
| 10 | F2: Integrar Coveralls | Closed | M2 |
| 11 | F3: Crear workflow ci.yml | Closed | M3 |
| 12 | F4: Configurar Snyk | Closed | M4 |
| 13 | F4: Configurar Semgrep | Closed | M4 |
| 14 | F5: Configurar SonarQube | Closed | M5 |
| 15 | F7: Observabilidad | Open | M6 |

### Setup manual del tablero

1. Ir a https://github.com/alexx00124/TiendaGafas/projects
2. Click "New project"
3. Nombre: "Tienda de Gafas - Kanban"
4. Crear columnas: To Do → In Progress → Done
5. Arrastrar issues a sus columnas

### Configurar Projects con gh CLI

```bash
# Agregar scope project al token
gh auth refresh -s project

# Crear proyecto
gh api graphql -f query='
mutation {
  createProjectV2(input: {
    ownerId: "MDQ6VXNlcjEyNjY5Nzc1NQ=="
    title: "Tienda de Gafas - Kanban"
  }) {
    projectV2 { id url }
  }
}'
```
