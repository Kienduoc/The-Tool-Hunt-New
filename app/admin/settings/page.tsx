import { Settings, Database, Shield, Bell, Palette } from 'lucide-react'

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Settings</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Settings className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold">General</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Site Name</p>
                                <p className="text-sm text-muted-foreground">The Tool Hunt</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Environment</p>
                                <p className="text-sm text-muted-foreground">Development</p>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                DEV
                            </span>
                        </div>
                    </div>
                </div>

                {/* Database Settings */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Database className="w-5 h-5 text-green-500" />
                        </div>
                        <h2 className="text-lg font-semibold">Database</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Provider</p>
                                <p className="text-sm text-muted-foreground">Supabase</p>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                                Connected
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Project ID</p>
                                <p className="text-sm text-muted-foreground font-mono">xhrssdetskpvubjkjsaz</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-red-500" />
                        </div>
                        <h2 className="text-lg font-semibold">Security</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">RLS Policies</p>
                                <p className="text-sm text-muted-foreground">Row Level Security enabled</p>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                                Active
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Auth Provider</p>
                                <p className="text-sm text-muted-foreground">Email / Google OAuth</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Bell className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-lg font-semibold">Notifications</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-muted-foreground">For new user signups</p>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                Disabled
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center py-8 text-muted-foreground">
                <p>More settings coming soon...</p>
            </div>
        </div>
    )
}
