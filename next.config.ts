/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This is what Cloudflare is looking for
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;
