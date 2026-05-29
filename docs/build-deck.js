// Generates CloudKart-Presentation.pptx using pptxgenjs.
// Run:  node build-deck.js
const PptxGenJS = require('pptxgenjs');

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_WIDE';           // 13.33" x 7.5"
pres.author  = 'Ayush Gupta';
pres.title   = 'CloudKart - DevOps Major Project';
pres.subject = 'College Major Project';

// -------- Theme --------
const NAVY      = '1E3A5F';
const NAVY_DK   = '152B47';
const LIGHT_BL  = 'E8F1FA';
const PALE_BL   = 'F4F8FC';
const TEAL      = '00BFA6';
const TEAL_DK   = '009A87';
const TEXT      = '1A1A1A';
const MUTED     = '6B7280';
const WHITE     = 'FFFFFF';
const SOFT_WH   = 'B4C5DB';
const CODE_BG   = '0F1A2C';
const CODE_GRAY = 'CFD8E3';

const FONT = 'Calibri';
const CODE = 'Consolas';

// -------- Helpers --------
function footer(slide, page) {
  slide.addText('CloudKart  ·  Ayush Gupta', { x: 0.5, y: 7.1, w: 6, h: 0.3, fontSize: 9, color: MUTED, fontFace: FONT });
  slide.addText(`${page} / 12`, { x: 12, y: 7.1, w: 1, h: 0.3, fontSize: 9, color: MUTED, fontFace: FONT, align: 'right' });
}
function title(slide, title, subtitle) {
  slide.addText(title, { x: 0.6, y: 0.35, w: 12, h: 0.7, fontSize: 30, bold: true, color: NAVY, fontFace: FONT });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.6, y: 1.0, w: 12, h: 0.4, fontSize: 14, color: MUTED, fontFace: FONT, italic: true });
  }
}
function phaseBadge(slide, num) {
  slide.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.35, w: 0.75, h: 0.75, fill: { color: TEAL }, line: { color: TEAL, width: 0 } });
  slide.addText(`${num}`, { x: 0.6, y: 0.35, w: 0.75, h: 0.75, fontSize: 28, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: FONT });
}

// ─── Slide 1: Title ────────────────────────────────────────
const s1 = pres.addSlide();
s1.background = { color: NAVY };
s1.addText('Cloud', { x: 0.7, y: 2.0, w: 5, h: 1.5, fontSize: 84, bold: true, color: WHITE, fontFace: FONT });
s1.addText('Kart',  { x: 4.0, y: 2.0, w: 5, h: 1.5, fontSize: 84, bold: true, color: TEAL,  fontFace: FONT });
s1.addText('Cloud-Native Microservices E-Commerce Platform', { x: 0.7, y: 3.6, w: 12, h: 0.6, fontSize: 22, color: LIGHT_BL, fontFace: FONT });
s1.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 4.3, w: 1.2, h: 0.05, fill: { color: TEAL }, line: { color: TEAL, width: 0 } });
s1.addText('A major DevOps project: Docker · Kubernetes · Helm · Terraform · CI/CD · full observability.', { x: 0.7, y: 4.5, w: 12, h: 0.9, fontSize: 15, color: SOFT_WH, fontFace: FONT, italic: true });
s1.addText('Ayush Gupta', { x: 0.7, y: 6.1, w: 6, h: 0.5, fontSize: 20, bold: true, color: WHITE, fontFace: FONT });
s1.addText('itsayush0212@gmail.com', { x: 0.7, y: 6.55, w: 6, h: 0.3, fontSize: 12, color: LIGHT_BL, fontFace: FONT });
s1.addText('github.com/Ayush-Gupta-0212/cloudkart', { x: 7, y: 6.55, w: 6, h: 0.3, fontSize: 12, color: TEAL, fontFace: FONT, align: 'right' });

// ─── Slide 2: Problem & Solution ───────────────────────────
const s2 = pres.addSlide();
s2.background = { color: WHITE };
title(s2, 'Why CloudKart?', 'The case for microservices and modern DevOps.');

s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.7, w: 5.9, h: 5.1, fill: { color: PALE_BL }, line: { color: LIGHT_BL, width: 0 }, rectRadius: 0.08 });
s2.addText('THE PROBLEM', { x: 0.9, y: 1.95, w: 5.5, h: 0.35, fontSize: 11, bold: true, color: MUTED, fontFace: FONT, charSpacing: 2 });
s2.addText("Monolithic apps don't scale.", { x: 0.9, y: 2.35, w: 5.5, h: 0.55, fontSize: 22, bold: true, color: NAVY, fontFace: FONT });

