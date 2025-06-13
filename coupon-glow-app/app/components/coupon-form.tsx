
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
}

interface CouponFormProps {
  coupon?: Coupon | null;
  onClose: () => void;
}

const categories = [
  { value: 'discount', label: 'Descuento General', color: 'var(--glow-discount)' },
  { value: 'shipping', label: 'Envío Gratis', color: 'var(--glow-shipping)' },
  { value: 'premium', label: 'Premium', color: 'var(--glow-premium)' },
  { value: 'urgent', label: 'Tiempo Limitado', color: 'var(--glow-urgent)' },
  { value: 'welcome', label: 'Bienvenida', color: 'var(--glow-welcome)' },
];

export default function CouponForm({ coupon, onClose }: CouponFormProps) {
  const [formData, setFormData] = useState({
    title: coupon?.title || '',
    discountText: coupon?.discountText || '',
    code: coupon?.code || '',
    description: coupon?.description || '',
    category: coupon?.category || 'discount',
    isActive: coupon?.isActive ?? true,
    expiresAt: coupon?.expiresAt ? coupon.expiresAt.split('T')[0] : '',
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(coupon?.logoUrl || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "El archivo es demasiado grande. Máximo 5MB.",
          variant: "destructive",
        });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;

    const formData = new FormData();
    formData.append('file', logoFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el logo",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = coupon?.logoUrl || '';
      
      if (logoFile) {
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }

      const submitData = {
        ...formData,
        logoUrl: logoUrl || null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
      };

      const url = coupon ? `/api/coupons/${coupon.id}` : '/api/coupons';
      const method = coupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast({
          title: coupon ? "Cupón actualizado" : "Cupón creado",
          description: coupon ? "El cupón se ha actualizado correctamente" : "El cupón se ha creado correctamente",
        });
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save coupon');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el cupón",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="admin-container w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {coupon ? 'Editar Cupón' : 'Nuevo Cupón'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Logo del Cupón
              </label>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-20 h-20 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoPreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <Upload className="h-8 w-8 text-white/40" />
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {logoPreview ? 'Cambiar logo' : 'Subir logo'}
                  </button>
                  <p className="text-xs text-white/60 mt-1">
                    PNG, JPG hasta 5MB
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Título del Cupón *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none form-glow"
                placeholder="Ej: Descuento en Electrónicos"
              />
            </div>

            {/* Discount Text */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Texto de Descuento *
              </label>
              <input
                type="text"
                name="discountText"
                value={formData.discountText}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none form-glow"
                placeholder="Ej: 50% OFF"
              />
            </div>

            {/* Code */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Código del Cupón *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none form-glow font-mono"
                placeholder="Ej: SAVE50"
                style={{ textTransform: 'uppercase' }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none form-glow resize-none"
                placeholder="Descripción opcional del cupón..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none form-glow"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value} className="bg-gray-800">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Expires At */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Fecha de Expiración
              </label>
              <input
                type="date"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none form-glow"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-2"
              />
              <label className="text-white/80 text-sm font-medium">
                Cupón activo
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-white/80 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 disabled:opacity-50"
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                <span>{loading ? 'Guardando...' : 'Guardar Cupón'}</span>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
