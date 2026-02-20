
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCategories() {
    console.log('Fetching categories...')
    const { data, error } = await supabase
        .from('tools')
        .select('category')
        .order('category')
        .limit(10)

    if (error) {
        console.error('Error:', JSON.stringify(error, null, 2))
    } else {
        console.log('Success!', data?.length, 'rows found')
        console.log('Sample:', data?.slice(0, 3))
    }
}

testCategories()
