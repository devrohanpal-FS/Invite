import { NextRequest, NextResponse } from 'next/server';
import { addRSVPServer } from '@/lib/server-storage';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const body = await req.json();

    if (!body || !body.name) {
      return NextResponse.json({ success: false, error: 'Guest name is required' }, { status: 400 });
    }

    const updated = addRSVPServer(slug, {
      name: body.name,
      attending: Boolean(body.attending),
      guestsCount: Number(body.guestsCount) || 1,
      message: body.message || '',
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API POST /api/invites/[slug]/rsvp error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record RSVP' }, { status: 500 });
  }
}
