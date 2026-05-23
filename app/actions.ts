'use server';

import { cookies } from 'next/headers';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { getSession, sessionCookieName, type LocalSession } from '@/lib/session';

async function requireUser() {
  const session = getSession();

  if (!session) {
    redirect('/login');
  }

  return session;
}

async function requireAdmin() {
  const user = await requireUser();
  const profile = await prisma.profile.findUnique({ where: { id: user.id } });

  if (!profile || profile.role !== 'admin') {
    redirect('/shop');
  }

  return { user, profile };
}

async function saveProductImage(file: File) {
  const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const uniqueName = `${Date.now()}-${fileName}`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, uniqueName), Buffer.from(await file.arrayBuffer()));

  return `/uploads/${uniqueName}`;
}

export async function createLocalSession(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const phoneNo = String(formData.get('phoneNo') ?? '').trim();
  const userAddress = String(formData.get('userAddress') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const existing = getSession();

  let sessionId = existing?.id ?? crypto.randomUUID();
  let sessionName = name || existing?.name || 'Guest';

  if (email) {
    // login or register by email: find existing profile by email, otherwise create
    const profile = await prisma.profile.findUnique({ where: { email } });

    if (profile) {
      sessionId = profile.id;
      sessionName = profile.fullName || sessionName;
    } else {
      // create a new profile record for this email
      const id = sessionId;
      await prisma.profile.create({
        data: {
          id,
          fullName: sessionName,
          email,
          phoneNo: phoneNo || null,
          userAddress: userAddress || null,
          role: 'customer',
          languagePreference: 'en',
          themePreference: 'light'
        }
      });
    }
  } else {
    // fallback: local session without email
    await prisma.profile.upsert({
      where: { id: sessionId },
      create: {
        id: sessionId,
        fullName: sessionName,
        email: `${sessionId}@local.test`,
        phoneNo: phoneNo || null,
        userAddress: userAddress || null,
        role: 'customer',
        languagePreference: 'en',
        themePreference: 'light'
      },
      update: {
        fullName: sessionName,
        email: `${sessionId}@local.test`,
        phoneNo: phoneNo || null,
        userAddress: userAddress || null,
        role: 'customer'
      }
    });
  }

  const session: LocalSession = {
    id: sessionId,
    name: sessionName,
    role: 'customer'
  };

  cookies().set(sessionCookieName(), JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });

  redirect('/shop');
}

export async function addToCart(formData: FormData) {
  const user = await requireUser();
  const productId = BigInt(String(formData.get('productId')));
  const quantity = Math.max(1, Number(formData.get('quantity') ?? 1));

  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });

    if (!product || product.inStock < quantity) {
      return;
    }

    const existing = await tx.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    });

    if (existing) {
      await tx.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      });
    } else {
      await tx.cartItem.create({
        data: {
          userId: user.id,
          productId,
          quantity
        }
      });
    }

    await tx.product.update({
      where: { id: productId },
      data: { inStock: { decrement: quantity } }
    });
  });

  revalidatePath('/shop');
  revalidatePath('/cart');
}

export async function updateCartQuantity(formData: FormData) {
  const user = await requireUser();
  const productId = BigInt(String(formData.get('productId')));
  const action = String(formData.get('action'));

  await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      },
      include: { product: true }
    });

    if (!cartItem) {
      return;
    }

    if (action === 'add') {
      if (cartItem.product.inStock < 1) {
        return;
      }

      await tx.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: { increment: 1 } }
      });

      await tx.product.update({
        where: { id: productId },
        data: { inStock: { decrement: 1 } }
      });
      return;
    }

    if (cartItem.quantity > 1) {
      await tx.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: { decrement: 1 } }
      });
    } else {
      await tx.cartItem.delete({ where: { id: cartItem.id } });
    }

    await tx.product.update({
      where: { id: productId },
      data: { inStock: { increment: 1 } }
    });
  });

  revalidatePath('/cart');
  revalidatePath('/shop');
}

export async function checkout(formData: FormData) {
  const user = await requireUser();
  const paymentMethod = String(formData.get('paymentMethod'));

  await prisma.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true }
    });

    if (!cartItems.length) {
      return;
    }

    const totalPrice = cartItems.reduce(
      (sum, item) => sum.add(new Prisma.Decimal(item.product.price).mul(item.quantity)),
      new Prisma.Decimal(0)
    );

    const order = await tx.order.create({
      data: {
        userId: user.id,
        totalPrice,
        paymentMethod,
        confirmPayment: true,
        orderStatus: 'paid'
      }
    });

    await tx.orderItem.createMany({
      data: cartItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        productPrice: item.product.price
      }))
    });

    await tx.cartItem.deleteMany({ where: { userId: user.id } });
  });

  revalidatePath('/cart');
  revalidatePath('/order-history');
  redirect('/order-history');
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();

  const productId = BigInt(String(formData.get('productId')));
  const productName = String(formData.get('productName') ?? '');
  const inStock = Number(formData.get('inStock') ?? 0);
  const price = new Prisma.Decimal(String(formData.get('price') ?? '0'));
  const description = String(formData.get('description') ?? '');
  const imageUrl = String(formData.get('imageUrl') ?? '');
  const uploadedImage = formData.get('imageFile');
  const type = String(formData.get('type') ?? 'other');

  let nextImageUrl = imageUrl;

  if (uploadedImage instanceof File && uploadedImage.size > 0) {
    nextImageUrl = await saveProductImage(uploadedImage);
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      productName,
      inStock,
      price,
      description,
      imageUrl: nextImageUrl || null,
      type
    }
  });

  revalidatePath('/admin');
  revalidatePath('/shop');
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const productName = String(formData.get('productName') ?? '').trim();
  const inStock = Number(formData.get('inStock') ?? 0);
  const price = new Prisma.Decimal(String(formData.get('price') ?? '0'));
  const description = String(formData.get('description') ?? '').trim();
  const imageUrl = String(formData.get('imageUrl') ?? '').trim();
  const uploadedImage = formData.get('imageFile');
  const type = String(formData.get('type') ?? 'other').trim() || 'other';

  if (!productName) {
    redirect('/admin');
  }

  let nextImageUrl = imageUrl;

  if (uploadedImage instanceof File && uploadedImage.size > 0) {
    nextImageUrl = await saveProductImage(uploadedImage);
  }

  await prisma.product.create({
    data: {
      productName,
      inStock,
      price,
      description: description || null,
      imageUrl: nextImageUrl || null,
      type
    }
  });

  revalidatePath('/admin');
  revalidatePath('/shop');
}

export async function updateUserRole(formData: FormData) {
  await requireAdmin();

  const profileId = String(formData.get('profileId') ?? '').trim();
  const role = String(formData.get('role') ?? 'customer') === 'admin' ? 'admin' : 'customer';

  if (!profileId) {
    redirect('/admin');
  }

  await prisma.profile.update({
    where: { id: profileId },
    data: { role }
  });

  revalidatePath('/admin');
}

export async function logout() {
  // clear session cookie and redirect to login
  cookies().delete(sessionCookieName());
  redirect('/login');
}