import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import URDFLoader from 'urdf-loader';
import { unpackZip, findArchiveFile } from './archive.js';

const words = {
  en: {
    skip:'Skip to joint controls',back:'Portfolio',eyebrow:'FROM FILE TO MOTION',title:'A closer look at the mechanics.',intro:'Rotate the model. Explore each joint. See how it all connects.',viewportLabel:'3D model viewer',fit:'Fit view',cameraLabel:'Camera view',iso:'Perspective',front:'Front',side:'Side',top:'Top',fullscreen:'Toggle fullscreen',canvasLabel:'Interactive 3D robot. Drag to rotate, right-drag to pan, and scroll to zoom.',retry:'Load ZERO ARM',gesture:'Drag to orbit · Right-drag to pan · Scroll to zoom',grid:'Grid',frames:'Joint frames',wireframe:'Wireframe',colors:'Link colors',saveImage:'Save image ↗',position:'Link frame position',measuredFrame:'Measured link frame',controlsEyebrow:'KINEMATIC CONTROLS',joints:'Joint explorer',waiting:'Joint controls appear when the model is ready.',reset:'Reset pose',exportPose:'Export pose',structure:'Model structure',modelNote:'URDF kinematics, without physics or collision checking. ZERO ARM joint limits are model placeholders, not calibrated hardware limits.',privacy:'An interactive view of my ZERO ARM model.',download:'Download ZERO ARM ZIP ↓',support:'6 AXES / 7 LINKS / URDF + STL',loading:'Loading robot…',fetching:'Downloading model',unpacking:'Unpacking ZIP…',building:'Building the robot…',failed:'The model could not be loaded.',links:'links',jointCount:'movable joints',degrees:'degrees',millimetres:'millimetres',noJoints:'This model has no supported movable joints.',unsupported:'Floating and planar joints are shown at their zero pose.',resetDone:'All joints reset.',imageDone:'Image saved.',poseDone:'Pose exported.',exportFailed:'The image could not be exported.',fullscreenFailed:'Fullscreen is unavailable in this browser.',pageTitle:'Robot Lab — Aaron',loadKept:'Your previous model is still available. Close this notice to continue.',dismiss:'Dismiss',
  },
  zh: {
    skip:'跳转到关节控制',back:'个人主页',eyebrow:'从文件，到运动',title:'走近机械结构，探索每一轴。',intro:'旋转模型，调节关节，看看各个部分如何连接。',viewportLabel:'三维模型查看器',fit:'适应视图',cameraLabel:'相机视角',iso:'透视',front:'正视',side:'侧视',top:'顶视',fullscreen:'切换全屏',canvasLabel:'可交互的三维机器人。拖动旋转视角，右键拖动平移，滚轮缩放。',retry:'加载 ZERO ARM',gesture:'拖动旋转 · 右键平移 · 滚轮缩放',grid:'网格',frames:'关节坐标系',wireframe:'线框',colors:'连杆分色',saveImage:'保存图片 ↗',position:'连杆坐标系位置',measuredFrame:'测量的连杆坐标系',controlsEyebrow:'运动学控制',joints:'关节探索',waiting:'模型加载后，关节控制将在这里显示。',reset:'姿态复位',exportPose:'导出姿态',structure:'模型结构',modelNote:'基于 URDF 的运动学查看，不包含物理仿真或碰撞检测。ZERO ARM 的关节限位是模型占位值，尚未经过硬件标定。',privacy:'我的 ZERO ARM 机械臂交互展示。',download:'下载 ZERO ARM ZIP ↓',support:'6 轴 / 7 个连杆 / URDF + STL',loading:'正在加载机器人…',fetching:'正在下载模型',unpacking:'正在解压 ZIP…',building:'正在构建机器人…',failed:'模型加载失败。',links:'个连杆',jointCount:'个可动关节',degrees:'度',millimetres:'毫米',noJoints:'此模型没有支持调节的可动关节。',unsupported:'浮动关节和平面关节以零位姿显示。',resetDone:'所有关节已复位。',imageDone:'图片已保存。',poseDone:'姿态已导出。',exportFailed:'无法导出图片。',fullscreenFailed:'此浏览器暂不支持全屏。',pageTitle:'机械臂实验室 — Aaron',loadKept:'上一个模型仍然可用。关闭此提示后可继续操作。',dismiss:'关闭提示',
  }
};
const $ = id => document.getElementById(id);
document.body.classList.toggle('embedded',new URLSearchParams(location.search).get('embed') === '1');
let language = 'en';
try { language = localStorage.getItem('aaron-portfolio-language') === 'zh' ? 'zh' : 'en'; } catch {}
const t = key => words[language][key];
let robot = null;
const currentFileName = 'ZERO_ARM_urdf_online_verified.zip';
let jointControls = [];
let frameHelpers = [];
let meshMaterials = [];
let currentUrls = [];
let busy = false;
let loadPhase = 'loading';
let progress = '';
let noticeTimer;

