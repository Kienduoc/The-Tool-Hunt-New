import SignupForm from '@/components/auth/SignupForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign Up | The Tool Hunt',
    description: 'Create an account to start hunting and collecting AI tools.',
}

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <SignupForm />
        </div>
    )
}
