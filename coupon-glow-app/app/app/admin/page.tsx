
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';
import CouponForm from '@/components/coupon-form';
import CouponList from '@/components/coupon-list';
import { useToast } from '@/hooks/use-toast';
import { Plus, Sparkles } from 'lucide-react';

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

export default function AdminPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      } else {
        throw new Error('Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los cupones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setShowForm(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCoupon(null);
    fetchCoupons();
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cupón?')) {
      return;
    }

    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Cupón eliminado",
          description: "El cupón se ha eliminado correctamente",
        });
        fetchCoupons();
      } else {
        throw new Error('Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el cupón",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-white/60 text-lg">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              <h1 className="text-3xl font-bold text-white">
                Panel de Administración
              </h1>
            </div>
            
            <motion.button
              onClick={handleCreateCoupon}
              className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo Cupón</span>
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="admin-container p-6">
              <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">
                Total Cupones
              </h3>
              <div className="text-3xl font-bold text-white">
                {coupons.length}
              </div>
            </div>
            
            <div className="admin-container p-6">
              <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">
                Activos
              </h3>
              <div className="text-3xl font-bold text-green-400">
                {coupons.filter(c => c.isActive).length}
              </div>
            </div>
            
            <div className="admin-container p-6">
              <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">
                Inactivos
              </h3>
              <div className="text-3xl font-bold text-red-400">
                {coupons.filter(c => !c.isActive).length}
              </div>
            </div>
          </div>

          {/* Coupon List */}
          <div className="admin-container p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              Gestión de Cupones
            </h2>
            
            <CouponList
              coupons={coupons}
              onEdit={handleEditCoupon}
              onDelete={handleDeleteCoupon}
            />
          </div>
        </motion.div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <CouponForm
          coupon={editingCoupon}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
