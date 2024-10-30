import createNextIntlPlugin from "next-intl/plugin";
const i18wrapper = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default i18wrapper(nextConfig);
