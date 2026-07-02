/** @type {import('next').NextConfig} */
const nextConfig = {
  /* इसे experimental के बाहर, सीधे रूट लेवल पर रखना है */
  allowedDevOrigins: ['192.168.31.211:3000', '192.168.31.211', 'localhost:3000']
};

export default nextConfig;