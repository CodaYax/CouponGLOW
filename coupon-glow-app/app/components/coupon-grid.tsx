
'use client';

import { motion } from 'framer-motion';
import CouponCard from './coupon-card';

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

interface CouponGridProps {
  coupons: Coupon[];
}

export default function CouponGrid({ coupons }: CouponGridProps) {
  const activeCoupons = coupons.filter(coupon => coupon.isActive);

  if (activeCoupons.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-white/60 text-lg mb-4">
          No hay cupones disponibles en este momento
        </div>
        <div className="text-white/40 text-sm">
          ¡Vuelve pronto para descubrir nuevas ofertas!
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {activeCoupons.map((coupon, index) => (
        <motion.div
          key={coupon.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ scale: 1.02 }}
          className="h-64"
        >
          <CouponCard
            id={coupon.id}
            title={coupon.title}
            discountText={coupon.discountText}
            code={coupon.code}
            logoUrl={coupon.logoUrl || undefined}
            description={coupon.description || undefined}
            category={coupon.category}
            expiresAt={coupon.expiresAt || undefined}
          />
        </motion.div>
      ))}
    </div>
  );
}
