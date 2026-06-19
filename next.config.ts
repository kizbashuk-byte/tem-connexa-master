import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok tunnel origin for HMR (hot module reload) during local Twilio testing
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.io",
  ],
  // Prevent twilio from being bundled by Next.js — run it server-side only
  serverExternalPackages: ["twilio"],
};

export default nextConfig;
