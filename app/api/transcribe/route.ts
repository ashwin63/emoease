import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get('audio') as Blob;

    // Convert audio to text using Whisper API
    const whisperFormData = new FormData();
    whisperFormData.append('file', audioBlob, 'audio.wav');
    whisperFormData.append('model', 'whisper-1');

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: whisperFormData,
    });

    const { text } = await whisperResponse.json();

    // Get ChatGPT response
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are EmotionalEase, an AI trained to support people emotionally. Respond with warmth and safety.'
          },
          {
            role: 'user',
            content: text
          }
        ],
      }),
    });

    const chatData = await chatResponse.json();
    const responseText = chatData.choices[0].message.content;

    return NextResponse.json({ responseText });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process audio' }, { status: 500 });
  }
}
