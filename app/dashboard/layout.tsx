import { DashboardSidebar, MobileNav } from '@/components/citadel/dashboard-sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-citadel-slate overflow-hidden">
            {/* Desktop Sidebar */}
            <DashboardSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
                    {children}
                </div>
            </div>

            {/* Mobile Nav */}
            <MobileNav />
        </div>
    );
}
