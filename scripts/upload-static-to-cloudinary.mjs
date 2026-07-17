/**
 * Upload public/ static images to Cloudinary (yonel-static/) and write
 * src/lib/cloudinaryAssets.ts
 *
 * Usage: node scripts/upload-static-to-cloudinary.mjs
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const KEEP_LOCAL = new Set(['favicon.ico']);
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
/** Bozuk/placeholder (1 byte) dosyaları atla */
const MIN_BYTES = 100;

function loadEnvLocal() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local bulunamadı');
  }
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function walkImages(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkImages(full, base));
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    const rel = path.relative(base, full).split(path.sep).join('/');
    if (KEEP_LOCAL.has(rel)) continue;
    const size = fs.statSync(full).size;
    if (size < MIN_BYTES) {
      console.warn(`  skip (too small ${size}B): /${rel}`);
      continue;
    }
    // Kullanılmayan yedek/screenshot — yükleme, sonra local silinecek
    if (/Ekran Resmi|slider\/eski\//i.test(rel)) {
      console.warn(`  skip (unused): /${rel}`);
      continue;
    }
    out.push({ full, rel, publicPath: `/${rel}` });
  }
  return out;
}

function signParams(params, apiSecret) {
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');
}

/** /assets/logo1.png → yonel-static/assets/logo1_png (uzantı korunur, çakışma olmaz) */
function toPublicId(publicPath) {
  const withoutSlash = publicPath.replace(/^\//, '');
  const safe = withoutSlash.replace(/\./g, '_');
  return `yonel-static/${safe}`;
}

function deliveryUrl(cloudName, publicId) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
}

async function uploadFile({ full, publicPath }, cloudName, apiKey, apiSecret) {
  const publicId = toPublicId(publicPath);
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    public_id: publicId,
    overwrite: 'true',
    timestamp: String(timestamp),
  };
  const signature = signParams(params, apiSecret);

  const form = new FormData();
  const blob = new Blob([fs.readFileSync(full)]);
  form.append('file', blob, path.basename(full));
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('public_id', publicId);
  form.append('overwrite', 'true');
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`${publicPath}: ${data.error?.message || res.statusText}`);
  }

  return {
    publicPath,
    publicId: data.public_id,
    secureUrl: data.secure_url,
    delivery: deliveryUrl(cloudName, data.public_id),
  };
}

function writeAssetsModule(entries, cloudName) {
  const byPath = Object.fromEntries(entries.map((e) => [e.publicPath, e.delivery]));
  const logo1 = byPath['/assets/logo1.png'];
  const appIcon = byPath['/app-icon.png'];

  const lines = entries
    .slice()
    .sort((a, b) => a.publicPath.localeCompare(b.publicPath))
    .map((e) => {
      if (e.publicPath === '/assets/logo1.png') {
        return `  ${JSON.stringify(e.publicPath)}: LOGO1,`;
      }
      if (e.publicPath === '/app-icon.png') {
        return `  ${JSON.stringify(e.publicPath)}: APP_ICON,`;
      }
      return `  ${JSON.stringify(e.publicPath)}: ${JSON.stringify(e.delivery)},`;
    })
    .join('\n');

  const content = `/**
 * Statik görseller — Cloudinary (yonel-static).
 * Yerel /public path → optimize delivery URL.
 * Yenilemek için: node scripts/upload-static-to-cloudinary.mjs
 */
const CLOUD_NAME = ${JSON.stringify(cloudName)};

const LOGO1 = ${JSON.stringify(logo1)};
const APP_ICON = ${JSON.stringify(appIcon)};

export const CLOUDINARY_STATIC_ASSETS: Record<string, string> = {
  "/og-image.jpg": LOGO1,
  "/twitter-image.jpg": LOGO1,
  "/android-chrome-192x192.png": APP_ICON,
  "/android-chrome-512x512.png": APP_ICON,
${lines}
};

/** Yerel path veya tam site URL → Cloudinary URL; bilinmeyen path olduğu gibi döner */
export function staticAsset(pathOrUrl: string): string {
  if (!pathOrUrl) return pathOrUrl;

  if (pathOrUrl.includes('res.cloudinary.com')) {
    return pathOrUrl;
  }

  const sitePrefix = 'https://www.yonelotoyedekparca.com';
  let key = pathOrUrl;
  if (key.startsWith(sitePrefix)) {
    key = key.slice(sitePrefix.length) || '/';
  }
  if (!key.startsWith('/')) {
    key = \`/\${key}\`;
  }

  return CLOUDINARY_STATIC_ASSETS[key] ?? pathOrUrl;
}

export function cloudinaryCloudName(): string {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || CLOUD_NAME;
}
`;

  const outPath = path.join(root, 'src/lib/cloudinaryAssets.ts');
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Wrote ${outPath} (${entries.length} assets)`);
}

async function main() {
  loadEnvLocal();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary env eksik (CLOUD_NAME / API_KEY / API_SECRET)');
  }

  const publicDir = path.join(root, 'public');
  const files = walkImages(publicDir);
  console.log(`Uploading ${files.length} images to cloud ${cloudName}...`);

  const results = [];
  for (const file of files) {
    process.stdout.write(`  ${file.publicPath} ... `);
    try {
      const result = await uploadFile(file, cloudName, apiKey, apiSecret);
      results.push(result);
      console.log('ok');
    } catch (err) {
      console.log('FAIL');
      throw err;
    }
  }

  writeAssetsModule(results, cloudName);
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
