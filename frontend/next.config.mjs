import createNextIntlPlugin from "next-intl/plugin";
const i18wrapper = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // experimental: {
  //   swcTraceProfiling: true,
  // },
  output: "standalone",
};

export default i18wrapper(nextConfig);
