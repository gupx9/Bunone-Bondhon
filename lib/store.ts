import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type ProductCard = {
  id: bigint;
  productName: string;
  price: Prisma.Decimal;
  description: string | null;
  imageUrl: string | null;
  type: string;
  inStock: number;
};

export const fallbackProducts: ProductCard[] = [
  {
    id: 1n,
    productName: 'Gold Necklace',
    price: new Prisma.Decimal(1500),
    description: 'Elegant gold necklace for special occasions.',
    imageUrl: '/logo.jpg',
    type: 'jewellery',
    inStock: 10
  },
  {
    id: 2n,
    productName: 'Traditional Saree',
    price: new Prisma.Decimal(2800),
    description: 'Handwoven cotton saree with traditional patterns.',
    imageUrl: '/header.jpg',
    type: 'clothing',
    inStock: 15
  },
  {
    id: 3n,
    productName: 'Handmade Bag',
    price: new Prisma.Decimal(800),
    description: 'Stylish handmade bag with durable materials.',
    imageUrl: '/background.jpg',
    type: 'other',
    inStock: 15
  }
];

export async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: [{ type: 'asc' }, { productName: 'asc' }]
    });
  } catch {
    return fallbackProducts;
  }
}

export async function getCartItems(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getAdminSnapshot() {
  const [products, orders, users] = await Promise.all([
    prisma.product.findMany({ orderBy: { id: 'asc' } }),
    prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.profile.findMany({ orderBy: { createdAt: 'asc' } })
  ]);

  return { products, orders, users };
}
