import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getHuntedCount } from '@/lib/api/hunted'
import Button from '@/components/ui/Button'
import { Search, Menu } from 'lucide-react'

export default async function Header() {
    const supabase = await createClient()
    const [{ data: { user } }, huntedCount] = await Promise.all([
        supabase.auth.getUser(),
        getHuntedCount()
    ])

    return (
        <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="text-2xl transition-transform group-hover:scale-110">🎯</div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            The Tool Hunt
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        <Link
                            href="/hunt-like-a-pro"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 text-foreground/80 hover:text-primary transition-all font-semibold"
                        >
                            <span className="text-xl">🎓</span>
                            <span>Hunt Like a Pro</span>
                        </Link>
                        <Link
                            href="/the-hunt-is-on"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/10 text-foreground/80 hover:text-secondary transition-all font-semibold"
                        >
                            <span className="text-xl">🎯</span>
                            <span>The Hunt Is ON!</span>
                        </Link>
                        {/* <Link
                            href="/news"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-500/10 text-foreground/80 hover:text-blue-500 transition-all font-semibold"
                        >
                            <span className="text-xl">📰</span>
                            <span>News</span>
                        </Link> */}
                        <Link
                            href="/hunted"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition-all font-semibold"
                        >
                            <span className="text-xl">💼</span>
                            <span>Hunted</span>
                            {huntedCount > 0 && (
                                <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-bold text-white bg-emerald-500 rounded-full leading-none">
                                    {huntedCount}
                                </span>
                            )}
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-accent rounded-full">
                            <Search className="w-5 h-5" />
                        </button>

                        {user ? (
                            <div className="hidden md:flex items-center gap-4">
                                <Link href="/profile">
                                    <Button variant="ghost" size="sm" className="font-semibold">
                                        Profile
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="hidden md:flex gap-3 items-center">
                                <Link href="/auth/login">
                                    <Button variant="ghost" className="font-semibold text-foreground hover:bg-accent/50">Login</Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button size="sm" className="font-bold shadow-md hover:shadow-lg transition-all px-6">Sign Up</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 text-foreground">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
