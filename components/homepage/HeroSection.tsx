// "use client";

// import { motion, type Variants, type TargetAndTransition } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";

// const textContainerVariants: Variants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.15, delayChildren: 0.2 },
//   },
// };

// const textItemVariants: Variants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
// };

// const imageContainerVariants: Variants = {
//     hidden: { opacity: 0, scale: 0.9 },
//     visible: {
//         opacity: 1,
//         scale: 1,
//         transition: { staggerChildren: 0.2, delayChildren: 0.4, duration: 0.6 }
//     }
// }

// const imageItemVariants: Variants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } }
// }

// const hoverEffect: TargetAndTransition = {
//     scale: 1.05,
//     zIndex: 30,
//     boxShadow: '0px 25px 40px rgba(0, 0, 0, 0.3)',
//     transition: { duration: 0.3, ease: 'easeOut' }
// };

// export default function HeroSection() {
//   return (
//     <section className="min-h-[90vh] container mx-auto px-6 py-12 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
      
//       {/* ===== Left Side - Animated Text ===== */}
//       <motion.div
//         className="lg:w-1/2 text-center lg:text-left z-10"
//         variants={textContainerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <motion.h1 
//             className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
//             variants={textItemVariants}
//         >
//           Your Premier Marketplace
//           <span className="block text-sky-400">for Digital Assets</span>
//         </motion.h1>
//         <motion.p 
//             className="mt-6 text-lg text-slate-300 max-w-xl mx-auto lg:mx-0"
//             variants={textItemVariants}
//         >
//           Securely connect, buy, and sell accounts across Telegram, YouTube, and TikTok—all completely free.
//         </motion.p>
//         <motion.div 
//             className="mt-10"
//             variants={textItemVariants}
//         >
//           <Link
//             href="/auth/signin"
//             className="inline-block px-8 py-4 bg-sky-600 text-white font-bold rounded-full shadow-2xl shadow-sky-500/50 hover:bg-sky-700 transform hover:-translate-y-1 transition-all duration-300 tracking-wider"
//           >
//             Get Started Now
//           </Link>
//         </motion.div>
//       </motion.div>

//       {/* ===== Right Side - Layered, Animated Images ===== */}
//       <motion.div
//         className="lg:w-1/2 relative w-full mt-12 lg:mt-0 h-[450px] sm:h-[500px]"
//         variants={imageContainerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* ===> REPLACE IMAGE PATH <=== */}
//         <motion.div
//           className="absolute top-0 left-0 w-[70%] h-[75%] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 cursor-pointer z-0"
//           variants={imageItemVariants}
//           whileHover={hoverEffect}
//           animate={{
//               y: ["0%", "-2%", "0%"],
//               transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
//           }}
//         >
//           <Image
//             src="//telegram.avif" 
//             alt="Digital marketplace on a phone"
//             fill
//             sizes="(max-width: 768px) 50vw, 33vw"
//             className="object-cover"
//             priority
//           />
//         </motion.div>

//         {/* ===> REPLACE IMAGE PATH <=== */}
//         <motion.div
//           className="absolute bottom-0 right-0 w-[65%] h-[70%] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/15 cursor-pointer z-10"
//           variants={imageItemVariants}
//           whileHover={hoverEffect}
//            animate={{
//               scale: [1, 1.02, 1],
//               transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
//            }}
//         >
//           <Image
//              src="/logo.png" 
//              alt="Abstract network connections"
//              fill
//              sizes="(max-width: 768px) 50vw, 33vw"
//              className="object-cover"
//           />
//         </motion.div>
        
//         {/* ===> REPLACE IMAGE PATH <=== */}
//         <motion.div
//            className="absolute top-[10%] right-[5%] w-[30%] h-[35%] rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 cursor-pointer z-20 backdrop-blur-md bg-white/5"
//            variants={imageItemVariants}
//            whileHover={hoverEffect}
//         >
//           <Image
//             src="/logo.png" 
//             alt="Telegram or TikTok logo"
//             fill
//             sizes="(max-width: 768px) 30vw, 20vw"
//             className="object-cover p-2"
//           />
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// }


