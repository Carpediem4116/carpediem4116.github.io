import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../',import.meta.url));
const assetVersion = '14';
const origin = 'https://carpediem4116.github.io';
const partial = name => readFile(path.join(root,'templates',name+'.html'),'utf8');
const contact = await partial('contact-footer');
const footer = await partial('footer');
const pages = [
  {key:'home',url:'/',title:'Aaron — Projects & ideas',description:"Aaron's personal portfolio. Exploring mechanical design, embedded systems and robotic arm models."},
  {key:'projects',url:'/projects/',title:'Projects — Aaron',description:"A closer look at what I'm building, and how it fits together."},
  {key:'detail',url:'/projects/zero-arm/',title:'ZERO ARM — Aaron',description:'Connecting mechanical models, embedded firmware, and a six-axis robot description.'},
  {key:'about',url:'/about/',title:'About — Aaron',description:'Curiosity is the starting point. A little about Aaron and the projects behind this site.'},
  {key:'cv',url:'/cv/',title:'CV — Aaron',description:'My CV is taking shape. Education, experience, and a downloadable PDF will be added when ready.'},
  {key:'contact',url:'/contact/',title:'Contact — Aaron',description:'Connect with Aaron through email, WhatsApp, GitHub or LinkedIn.'},
  {key:'notfound',url:'/404.html',title:'Page not found — Aaron',description:'Return to Aaron’s portfolio.'}
];
const items = [['home','/','navHome','Home'],['projects','/projects/','navWork','Projects'],['robot','/robot/','navLab','Robot Lab'],['about','/about/','navAbout','About'],['cv','/cv/','navCv','CV'],['contact','/contact/','navContact','Contact']];
function header(page) {
  const current = page.key === 'detail' ? 'projects' : page.key;
  return `<header class="site-header"><a class="wordmark" href="/" aria-label="Aaron, home">a<span>.</span></a><nav id="site-navigation" aria-label="Main navigation" data-aria="navLabel">${items.map(([key,url,label,text])=>`<a href="${url}" data-i18n="${label}"${key===current?' aria-current="page"':''}>${text}</a>`).join('')}</nav><button id="language-toggle" class="language-toggle" type="button" aria-label="Switch to Chinese"><span aria-hidden="true">◎</span><span id="language-label">中文</span></button><button id="menu-toggle" class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="site-navigation"><span></span><span></span></button></header>`;
}
for (const page of pages) {
  const body = page.key==='notfound' ? '<section class="page-intro section-wrap not-found"><p class="eyebrow">404</p><h1 class="page-title" data-i18n="notFoundTitle">This page could not be found.</h1><a href="/" class="button primary" data-i18n="returnHome">Return home ↗</a></section>' : await partial(page.key);
  const output = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f4f2eb"><meta name="description" content="${page.description.replaceAll('"','&quot;')}"><title>${page.title}</title><link rel="canonical" href="${origin+page.url}">${page.key==='notfound'?'<meta name="robots" content="noindex">':''}<meta property="og:type" content="website"><meta property="og:title" content="${page.title}"><meta property="og:description" content="${page.description.replaceAll('"','&quot;')}"><meta property="og:url" content="${origin+page.url}"><meta property="og:image" content="${origin}/assets/zero-arm-preview.png"><meta property="og:image:alt" content="ZERO ARM, a six-axis robotic arm with colored links"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css?v=${assetVersion}"><script src="/app.js?v=${assetVersion}" defer></script><script src="/effects.js?v=${assetVersion}" defer></script><script src="/vendor/gsap-3.15.0.min.js" defer></script><script src="/motion.js?v=${assetVersion}" defer></script></head>
<body data-page="${page.key}" class="${page.key==='home'?'home-page':'inner-page '+page.key+'-page'}"><div class="ambient-background" aria-hidden="true"><canvas class="fluid-canvas" data-fluid="paper"></canvas></div><a class="skip-link" href="#main" data-i18n="skip">Skip to content</a>${header(page)}<main id="main" tabindex="-1">${body}</main>${page.key==='contact'?'':contact}${footer}</body></html>`;
  const target = path.join(root,page.url.endsWith('.html')?page.url.slice(1):page.url.slice(1)+'index.html');
  await mkdir(path.dirname(target),{recursive:true});
  await writeFile(target,output);
}
const urls = [...pages.filter(p=>p.key!=='notfound').map(p=>p.url),'/robot/'];
await writeFile(path.join(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${origin+url}</loc></url>`).join('')}</urlset>`);
await writeFile(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Built ${pages.length} static pages from existing content.`);
