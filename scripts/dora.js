const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEPLOY_LOG = path.join(__dirname, '..', 'dora', 'deploy-log.json');

const VALUES = {
  deploymentFrequency: { elite: '>1/día', label: 'Frecuencia de despliegue (deploys/semana)' },
  leadTime: { elite: '<1 día', label: 'Lead Time (mediana, en días)' },
  changeFailureRate: { elite: '0-15%', label: 'Change Failure Rate (%)' },
  mttr: { elite: '<1 hora', label: 'MTTR (mediana, en horas)' },
};

function gitLog() {
  const out = execSync(
    'git log master --format="%H|%at|%ct" --since="180 days ago"',
    { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }
  );
  return out
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, authorTs, commitTs] = line.split('|');
      return { sha, authorTs: +authorTs, commitTs: +commitTs };
    });
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function loadDeployLog() {
  if (!fs.existsSync(DEPLOY_LOG)) return [];
  try {
    return JSON.parse(fs.readFileSync(DEPLOY_LOG, 'utf-8'));
  } catch {
    return [];
  }
}

function computeDeploymentFrequency(commits) {
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const weeks = {};
  for (const c of commits) {
    const age = now - c.commitTs * 1000;
    const week = Math.floor(age / weekMs);
    if (week <= 12) weeks[week] = (weeks[week] || 0) + 1;
  }
  const counts = Object.values(weeks);
  if (!counts.length) return 0;
  return counts.reduce((a, b) => a + b, 0) / Math.min(counts.length, 12);
}

function computeLeadTime(commits) {
  // Proxy para trunk-based: mediana del tiempo entre commits consecutivos.
  const gaps = [];
  for (let i = 1; i < commits.length; i++) {
    gaps.push(commits[i - 1].commitTs - commits[i].commitTs);
  }
  const m = median(gaps.filter((g) => g > 0));
  return m ? m / 86400 : null;
}

function computeCFR(deploys) {
  const recent = deploys.filter((d) => Date.now() - new Date(d.timestamp).getTime() < 30 * 24 * 60 * 60 * 1000);
  if (!recent.length) return null;
  const failed = recent.filter((d) => !d.success).length;
  return (failed / recent.length) * 100;
}

function computeMTTR(deploys) {
  const sorted = [...deploys].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  let currentFailureStart = null;
  const restoreTimes = [];
  for (const d of sorted) {
    if (!d.success) {
      if (currentFailureStart === null) currentFailureStart = new Date(d.timestamp);
    } else if (currentFailureStart !== null) {
      restoreTimes.push(new Date(d.timestamp).getTime() - currentFailureStart.getTime());
      currentFailureStart = null;
    }
  }
  const m = median(restoreTimes);
  return m ? m / 3600000 : null;
}

const commits = gitLog();
const deploys = loadDeployLog();

const metrics = {
  deploymentFrequency: computeDeploymentFrequency(commits),
  leadTime: computeLeadTime(commits),
  changeFailureRate: computeCFR(deploys),
  mttr: computeMTTR(deploys),
};

function fmt(value, digits = 2) {
  return value === null ? 'n/a' : value.toFixed(digits);
}

const width = 40;
console.log('\n' + '='.repeat(width));
console.log('REPORTE DORA METRICS');
console.log('='.repeat(width));
console.log(`Commits analizados (180 días): ${commits.length}`);
console.log(`Deploys registrados (30 días): ${deploys.length}`);
console.log('---');
console.log(`${VALUES.deploymentFrequency.label.padEnd(38)}: ${fmt(metrics.deploymentFrequency)}`);
console.log(`  Elite: ${VALUES.deploymentFrequency.elite}`);
console.log(`${VALUES.leadTime.label.padEnd(38)}: ${fmt(metrics.leadTime)}`);
console.log(`  Elite: ${VALUES.leadTime.elite}`);
console.log(`${VALUES.changeFailureRate.label.padEnd(38)}: ${fmt(metrics.changeFailureRate)}`);
console.log(`  Elite: ${VALUES.changeFailureRate.elite}`);
console.log(`${VALUES.mttr.label.padEnd(38)}: ${fmt(metrics.mttr)}`);
console.log(`  Elite: ${VALUES.mttr.elite}`);
console.log('---');
console.log('Notas:');
console.log('  - Lead Time usa proxy trunk-based (gap entre commits consecutivos).');
console.log('  - CFR y MTTR dependen de dora/deploy-log.json, actualizado por el health-check del deploy.');

const outPath = path.join(__dirname, '..', 'dora', 'report.json');
fs.writeFileSync(outPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  commitsAnalyzed: commits.length,
  deploysLogged: deploys.length,
  metrics,
}, null, 2));
console.log(`\nReporte guardado en: dora/report.json`);