'use strict';
const translations = {
  en: {
    homeLabel:'Aaron, home',modelImageAlt:'ZERO ARM six-axis robotic arm, with colored links',cvTitleStart:'The next',cvTitleEnd:'chapter.',
    navHome:'Home',navCv:'CV',openMenu:'Open navigation',closeMenu:'Close navigation',projectsPageTitle:'Projects — Aaron',detailPageTitle:'ZERO ARM — Aaron',aboutPageTitle:'About — Aaron',cvPageTitle:'CV — Aaron',contactPageTitle:'Contact — Aaron',notfoundPageTitle:'Page not found — Aaron',notFoundTitle:'This page could not be found.',returnHome:'Return home ↗',
    modelPreviewLabel:'MODEL PREVIEW',modelFallbackHint:'Static preview · Open Robot Lab to retry the interactive model',
    modelFallback:'3D is unavailable right now. Preview shown; open Robot Lab to try again.',modelFallbackImage:'ZERO ARM six-axis robotic arm preview',
    navContact:'Contact',getInTouch:'Get in touch ↗',buildNotes:'Read the build notes ↗',caseEyebrow:'ZERO ARM / BUILD NOTE 001',caseTitle:'Getting the frames to agree.',caseProblem:'A connected CAD assembly is only the beginning. Its meshes and joint frames have to agree before it can move as one robot.',caseApproach:'This project brings the mechanical assembly into seven rigid links, with joint-local meshes and a six-axis URDF description. The browser lets you inspect those connections directly.',degreesFreedom:'degrees of freedom',rigidLinks:'rigid links',upAxis:'up axis',
    carouselLabel:'Selected projects',exploreArm:'Explore ZERO ARM in 3D',onHorizon:'ON THE HORIZON',comingSoon:'Coming soon.',comingText:'The next idea is taking shape. More projects will join this collection as they develop.',stayCurious:'Stay curious.',previousProject:'Previous project',nextProject:'Next project',showArm:'Show Robotic Arm',showSoon:'Show Coming soon',socialLabel:'Contact links',emailLabel:'Email',socialCaption:"Let's connect.",
    navLab:'Robot Lab',openLab:'Open the six-axis explorer',realModelLabel:'LIVE 3D MODEL',modelHint:'Drag to rotate · Scroll to zoom · Your real ZERO ARM model',
    skip:'Skip to content',navLabel:'Main navigation',navWork:'Projects',navAbout:'About',eyebrow:'AARON / PERSONAL PORTFOLIO',heroLine1:'Making ideas',heroLine2:'move.',heroDescription:'Exploring the space between mechanical design, embedded software, and the models that bring them together.',heroCta:'Explore my work',heroNote:'A collection of projects, experiments, and things in progress.',sketchLabel:'KINEMATIC SKETCH',sketchTitle:'An interactive robotic arm sketch',sketchDesc:'An illustrative two-link arm. Adjust the slider below to change the shoulder angle. This is a conceptual drawing, not a simulation of the project.',jointLabel:'Explore the shoulder angle',sketchNote:"An illustrative study, not the project's CAD model or simulation.",heroBottom:'DESIGN / CODE / EXPLORATION',scroll:'SCROLL TO EXPLORE ↓',workEyebrow:'01 / SELECTED WORK',workTitle:'From concept to components.',workIntro:"A closer look at what I'm building, and how it fits together.",ongoing:'IN PROGRESS',projectTitle:'Robotic Arm',projectLead:'Connecting mechanical models, embedded firmware, and a six-axis robot description.',projectDescription:'A project workspace spanning STEP assemblies and 3D printing resources, an STM32F103 firmware project, and D-H / URDF models. An exploration of the connections between physical structure and software.',repoLink:'Explore the repository',insideProject:'INSIDE THE PROJECT',mechanical:'Mechanical design',mechanicalText:'STEP assemblies, printable parts, and assembly references.',embedded:'Embedded software',embeddedText:'STM32F103, HAL, and FreeRTOS project structure.',robotModels:'Robot models',robotModelsText:'D-H parameters and a six-axis URDF description.',projectNotes:'Project notes & current status',projectStatus:'The repository documents CAD-to-URDF checks and a MATLAB zero-pose import. Full motion validation, firmware builds, and hardware operation remain work in progress.',readmeLink:'Read the project notes ↗',moreWork:'More projects will join this collection as they develop.',aboutEyebrow:'02 / A LITTLE ABOUT ME',aboutLine1:'Curiosity is',aboutLine2:'the starting point.',aboutLead:"Hi, I'm Aaron.",aboutText:"I enjoy exploring how things work across mechanical design and software. This site is a place to share the projects I'm working on, the ideas behind them, and what I'm learning along the way.",aboutText2:'Right now, that includes bringing together CAD, embedded firmware, and robot descriptions in a robotic arm project.',githubProfile:'Find me on GitHub',cvEyebrow:'03 / CURRICULUM VITAE',cvTitle:'The next chapter.',cvText:"My CV is taking shape. Education, experience, and a downloadable PDF will be added here when it's ready.",cvStatus:'CV IN PREPARATION',cvNote:'A work in progress.',contactEyebrow:'KEEP EXPLORING',contactTitle:"See what's next.",footer:'Built with curiosity.',backTop:'BACK TO TOP ↑',pageTitle:'Aaron — Projects & ideas',description:"Aaron's personal portfolio. Exploring mechanical design, embedded systems and robotic arm models."
  },
  zh: {
    homeLabel:'Aaron，返回主页',modelImageAlt:'ZERO ARM 六轴机械臂，连杆分色展示',cvTitleStart:'下一章，',cvTitleEnd:'正在书写。',
    navHome:'主页',navCv:'CV',openMenu:'打开导航',closeMenu:'关闭导航',projectsPageTitle:'项目 — Aaron',detailPageTitle:'ZERO ARM — Aaron',aboutPageTitle:'关于 — Aaron',cvPageTitle:'简历 — Aaron',contactPageTitle:'联系 — Aaron',notfoundPageTitle:'页面未找到 — Aaron',notFoundTitle:'暂时找不到这个页面。',returnHome:'返回主页 ↗',
    modelPreviewLabel:'模型预览',modelFallbackHint:'静态预览 · 可打开 Robot Lab 重试交互模型',
    modelFallback:'三维模型暂时无法加载，先显示预览图。可打开 Robot Lab 重试。',modelFallbackImage:'ZERO ARM 六轴机械臂预览图',
    navContact:'联系',getInTouch:'保持联系 ↗',buildNotes:'阅读构建笔记 ↗',caseEyebrow:'ZERO ARM / 构建笔记 001',caseTitle:'让坐标系，对得上。',caseProblem:'连接完整的 CAD 装配体只是起点。网格与关节坐标系需要一致，零件才能作为一台机器人运动。',caseApproach:'这个项目将机械装配体整理为七个刚性连杆，配合关节局部网格与六轴 URDF 描述。你可以在浏览器中直接查看这些连接。',degreesFreedom:'自由度',rigidLinks:'刚性连杆',upAxis:'向上轴',
    carouselLabel:'项目展示',exploreArm:'在三维空间探索 ZERO ARM',onHorizon:'正在酝酿',comingSoon:'敬请期待。',comingText:'下一个想法正在成形。随着项目逐步完善，更多作品会加入这里。',stayCurious:'保持好奇。',previousProject:'上一个项目',nextProject:'下一个项目',showArm:'显示机械臂项目',showSoon:'显示敬请期待',socialLabel:'联系方式',emailLabel:'邮箱',socialCaption:'保持联系。',
    navLab:'机械臂',openLab:'打开六轴关节探索器',realModelLabel:'实时三维模型',modelHint:'拖动旋转 · 滚轮缩放 · 真实 ZERO ARM 模型',
    skip:'跳转至正文',navLabel:'主导航',navWork:'项目',navAbout:'关于',eyebrow:'AARON / 个人作品集',heroLine1:'让想法',heroLine2:'动起来。',heroDescription:'探索机械设计、嵌入式软件，以及连接两者的模型。从一个想法开始，把它拆解、构建，再一步步验证。',heroCta:'探索我的项目',heroNote:'记录项目、实验，以及仍在生长的想法。',sketchLabel:'运动学概念草图',sketchTitle:'可交互的机械臂概念草图',sketchDesc:'这是一幅双连杆机械臂示意图。调整下方滑块可以改变肩关节角度。它用于概念展示，并非项目仿真。',jointLabel:'试着改变肩关节角度',sketchNote:'概念示意，并非项目的实际 CAD 模型或仿真。',heroBottom:'设计 / 代码 / 探索',scroll:'向下探索 ↓',workEyebrow:'01 / 精选项目',workTitle:'从想法，到零部件。',workIntro:'看看我正在做什么，以及各个部分如何连接起来。',ongoing:'进行中',projectTitle:'机械臂',projectLead:'连接机械模型、嵌入式固件与六轴机器人描述。',projectDescription:'一个涵盖 STEP 装配模型、3D 打印资源、STM32F103 固件工程以及 D-H / URDF 模型的项目，探索实体结构与软件之间的联系。',repoLink:'查看项目仓库',insideProject:'项目组成',mechanical:'机械设计',mechanicalText:'STEP 装配模型、可打印零件与装配参考资料。',embedded:'嵌入式软件',embeddedText:'STM32F103、HAL 与 FreeRTOS 工程结构。',robotModels:'机器人模型',robotModelsText:'D-H 参数与六轴 URDF 机器人描述。',projectNotes:'项目记录与当前进展',projectStatus:'仓库记录了 CAD 到 URDF 的检查与 MATLAB 零位姿导入。完整运动验证、固件编译及硬件运行仍在推进中。',readmeLink:'阅读项目记录 ↗',moreWork:'随着项目逐步完善，更多作品会加入这里。',aboutEyebrow:'02 / 关于我',aboutLine1:'好奇心，',aboutLine2:'是一切的起点。',aboutLead:'你好，我是 Aaron。',aboutText:'我喜欢在机械设计与软件之间探索事物的工作方式。这个网站记录我正在做的项目、背后的想法，以及过程中的学习与发现。',aboutText2:'目前，我正在一个机械臂项目中，将 CAD、嵌入式固件与机器人描述模型连接起来。',githubProfile:'在 GitHub 上找到我',cvEyebrow:'03 / 个人简历',cvTitle:'下一章，正在书写。',cvText:'我的 CV 仍在整理中。准备完成后，这里会加入教育背景、经历，以及可下载的 PDF 简历。',cvStatus:'简历准备中',cvNote:'持续整理，逐步完善。',contactEyebrow:'继续探索',contactTitle:'看看接下来的进展。',footer:'从好奇心出发。',backTop:'返回顶部 ↑',pageTitle:'Aaron — 项目与想法',description:'Aaron 的个人作品集。探索机械设计、嵌入式系统与机械臂模型。'
  }
};
const languageToggle = document.getElementById('language-toggle');
const page = document.body.dataset.page || 'home';
let currentLanguage = 'en';
function setLanguage(language) {
  const selected = language === 'zh' ? 'zh' : 'en';
  currentLanguage = selected;
  document.documentElement.lang = selected === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = translations[selected][element.dataset.i18n];
    if (typeof value === 'string') element.textContent = value;
  });
  document.querySelectorAll('[data-aria]').forEach(element => {
    element.setAttribute('aria-label', translations[selected][element.dataset.aria]);
  });
  document.querySelectorAll('[data-alt]').forEach(element => {
    element.alt = translations[selected][element.dataset.alt];
  });
  document.title = translations[selected][page+'PageTitle'] || translations[selected].pageTitle;
  const descriptionKey = ({projects:'workIntro',detail:'projectLead',about:'aboutText',cv:'cvText',contact:'socialCaption',notfound:'notFoundTitle'})[page] || 'description';
  document.querySelector('meta[name="description"]').content = translations[selected][descriptionKey];
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = translations[selected][descriptionKey];
  document.querySelector('meta[property="og:image:alt"]').content = translations[selected].modelImageAlt;
  const fallbackPoster = document.querySelector('.model-error .model-poster');
  if (fallbackPoster) fallbackPoster.alt = translations[selected].modelFallbackImage;
  document.getElementById('language-label').textContent = selected === 'zh' ? 'EN' : '中文';
  languageToggle.setAttribute('aria-label',selected === 'zh' ? 'Switch to English' : '切换为中文');
  languageToggle.lang = selected === 'zh' ? 'en' : 'zh-CN';
  const readme = document.getElementById('readme-link');
  if (readme) readme.href = 'https://github.com/Carpediem4116/Robotic-Arm/blob/main/readme-' + (selected === 'zh' ? 'cn' : 'en') + '.md';
  const preview = document.getElementById('robot-preview');
  if (preview) {
    preview.title = selected === 'zh' ? 'ZERO ARM 机械臂三维预览' : 'ZERO ARM interactive 3D preview';
    if (location.protocol.startsWith('http')) preview.contentWindow?.postMessage({type:'aaron-language',language:selected},location.origin);
  }
  try { localStorage.setItem('aaron-portfolio-language',selected); } catch { /* Language switching also works when storage is unavailable. */ }
  updateModelLabels();
  document.dispatchEvent(new Event('portfolio-language'));
}
languageToggle.addEventListener('click', () => setLanguage(currentLanguage === 'en' ? 'zh' : 'en'));
let savedLanguage = 'en';
try { savedLanguage = localStorage.getItem('aaron-portfolio-language') || 'en'; } catch { /* English is the default. */ }
setLanguage(savedLanguage);
document.getElementById('year').textContent = new Date().getFullYear();

