import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = process.env.BASE_PATH ?? '';

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: 'export' as const,
        trailingSlash: true,
        basePath,
        assetPrefix: basePath || undefined,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
