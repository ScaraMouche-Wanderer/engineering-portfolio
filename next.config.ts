import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "@prisma/client", "@libsql/client"],
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/external_projects/**',
        '**/scripts/**',
        '**/scratch/**',
        '**/.system_generated/**',
      ],
    };
    return config;
  },
};

export default nextConfig;