const problems = [
  ['Risky deploys',     'one bug = full outage'],
  ['Slow iteration',    'one team, one codebase'],
  ['Manual ops',        '"works on my machine"'],
  ['Locked stack',      'no polyglot teams'],
  ['Hard to scale',     'scale all or nothing'],
];
problems.forEach((p, i) => {
  const y = 3.2 + i * 0.65;
  s2.addText(`✕  ${p[0]}`, { x: 0.9, y, w: 2.4, h: 0.4, fontSize: 13, bold: true, color: NAVY, fontFace: FONT });
  s2.addText(p[1],          { x: 3.3, y, w: 3.1, h: 0.4, fontSize: 11, color: MUTED, fontFace: FONT, italic: true });
});

s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.7, w: 6.0, h: 5.1, fill: { color: NAVY }, line: { color: NAVY, width: 0 }, rectRadius: 0.08 });
s2.addText('CLOUDKART', { x: 7.1, y: 1.95, w: 5.5, h: 0.35, fontSize: 11, bold: true, color: TEAL, fontFace: FONT, charSpacing: 2 });
s2.addText('4 microservices, fully automated.', { x: 7.1, y: 2.35, w: 5.5, h: 0.55, fontSize: 22, bold: true, color: WHITE, fontFace: FONT });

const solutions = [
  ['Containers',      'Docker + multi-stage builds'],
  ['Orchestration',   'Kubernetes + rolling updates'],
  ['Packaging',       'Helm with dev/staging/prod'],
  ['Automation',      'CI/CD with Trivy security'],
  ['Observability',   'Prometheus + Grafana + Loki'],
];
solutions.forEach((s, i) => {
  const y = 3.2 + i * 0.65;
  s2.addText(`✓  ${s[0]}`, { x: 7.1, y, w: 2.5, h: 0.4, fontSize: 13, bold: true, color: TEAL, fontFace: FONT });
  s2.addText(s[1],          { x: 9.6, y, w: 3.2, h: 0.4, fontSize: 11, color: SOFT_WH, fontFace: FONT, italic: true });
});
footer(s2, 2);

// ─── Slide 3: Architecture ─────────────────────────────────
const s3 = pres.addSlide();
s3.background = { color: WHITE };
title(s3, 'System Architecture', 'Single-entry path-based routing into independent microservices.');

// Browser
s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.5, y: 1.7, w: 2.3, h: 0.55, fill: { color: NAVY }, line: { color: NAVY, width: 0 }, rectRadius: 0.06 });
s3.addText('USER BROWSER', { x: 5.5, y: 1.7, w: 2.3, h: 0.55, fontSize: 11, bold: true, color: WHITE, fontFace: FONT, align: 'center', valign: 'middle', charSpacing: 1 });
s3.addShape(pres.shapes.LINE, { x: 6.65, y: 2.3, w: 0, h: 0.3, line: { color: MUTED, width: 2, endArrowType: 'triangle' } });

// Ingress
s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1, y: 2.75, w: 11.3, h: 0.7, fill: { color: TEAL }, line: { color: TEAL, width: 0 }, rectRadius: 0.06 });
s3.addText('Nginx Ingress Controller', { x: 1, y: 2.78, w: 11.3, h: 0.35, fontSize: 14, bold: true, color: WHITE, fontFace: FONT, align: 'center' });
s3.addText('/api/users → user-service     /api/products → product-service     /api/cart, /api/orders → order-service     / → frontend', { x: 1, y: 3.12, w: 11.3, h: 0.3, fontSize: 9.5, color: WHITE, fontFace: CODE, align: 'center' });

// 4 services
const services = [
  { name: 'frontend',        sub: 'React + Nginx',         x: 0.9 },
  { name: 'user-service',    sub: 'Node + JWT + bcrypt',   x: 4.0 },
  { name: 'product-service', sub: 'Node + catalog',        x: 7.1 },
  { name: 'order-service',   sub: 'Node + cart',           x: 10.2 },
];
services.forEach((svc) => {
  s3.addShape(pres.shapes.LINE, { x: svc.x + 1.4, y: 3.5, w: 0, h: 0.3, line: { color: MUTED, width: 1.5, endArrowType: 'triangle' } });
  s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: svc.x, y: 3.85, w: 2.8, h: 1.0, fill: { color: LIGHT_BL }, line: { color: NAVY, width: 1 }, rectRadius: 0.06 });
  s3.addText(svc.name, { x: svc.x, y: 3.95, w: 2.8, h: 0.4, fontSize: 13, bold: true, color: NAVY, fontFace: FONT, align: 'center' });
  s3.addText(svc.sub,  { x: svc.x, y: 4.4, w: 2.8, h: 0.3, fontSize: 9, color: MUTED, fontFace: FONT, align: 'center', italic: true });
});

