import TopNav from '@/components/TopNav';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen flex flex-col bg-brand-canvas'>
      <TopNav />
      <div className='flex-1 px-4 pb-4'>{children}</div>
    </div>
  );
}