function translate() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = t('pageTitle');
  document.querySelectorAll('[data-t]').forEach(node => { node.textContent = t(node.dataset.t); });
  document.querySelectorAll('[data-aria-t]').forEach(node => { node.setAttribute('aria-label', t(node.dataset.ariaT)); });
  $('lab-language-label').textContent = language === 'zh' ? 'EN' : '中文';
  $('lab-language').setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
  if (busy) $('load-message').textContent = t(loadPhase) + progress;
  updateStatistics();
  jointControls.forEach(control => labelControl(control));
}
$('lab-language').addEventListener('click', () => {
  language = language === 'en' ? 'zh' : 'en';
  try { localStorage.setItem('aaron-portfolio-language', language); } catch {}
  translate();
});
window.addEventListener('message',event => {
  if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'aaron-language') return;
  if (!['en','zh'].includes(event.data.language)) return;
  language = event.data.language;
  translate();
});
window.addEventListener('storage',event => {
  if (event.key !== 'aaron-portfolio-language') return;
  language = event.newValue === 'zh' ? 'zh' : 'en';
  translate();
});

function notice(message) {
  clearTimeout(noticeTimer);
  $('lab-notice').textContent = message;
  $('lab-notice').hidden = false;
  noticeTimer = setTimeout(() => { $('lab-notice').hidden = true; }, 4000);
}

function setBusy(value, phase = 'loading') {
  busy = value;
  loadPhase = phase;
  progress = '';
  $('load-overlay').hidden = !value;
  $('load-overlay').classList.remove('error');
  $('retry-load').hidden = true;
  $('load-detail').textContent = '';
  if (value) $('load-message').textContent = t(phase);
  for (const id of ['fit-view','camera-view','save-image','frame-select','reset-pose','export-pose']) $(id).disabled = value || !robot;
  jointControls.forEach(({ range, number }) => { range.disabled = number.disabled = value; });
}

function showError(error) {
  setBusy(false);
  $('load-overlay').hidden = false;
  $('load-overlay').classList.add('error');
  $('load-message').textContent = t('failed');
  $('load-detail').textContent = String(error.message || error) + (robot ? '\n' + t('loadKept') : '');
  $('retry-load').hidden = false;
  $('retry-load').textContent = robot ? t('dismiss') : t('retry');
}

