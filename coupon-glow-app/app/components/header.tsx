
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Settings } from 'lucide-react';

export default function Header() {
  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            CouponGlow
          </span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link 
            href="/" 
            className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
          >
            Cupones
          </Link>
          <Link 
            href="/admin" 
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 font-medium"
          >
            <Settings className="h-4 w-4" />
            <span>Admin</span>
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
