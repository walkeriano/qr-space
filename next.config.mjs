/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["firebasestorage.googleapis.com"], // Permite el dominio de Firebase Storage
      },
};

export default nextConfig;
