import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/wanli",
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = nextConfig;