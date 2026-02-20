import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export type ArticleType = 'Toplist' | 'Comparison' | 'General'

export interface GenerateArticleRequest {
    topic: string
    type: ArticleType
    targetKeyword: string
}

export interface GeneratedArticle {
    title: string
    slug: string
    excerpt: string
    content: string
    seo_title: string
    seo_description: string
    tags: string[]
    category: string
}

export async function generateArticle(request: GenerateArticleRequest): Promise<GeneratedArticle> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
            responseMimeType: "application/json"
        }
    })

    const prompt = `
    You are an expert SEO Content Writer. Your task is to write a comprehensive, engaging, and SEO-optimized article based on the following inputs:

    Topic: "${request.topic}"
    Type: "${request.type}"
    Target Keyword: "${request.targetKeyword}"

    Follow these guidelines:
    1.  **Structure**: Use a clear structure with H1, H2, H3 headers.
    2.  **Hook**: Write an engaging introduction (50-100 words) that hooks the reader.
    3.  **Content**:
        - If "Toplist": List 5-7 items. For each, include Pros, Cons, and a Verdict.
        - If "Comparison": Compare key aspects (e.g., Features, Pricing, Ease of Use) and declare a winner for each.
        - If "General": meaningful depth, covers "what", "why", "how".
    4.  **SEO**: 
        - Include the target keyword naturally (0.5-1.5% density).
        - Use semantic variations.
    5.  **E-E-A-T**: Write with an expert tone, include practical advice or "Pro Tips".
    6.  **Formatting**: Use bullet points, bold text for emphasis, and tables where appropriate.

    Return the output strictly as a JSON object with the following schema:
    {
        "title": "Catchy SEO Title",
        "slug": "url-friendly-slug",
        "excerpt": "Compelling meta description/excerpt (150-160 chars)",
        "content": "The full article content in Markdown format",
        "seo_title": "Title tag for search engines",
        "seo_description": "Meta description for search engines",
        "tags": ["tag1", "tag2", "tag3"],
        "category": "${request.type}"
    }
    `

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        console.log("Gemini Response:", text) // Debug log

        return JSON.parse(text)
    } catch (error: any) {
        console.error("Gemini Generation Error:", error)
        throw new Error(`Failed to generate article: ${error.message}`)
    }
}
