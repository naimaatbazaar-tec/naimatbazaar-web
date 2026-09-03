import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    const orderId = 'NB-' + Math.floor(100000 + Math.random() * 900000);

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        orderId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Order Route Error:', error);
    return NextResponse.json({ message: 'Failed to process order' }, { status: 500 });
  }
}