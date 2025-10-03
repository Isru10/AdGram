// import CustomCarousel from "@/components/CustomCarousel";
// import TelegramPlanes from "@/components/TelegramPlanes";
// import Link from "next/link";
// import { FiDollarSign } from "react-icons/fi";
// import { FaTelegramPlane, FaTiktok, FaLinkedin, FaInstagram } from "react-icons/fa";

// export default function HomePage() {
//   return (
//     // Base Theme: Deep Blue background, Light Text
//     <div className="bg-sky-950 text-slate-200">

//       {/* ===== Hero Section (Main Blue Background) ===== */}
//       <section className="min-h-[90vh] container mx-auto px-6 py-12 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
//         <div className="lg:w-1/2 text-center lg:text-left">
//           {/* Use bright white for the main title */}
//           <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
//             The Future of Trading
//             {/* Vibrant light blue accent */}
//             <span className="block text-sky-400">Telegram Channels</span>
//           </h1>
//           {/* Secondary text is a light slate/gray */}
//           <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
//             A secure, real-time marketplace connecting buyers and sellers of Telegram channels and groups. All for free.
//           </p>
//           <div className="mt-10">
//             <Link
//               href="/auth/signin"
//               // Button remains a high-contrast accent blue
//               className="inline-block px-8 py-4 bg-sky-600 text-white font-bold rounded-full shadow-2xl shadow-sky-500/50 hover:bg-sky-700 transform hover:-translate-y-1 transition-all duration-300 tracking-wider"
//             >
//               Get Started Now
//             </Link>
//           </div>
//         </div>
//         {/* Hero Animation */}
//         <div className="lg:w-1/2 w-full h-96 lg:h-auto mt-10 lg:mt-0">
//           <TelegramPlanes />
//         </div>
//       </section>

//       {/* ===== Services Section (Alternating Dark Blue Background) ===== */}
//       <section id="services" className="py-20 bg-sky-900">
//         <div className="container mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
//           <p className="text-slate-400 mb-12">A simple and secure process from start to finish.</p>
         
//          {/* carousel here */}
//          <CustomCarousel/>
//         </div>
//       </section>

//       {/* ===== "Why Us?" Section (A focused blue feature card) ===== */}
//       <section id="features" className="py-20 bg-sky-950">
//         <div className="container mx-auto px-6 text-center">
//           {/* Feature card: Use the accent blue as the background for maximum emphasis */}
//           <div className="bg-sky-600 text-white p-12 rounded-3xl shadow-2xl shadow-sky-500/30 max-w-4xl mx-auto">
//             {/* Icon remains white/light for maximum contrast on the accent color */}
//             <FiDollarSign className="mx-auto mb-6 h-16 w-16 opacity-90" />
//             <h2 className="text-4xl font-extrabold mb-4">Completely Free. No Hidden Costs.</h2>
//             <p className="text-lg text-sky-100 max-w-3xl mx-auto">
//               Our mission is to create an open and accessible marketplace. We charge zero commission on your sales and have no listing fees. What you negotiate is what you get. This is our commitment to the community.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ===== Contact Section (Alternating Dark Blue Background) ===== */}
//       <section id="contact" className="py-20 bg-sky-900">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-white">Contact the Developers</h2>
//             <p className="text-slate-400">Connect with us on social media or reach out directly.</p>
//           </div>
          
//           <div className="mt-12 flex justify-center gap-x-8 md:gap-x-12">
//             {/* Default link color is light gray, hover is the accent blue */}
            
//             {/* Telegram Icon Link */}
//             <a 
//               href="#" /* <-- TODO: Add your Telegram link here */
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="text-slate-400 hover:text-sky-400 hover:scale-110 transform transition-all duration-300"
//               aria-label="Telegram"
//             >
//               <FaTelegramPlane size={32} />
//             </a>

//             {/* TikTok Icon Link */}
//             <a 
//               href="#" /* <-- TODO: Add your TikTok link here */
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="text-slate-400 hover:text-sky-400 hover:scale-110 transform transition-all duration-300"
//               aria-label="TikTok"
//             >
//               <FaTiktok size={32} />
//             </a>

//             {/* LinkedIn Icon Link */}
//             <a 
//               href="#" /* <-- TODO: Add your LinkedIn link here */
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="text-slate-400 hover:text-sky-400 hover:scale-110 transform transition-all duration-300"
//               aria-label="LinkedIn"
//             >
//               <FaLinkedin size={32} />
//             </a>