// Observability layer
s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 5.3, w: 11.9, h: 1.6, fill: { color: PALE_BL }, line: { color: NAVY, width: 1, dashType: 'dash' }, rectRadius: 0.06 });
s3.addText('OBSERVABILITY · scrapes /metrics, ships logs, fires alerts', { x: 0.7, y: 5.4, w: 11.9, h: 0.3, fontSize: 10, color: MUTED, fontFace: FONT, align: 'center', italic: true, charSpacing: 1 });
const obs = [
  { name: 'Prometheus',      x: 0.95 },
  { name: 'Grafana',         x: 3.95 },
  { name: 'Loki + Promtail', x: 6.95 },
  { name: 'Alertmanager',    x: 9.95 },
];
obs.forEach((o) => {
  s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: o.x, y: 5.85, w: 2.6, h: 0.85, fill: { color: NAVY }, line: { color: NAVY, width: 0 }, rectRadius: 0.05 });
  s3.addText(o.name, { x: o.x, y: 5.85, w: 2.6, h: 0.85, fontSize: 12, bold: true, color: WHITE, fontFace: FONT, align: 'center', valign: 'middle' });
});
footer(s3, 3);

// ─── Slide 4: Tech Stack ───────────────────────────────────
const s4 = pres.addSlide();
s4.background = { color: WHITE };
title(s4, 'Technology Stack', '12 production-grade tools across the full lifecycle.');

const stack = [
  { cat: 'LANGUAGES',     tools: 'Node.js 22 · React 18 · Bash',                      color: NAVY },
  { cat: 'CONTAINERS',    tools: 'Docker 29 · Compose · Alpine',                       color: NAVY },
  { cat: 'ORCHESTRATION', tools: 'Kubernetes 1.35 · Minikube · K3s',                   color: NAVY },
  { cat: 'PACKAGE MGR',   tools: 'Helm 3 (chart with 3 envs)',                         color: TEAL },
  { cat: 'IaC',           tools: 'Terraform 1.15 · AWS Provider 5',                    color: TEAL },
  { cat: 'CLOUD',         tools: 'AWS EC2 · VPC · S3 · DynamoDB · IAM',                color: TEAL },
  { cat: 'CI/CD',         tools: 'GitHub Actions · Jenkins · GHCR',                    color: NAVY },
  { cat: 'INGRESS',       tools: 'Nginx Ingress Controller',                           color: NAVY },
  { cat: 'OBSERVABILITY', tools: 'Prometheus · Grafana · Loki · Alertmanager',         color: TEAL },
  { cat: 'SECURITY',      tools: 'Trivy · runAsNonRoot · K8s Secrets · IMDSv2',        color: TEAL },
  { cat: 'TESTING',       tools: 'Jest · Supertest · 32 tests',                        color: NAVY },
  { cat: 'GIT / SCM',     tools: 'GitHub · SSH · Conventional Commits',                color: NAVY },
];
stack.forEach((item, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = 0.6 + col * 4.2;
  const y = 1.85 + row * 1.32;
  s4.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.0, h: 1.15, fill: { color: WHITE }, line: { color: 'D1DAE5', width: 1 }, rectRadius: 0.06 });
  s4.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.08, h: 1.15, fill: { color: item.color }, line: { color: item.color, width: 0 } });
  s4.addText(item.cat,   { x: x + 0.25, y: y + 0.15, w: 3.6, h: 0.3,  fontSize: 10, bold: true, color: item.color, fontFace: FONT, charSpacing: 2 });
  s4.addText(item.tools, { x: x + 0.25, y: y + 0.5,  w: 3.6, h: 0.55, fontSize: 12, color: TEXT, fontFace: FONT });
});
footer(s4, 4);

// ─── Slide 5: Phase 1 ──────────────────────────────────────
const s5 = pres.addSlide();
s5.background = { color: WHITE };
phaseBadge(s5, 1);
s5.addText('Phase 1 · Microservices + Docker', { x: 1.5, y: 0.4, w: 11, h: 0.6, fontSize: 26, bold: true, color: NAVY, fontFace: FONT });
s5.addText('Built 4 independent services. Containerized each. Wired with docker-compose.', { x: 1.5, y: 1.0, w: 11, h: 0.4, fontSize: 13, color: MUTED, fontFace: FONT, italic: true });