function disposeObject(object) {
  if (!object) return;
  const geometries = new Set(), materials = new Set(), textures = new Set();
  object.traverse(node => {
    if (node.geometry) geometries.add(node.geometry);
    for (const material of node.material ? (Array.isArray(node.material) ? node.material : [node.material]) : []) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  geometries.forEach(item => item.dispose());
  materials.forEach(item => item.dispose());
  textures.forEach(item => item.dispose());
}

let renderer, scene, camera, controls, grid, floor;
let dirty = true;
const canvasWrap = $('canvas-wrap');
const cameraDirection = new THREE.Vector3(1.2, -1.7, 1.05).normalize();
const modelBounds = new THREE.Box3();
const modelCenter = new THREE.Vector3();
const modelSize = new THREE.Vector3();
const framePosition = new THREE.Vector3();
let modelScale = 1;

function initializeScene() {
  renderer = new THREE.WebGLRenderer({canvas:$('robot-canvas'),antialias:true,alpha:false,preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.setClearColor('#e9ede7');
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38,1,0.001,1000);
  camera.up.set(0,0,1);
  camera.position.set(0.7,-1,0.65);
  controls = new OrbitControls(camera,renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  controls.addEventListener('change',() => { dirty = true; });
  scene.add(new THREE.AmbientLight(0xffffff,0.7));
  const keyLight = new THREE.DirectionalLight(0xfff8ed,2.4);
  keyLight.position.set(2,-3,5);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xc4d6e5,0.8);
  fillLight.position.set(-2,2,1);
  scene.add(fillLight);
  const resize = () => {
    const width = canvasWrap.clientWidth, height = canvasWrap.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width,height,false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    dirty = true;
  };
  new ResizeObserver(resize).observe(canvasWrap);
  resize();
  const animate = () => {
    requestAnimationFrame(animate);
    if (document.hidden) return;
    if (controls.update()) dirty = true;
    if (dirty) { renderer.render(scene,camera); dirty = false; }
  };
  animate();
}

function fitView(kind = $('camera-view').value) {
  if (!robot) return;
  robot.updateMatrixWorld(true);
  modelBounds.setFromObject(robot);
  modelBounds.getCenter(modelCenter);
  modelBounds.getSize(modelSize);
  const radius = Math.max(modelSize.length() / 2,0.01);
  const halfFov = Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.min(camera.aspect,1));
  const distance = radius / Math.sin(halfFov) * 1.12;
  if (kind === 'front') cameraDirection.set(0,-1,0.03).normalize();
  else if (kind === 'side') cameraDirection.set(1,0,0.03).normalize();
  else if (kind === 'top') cameraDirection.set(0,-0.0001,1).normalize();
  else cameraDirection.set(1.2,-1.7,1.05).normalize();
  camera.position.copy(modelCenter).addScaledVector(cameraDirection,distance);
  camera.near = Math.max(radius / 1000,0.00001);
  camera.far = radius * 1000;
  camera.updateProjectionMatrix();
  controls.minDistance = radius * 0.06;
  controls.maxDistance = radius * 30;
  controls.target.copy(modelCenter);
  controls.update();
  dirty = true;
}

function setupFloor() {
  if (grid) { scene.remove(grid); disposeObject(grid); }
  if (floor) { scene.remove(floor); disposeObject(floor); }
  modelBounds.setFromObject(robot);
  modelBounds.getSize(modelSize);
  modelScale = Math.max(modelSize.x,modelSize.y,modelSize.z,0.01);
  const size = modelScale * 2.8;
  grid = new THREE.GridHelper(size,20,0xa7b4a4,0xcbd3c7);
  grid.rotation.x = Math.PI / 2;
  grid.position.z = modelBounds.min.z - modelScale * 0.01;
  grid.visible = $('show-grid').checked;
  scene.add(grid);
  floor = new THREE.Mesh(new THREE.PlaneGeometry(size * 4,size * 4),new THREE.MeshBasicMaterial({color:0xe9ede7,toneMapped:false,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));
  floor.position.z = grid.position.z - modelScale * 0.001;
  scene.add(floor);
}

function validateDescription(xml) {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('URDF document types and entities are not supported.');
  const document = new DOMParser().parseFromString(xml,'application/xml');
  if (document.querySelector('parsererror') || document.documentElement.nodeName !== 'robot') throw new Error('The URDF is not valid robot XML.');
  const links = [...document.documentElement.children].filter(node => node.tagName === 'link');
  const joints = [...document.documentElement.children].filter(node => node.tagName === 'joint');
  if (!links.length || links.length > 256 || joints.length > 256) throw new Error('Use a URDF with 1–256 links and at most 256 joints.');
  const safeName = name => name && !['__proto__','prototype','constructor'].includes(name);
  const linkNames = links.map(node => node.getAttribute('name'));
  const jointNames = joints.map(node => node.getAttribute('name'));
  if (![...linkNames,...jointNames].every(safeName) || new Set(linkNames).size !== links.length || new Set(jointNames).size !== joints.length) throw new Error('Link and joint names must be unique, valid names.');
  const children = new Set(), graph = new Map(linkNames.map(name => [name,[]]));
  for (const joint of joints) {
    const parent = joint.querySelector('parent')?.getAttribute('link');
    const child = joint.querySelector('child')?.getAttribute('link');
    if (!graph.has(parent) || !graph.has(child) || children.has(child)) throw new Error('The URDF must describe a connected link tree.');
    const limit = joint.querySelector('limit');
    if (['revolute','prismatic'].includes(joint.getAttribute('type'))) {
      const lower = Number(limit?.getAttribute('lower'));
      const upper = Number(limit?.getAttribute('upper'));
      if (!limit || ![lower,upper].every(Number.isFinite) || upper < lower) throw new Error('Invalid joint limits.');
    }
    graph.get(parent).push(child);
    children.add(child);
    for (const attr of ['xyz','rpy']) {
      for (const node of joint.querySelectorAll('[' + attr + ']')) {
        const values = node.getAttribute(attr).trim().split(/\s+/).map(Number);
        if (values.length !== 3 || !values.every(Number.isFinite)) throw new Error('Invalid joint transform.');
      }
    }
  }
  const roots = linkNames.filter(name => !children.has(name));
  if (roots.length !== 1) throw new Error('The URDF must have exactly one root link.');
  const visited = new Set();
  function visit(name) {
    if (visited.has(name)) throw new Error('The URDF contains a cycle.');
    visited.add(name);
    graph.get(name).forEach(visit);
  }
  visit(roots[0]);
  if (visited.size !== links.length) throw new Error('The URDF contains disconnected links.');
  const mimicGraph = new Map(joints.map(joint => [joint.getAttribute('name'),joint.querySelector('mimic')?.getAttribute('joint')]));
  for (const name of jointNames) {
    const seen = new Set();
    let cursor = name;
    while (mimicGraph.get(cursor)) {
      if (seen.has(cursor) || !mimicGraph.has(mimicGraph.get(cursor))) throw new Error('Invalid mimic joint relationship.');
      seen.add(cursor);
      cursor = mimicGraph.get(cursor);
    }
  }
  return document;
}

async function parseRobot(archive, urdfPath) {
  const xml = new TextDecoder().decode(archive.files.get(urdfPath));
  const description = validateDescription(xml);
  const urls = new Map();
  const manager = new THREE.LoadingManager();
  const failures = [];
  manager.setURLModifier(input => {
    if ([...urls.values()].includes(input)) return input;
    const path = findArchiveFile(archive.files,input);
    if (!urls.has(path)) {
      const mime = /\.png$/i.test(path) ? 'image/png' : /\.jpe?g$/i.test(path) ? 'image/jpeg' : 'application/octet-stream';
      urls.set(path,URL.createObjectURL(new Blob([archive.files.get(path)],{type:mime})));
    }
    return urls.get(path);
  });
  manager.onError = url => failures.push('Unable to load resource: ' + url);
  const loader = new URDFLoader(manager);
  loader.workingPath = 'zip:///' + (urdfPath.includes('/') ? urdfPath.slice(0,urdfPath.lastIndexOf('/') + 1) : '');
  loader.packages = name => 'zip:///' + name;
  loader.parseCollision = false;
  const geometryCache = new Map();
  loader.loadMeshCb = (input, loadingManager, material, complete) => {
    try {
      const path = findArchiveFile(archive.files,input);
      const bytes = archive.files.get(path);
      let object;
      if (/\.stl$/i.test(path)) {
        if (!geometryCache.has(path)) {
          const geometry = new STLLoader().parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset + bytes.byteLength));
          if (!geometry.attributes.position?.count) throw new Error('Empty STL: ' + path);
          geometry.computeBoundingBox();
          geometryCache.set(path,geometry);
        }
        object = new THREE.Mesh(geometryCache.get(path),material.clone());
      } else throw new Error('The ZERO ARM model requires STL meshes.');
      complete(object);
    } catch (error) { failures.push(error.message); complete(null); }
  };
  let result;
  try {
    await new Promise((resolve,reject) => {
      const timeout = setTimeout(() => reject(new Error('Model resources took too long to load.')),25000);
      manager.onLoad = () => { clearTimeout(timeout); resolve(); };
      manager.itemStart('zip-parse');
      try { result = loader.parse(description); } catch (error) { clearTimeout(timeout); reject(error); }
      manager.itemEnd('zip-parse');
    });
    if (failures.length) throw new Error(failures.slice(0,4).join('\n'));
    result.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(result);
    if (bounds.isEmpty() || ![...bounds.min.toArray(),...bounds.max.toArray()].every(Number.isFinite)) throw new Error('The model has no valid visible geometry.');
    return { model:result, urls:[...urls.values()] };
  } catch (error) {
    disposeObject(result);
    [...urls.values()].forEach(url => URL.revokeObjectURL(url));
    throw error;
  }
}

function updateStatistics() {
  if (!robot) return;
  $('model-stats').textContent = `${Object.keys(robot.links).length} ${t('links')} / ${jointControls.length} ${t('jointCount')}`;
}

function labelControl(control) {
  const unit = control.linear ? t('millimetres') : t('degrees');
  control.range.setAttribute('aria-label',`${control.joint.name} (${unit})`);
  control.number.setAttribute('aria-label',`${control.joint.name} ${unit}`);
}

function updateFramePosition() {
  if (!robot) return;
  robot.updateMatrixWorld(true);
  const frame = robot.links[$('frame-select').value];
  if (!frame) return;
  frame.getWorldPosition(framePosition);
  // The robot root retains the original URDF base frame; the camera is Z-up.
  for (const axis of ['x','y','z']) $('frame-' + axis).textContent = (Math.abs(framePosition[axis]) < 0.000005 ? 0 : framePosition[axis] * 1000).toFixed(2);
  dirty = true;
}

function updateJoint(control, requested, preserveNumber = false) {
  let value = Number(requested);
  if (!Number.isFinite(value)) value = (control.joint.jointValue[0] || 0) * control.factor;
  value = THREE.MathUtils.clamp(value,control.lower,control.upper);
  robot.setJointValue(control.joint.name,value / control.factor);
  syncJointControls(preserveNumber ? control.number : null);
  updateFramePosition();
}

function syncJointControls(preservedInput = null) {
  for (const control of jointControls) {
    const value = control.joint.jointValue[0] * control.factor;
    control.range.value = String(value);
    if (control.number !== preservedInput) control.number.value = value.toFixed(1);
  }
}

function buildJointControls() {
  $('joint-list').replaceChildren();
  $('model-tree').replaceChildren();
  $('frame-select').replaceChildren();
  jointControls = [];
  const supported = ['revolute','continuous','prismatic'];
  const allJoints = Object.values(robot.joints);
  for (const joint of allJoints) {
    const treeRow = document.createElement('div');
    treeRow.className = 'model-tree-row';
    const type = document.createElement('span'); type.textContent = joint.jointType;
    const relation = document.createElement('span'); relation.textContent = `${joint.name}: ${joint.parent?.name || '—'} → ${joint.children.find(child => child.isURDFLink)?.name || '—'}`;
    treeRow.append(type,relation); $('model-tree').append(treeRow);
    if (!supported.includes(joint.jointType) || joint.isURDFMimicJoint) continue;
    const linear = joint.jointType === 'prismatic';
    const factor = linear ? 1000 : 180 / Math.PI;
    let lower = joint.jointType === 'continuous' ? -180 : joint.limit.lower * factor;
    let upper = joint.jointType === 'continuous' ? 180 : joint.limit.upper * factor;
    if (![lower,upper].every(Number.isFinite) || upper < lower) throw new Error('Invalid limits for ' + joint.name);
    const unit = linear ? 'mm' : '°';
    const wrapper = document.createElement('div'); wrapper.className = 'joint-control';
    const line = document.createElement('div'); line.className = 'joint-label-line';
    const name = document.createElement('span'); name.className = 'joint-name';
    const index = document.createElement('span'); index.className = 'joint-number'; index.textContent = String(jointControls.length + 1).padStart(2,'0');
    name.append(index,document.createTextNode(joint.name));
    const valueWrap = document.createElement('span'); valueWrap.className = 'joint-value';
    const number = document.createElement('input'); number.type = 'number'; number.min = lower; number.max = upper; number.step = 0.1; number.value = 0;
    const unitLabel = document.createElement('span'); unitLabel.textContent = unit; valueWrap.append(number,unitLabel); line.append(name,valueWrap);
    const range = document.createElement('input'); range.type = 'range'; range.className = 'joint-range'; range.min = lower; range.max = upper; range.step = 0.1; range.value = 0;
    range.dataset.joint = joint.name;
    number.dataset.joint = joint.name;
    const limits = document.createElement('div'); limits.className = 'joint-limit-labels';
    for (const value of [lower,upper]) { const label = document.createElement('span'); label.textContent = `${Number(value.toFixed(1))}${unit}`; limits.append(label); }
    wrapper.append(line,range,limits); $('joint-list').append(wrapper);
    const control = {joint,range,number,linear,factor,lower,upper};
    jointControls.push(control); labelControl(control);
    range.addEventListener('input',() => updateJoint(control,range.value));
    number.addEventListener('input',() => { if (number.value !== '' && Number.isFinite(number.valueAsNumber)) updateJoint(control,number.value,true); });
    number.addEventListener('change',() => updateJoint(control,number.value));
  }
  if (!jointControls.length) { const note = document.createElement('p'); note.className = 'waiting-copy'; note.textContent = t('noJoints'); $('joint-list').append(note); }
  if (allJoints.some(joint => ['floating','planar'].includes(joint.jointType))) { const note = document.createElement('p'); note.className = 'waiting-copy'; note.textContent = t('unsupported'); $('joint-list').append(note); }
  for (const name of Object.keys(robot.links)) { const option = document.createElement('option'); option.value = option.textContent = name; $('frame-select').append(option); }
  const leaf = Object.values(robot.links).findLast(link => !link.children.some(child => child.isURDFJoint));
  $('frame-select').value = leaf?.name || Object.keys(robot.links).at(-1);
  updateStatistics();
  syncJointControls();
}

function styleRobot() {
  meshMaterials = [];
  frameHelpers = [];
  const palette = [0x4f635b,0xbbbcb5,0xab5643,0xd7b98e,0x6c8e9b,0x939e79,0xc88768];
  Object.values(robot.links).forEach((link,index) => {
    for (const child of link.children) {
      if (!child.isURDFVisual) continue;
      child.traverse(mesh => {
        if (!mesh.isMesh) return;
        const originals = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const materials = originals.map(original => {
          const material = new THREE.MeshStandardMaterial({color:original.color || 0xb0b6b2,roughness:0.59,metalness:0.22,map:original.map || null,side:THREE.DoubleSide,transparent:original.transparent,opacity:original.opacity});
          meshMaterials.push({material,originalColor:material.color.clone(),linkColor:new THREE.Color(palette[index % palette.length])});
          original.dispose();
          return material;
        });
        mesh.material = Array.isArray(mesh.material) ? materials : materials[0];
      });
    }
  });
  for (const joint of Object.values(robot.joints)) {
    const helper = new THREE.AxesHelper(modelScale * 0.16);
    helper.visible = $('show-frames').checked;
    helper.renderOrder = 3;
    helper.material.depthTest = false;
    joint.add(helper); frameHelpers.push(helper);
  }
  applyDisplayOptions();
}

function applyDisplayOptions() {
  if (grid) grid.visible = $('show-grid').checked;
  frameHelpers.forEach(helper => { helper.visible = $('show-frames').checked; });
  meshMaterials.forEach(({material,originalColor,linkColor}) => {
    material.wireframe = $('wireframe').checked;
    material.color.copy($('link-colors').checked ? linkColor : originalColor);
  });
  dirty = true;
}

async function displayDescription(archive,urdfPath) {
  setBusy(true,'building');
  // Yield once so the loading state is painted before parsing large STL files.
  await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve,0)));
  const {model,urls} = await parseRobot(archive,urdfPath);
  const previous = robot;
  if (previous) scene.remove(previous);
  currentUrls.forEach(url => URL.revokeObjectURL(url));
  currentUrls = urls;
  robot = model;
  scene.add(robot);
  disposeObject(previous);
  $('model-name').textContent = robot.robotName || robot.name || 'URDF';
  $('file-name').textContent = currentFileName;
  setupFloor();
  styleRobot();
  buildJointControls();
  updateFramePosition();
  $('camera-view').value = 'iso';
  fitView('iso');
  setBusy(false);
}