document.addEventListener('click',event => {
  if (!event.target.closest('[data-open-project]')) return;
  const details = document.getElementById('project-details');
  if (!details) return;
  event.preventDefault();
  details.open = true;
  details.scrollIntoView({block:'start'});
  details.querySelector('summary').focus({preventScroll:true});
});

// Keep the same robot visible while its meshes load; remove the poster only
// after the embedded viewer reports a rendered model. A failed 3D load keeps
// the real model's preview visible and exposes a translated recovery hint.
const robotPreview = document.getElementById('robot-preview');
window.addEventListener('message',event => {
  if (event.origin !== location.origin || event.source !== robotPreview?.contentWindow) return;
  const kind = event.data?.type;
  if (!['aaron-model-ready','aaron-model-error'].includes(kind)) return;
  const stage = robotPreview.closest('.robot-stage');
  const failed = kind === 'aaron-model-error';
  stage.classList.toggle('model-error',failed);
  stage.classList.toggle('model-ready',!failed);
  const poster = stage.querySelector('.model-poster');
  poster.setAttribute('aria-hidden',String(!failed));
  poster.alt = failed ? translations[currentLanguage].modelFallbackImage : '';
  stage.querySelector('.model-fallback').hidden = !failed;
  if (failed) { robotPreview.setAttribute('aria-hidden','true'); robotPreview.tabIndex = -1; }
  else { robotPreview.removeAttribute('aria-hidden'); robotPreview.removeAttribute('tabindex'); }
  updateModelLabels();
});

