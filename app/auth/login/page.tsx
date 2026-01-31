import LoginForm from '@/components/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login | The Tool Hunt',
    description: 'Login to access your personalized tool collection.',
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <LoginForm />
        </div>
    )
}
