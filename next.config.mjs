/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
      {
        protocol: "https",
        hostname: "livraria.senado.leg.br",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
    ],
  },

  // 🔹 Adiciona proxy para evitar CORS em desenvolvimento
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE || "https://db-bookshelf.onrender.com"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
