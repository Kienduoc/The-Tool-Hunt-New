import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const features = [
    {
        emoji: '🎓',
        title: 'Hunt Like a Pro',
        description: 'Master AI tools with expert video tutorials. Don\'t just find tools, learn how to use them efficiently.',
        link: '/hunt-like-a-pro',
        color: 'text-primary',
        badge: '8 Videos',
        bgHover: 'group-hover:border-primary/50',
    },
    {
        emoji: '🎯',
        title: 'The Hunt Is ON!',
        description: 'Explore our massive directory with smart filters. Find exactly what you need by category, price, or use case.',
        link: '/the-hunt-is-on',
        color: 'text-secondary',
        badge: '20+ Tools',
        bgHover: 'group-hover:border-secondary/50',
    },
    {
        emoji: '💼',
        title: 'Hunted Collection',
        description: 'Build your personal arsenal. Save, tag, and organize your favorite tools for quick access later.',
        link: '/hunted',
        color: 'text-blue-400',
        badge: 'Personal',
        bgHover: 'group-hover:border-blue-400/50',
    },
]

export default function FeatureCards() {
    return (
        <section className="container py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature) => (
                    <Link
                        key={feature.title}
                        href={feature.link}
                        className={`group relative p-8 bg-card rounded-xl border border-border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${feature.bgHover}`}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="text-5xl">{feature.emoji}</div>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-full text-muted-foreground border border-border">
                                {feature.badge}
                            </span>
                        </div>

                        <h3 className={`text-2xl font-bold mb-3 ${feature.color}`}>
                            {feature.title}
                        </h3>

                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            {feature.description}
                        </p>

                        <div className={`flex items-center gap-2 font-medium ${feature.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                            <span className="text-sm">Start Here</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
