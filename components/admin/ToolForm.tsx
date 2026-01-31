'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { Tool } from '@/lib/api/tools'

export default function ToolForm({ tool, action }: { tool?: Tool, action: any }) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        await action(formData)
        setLoading(false)
    }

    return (
        <form action={handleSubmit} className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-xl">
            <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input name="name" defaultValue={tool?.name} required className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea name="description" defaultValue={tool?.description} required rows={4} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select name="category" defaultValue={tool?.category || 'Development'} className="w-full px-4 py-2 bg-background border border-border rounded-lg">
                        {['Development', 'Design', 'Marketing', 'Writing', 'Productivity'].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Pricing</label>
                    <select name="pricing_type" defaultValue={tool?.pricing_type || 'Freemium'} className="w-full px-4 py-2 bg-background border border-border rounded-lg">
                        <option value="Free">Free</option>
                        <option value="Freemium">Freemium</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Website URL</label>
                <input name="website_url" type="url" defaultValue={tool?.website_url} required className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Logo URL</label>
                <input name="logo_url" type="url" defaultValue={tool?.logo_url || ''} className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select name="status" defaultValue={tool?.status || 'new_tool'} className="w-full px-4 py-2 bg-background border border-border rounded-lg">
                    <option value="new_tool">New Tool</option>
                    <option value="verified">Verified</option>
                    <option value="hot_trend">Hot Trend</option>
                </select>
            </div>

            <Button disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Tool'}
            </Button>
        </form>
    )
}