const p1 = [
  ['frontend',        'React 18 + Vite + Nginx (multi-stage, ~30 MB)'],
  ['user-service',    'Express + JWT + bcrypt — 10 tests passing'],
  ['product-service', 'Express + 8 seeded products — 8 tests passing'],
  ['order-service',   'Express + cart + HTTP to product-service — 14 tests'],
];
p1.forEach((b, i) => {
  const y = 1.95 + i * 0.85;
  s5.addShape(pres.shapes.OVAL, { x: 0.7, y: y + 0.15, w: 0.2, h: 0.2, fill: { color: TEAL }, line: { color: TEAL, width: 0 } });
  s5.addText(b[0], { x: 1.0, y, w: 2.5, h: 0.5, fontSize: 16, bold: true, color: NAVY, fontFace: CODE });
  s5.addText(b[1], { x: 3.6, y, w: 5.0, h: 0.5, fontSize: 13, color: TEXT, fontFace: FONT, valign: 'middle' });
});

s5.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.0, y: 1.95, w: 3.85, h: 4.75, fill: { color: NAVY }, line: { color: NAVY, width: 0 }, rectRadius: 0.08 });
s5.addText('KEY RESULTS', { x: 9.2, y: 2.15, w: 3.5, h: 0.35, fontSize: 11, bold: true, color: TEAL, fontFace: FONT, charSpacing: 2 });
const p1Stats = [
  ['32',       'unit tests passing'],
  ['~245 MB',  'avg image size (Alpine)'],
  ['~80%',     'avg test coverage'],
  ['1',        'command: docker compose up -d'],
];
p1Stats.forEach((s, i) => {
  const y = 2.6 + i * 1.05;
  s5.addText(s[0], { x: 9.2, y,         w: 3.5, h: 0.55, fontSize: 32, bold: true, color: WHITE, fontFace: FONT });
  s5.addText(s[1], { x: 9.2, y: y + 0.55, w: 3.5, h: 0.3,  fontSize: 11, color: SOFT_WH, fontFace: FONT, italic: true });
});
footer(s5, 5);

// ─── Slide 6: Phase 2 ──────────────────────────────────────
const s6 = pres.addSlide();
s6.background = { color: WHITE };
phaseBadge(s6, 2);
s6.addText('Phase 2 · Kubernetes Orchestration', { x: 1.5, y: 0.4, w: 11, h: 0.6, fontSize: 26, bold: true, color: NAVY, fontFace: FONT });
s6.addText('Same containers — orchestrated by a real Kubernetes cluster.', { x: 1.5, y: 1.0, w: 11, h: 0.4, fontSize: 13, color: MUTED, fontFace: FONT, italic: true });

s6.addText('Kubernetes Resources Used', { x: 0.6, y: 1.85, w: 6, h: 0.4, fontSize: 16, bold: true, color: NAVY, fontFace: FONT });
const k8sRes = [
  { name: 'Deployment',      desc: 'rolling updates, replica mgmt' },
  { name: 'Service',         desc: 'stable DNS, load balancing' },
  { name: 'Ingress',         desc: 'HTTP entry, path routing' },
  { name: 'ConfigMap',       desc: 'non-sensitive config' },
  { name: 'Secret',          desc: 'JWT_SECRET, base64' },
  { name: 'HPA',             desc: 'auto-scale on CPU' },
  { name: 'Liveness probe',  desc: 'restart unhealthy pods' },
  { name: 'Readiness probe', desc: 'gate traffic to pods' },
];
k8sRes.forEach((r, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.6 + col * 3.1, y = 2.4 + row * 0.95;
  s6.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.0, h: 0.8, fill: { color: PALE_BL }, line: { color: 'D1DAE5', width: 1 }, rectRadius: 0.05 });
  s6.addText(r.name, { x: x + 0.15, y: y + 0.05, w: 2.8, h: 0.35, fontSize: 12, bold: true, color: NAVY, fontFace: CODE });
  s6.addText(r.desc, { x: x + 0.15, y: y + 0.4,  w: 2.8, h: 0.3,  fontSize: 10, color: MUTED, fontFace: FONT, italic: true });
});

