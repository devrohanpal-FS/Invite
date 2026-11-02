import type { Metadata } from 'next';
import { getInvitationBySlugServer } from '@/lib/server-storage';

export async function generateStaticParams() {
  return [
    { slug: 'kabir-ananya' },
    { slug: 'veer-zara' },
    { slug: 'sam-sofia' },
    { slug: 'akshita-gaurav' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const invite = getInvitationBySlugServer(params.slug);

  if (!invite) {
    return {
      title: 'Digital Wedding Invitation',
      description: 'You are cordially invited to celebrate our special day.',
    };
  }

  const title = `Wedding Invitation: ${invite.groomName} & ${invite.brideName}`;
  const description = `${invite.salutation || 'Together with our families'} • Celebrating on ${invite.weddingDate} at ${invite.venueName}, ${invite.city}. Click to open your interactive invitation!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: invite.couplePhoto ? [{ url: invite.couplePhoto }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: invite.couplePhoto ? [invite.couplePhoto] : undefined,
    },
  };
}

export default function GuestInviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
