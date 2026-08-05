# Política de Seguridad

## Herramientas de análisis

| Herramienta | Tipo | Frecuencia |
|-------------|------|------------|
| **Snyk** | Vulnerabilidades de dependencias (CVEs) | En cada PR y semanal |
| **Semgrep** | Análisis estático de seguridad (SAST) | En cada PR |

## Cómo ejecutar local

```bash
# Snyk — verificar vulnerabilidades
npx snyk test

# Snyk — monitoreo continuo
npx snyk monitor

# Semgrep — análisis estático
npx semgrep --config .semgrep.yml src/
```

## Reportar una vulnerabilidad

1. **No** abras un issue público
2. Envía un email a [tu-email@ejemplo.com] con:
   - Descripción de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencia de fix (si la tienes)

## Proceso de remediación

1. **Crítico/Alto**: Fix en 24-48 horas
2. **Medio**: Fix en la siguiente sprint
3. **Bajo**: Fix en el backlog

## Dependencias

- Todas las dependencias se actualizan mensualmente
- Dependencias de seguridad se patchean inmediatamente
- Renov bot actualiza PRs automáticos
