'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
    {
        variants: {
            variant: {
                primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                secondary: 'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
                outline: 'border border-border hover:bg-accent hover:text-accent-foreground text-foreground',
                ghost: 'hover:bg-accent hover:text-accent-foreground text-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                sm: 'h-9 px-3 text-sm',
                md: 'h-10 px-4 py-2',
                lg: 'h-11 px-8 text-lg',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
)

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    children: ReactNode
}

export default function Button({
    className,
    variant,
    size,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {children}
        </button>
    )
}
