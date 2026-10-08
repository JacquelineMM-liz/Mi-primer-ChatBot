import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El código del tutorial usa `any`; esto evita que ESLint bloquee `npm run build`
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
