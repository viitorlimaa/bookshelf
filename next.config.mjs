/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // 🔹 Adiciona proxy para evitar CORS em desenvolvimento
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://db-bookshelf.onrender.com/:path*", // proxy para o backend remoto
      },
    ];
  },
};

export default nextConfig;
