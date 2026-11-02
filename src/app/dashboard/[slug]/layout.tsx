import React from 'react';

export async function generateStaticParams() {
  return [
    { slug: 'kabir-ananya' },
    { slug: 'veer-zara' },
    { slug: 'sam-sofia' },
    { slug: 'akshita-gaurav' },
  ];
}

export default function DashboardSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
