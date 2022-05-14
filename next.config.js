/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["placekitten.com"],
  },
  redirects: async () => [
    {
      source: "/discord",
      destination: "https://discord.gg/5V6YMuHrX3",
      permanent: false,
    },
  ],
};

module.exports = nextConfig;
