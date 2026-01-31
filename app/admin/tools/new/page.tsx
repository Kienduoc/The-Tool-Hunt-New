import ToolForm from '@/components/admin/ToolForm'
import { createTool } from '@/lib/actions/admin/tools'

export default function NewToolPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Add New Tool</h1>
            <ToolForm action={createTool} />
        </div>
    )
}
