import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;
    
    if (!audioFile) {
      console.error('No audio file received');
      return NextResponse.json({ error: 'No audio file received' }, { status: 400 });
    }

    console.log('Received audio file:', audioFile.size, audioFile.type);

    // Convert audio to text using Whisper API
    const whisperFormData = new FormData();
    whisperFormData.append('file', audioFile, 'recording.webm');
    whisperFormData.append('model', 'whisper-1');

    console.log('Sending to Whisper API...');
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: whisperFormData,
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error('Whisper API Error:', errorText);
      throw new Error('Whisper API request failed');
    }

    const { text } = await whisperResponse.json();
    console.log('Transcribed text:', text);

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

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      console.error('ChatGPT API Error:', errorText);
      throw new Error('ChatGPT API request failed');
    }

    const chatData = await chatResponse.json();
    const responseText = chatData.choices[0].message.content;

    return NextResponse.json({ responseText });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process audio' }, { status: 500 });
  }
}