s6.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 1.85, w: 5.85, h: 4.85, fill: { color: NAVY }, line: { color: NAVY, width: 0 }, rectRadius: 0.08 });
s6.addText('LIVE CLUSTER STATE', { x: 7.2, y: 2.0, w: 5.5, h: 0.35, fontSize: 11, bold: true, color: TEAL, fontFace: FONT, charSpacing: 2 });
s6.addText('$ kubectl -n cloudkart get pods', { x: 7.2, y: 2.4, w: 5.5, h: 0.3, fontSize: 11, color: SOFT_WH, fontFace: CODE });
const podOut = `NAME                              READY  STATUS
frontend-589d4764cc-jf5cc         1/1    Running
order-service-7cd64d7779-lltdq    1/1    Running
product-service-75f949cc45-p7lhz  1/1    Running
user-service-9dcf7b97c-68rv6      1/1    Running`;
s6.addText(podOut, { x: 7.2, y: 2.75, w: 5.5, h: 1.9, fontSize: 9.5, color: WHITE, fontFace: CODE });
s6.addText('Verified end-to-end:', { x: 7.2, y: 4.95, w: 5.5, h: 0.3, fontSize: 12, bold: true, color: TEAL, fontFace: FONT });
const verified = [
  '✓ register → login → JWT → cart → order',
  '✓ inter-service HTTP via service DNS',
  '✓ Ingress routes /api/* to right backend',
  '✓ Rolling updates with zero downtime',
];
verified.forEach((v, i) => {
  s6.addText(v, { x: 7.2, y: 5.3 + i * 0.32, w: 5.5, h: 0.32, fontSize: 11, color: WHITE, fontFace: FONT });
});
footer(s6, 6);

// ─── Slide 7: Phase 3 (Helm + CI/CD) ───────────────────────
const s7 = pres.addSlide();
s7.background = { color: WHITE };
phaseBadge(s7, 3);
s7.addText('Phase 3 · Helm Chart + CI/CD Pipelines', { x: 1.5, y: 0.4, w: 11, h: 0.6, fontSize: 26, bold: true, color: NAVY, fontFace: FONT });
s7.addText('From raw manifests to versioned, parameterized, auditable releases.', { x: 1.5, y: 1.0, w: 11, h: 0.4, fontSize: 13, color: MUTED, fontFace: FONT, italic: true });

const cards = [
  { title: 'HELM CHART', color: NAVY, items: [
    'Range loop over services',
    'values-dev / staging / prod',
    'install → upgrade → rollback',
    'helm history → audit trail',
    'One command per environment',
  ]},
  { title: 'GITHUB ACTIONS (CI)', color: TEAL, items: [
    'Matrix: test 3 backends in parallel',
    'Helm lint + multi-env render',
    'Docker build with layer cache',
    'Trivy: HIGH/CRITICAL fails build',
    'Push to GHCR on main',
  ]},
  { title: 'JENKINS (CD)', color: NAVY, items: [
    'Declarative pipeline',
    'Params: image tag · env · dry-run',
    'helm upgrade --atomic',
    'Auto-rollback on smoke-test fail',
    'Triggered by GHCR webhook',
  ]},
];
cards.forEach((c, i) => {
  const x = 0.6 + i * 4.2;
  s7.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: 4.0, h: 5.0, fill: { color: WHITE }, line: { color: c.color, width: 2 }, rectRadius: 0.08 });
  s7.addShape(pres.shapes.RECTANGLE, { x, y: 1.85, w: 4.0, h: 0.65, fill: { color: c.color }, line: { color: c.color, width: 0 } });
  s7.addText(c.title, { x, y: 1.85, w: 4.0, h: 0.65, fontSize: 13, bold: true, color: WHITE, fontFace: FONT, align: 'center', valign: 'middle', charSpacing: 1 });
  c.items.forEach((it, j) => {
    const y = 2.85 + j * 0.75;
    s7.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.13, w: 0.15, h: 0.15, fill: { color: c.color }, line: { color: c.color, width: 0 } });
    s7.addText(it, { x: x + 0.5, y, w: 3.4, h: 0.6, fontSize: 12, color: TEXT, fontFace: FONT });
  });
});
footer(s7, 7);

// ─── Slide 8: Phase 4 (Terraform + AWS) ────────────────────
const s8 = pres.addSlide();
s8.background = { color: WHITE };
phaseBadge(s8, 4);
s8.addText('Phase 4 · Infrastructure as Code', { x: 1.5, y: 0.4, w: 11, h: 0.6, fontSize: 26, bold: true, color: NAVY, fontFace: FONT });
s8.addText('A production-grade AWS stack defined in Terraform, free-tier friendly.', { x: 1.5, y: 1.0, w: 11, h: 0.4, fontSize: 13, color: MUTED, fontFace: FONT, italic: true });

