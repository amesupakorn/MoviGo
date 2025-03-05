import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
      return [
        {
          source: "/api/socket",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS, PATCH, DELETE, POST, PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-Requested-With, Content-Type, Authorization" },
          ],
        },
      ];
    },
  };

export default nextConfig;
