import Link from 'next/link'
import { Github, Twitter, Linkedin, Youtube } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card mt-auto">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="text-2xl">🎯</div>
                            <span className="text-xl font-bold text-foreground">The Tool Hunt</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Join the hunt for the best AI tools. Learn from experts, discover gems, and build your ultimate arsenal.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Explore</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/hunt-like-a-pro" className="hover:text-primary transition-colors">Hunt Like a Pro</Link></li>
                            <li><Link href="/the-hunt-is-on" className="hover:text-secondary transition-colors">The Hunt Is ON!</Link></li>
                            <li><Link href="/news" className="hover:text-blue-400 transition-colors">News & Comparisons</Link></li>
                            <li><Link href="/hunted" className="hover:text-foreground transition-colors">Hunted Collection</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="/submit-tool" className="hover:text-foreground transition-colors">Submit a Tool</Link></li>
                            <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Connect</h3>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-red-500 transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} The Tool Hunt. Built for Hunters.</p>
                </div>
            </div>
        </footer>
    )
}
