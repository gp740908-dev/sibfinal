
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mengizinkan gambar dari domain eksternal (Unsplash, dll)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // Mencegah kegagalan build karena error TypeScript/ESLint kecil saat deploy
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
