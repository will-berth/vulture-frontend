/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/pos',
                permanent: true, // O false si no quieres que sea una redirección permanente
            },
        ];
    }
};

export default nextConfig;
