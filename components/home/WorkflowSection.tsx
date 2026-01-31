import { Video, Search, Save, Rocket } from 'lucide-react'

const steps = [
    {
        number: 1,
        icon: Video,
        title: 'Watch & Learn',
        description: 'Watch deep-dive tutorials to understand tool capabilities.',
        color: 'bg-primary text-primary-foreground',
    },
    {
        number: 2,
        icon: Search,
        title: 'Spot a Tool',
        description: 'Find the perfect tool for your specific workflow needs.',
        color: 'bg-secondary text-secondary-foreground',
    },
    {
        number: 3,
        icon: Save,
        title: 'Save to Hunted',
        description: 'Add to your personal collection with custom tags.',
        color: 'bg-blue-500 text-white',
    },
    {
        number: 4,
        icon: Rocket,
        title: 'Apply & Master',
        description: 'Implement the tool and level up your productivity.',
        color: 'bg-foreground text-background',
    },
]

export default function WorkflowSection() {
    return (
        <section className="container py-24">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Your Hunting Workflow</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    From discovery to mastery in four simple steps.
                </p>
            </div>

            <div className="relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-blue-500/50 -z-10" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4">
                    {steps.map((step) => (
                        <div key={step.number} className="group flex flex-col items-center text-center space-y-6">
                            <div className={`w-20 h-20 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform shadow-xl flex items-center justify-center ${step.color}`}>
                                <step.icon className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">{step.title}</h3>
                                <p className="text-muted-foreground text-sm px-4">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
