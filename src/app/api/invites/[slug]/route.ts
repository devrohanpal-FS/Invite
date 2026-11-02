import { NextRequest, NextResponse } from 'next/server';
import { getInvitationBySlugServer, saveInvitationServer, incrementViewsServer } from '@/lib/server-storage';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const invite = getInvitationBySlugServer(slug);

    if (!invite) {
      return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
    }

    // Optional query param ?view=true to increment view count
    const shouldCountView = req.nextUrl.searchParams.get('view') === 'true';
    if (shouldCountView) {
      incrementViewsServer(slug);
      invite.totalViews = (invite.totalViews || 0) + 1;
    }

    return NextResponse.json({ success: true, data: invite });
  } catch (error) {
    console.error('API GET /api/invites/[slug] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch invitation' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();
    body.slug = params.slug;
    const updated = saveInvitationServer(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API PUT /api/invites/[slug] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update invitation' }, { status: 500 });
  }
}
