export const SUMMARIZE_VIDEO_PROMPT = `You are an AI assistant analyzing a YouTube video transcript about AI tools and productivity.

Your task:
1. Generate a concise 2-3 sentence summary of the video
2. Identify 3-5 key highlights or main points
3. Extract the category (e.g., "Development", "Design", "Marketing", "Productivity")

Video Title: {title}
Video Description: {description}
Transcript:
{transcript}

Respond in JSON format:
{
  "summary": "2-3 sentence summary",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "category": "category name"
}
`

export const DETECT_TIMESTAMPS_PROMPT = `Analyze this video transcript and identify 3-7 key moments or sections.

For each timestamp, provide:
- The timestamp (in seconds)
- A short title (max 50 chars)
- A brief description (max 100 chars)

Video Transcript:
{transcript}

Respond in JSON format:
{
  "timestamps": [
    {
      "timestamp": 120,
      "title": "Introduction to AI Agents",
      "description": "Overview of what AI agents are and how they work"
    }
  ]
}
`

export const DETECT_TOOLS_PROMPT = `Analyze this video transcript and identify all AI tools, software, or platforms mentioned.

For each tool, extract:
- Tool name
- Brief description (what it does)
- Category (e.g., "Development", "Design", "Marketing", "Writing", "Productivity")
- Pricing type (if mentioned): "Free", "Freemium", or "Paid". Default to "Freemium" if unsure.
- Use cases (array of 1-3 use cases)

Video Title: {title}
Transcript:
{transcript}

Respond in JSON format:
{
  "tools": [
    {
      "name": "ChatGPT",
      "description": "AI chatbot for conversations and content creation",
      "category": "Productivity",
      "pricingType": "Freemium",
      "useCases": ["Writing", "Coding", "Research"]
    }
  ]
}

IMPORTANT: Only include tools that are clearly mentioned or demonstrated in the video. Ignore generic terms like "AI", "computer", "internet".
`