s8.addText('TERRAFORM MODULES', { x: 0.6, y: 1.85, w: 6, h: 0.35, fontSize: 11, bold: true, color: MUTED, fontFace: FONT, charSpacing: 2 });
const modules = [
  { name: 'modules/vpc',              desc: 'VPC + 2 public subnets + IGW + route table' },
  { name: 'modules/security-groups',  desc: 'SG: SSH (restricted), HTTP, HTTPS, K3s API' },
  { name: 'modules/ec2',              desc: 't2.micro + gp3 encrypted + IMDSv2 + K3s' },
];
modules.forEach((m, i) => {
  const y = 2.35 + i * 0.85;
  s8.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 6.0, h: 0.75, fill: { color: PALE_BL }, line: { color: 'D1DAE5', width: 1 }, rectRadius: 0.05 });
  s8.addText(m.name, { x: 0.8, y: y + 0.05, w: 5.6, h: 0.3, fontSize: 13, bold: true, color: NAVY, fontFace: CODE });
  s8.addText(m.desc, { x: 0.8, y: y + 0.4,  w: 5.6, h: 0.35, fontSize: 11, color: MUTED, fontFace: FONT, italic: true });
});

s8.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 5.0, w: 6.0, h: 1.7, fill: { color: NAVY }, line: { color: NAVY, width: 0 }, rectRadius: 0.06 });
s8.addText('REMOTE STATE BACKEND', { x: 0.8, y: 5.15, w: 5.6, h: 0.3, fontSize: 11, bold: true, color: TEAL, fontFace: FONT, charSpacing: 2 });
s8.addText('S3 bucket (versioned + encrypted)', { x: 0.8, y: 5.5, w: 5.6, h: 0.3, fontSize: 12, color: WHITE, fontFace: FONT });
s8.addText('DynamoDB table for state locking',   { x: 0.8, y: 5.85, w: 5.6, h: 0.3, fontSize: 12, color: WHITE, fontFace: FONT });
s8.addText('Reproducible · team-safe · disaster recovery', { x: 0.8, y: 6.25, w: 5.6, h: 0.3, fontSize: 10, color: SOFT_WH, fontFace: FONT, italic: true });

s8.addText('VALIDATED LOCALLY', { x: 7.0, y: 1.85, w: 5.9, h: 0.35, fontSize: 11, bold: true, color: MUTED, fontFace: FONT, charSpacing: 2 });
s8.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 2.35, w: 5.85, h: 4.35, fill: { color: CODE_BG }, line: { color: CODE_BG, width: 0 }, rectRadius: 0.05 });
const tfLines = [
  { t: '$ terraform fmt -recursive',       c: CODE_GRAY },
  { t: '$ terraform init -backend=false',  c: CODE_GRAY },
  { t: '$ terraform validate',             c: CODE_GRAY },
  { t: '',                                  c: WHITE },
  { t: '✓ Success! Configuration valid.', c: TEAL, b: true },
  { t: '',                                  c: WHITE },
  { t: '── Free-tier ready ──',            c: MUTED },
  { t: '• t2.micro  (750 hrs/mo free)',    c: WHITE },
  { t: '• gp3 EBS   (30 GB free)',         c: WHITE },
  { t: '• S3 + DynamoDB',                  c: WHITE },
  { t: '• Cost: ~$0/month (first year)',   c: WHITE },
];
tfLines.forEach((l, i) => {
  s8.addText(l.t, { x: 7.2, y: 2.5 + i * 0.34, w: 5.5, h: 0.32, fontSize: 11, color: l.c, bold: !!l.b, fontFace: CODE });
});
footer(s8, 8);

// ─── Slide 9: Phase 5 (Observability) ──────────────────────
const s9 = pres.addSlide();
s9.background = { color: WHITE };
phaseBadge(s9, 5);
s9.addText('Phase 5 · Observability Stack', { x: 1.5, y: 0.4, w: 11, h: 0.6, fontSize: 26, bold: true, color: NAVY, fontFace: FONT });
s9.addText('Metrics, logs, alerts — all live on Kubernetes.', { x: 1.5, y: 1.0, w: 11, h: 0.4, fontSize: 13, color: MUTED, fontFace: FONT, italic: true });

