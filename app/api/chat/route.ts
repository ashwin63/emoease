import { NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://emoease.vercel.app',
        'X-Title': 'EmotionalEase Chat'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are EmotionalEase, an AI trained to support people emotionally. Respond with warmth and safety.'
          },
          {
            role: 'user',
            content: message
          }
        ]
      }),
    });

    const data = await response.json();
    return NextResponse.json({ message: data.choices[0].message.content });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch response' }, { status: 500 });
  }
}