async function openArchive(data) {
  setBusy(true,'unpacking');
  const archive = await unpackZip(data);
  if (archive.descriptions.length !== 1 || archive.descriptions[0] !== 'zero_arm_ovo.urdf') throw new Error('The provided ZERO ARM description was not found.');
  await displayDescription(archive,'zero_arm_ovo.urdf');
}

async function loadDefault() {
  if (busy) return;
  try {
    setBusy(true,'fetching');
    const response = await fetch(new URL('./assets/zero-arm.zip',import.meta.url));
    if (!response.ok) throw new Error(`Model download failed (${response.status}).`);
    const total = Number(response.headers.get('content-length'));
    if (total > 50 * 1024 * 1024) throw new Error('Model download exceeds 50 MB.');
    let bytes;
    if (response.body) {
      const chunks = []; let length = 0;
      const reader = response.body.getReader();
      while (true) {
        const {done,value} = await reader.read(); if (done) break;
        length += value.length;
        if (length > 50 * 1024 * 1024) { await reader.cancel(); throw new Error('Model download exceeds 50 MB.'); }
        chunks.push(value);
        progress = total ? ` ${Math.min(100,Math.round(length / total * 100))}%` : ` ${(length / 1048576).toFixed(1)} MB`;
        $('load-message').textContent = t('fetching') + progress;
      }
      bytes = new Uint8Array(length); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.length; }
    } else bytes = new Uint8Array(await response.arrayBuffer());
    await openArchive(bytes);
  } catch (error) { showError(error); }
}