const obsCard = [
  { name: 'Prometheus',      desc: 'Scrapes /metrics from 3 backend pods every 15s' },
  { name: 'Grafana',         desc: 'Dashboards against Prometheus + Loki' },
  { name: 'Loki + Promtail', desc: 'Log aggregation: stdout → Promtail → Loki' },
  { name: 'Alertmanager',    desc: '4 alert rules — the golden signals' },
];
obsCard.forEach((c, i) => {
  const x = 0.6 + i * 3.1;
  s9.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: 3.0, h: 1.65, fill: { color: NAVY }, line: { color: NAVY, width: 0 }, rectRadius: 0.08 });
  s9.addText(c.name, { x: x + 0.15, y: 2.0, w: 2.7, h: 0.5, fontSize: 15, bold: true, color: WHITE, fontFace: FONT });
  s9.addText(c.desc, { x: x + 0.15, y: 2.55, w: 2.7, h: 0.9, fontSize: 11, color: SOFT_WH, fontFace: FONT });
});

s9.addText('LIVE EVIDENCE — query against the running cluster', { x: 0.6, y: 3.75, w: 12, h: 0.35, fontSize: 11, bold: true, color: MUTED, fontFace: FONT, charSpacing: 2 });
s9.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.2, w: 12.3, h: 2.5, fill: { color: CODE_BG }, line: { color: CODE_BG, width: 0 }, rectRadius: 0.05 });
s9.addText('# Query Prometheus for CloudKart request counts', { x: 0.8, y: 4.35, w: 12, h: 0.3, fontSize: 11, color: MUTED, fontFace: CODE });
s9.addText('PROMQL>  sum(http_requests_total) by (service)',   { x: 0.8, y: 4.7, w: 12, h: 0.3, fontSize: 12, color: TEAL, fontFace: CODE, bold: true });
const promResult = [
  '  user-service     →  1,658',
  '  product-service  →  1,687',
  '  order-service    →  1,661',
];
promResult.forEach((line, i) => {
  s9.addText(line, { x: 0.8, y: 5.15 + i * 0.32, w: 12, h: 0.32, fontSize: 14, color: WHITE, fontFace: CODE });
});
s9.addText('▲ Real requests counted by Prometheus — proves end-to-end scraping works.', { x: 0.8, y: 6.25, w: 12, h: 0.3, fontSize: 11, color: SOFT_WH, fontFace: FONT, italic: true });
footer(s9, 9);

// ─── Slide 10: DevSecOps ───────────────────────────────────
const s10 = pres.addSlide();
s10.background = { color: WHITE };
title(s10, 'DevSecOps · Security in Every Stage', 'Shift-left: catch issues before they reach production.');

const security = [
  { title: 'Trivy in CI',           desc: 'Scans every image for known CVEs. HIGH/CRITICAL fails the build.' },
  { title: 'Non-root containers',   desc: 'UID 1001 in image + runAsNonRoot: true verified by K8s.' },
  { title: 'Dropped capabilities',  desc: 'capabilities.drop: [ALL] — minimum Linux privileges.' },
  { title: 'K8s Secrets',           desc: 'JWT_SECRET via valueFrom — never in code or env literal.' },
  { title: 'IMDSv2 + encrypted EBS',desc: 'EC2 metadata locked down · root volume encrypted.' },
  { title: 'Restricted SSH',        desc: 'SG only allows YOUR_IP/32 — not 0.0.0.0/0 in prod.' },
];
security.forEach((sec, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = 0.6 + col * 4.2;
  const y = 1.85 + row * 2.5;
  s10.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.0, h: 2.3, fill: { color: PALE_BL }, line: { color: 'D1DAE5', width: 1 }, rectRadius: 0.08 });
  s10.addShape(pres.shapes.OVAL, { x: x + 0.3, y: y + 0.3, w: 0.6, h: 0.6, fill: { color: TEAL }, line: { color: TEAL, width: 0 } });
  s10.addText(`${i + 1}`, { x: x + 0.3, y: y + 0.3, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: FONT });
  s10.addText(sec.title, { x: x + 1.05, y: y + 0.35, w: 2.85, h: 0.5, fontSize: 15, bold: true, color: NAVY, fontFace: FONT });
  s10.addText(sec.desc,  { x: x + 0.3, y: y + 1.1, w: 3.6, h: 1.1, fontSize: 11, color: TEXT, fontFace: FONT });
});
footer(s10, 10);

// ─── Slide 11: Results & Lessons ───────────────────────────
const s11 = pres.addSlide();
s11.background = { color: WHITE };
title(s11, 'Results & Lessons Learned', 'What worked, what broke, what I now understand.');