//             {/* Instagram Icon Link */}
//             <a 
//               href="#" /* <-- TODO: Add your Instagram link here */
//               target="_blank" 
//               rel="noopener noreferrer" 
//               className="text-slate-400 hover:text-sky-400 hover:scale-110 transform transition-all duration-300"
//               aria-label="Instagram"
//             >
//               <FaInstagram size={32} />
//             </a>
//           </div>

//         </div>
//       </section>


//       {/* ===== Footer (Matches the alternating section background) ===== */}
//       <footer className="bg-sky-900 border-t border-sky-800">
//         <div className="container mx-auto px-6 py-12">
//           <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
//             <div>
//               <Link href="/" className="text-2xl font-bold text-white">
//                 TG Marketplace
//               </Link>
//               <p className="mt-2 text-slate-400">The premier platform for Telegram assets.</p>
//             </div>
//             <div className="flex mt-6 md:mt-0 space-x-6 text-slate-400">
//               <Link href="/ads" className="hover:text-sky-400 transition-colors">Ads</Link>
//               <Link href="#services" className="hover:text-sky-400 transition-colors">Services</Link>
//               <Link href="#contact" className="hover:text-sky-400 transition-colors">Contact</Link>
//             </div>
//           </div>
//           <div className="mt-8 border-t border-sky-800 pt-8 text-center text-slate-500">
//             <p>&copy; {new Date().getFullYear()} TG Marketplace. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }




"use client";

import HeroSection from "@/components/homepage/HeroSection";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { FiDollarSign, FiSearch, FiShield, FiMessageSquare } from "react-icons/fi";

