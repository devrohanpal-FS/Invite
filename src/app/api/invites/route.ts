import { NextRequest, NextResponse } from 'next/server';
import { getAllInvitationsServer, saveInvitationServer } from '@/lib/server-storage';
import { InvitationData } from '@/types/invite';

export async function GET() {
  try {
    const invites = getAllInvitationsServer();
    return NextResponse.json({ success: true, data: invites });
  } catch (error) {
    console.error('API GET /api/invites error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch invitations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: InvitationData = await req.json();
    if (!body || !body.groomName || !body.brideName) {
      return NextResponse.json({ success: false, error: 'Groom and bride names are required' }, { status: 400 });
    }

    const saved = saveInvitationServer(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error('API POST /api/invites error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save invitation' }, { status: 500 });
  }
}
