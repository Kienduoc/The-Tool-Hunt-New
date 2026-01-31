'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdmin } from '@/lib/auth/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createArticle(formData: FormData) {
    const { user } = await checkAdmin()
    const supabase = await createClient()

    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const cover_image_url = formData.get('cover_image_url') as string
    const category = formData.get('category') as string
    const published = formData.get('published') === 'on'

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const { error } = await supabase.from('articles').insert({
        title,
        slug,
        excerpt,
        content,
        cover_image_url,
        category,
        published,
        published_at: published ? new Date().toISOString() : null,
        author_id: user.id
    })

    if (error) {
        console.error(error.message)
        return
    }

    revalidatePath('/admin/articles')
    revalidatePath('/news')
    redirect('/admin/articles')
}

export async function deleteArticle(id: string, _formData: FormData) {
    await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase.from('articles').delete().eq('id', id)

    if (error) {
        console.error(error.message)
        return
    }

    revalidatePath('/admin/articles')
    revalidatePath('/news')
}