import { useRef } from "react";
import { FaInstagram, FaLinkedin, FaTelegramPlane, FaTiktok } from "react-icons/fa";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  const processRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: processRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useSpring(useTransform(scrollYProgress, [0, 0.8], [0, 1]), { stiffness: 400, damping: 90 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="bg-gradient-to-r from-sky-950 via-indigo-950 to-slate-950 text-slate-200">
      
      <HeroSection />

      {/* ===== UPGRADED: "How It Works" Section with Animated Connector ===== */}
      <section id="services" className="py-24 relative" ref={processRef}>
        <div className="container mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <motion.h2 variants={cardVariants} className="text-4xl font-bold text-white mb-4">A Seamless Journey</motion.h2>
            <motion.p variants={cardVariants} className="text-lg text-slate-300 mb-20 max-w-2xl mx-auto">From discovery to deal, our platform is designed to be intuitive and secure every step of the way.</motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* SVG Line for Desktop */}
            <svg
              className="absolute top-1/2 left-0 w-full h-full hidden md:block"
              preserveAspectRatio="none"
              style={{ transform: 'translateY(-50%)' }}
            >
              <motion.path
                d="M 16% 50% C 30% 50%, 30% 20%, 50% 20% S 70% 20%, 70% 50%, 84% 50%"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeDasharray="1"
                strokeLinecap="round"
                style={{ pathLength }}
              />
              <defs>
                <linearGradient id="gradient" gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor="#38bdf8" /> {/* sky-400 */}
                  <stop offset="100%" stopColor="#a855f7" /> {/* fuchsia-500 */}
                </linearGradient>
              </defs>
            </svg>

            {/* Step 1 */}
            <motion.div variants={cardVariants} className="bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-left relative z-10 transition-transform duration-300 hover:-translate-y-2">
              <FiSearch className="text-sky-400 h-10 w-10 mb-4"/>
              <h3 className="text-xl font-bold text-white mb-2">1. Discover</h3>
              <p className="text-slate-400">Explore verified digital assets with powerful filters to find exactly what you are looking for.</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={cardVariants} className="bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-left relative z-10 transition-transform duration-300 hover:-translate-y-2">
              <FiMessageSquare className="text-sky-400 h-10 w-10 mb-4"/>
              <h3 className="text-xl font-bold text-white mb-2">2. Connect</h3>
              <p className="text-slate-400">Message sellers directly and securely on our platform to negotiate terms and build trust.</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={cardVariants} className="bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-left relative z-10 transition-transform duration-300 hover:-translate-y-2">
              <FiShield className="text-sky-400 h-10 w-10 mb-4"/>
              <h3 className="text-xl font-bold text-white mb-2">3. Transact</h3>
              <p className="text-slate-400">Utilize our guides and recommended secure third-party escrow services for a safe transfer.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== UPGRADED: "Features" Section with Interactive Spotlight ===== */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center">
            <motion.h2 variants={cardVariants} className="text-4xl font-bold text-white mb-4">Built for Creators, By Creators</motion.h2>
            <motion.p variants={cardVariants} className="text-lg text-slate-300 mb-16 max-w-2xl mx-auto">We are laser-focused on providing the best tools and a trusted environment for the creator economy.</motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div 
              variants={cardVariants} 
              onMouseMove={handleMouseMove}
              className="group relative lg:col-span-2 bg-slate-900 p-12 rounded-3xl overflow-hidden border border-white/10"
            >
              <div 
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
                style={{ background: 'radial-gradient(400px at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.15), transparent 80%)' }}
              />
              <div className="relative">
                <FiDollarSign className="h-12 w-12 mb-4 text-sky-400" />
                <h3 className="text-4xl font-extrabold text-white mb-4">Zero Commission. Ever.</h3>
                <p className="text-lg text-slate-300 max-w-2xl">
                  Our platform is completely free. We believe your hard work belongs to you. No hidden fees, no commission on sales—what you negotiate is what you earn.
                </p>
              </div>
            </motion.div>

            <div className="flex flex-col gap-8">
              <motion.div variants={cardVariants} className="bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-sky-400/50 hover:shadow-[0_0_20px_theme(colors.sky.500/20%)]">
                <FiShield className="text-sky-400 h-10 w-10 mb-4"/>
                <h3 className="text-xl font-bold text-white mb-2">Verified & Secure</h3>
                <p className="text-slate-400">A trusted environment with a secure messaging system to protect you from scams.</p>
              </motion.div>
              <motion.div variants={cardVariants} className="bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-sky-400/50 hover:shadow-[0_0_20px_theme(colors.sky.500/20%)]">
                <FiSearch className="text-sky-400 h-10 w-10 mb-4"/>
                <h3 className="text-xl font-bold text-white mb-2">Direct Communication</h3>
                <p className="text-slate-400">No middlemen. Connect directly to build trust and streamline your deals.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== UPGRADED: "Contact" Section with Shimmer CTA ===== */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            className="relative bg-slate-900 p-12 rounded-3xl text-center overflow-hidden border border-white/10"
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true, amount: 0.5 }}
          >
            {/* === THIS IS THE FIX: No external config needed === */}
            <div className="absolute top-1/2 left-1/2 h-[300%] w-[300%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,#0ea5e9_0%,#4f46e5_50%,#0ea5e9_100%)] opacity-20 animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-0 bg-slate-900/50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>

            <div className="relative">
              <h2 className="text-4xl font-extrabold text-white mb-4">Join The Future of Digital Trading</h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">Your next big opportunity is waiting. Sign up or start browsing today.</p>
              
              {/* <Link
                href="/ads"
                className="inline-block px-8 py-4 mb-8 bg-sky-600 text-white font-bold rounded-full shadow-lg shadow-sky-500/30 hover:bg-sky-700 transform hover:-translate-y-1 transition-all duration-300 tracking-wider"
              >
                Contact the Developer now : 0998238423
              </Link> */}



              <a
  href="tel:0998238423"
  className="relative inline-flex items-center justify-center px-10 py-4 mb-8 font-bold text-white rounded-full group overflow-hidden"
>
  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 animate-pulse opacity-75 group-hover:opacity-100 transition duration-500 rounded-full"></span>
  <span className="relative z-10 flex items-center gap-2">
    📞 Contact The Developer Right Now: 0935562710
  </span>
</a>


              <div className="flex justify-center gap-x-8">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors duration-300" aria-label="Telegram"><FaTelegramPlane size={28} /></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors duration-300" aria-label="TikTok"><FaTiktok size={28} /></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors duration-300" aria-label="LinkedIn"><FaLinkedin size={28} /></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors duration-300" aria-label="Instagram"><FaInstagram size={28} /></a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-sky-800/50">
        <div className="container mx-auto px-6 py-12">
          {/* Footer content remains the same */}
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div>
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-fuchsia-500 bg-clip-text text-transparent">AdGram</Link>
              <p className="mt-2 text-slate-400">The premier platform for digital assets.</p>
            </div>
            <div className="flex mt-6 md:mt-0 space-x-6 text-slate-400">
              <Link href="/ads" className="hover:text-sky-400 transition-colors">Ads</Link>
              <Link href="#services" className="hover:text-sky-400 transition-colors">Services</Link>
              <Link href="#contact" className="hover:text-sky-400 transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-sky-800/50 pt-8 text-center text-slate-500">
            <p>&copy; {new Date().getFullYear()} AdGram. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}