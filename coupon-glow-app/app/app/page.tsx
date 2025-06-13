
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';
import CouponGrid from '@/components/coupon-grid';

interface Coupon {
  id: string;
  title: string;
  discountText: string;
  code: string;
  logoUrl?: string;
  description?: string;
  category: string;
  expiresAt?: string;
  isActive: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const response = await fetch('/api/coupons');
        if (response.ok) {
          const data = await response.json();
          setCoupons(data.filter((coupon: Coupon) => coupon.isActive));
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCoupons();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Cupones Brillantes
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Descubre ofertas increíbles con efectos visuales únicos de bioluminiscencia
          </motion.p>
          <motion.div 
            className="text-white/60 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Haz clic en cualquier cupón para copiar su código al portapapeles
          </motion.div>
        </div>

        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-particle ${8 + Math.random() * 4}s infinite linear`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* Coupons Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ofertas Disponibles
          </motion.h2>
          
          {loading ? <LoadingSkeleton /> : <CouponGrid coupons={coupons} />}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">
            © 2025 CouponGlow. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
