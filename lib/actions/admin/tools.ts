'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdmin } from '@/lib/auth/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTool(formData: FormData) {
    await checkAdmin()
    const supabase = await createClient()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const website_url = formData.get('website_url') as string
    const logo_url = formData.get('logo_url') as string
    const category = formData.get('category') as string
    const pricing_type = formData.get('pricing_type') as string
    const status = formData.get('status') as string
    // Use Cases handling simpler for now (comma values)

    // Generating slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const { error } = await supabase.from('tools').insert({
        name,
        slug,
        description,
        website_url,
        logo_url,
        category,
        pricing_type,
        status,
        use_cases: [] // Simplified for MVP
    })

    if (error) {
        console.error(error.message)
        return
    }

    revalidatePath('/admin/tools')
    revalidatePath('/the-hunt-is-on')
    redirect('/admin/tools')
}

export async function updateTool(id: string, formData: FormData) {
    await checkAdmin()
    const supabase = await createClient()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const website_url = formData.get('website_url') as string
    const logo_url = formData.get('logo_url') as string
    const category = formData.get('category') as string
    const pricing_type = formData.get('pricing_type') as string
    const status = formData.get('status') as string

    const { error } = await supabase.from('tools').update({
        name,
        description,
        website_url,
        logo_url,
        category,
        pricing_type,
        status
    }).eq('id', id)

    if (error) {
        console.error(error.message)
        return
    }

    revalidatePath('/admin/tools')
    revalidatePath('/the-hunt-is-on')
    redirect('/admin/tools')
}

export async function deleteTool(id: string, _formData: FormData) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase.from('tools').delete().eq('id', id)

    if (error) {
        console.error(error.message)
        return
    }

    revalidatePath('/admin/tools')
    revalidatePath('/the-hunt-is-on')
}
