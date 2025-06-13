
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      discountText,
      code,
      logoUrl,
      description,
      category,
      isActive,
      expiresAt,
    } = body;

    // Validate required fields
    if (!title || !discountText || !code) {
      return NextResponse.json(
        { error: 'Title, discount text, and code are required' },
        { status: 400 }
      );
    }

    // Check if code already exists for other coupons
    const existingCoupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        NOT: {
          id: params.id,
        },
      },
    });

    if (existingCoupon) {
      return NextResponse.json(
        { error: 'A coupon with this code already exists' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        title,
        discountText,
        code: code.toUpperCase(),
        logoUrl,
        description,
        category: category || 'discount',
        isActive: isActive ?? true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.coupon.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