"use client";

import { motion, type Variants, type TargetAndTransition } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// --- NO CHANGES TO ANIMATIONS ---
const textContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};
const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const imageContainerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.4, duration: 0.6 }
    }
}
const imageItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } }
}
const hoverEffect: TargetAndTransition = {
    scale: 1.05,
    zIndex: 30,
    boxShadow: '0px 25px 40px rgba(0, 0, 0, 0.3)',
    transition: { duration: 0.3, ease: 'easeOut' }
};
// --- END OF ANIMATIONS ---


export default function HeroSection() {
  return (
    <section className="min-h-[90vh] container mx-auto px-6 py-12 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
      
      {/* ===== Text content remains the same ===== */}
      <motion.div
        className="lg:w-1/2 text-center lg:text-left z-10"
        variants={textContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
            variants={textItemVariants}
        >
          Your Premier Marketplace
          <span className="block text-sky-400">for Digital Assets</span>
        </motion.h1>
        <motion.p 
            className="mt-6 text-lg text-slate-300 max-w-xl mx-auto lg:mx-0"
            variants={textItemVariants}
        >
          Securely connect, buy, and sell accounts across Telegram, YouTube, and TikTok—all completely free.
        </motion.p>
        <motion.div 
            className="mt-10"
            variants={textItemVariants}
        >
          <Link
            href="/auth/signin"
            className="inline-block px-8 py-4 bg-sky-600 text-white font-bold rounded-full shadow-2xl shadow-sky-500/50 hover:bg-sky-700 transform hover:-translate-y-1 transition-all duration-300 tracking-wider"
          >
            Get Started Now
          </Link>
        </motion.div>
      </motion.div>

      {/* ===== MODIFIED: Thematic Images for the Collage ===== */}
      <motion.div
        className="lg:w-1/2 relative w-full mt-12 lg:mt-0 h-[450px] sm:h-[500px]"
        variants={imageContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Image 1: TikTok / Shorts - A vibrant phone feed */}
        <motion.div
          className="absolute top-0 left-0 w-[70%] h-[75%] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 cursor-pointer z-0"
          variants={imageItemVariants} whileHover={hoverEffect}
          animate={{ y: ["0%", "-2%", "0%"], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }}}
        >
          <Image
            // ===> REPLACE WITH YOUR OWN IMAGE <===
            src="/tiktok.avif" 
            alt="Vibrant social media feed on a smartphone, representing TikTok and YouTube Shorts"
            fill sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Image 2: Telegram - A clean, abstract chat or network UI */}
        <motion.div
          className="absolute bottom-0 right-0 w-[65%] h-[70%] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/15 cursor-pointer z-10"
          variants={imageItemVariants} whileHover={hoverEffect}
          animate={{ scale: [1, 1.02, 1], transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }}}
        >
          <Image
            // ===> REPLACE WITH YOUR OWN IMAGE <===
             src="/telegram.avif" 
             alt="Abstract chart and data interface representing a digital community network for Telegram"
             fill sizes="(max-width: 768px) 50vw, 33vw"
             className="object-cover"
          />
        </motion.div>
        
        {/* Image 3: YouTube - A creator's setup or a simple logo */}
        <motion.div
           className="absolute top-[10%] right-[5%] w-[30%] h-[35%] rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 cursor-pointer z-20 backdrop-blur-md bg-white/5"
           variants={imageItemVariants} whileHover={hoverEffect}
        >
          <Image
            // ===> REPLACE WITH YOUR OWN IMAGE <===
            src="/youtube.avif" 
            alt="Close-up of a professional camera lens, representing a YouTube creator"
            fill sizes="(max-width: 768px) 30vw, 20vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}