
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    // 1. Check user auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Data to seed
    const articles = [
        {
            title: "Top 5 AI Code Editors for 2024",
            slug: "top-5-ai-code-editors-2024",
            excerpt: "Discover the best AI-powered code editors that are revolutionizing developer productivity. From Cursor to Windsurf, we rank the top contenders.",
            content: `
# Top 5 AI Code Editors for 2024: Boosting Developer Productivity

The landscape of software development is shifting rapidly. AI-powered code editors are no longer just "nice-to-have" extensions; they are becoming the central nervous system of modern development workflows. In this roundup, we explore the top 5 AI code editors that are redefining how we write code.

## 1. Cursor: The Game Changer

**Cursor** is a fork of VS Code that integrates AI deeply into the editing experience. Unlike standard extensions, Cursor can understand your entire codebase, making it incredibly powerful for refactoring and code generation.

*   **Pros**: Native AI integration, "Cmd+K" to generate code, codebase indexing.
*   **Cons**: Requires migration from VS Code (though it's seamless).
*   **Verdict**: The current king of AI editors.

## 2. Windsurf: The New Challenger

**Windsurf** by Codeium is gaining traction for its context-aware capabilities. It promises a "flow" state by anticipating your next move.

*   **Pros**: Fast, context-aware, "Flow" mode.
*   **Cons**: Newer ecosystem compared to VS Code.
*   **Verdict**: A strong contender for those who want speed.

## 3. GitHub Copilot (VS Code): The Standard

The classic combination. **VS Code** with **GitHub Copilot** is the reliable standard used by millions.

*   **Pros**: Huge ecosystem, enterprise-grade security.
*   **Cons**: AI feels more like an addon than a core feature.
*   **Verdict**: Best for enterprise environments.

## 4. Zed: The Speed Demon

**Zed** is built for performance. Written in Rust, it's blazing fast and now integrates AI features directly.

*   **Pros**: Incredible performance, collaborative features.
*   **Cons**: Smaller extension marketplace.
*   **Verdict**: Best for performance purists.

## 5. JetBrains AI Assistant

For those entrenched in the IntelliJ ecosystem, **JetBrains AI** provides a deeply integrated experience.

*   **Pros**: Knows your project deeply, great refactoring tools.
*   **Cons**: Paid subscription on top of IDE cost.
*   **Verdict**: Essential for Java/Kotlin developers.

## Conclusion

If you're ready to jump into the AI-native future, **Cursor** is the top recommendation. However, if you prefer stability and ecosystem, sticking with **VS Code + Copilot** is a safe bet.
            `,
            category: "Toplist",
            tags: ["coding", "ai", "editors", "productivity"],
            published: true,
            published_at: new Date().toISOString(),
            author_id: user.id
        },
        {
            title: "Midjourney vs Stable Diffusion: The Ultimate Showdown",
            slug: "midjourney-vs-stable-diffusion-2024",
            excerpt: "A comprehensive comparison of the two leading AI image generators. Which one should you choose for your creative workflow?",
            content: `
# Midjourney vs Stable Diffusion: Which Art Generator Reigns Supreme?

The battle for AI art supremacy continues. **Midjourney** and **Stable Diffusion** are the two titans of the industry, but they cater to very different needs. Let's break down the differences.

## Ease of Use

*   **Midjourney**: Operates within Discord. It's incredibly easy to start—just type \`/imagine\` and go. The barrier to entry is low, but the interface can be chaotic.
*   **Stable Diffusion**: Requires more setup (unless using a hosted version). UI varies (Automatic1111, ComfyUI), offering immense control but a steeper learning curve.

**Winner**: Midjourney (for beginners).

## Image Quality & Aesthetics

*   **Midjourney**: Known for its artistic flair, vibrant colors, and "finished" look straight out of the box. V6 is hyper-realistic.
*   **Stable Diffusion**: Quality depends heavily on the model (checkpoint) used. SDXL is powerful, but achieving Midjourney-level aesthetics often requires fine-tuning or LoRAs.

**Winner**: Midjourney (out of the box).

## Control & Flexibility

*   **Midjourney**: Limited control. You can use parameters like \`--stylize\` or \`--weird\`, but you can't control specific pixel placements easily.
*   **Stable Diffusion**: The king of control. With ControlNet, Inpainting, and regional prompting, you can dictate exactly *where* objects appear.

**Winner**: Stable Diffusion (by a mile).

## Cost & Access

*   **Midjourney**: Monthly subscription ($10-$120/mo). No free tier currently.
*   **Stable Diffusion**: Open source and free to run locally (if you have a GPU). Hosted services exist but the core tech is free.

**Winner**: Stable Diffusion.

## The Verdict

Choose **Midjourney** if you want stunning results with minimal effort and don't mind a subscription.

Choose **Stable Diffusion** if you need precise control, want to run locally for privacy, or are building a complex workflow.
            `,
            category: "Comparison",
            tags: ["ai-art", "midjourney", "stable-diffusion", "comparison"],
            published: true,
            published_at: new Date().toISOString(),
            author_id: user.id
        }
    ]

    // 3. Insert Articles
    const results = []

    for (const article of articles) {
        // Check if exists
        const { data: existing } = await supabase
            .from('articles')
            .select('id')
            .eq('slug', article.slug)
            .single()

        if (existing) {
            results.push({ title: article.title, status: 'skipped (exists)' })
            continue
        }

        const { error } = await supabase.from('articles').insert(article)

        if (error) {
            results.push({ title: article.title, status: 'failed', error: error.message })
        } else {
            results.push({ title: article.title, status: 'created' })
        }
    }

    return NextResponse.json({ success: true, results })
}
