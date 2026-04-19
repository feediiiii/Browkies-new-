import { motion } from "framer-motion";

interface RotatingCookieProps {
  size?: number;
  className?: string;
}

export default function RotatingCookie({ size = 48, className = "" }: RotatingCookieProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 15, 0, -15, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Cookie base */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-2 border-amber-300"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        />

        {/* Chocolate chips */}
        <motion.div
          className="absolute top-2 left-3 w-2 h-2 bg-amber-800 rounded-full"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
        />
        <motion.div
          className="absolute top-4 right-2 w-1.5 h-1.5 bg-amber-900 rounded-full"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
        />
        <motion.div
          className="absolute bottom-3 left-4 w-2 h-2 bg-amber-800 rounded-full"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-2 right-3 w-1 h-1 bg-amber-900 rounded-full"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.7 }}
        />

        {/* Highlight for 3D effect */}
        <motion.div
          className="absolute top-1 left-1 w-3 h-3 bg-gradient-to-br from-white/30 to-transparent rounded-full"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Crumb particles floating around */}
        <motion.div
          className="absolute -top-1 -right-1 w-1 h-1 bg-amber-500 rounded-full"
          animate={{
            x: [0, 3, -2, 0],
            y: [0, -2, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-amber-400 rounded-full"
          animate={{
            x: [0, -2, 1, 0],
            y: [0, 1, -1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 1
          }}
        />
      </motion.div>
    </div>
  );
}