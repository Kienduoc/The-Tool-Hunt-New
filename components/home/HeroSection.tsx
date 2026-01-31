import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function HeroSection() {
    return (
        <section className="container py-24 md:py-32 text-center overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none opacity-50" />

            <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    The <span className="text-primary">Hunt</span> Is <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-orange-500">ON!</span> 🎯
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    The Ultimate AI Tools Arsenal. Watch pro tutorials, discover hidden gems, and build your personal collection.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Link href="/the-hunt-is-on">
                        <Button size="lg" className="h-12 px-8 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                            Start Hunting Now
                        </Button>
                    </Link>
                    <Link href="/hunt-like-a-pro">
                        <Button variant="outline" size="lg" className="h-12 px-8 text-lg border-muted-foreground/20 hover:bg-accent">
                            Watch Tutorials
                        </Button>
                    </Link>
                </div>

                {/* Stats or Social Proof */}
                <div className="pt-12 flex flex-wrap justify-center gap-8 text-muted-foreground opacity-80">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-foreground text-xl">500+</span>
                        <span className="text-sm">Tools Indexed</span>
                    </div>
                    <div className="w-px h-10 bg-border hidden sm:block"></div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-foreground text-xl">50+</span>
                        <span className="text-sm">Video Tutorials</span>
                    </div>
                    <div className="w-px h-10 bg-border hidden sm:block"></div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-foreground text-xl">100%</span>
                        <span className="text-sm">Free to Join</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
