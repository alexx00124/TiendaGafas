#!/bin/bash
# SonarQube Local Scanner
# Uso: ./scripts/sonar-scan.sh

set -e

echo "🔍 SonarQube Local Scanner"
echo "=========================="

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker no está corriendo. Inicia Docker primero."
  exit 1
fi

# Verificar que coverage existe
if [ ! -f "coverage/lcov.info" ]; then
  echo "⚠️  No se encontró coverage/lcov.info"
  echo "Ejecutando tests con cobertura..."
  yarn test:coverage
fi

# Levantar SonarQube
echo "🚀 Levantando SonarQube..."
docker compose up -d sonarqube

echo "⏳ Esperando a que SonarQube esté listo..."
sleep 30

# Verificar que SonarQube está corriendo
if curl -s http://localhost:9000/api/system/status | grep -q '"status":"UP"'; then
  echo "✅ SonarQube está corriendo en http://localhost:9000"
  echo "   Usuario: admin"
  echo "   Contraseña: admin"
else
  echo "⚠️  SonarQube tarda en iniciar. Espera 1-2 minutos más."
fi

# Ejecutar scanner
echo "🔍 Ejecutando SonarQube Scanner..."
docker compose run --rm sonar-scanner

echo ""
echo "✅ Escaneo completado"
echo "📊 Reporte en: http://localhost:9000/dashboard?id=tienda-de-gafas"
