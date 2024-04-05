/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["placekitten.com"],
  },
  redirects: async () => [
    {
      source: "/discord",
      destination: "https://discord.gg/6PxVsDv",
      permanent: false,
    },
  ],
};

module.exports = nextConfig;
