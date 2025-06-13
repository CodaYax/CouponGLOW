
'use client';

import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

interface Coupon {
  id: string;
  title: string;
  discountText: string;
  code: string;
  logoUrl?: string;
  description?: string;
  category: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface CouponListProps {
  coupons: Coupon[];
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  discount: 'Descuento',
  shipping: 'Envío Gratis',
  premium: 'Premium',
  urgent: 'Tiempo Limitado',
  welcome: 'Bienvenida',
};

const categoryColors: Record<string, string> = {
  discount: 'text-yellow-400',
  shipping: 'text-green-400',
  premium: 'text-purple-400',
  urgent: 'text-red-400',
  welcome: 'text-blue-400',
};

export default function CouponList({ coupons, onEdit, onDelete }: CouponListProps) {
  if (coupons.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 text-lg mb-2">
          No hay cupones creados
        </div>
        <div className="text-white/40 text-sm">
          Crea tu primer cupón para comenzar
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {coupons.map((coupon, index) => (
        <motion.div
          key={coupon.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Logo */}
              {coupon.logoUrl && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                  <Image
                    src={coupon.logoUrl}
                    alt={`Logo de ${coupon.title}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {coupon.title}
                  </h3>
                  <span className={`text-sm font-medium ${categoryColors[coupon.category]}`}>
                    {categoryLabels[coupon.category]}
                  </span>
                  <div className="flex items-center">
                    {coupon.isActive ? (
                      <Eye className="h-4 w-4 text-green-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-white/60">
                  <div>
                    <span className="font-medium text-white">{coupon.discountText}</span>
                  </div>
                  <div>
                    Código: <span className="font-mono text-white">{coupon.code}</span>
                  </div>
                  {coupon.expiresAt && (
                    <div>
                      Expira: {new Date(coupon.expiresAt).toLocaleDateString('es-ES')}
                    </div>
                  )}
                </div>

                {coupon.description && (
                  <p className="text-white/60 text-sm mt-2 line-clamp-2">
                    {coupon.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <motion.button
                onClick={() => onEdit(coupon)}
                className="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit className="h-4 w-4" />
              </motion.button>
              
              <motion.button
                onClick={() => onDelete(coupon.id)}
                className="p-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
