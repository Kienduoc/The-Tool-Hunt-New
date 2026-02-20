import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdmin } from '@/lib/auth/admin'

export async function POST(request: Request) {
    await checkAdmin()
    const supabase = await createClient()

    const { type, source, rawData } = await request.json()

    if (!rawData || !type) {
        return NextResponse.json({ error: 'Missing type or rawData' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('pending_reviews')
        .insert({
            type,
            status: 'pending',
            source: source || 'manual',
            raw_data: rawData,
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
}
