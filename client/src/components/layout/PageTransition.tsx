import { motion } from "framer-motion";
import { ReactNode } from "react";

export function PageTransition({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.98, y: 15 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 0.98, y: -15 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`w-full h-full flex flex-col flex-1 transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
}