function updateModelLabels() {
  const stage = document.querySelector('.robot-stage');
  if (!stage) return;
  const failed = stage.classList.contains('model-error');
  document.querySelector('[data-i18n="realModelLabel"]').textContent = translations[currentLanguage][failed ? 'modelPreviewLabel' : 'realModelLabel'];
  document.querySelector('[data-i18n="modelHint"]').textContent = translations[currentLanguage][failed ? 'modelFallbackHint' : 'modelHint'];
}

const menuButton = document.getElementById('menu-toggle');
const siteHeader = document.querySelector('.site-header');
const navigation = document.getElementById('site-navigation');
function setMenu(open,restoreFocus = false) {
  if (!menuButton) return;
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',translations[currentLanguage][open?'closeMenu':'openMenu']);
  siteHeader.classList.toggle('menu-open',open);
  if (open) navigation.querySelector('a').focus({preventScroll:true});
  else if (restoreFocus) menuButton.focus({preventScroll:true});
}
menuButton?.addEventListener('click',() => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation?.addEventListener('click',event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown',event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') setMenu(false,true);
});
document.addEventListener('click',event => { if (!siteHeader?.contains(event.target)) setMenu(false); });
siteHeader?.addEventListener('focusout',event => { if (!siteHeader.contains(event.relatedTarget)) setMenu(false); });
document.addEventListener('portfolio-language',() => {
  if (menuButton) menuButton.setAttribute('aria-label',translations[currentLanguage][menuButton.getAttribute('aria-expanded')==='true'?'closeMenu':'openMenu']);
});
matchMedia('(min-width: 721px)').addEventListener('change',event => { if (event.matches) setMenu(false); });
setMenu(false);

const legacyPages = {'#about':'/about/','#cv':'/cv/','#contact':'/contact/','#project-details':'/projects/zero-arm/'};
if (page === 'home' && legacyPages[location.hash]) location.replace(legacyPages[location.hash]);
