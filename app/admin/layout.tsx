import Link from 'next/link'
import { checkAdmin } from '@/lib/auth/admin'
import {
    LayoutDashboard,
    Wrench,
    Video,
    FileText,
    Users,
    Settings,
    LogOut
} from 'lucide-react'
import { signOut } from '@/lib/auth/actions'

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Wrench, label: 'Tools', href: '/admin/tools' },
    { icon: Video, label: 'Videos', href: '/admin/videos' },
    { icon: FileText, label: 'Articles', href: '/admin/articles' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, role } = await checkAdmin()

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card flex flex-col fixed inset-y-0 z-50">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⚡</span>
                        <span className="font-bold text-lg">Admin Panel</span>
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mt-2 block pl-1">
                        {role} Access
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.email}</p>
                        </div>
                    </div>

                    <form action={signOut}>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
