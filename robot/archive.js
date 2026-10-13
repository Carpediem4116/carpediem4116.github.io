import { unzip } from 'fflate';

const MAX_TOTAL = 160 * 1024 * 1024;
const allowed = /\.(urdf|stl)$/i;

export function normalizePath(path) {
  const parts = [];
  for (const part of path.replaceAll('\\', '/').split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') {
      if (!parts.length) throw new Error('A model path points outside the ZIP.');
      parts.pop();
    } else parts.push(part);
  }
  return parts.join('/');
}

export function inspectZip(data) {
  if (data.length > 50 * 1024 * 1024) throw new Error('The ZIP must be smaller than 50 MB.');
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let end = -1;
  for (let offset = data.length - 22; offset >= Math.max(0, data.length - 65557); offset--) {
    if (view.getUint32(offset, true) === 0x06054b50 && offset + 22 + view.getUint16(offset + 20, true) === data.length) { end = offset; break; }
  }
  if (end < 0) throw new Error('This is not a readable ZIP archive.');
  if (view.getUint16(end + 4, true) || view.getUint16(end + 6, true)) throw new Error('Multi-volume ZIP files are not supported.');
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true);
  if (!count || count > 2000 || offset === 0xffffffff) throw new Error('Use a standard ZIP with at most 2,000 files.');
  let total = 0;
  const names = new Set();
  for (let index = 0; index < count; index++) {
    if (offset + 46 > end || view.getUint32(offset, true) !== 0x02014b50) throw new Error('The ZIP directory is invalid.');
    if (view.getUint16(offset + 8, true) & 1) throw new Error('Password-protected ZIP files are not supported.');
    const size = view.getUint32(offset + 24, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    if (offset + 46 + nameLength + extraLength + commentLength > end) throw new Error('The ZIP directory is incomplete.');
    const name = normalizePath(new TextDecoder().decode(data.subarray(offset + 46, offset + 46 + nameLength)));
    if (allowed.test(name) && !name.startsWith('__MACOSX/')) {
      if (names.has(name)) throw new Error('The ZIP contains duplicate file paths.');
      names.add(name);
      total += size;
      if (size > 80 * 1024 * 1024 || total > MAX_TOTAL) throw new Error('The unpacked model is too large (160 MB maximum).');
    }
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return { count, total };
}

export async function unpackZip(data) {
  inspectZip(data);
  const extracted = await new Promise((resolve, reject) => unzip(data, {
    filter: file => allowed.test(file.name) && !file.name.startsWith('__MACOSX/')
  }, (error, files) => error ? reject(error) : resolve(files)));
  const files = new Map();
  let total = 0;
  for (const [rawName, bytes] of Object.entries(extracted)) {
    total += bytes.length;
    if (total > MAX_TOTAL) throw new Error('The unpacked model is too large.');
    files.set(normalizePath(rawName), bytes);
  }
  const descriptions = [...files.keys()].filter(name => /\.urdf$/i.test(name)).sort((a, b) => a.length - b.length || a.localeCompare(b));
  if (!descriptions.length) throw new Error('No .urdf file found. Include the URDF and its meshes in the ZIP.');
  return { files, descriptions };
}

export function findArchiveFile(files, input) {
  if (/(^|\/)(https?|file|data|blob):/i.test(input)) throw new Error('All model resources must be inside the ZIP.');
  let path = input.replace(/^zip:\/\/+/, '');
  try { path = decodeURIComponent(path); } catch { /* Literal filename. */ }
  path = normalizePath(path);
  if (files.has(path)) return path;
  let matches = [...files.keys()].filter(key => key.endsWith('/' + path) || path.endsWith('/' + key));
  if (!matches.length) {
    const filename = path.split('/').pop();
    matches = [...files.keys()].filter(key => key.split('/').pop() === filename);
  }
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) throw new Error('Ambiguous mesh path: ' + path);
  throw new Error('Missing model resource: ' + path);
}
