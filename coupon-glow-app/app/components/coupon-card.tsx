
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CouponCardProps {
  id: string;
  title: string;
  discountText: string;
  code: string;
  logoUrl?: string;
  description?: string;
  category: string;
  expiresAt?: string;
}

export default function CouponCard({
  title,
  discountText,
  code,
  logoUrl,
  description,
  category,
  expiresAt
}: CouponCardProps) {
  const [copied, setCopied] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setShowFeedback(true);
      
      toast({
        title: "¡Código copiado!",
        description: `El código ${code} se ha copiado al portapapeles`,
      });

      setTimeout(() => {
        setCopied(false);
        setShowFeedback(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el código",
        variant: "destructive",
      });
    }
  };

  const isExpiringSoon = expiresAt && new Date(expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div 
      className={`coupon-card coupon-${category} ${isExpiringSoon ? 'coupon-urgent' : ''}`}
      tabIndex={0}
      onClick={handleCopyCode}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCopyCode();
        }
      }}
    >
      {/* SVG Filters for Glow Effects */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id={`filter-${category}`}>
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={`rgb(var(--glow))`} />
            <feDropShadow dx="0" dy="0" stdDeviation="25" floodColor={`rgb(var(--glow))`} />
            {category === 'premium' && (
              <feDropShadow dx="0" dy="0" stdDeviation="50" floodColor={`rgb(var(--glow))`} />
            )}
          </filter>
        </defs>
      </svg>

      {/* Discount Badge */}
      <div className="discount-badge">
        {discountText}
      </div>

      {/* Floating Particles Effect */}
      <div className="coupon-glow-effect">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating-particles"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${8 + i}s`
            }}
          />
        ))}
      </div>

      {/* Copy Feedback */}
      {showFeedback && (
        <div className="copy-feedback">
          <Check className="inline w-4 h-4 mr-2" />
          ¡Copiado!
        </div>
      )}

      {/* Coupon Details */}
      <div className="coupon-details">
        <div className="flex items-start justify-between mb-4">
          {logoUrl && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
              <Image
                src={logoUrl}
                alt={`Logo de ${title}`}
                fill
                className="object-contain p-2"
              />
            </div>
          )}
          <div className="flex items-center text-white/60 text-sm">
            <Copy className="w-4 h-4 mr-1" />
            Clic para copiar
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white leading-tight">
            {title}
          </h3>
          
          {description && (
            <p className="text-white/80 text-sm leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <span className="text-white/60 text-xs uppercase tracking-wide">Código</span>
              <div className="text-white font-mono font-bold">
                {code}
              </div>
            </div>

            {expiresAt && (
              <div className="text-right">
                <span className="text-white/60 text-xs">Válido hasta</span>
                <div className="text-white text-sm font-medium">
                  {new Date(expiresAt).toLocaleDateString('es-ES')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
