
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create sample coupons with different categories
  const coupons = [
    {
      title: 'Descuento en Electrónicos',
      discountText: '50% OFF',
      code: 'TECH50',
      description: 'Obtén un 50% de descuento en todos los productos electrónicos. Válido para smartphones, laptops, tablets y más.',
      category: 'discount',
      logoUrl: 'https://i.pinimg.com/originals/e9/cb/b2/e9cbb26a7f5495c98439335fafdfae6b.jpg',
      isActive: true,
      expiresAt: new Date('2025-12-31'),
    },
    {
      title: 'Envío Gratis Premium',
      discountText: 'ENVÍO GRATIS',
      code: 'FREESHIP',
      description: 'Disfruta de envío gratuito en todas tus compras sin mínimo de pedido.',
      category: 'shipping',
      logoUrl: 'https://www.citypng.com/public/uploads/preview/product-delivery-truck-green-icon-11636048727qb9aryq2my.png',
      isActive: true,
      expiresAt: new Date('2025-08-15'),
    },
    {
      title: 'Membresía Premium',
      discountText: '3 MESES GRATIS',
      code: 'PREMIUM3',
      description: 'Accede a contenido exclusivo y beneficios premium por 3 meses completamente gratis.',
      category: 'premium',
      logoUrl: 'https://static.vecteezy.com/system/resources/previews/026/494/868/large_2x/glossy-vip-black-glass-label-with-gold-crown-vip-membership-for-night-club-luxury-badge-template-exclusively-royal-membership-king-and-queen-crown-icon-vip-members-only-png.png',
      isActive: true,
      expiresAt: new Date('2025-07-01'),
    },
    {
      title: 'Flash Sale - ¡Solo Hoy!',
      discountText: '70% OFF',
      code: 'FLASH70',
      description: 'Oferta relámpago por tiempo muy limitado. ¡No te lo pierdas!',
      category: 'urgent',
      logoUrl: 'https://i.pinimg.com/originals/57/00/a1/5700a19fc5479181da4ad973375e73f6.jpg',
      isActive: true,
      expiresAt: new Date('2025-06-20'),
    },
    {
      title: 'Bienvenido Nuevo Usuario',
      discountText: '25% OFF',
      code: 'WELCOME25',
      description: 'Descuento especial para nuevos usuarios. ¡Bienvenido a nuestra comunidad!',
      category: 'welcome',
      logoUrl: 'https://i.pinimg.com/originals/89/d1/1d/89d11d95ac1baef7ade4289f9cbdbb90.jpg',
      isActive: true,
      expiresAt: new Date('2025-12-31'),
    },
    {
      title: 'Descuento en Ropa',
      discountText: '40% OFF',
      code: 'FASHION40',
      description: 'Renueva tu guardarropa con las últimas tendencias a precios increíbles.',
      category: 'discount',
      logoUrl: 'https://i.pinimg.com/originals/9a/3b/64/9a3b64769b5c99e24a320414ad766381.jpg',
      isActive: true,
      expiresAt: new Date('2025-09-30'),
    },
  ];

  console.log('Creating sample coupons...');
  
  for (const coupon of coupons) {
    try {
      await prisma.coupon.create({
        data: coupon,
      });
      console.log(`Created coupon: ${coupon.title}`);
    } catch (error) {
      console.log(`Coupon ${coupon.code} already exists, skipping...`);
    }
  }

  console.log('Sample coupons created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
