import {fileURLToPath} from 'node:url';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export default { output: 'export', trailingSlash: true, basePath, devIndicators: false, poweredByHeader: false, turbopack: {root:fileURLToPath(new URL('.',import.meta.url))} };
