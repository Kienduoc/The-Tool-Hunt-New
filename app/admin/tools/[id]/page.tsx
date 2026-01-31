import ToolForm from '@/components/admin/ToolForm'
import { updateTool } from '@/lib/actions/admin/tools'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params
    const { data: tool } = await supabase.from('tools').select('*').eq('id', id).single()

    if (!tool) notFound()

    const updateAction = updateTool.bind(null, tool.id)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Tool</h1>
            <ToolForm tool={tool} action={updateAction} />
        </div>
    )
}
