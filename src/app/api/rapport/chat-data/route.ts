import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { question, data } = await req.json() as { question: string; data: unknown }

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Tu es un assistant qui répond en français à des questions sur les données d'une association. Sois concis, bienveillant et utilise des emojis. Voici les données :

${JSON.stringify(data, null, 2)}

Question : ${question}`,
      },
    ],
  })

  const answer = (message.content[0] as { text: string }).text
  return NextResponse.json({ answer })
}
