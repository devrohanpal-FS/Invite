import { NextRequest, NextResponse } from 'next/server';
import { recordShagunServer } from '@/lib/server-storage';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const body = await req.json();
    const amount = Number(body?.amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Valid amount is required' }, { status: 400 });
    }

    const updated = recordShagunServer(slug, amount);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API POST /api/invites/[slug]/shagun error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record shagun' }, { status: 500 });
  }
}
