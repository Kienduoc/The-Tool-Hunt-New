import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { deleteTool } from '@/lib/actions/admin/tools'

export default async function AdminToolsPage() {
    const supabase = await createClient()
    const { data: tools } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Tools Management</h1>
                <Link
                    href="/admin/tools/new"
                    className="inline-flex items-center justify-center gap-2 rounded-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-4 py-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New Tool
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Pricing</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tools?.map((tool) => (
                            <tr key={tool.id} className="border-b border-border hover:bg-muted/30">
                                <td className="px-6 py-4 font-medium">{tool.name}</td>
                                <td className="px-6 py-4">{tool.category}</td>
                                <td className="px-6 py-4">{tool.pricing_type}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full border ${tool.status === 'verified' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        tool.status === 'new_tool' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                        }`}>
                                        {tool.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <Link
                                        href={`/admin/tools/${tool.id}`}
                                        className="inline-flex items-center justify-center h-9 px-3 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <form action={deleteTool.bind(null, tool.id)}>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
