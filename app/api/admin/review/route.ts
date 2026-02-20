import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAdmin } from '@/lib/auth/admin'
import { saveProcessedVideo } from '@/lib/video-processor/pipeline'

// GET: List pending reviews
export async function GET(request: Request) {
    await checkAdmin()
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const type = searchParams.get('type')

    let query = supabase
        .from('pending_reviews')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

    if (type) {
        query = query.eq('type', type)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data })
}

// POST: Approve a review item
export async function POST(request: Request) {
    await checkAdmin()
    const supabase = await createClient()

    const { reviewId, action, editedData } = await request.json()

    if (!reviewId || !action) {
        return NextResponse.json({ error: 'Missing reviewId or action' }, { status: 400 })
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (action === 'approve') {
        // Get the review item
        const { data: review, error: fetchError } = await supabase
            .from('pending_reviews')
            .select('*')
            .eq('id', reviewId)
            .single()

        if (fetchError || !review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 })
        }

        try {
            // Use editedData if provided, otherwise use raw_data
            const dataToSave = editedData || review.raw_data

            if (review.type === 'video') {
                await saveProcessedVideo(dataToSave, true)
            }

            // Mark as approved
            await supabase
                .from('pending_reviews')
                .update({
                    status: 'approved',
                    raw_data: dataToSave,
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                })
                .eq('id', reviewId)

            return NextResponse.json({ success: true, action: 'approved' })
        } catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 500 })
        }
    }

    if (action === 'reject') {
        const { error } = await supabase
            .from('pending_reviews')
            .update({
                status: 'rejected',
                admin_notes: editedData?.notes || 'Rejected by admin',
                reviewed_by: user?.id,
                reviewed_at: new Date().toISOString(),
            })
            .eq('id', reviewId)

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true, action: 'rejected' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// PUT: Update review item data (edit before approve)
export async function PUT(request: Request) {
    await checkAdmin()
    const supabase = await createClient()

    const { reviewId, rawData } = await request.json()
    if (!reviewId || !rawData) {
        return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const { error } = await supabase
        .from('pending_reviews')
        .update({ raw_data: rawData })
        .eq('id', reviewId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
