import { GoogleGenerativeAI } from '@google/generative-ai'
import {
    SUMMARIZE_VIDEO_PROMPT,
    DETECT_TIMESTAMPS_PROMPT,
    DETECT_TOOLS_PROMPT,
} from './prompts'

const apiKey = process.env.GOOGLE_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: "application/json" }
})

export interface VideoSummary {
    summary: string
    highlights: string[]
    category: string
}

export interface VideoTimestamp {
    timestamp: number
    title: string
    description: string
}

export interface DetectedTool {
    name: string
    description: string
    category: string
    pricingType: 'free' | 'freemium' | 'paid'
    useCases: string[]
}

export async function analyzeVideoSummary(
    title: string,
    description: string,
    transcript: string
): Promise<VideoSummary> {
    const prompt = SUMMARIZE_VIDEO_PROMPT
        .replace('{title}', title)
        .replace('{description}', description)
        .replace('{transcript}', transcript.slice(0, 30000)) // Gemini has larger context window

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as VideoSummary
}

export async function detectTimestamps(
    transcript: string
): Promise<VideoTimestamp[]> {
    const prompt = DETECT_TIMESTAMPS_PROMPT.replace('{transcript}', transcript.slice(0, 30000))

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const json = JSON.parse(text)
    return json.timestamps || []
}

export async function detectTools(
    title: string,
    transcript: string
): Promise<DetectedTool[]> {
    const prompt = DETECT_TOOLS_PROMPT
        .replace('{title}', title)
        .replace('{transcript}', transcript.slice(0, 30000))

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const json = JSON.parse(text)
    return json.tools || []
}
