/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    transpilePackages: ['next-international', 'international-types']
};

export default nextConfig;