s11.addText('RESULTS', { x: 0.6, y: 1.85, w: 6, h: 0.4, fontSize: 12, bold: true, color: MUTED, fontFace: FONT, charSpacing: 2 });
const results = [
  { num: '4',  label: 'microservices, all containerized' },
  { num: '32', label: 'tests passing across 3 services' },
  { num: '11', label: 'git commits — one per milestone' },
  { num: '8',  label: 'K8s pods running healthy' },
  { num: '3',  label: 'Helm revisions (install/upgrade/rollback)' },
];
results.forEach((r, i) => {
  const y = 2.35 + i * 0.85;
  s11.addText(r.num,   { x: 0.6, y, w: 1.4, h: 0.7,         fontSize: 36, bold: true, color: TEAL, fontFace: FONT });
  s11.addText(r.label, { x: 2.0, y: y + 0.15, w: 4.5, h: 0.5, fontSize: 13, color: TEXT, fontFace: FONT, valign: 'middle' });
});

s11.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.85, w: 6.0, h: 5.0, fill: { color: NAVY }, line: { color: NAVY, width: 0 }, rectRadius: 0.08 });
s11.addText('LESSONS LEARNED', { x: 7.0, y: 2.0, w: 5.6, h: 0.4, fontSize: 12, bold: true, color: TEAL, fontFace: FONT, charSpacing: 2 });
const lessons = [
  { title: 'Numeric UID for K8s', body: '"USER app" failed runAsNonRoot. K8s needs a number. Refactored Dockerfiles to USER 1001.' },
  { title: "Stateful services don't scale", body: 'Login broke on 2 replicas — each pod had its own in-memory store. Scaled to 1, documented PostgreSQL as next step.' },
  { title: 'Helm --atomic saves you', body: 'Failed upgrades auto-roll back. helm history is the audit trail every interview asks about.' },
];
lessons.forEach((l, i) => {
  const y = 2.55 + i * 1.4;
  s11.addText(`${i + 1}. ${l.title}`, { x: 7.0, y, w: 5.6, h: 0.4, fontSize: 14, bold: true, color: TEAL, fontFace: FONT });
  s11.addText(l.body,                  { x: 7.0, y: y + 0.4, w: 5.6, h: 0.95, fontSize: 11, color: WHITE, fontFace: FONT, italic: true });
});
footer(s11, 11);

// ─── Slide 12: Thank You + Future ──────────────────────────
const s12 = pres.addSlide();
s12.background = { color: NAVY };

s12.addText('Thank You', { x: 0.7, y: 1.0, w: 12, h: 1.4, fontSize: 64, bold: true, color: WHITE, fontFace: FONT });
s12.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.5, w: 1.2, h: 0.05, fill: { color: TEAL }, line: { color: TEAL, width: 0 } });
s12.addText('Questions, suggestions, code review — all welcome.', { x: 0.7, y: 2.65, w: 11, h: 0.5, fontSize: 17, color: SOFT_WH, fontFace: FONT, italic: true });

s12.addText('PLANNED FUTURE WORK', { x: 0.7, y: 3.85, w: 12, h: 0.35, fontSize: 11, bold: true, color: TEAL, fontFace: FONT, charSpacing: 2 });
const future = [
  ['PostgreSQL + Redis',           'Shared state — scale beyond 1 replica'],
  ['Sealed Secrets',                'Encrypt secrets so they\'re safe to commit'],
  ['cert-manager + Let\'s Encrypt', 'Automated HTTPS in production'],
  ['ArgoCD',                        'GitOps pull-based deployments'],
  ['Distributed tracing',           'Tempo / Jaeger — 3rd observability pillar'],
  ['Service mesh',                  'Istio / Linkerd for mTLS + traffic split'],
];
future.forEach((f, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.7 + col * 6.2;
  const y = 4.35 + row * 0.65;
  s12.addText(f[0], { x, y, w: 3.0, h: 0.4, fontSize: 13, bold: true, color: WHITE, fontFace: FONT });
  s12.addText(f[1], { x: x + 3.05, y, w: 2.95, h: 0.4, fontSize: 11, color: SOFT_WH, fontFace: FONT, italic: true });
});

s12.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 6.65, w: 12, h: 0.5, fill: { color: TEAL }, line: { color: TEAL, width: 0 }, rectRadius: 0.05 });
s12.addText('github.com/Ayush-Gupta-0212/cloudkart', { x: 0.7, y: 6.65, w: 12, h: 0.5, fontSize: 15, bold: true, color: WHITE, fontFace: FONT, align: 'center', valign: 'middle' });

pres.writeFile({ fileName: 'C:\\Users\\ayush\\Desktop\\DevOps\\cloudkart\\docs\\CloudKart-Presentation.pptx' })
  .then(name => console.log('OK: wrote', name))
  .catch(e => { console.error('ERROR:', e); process.exit(1); });
