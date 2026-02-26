/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals.push({
      '@react-native-async-storage/async-storage': 'commonjs @react-native-async-storage/async-storage',
    });
    return config;
  },
}

export default nextConfig
