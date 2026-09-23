import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@math-sd/ui",
    "@math-sd/student-ui",
    "@math-sd/manipulatives",
    "@math-sd/math-engine",
    "@math-sd/question-engine",
    "@math-sd/curriculum",
    "@math-sd/storage",
    "@math-sd/validators",
  ],
};

export default nextConfig;