function download(blob,filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  setTimeout(() => anchor.remove(),1000);
  setTimeout(() => URL.revokeObjectURL(url),30000);
}

$('fit-view').addEventListener('click',() => fitView());
$('camera-view').addEventListener('change',() => fitView());
$('frame-select').addEventListener('change',updateFramePosition);
for (const id of ['show-grid','show-frames','wireframe','link-colors']) $(id).addEventListener('change',applyDisplayOptions);
$('reset-pose').addEventListener('click',() => {
  for (const {joint,lower,upper,factor} of jointControls) robot.setJointValue(joint.name,THREE.MathUtils.clamp(0,lower,upper) / factor);
  syncJointControls(); updateFramePosition(); notice(t('resetDone'));
});
$('export-pose').addEventListener('click',() => {
  const joints = Object.fromEntries(Object.entries(robot.joints).filter(([,joint]) => joint.jointValue.length).map(([name,joint]) => [name,{type:joint.jointType,unit:joint.jointType === 'prismatic' ? 'metres' : 'radians',value:joint.jointValue.length === 1 ? joint.jointValue[0] : [...joint.jointValue]}]));
  download(new Blob([JSON.stringify({robot:robot.robotName || robot.name,source:currentFileName,reference:'URDF base frame',joints},null,2)],{type:'application/json'}),'robot-pose.json');
  notice(t('poseDone'));
});
$('save-image').addEventListener('click',() => {
  try {
    renderer.render(scene,camera);
    renderer.domElement.toBlob(blob => { if (blob) { download(blob,'robot-view.png'); notice(t('imageDone')); } else notice(t('exportFailed')); },'image/png');
  } catch { notice(t('exportFailed')); }
});
$('fullscreen').addEventListener('click',async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await $('lab-workspace').requestFullscreen(); }
  catch { notice(t('fullscreenFailed')); }
});
$('retry-load').addEventListener('click',() => { if (robot) $('load-overlay').hidden = true; else loadDefault(); });

translate();
try { initializeScene(); loadDefault(); }
catch (error) { showError(new Error('WebGL is unavailable in this browser. ' + error.message)); $('retry-load').hidden = true; }
