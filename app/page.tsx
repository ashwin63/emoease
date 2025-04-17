import ChatBubble from './components/ChatBubble';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-lavender-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-lavender-800 mb-4">EmotionalEase</h1>
        <p className="text-gray-600 mb-8">Your AI emotional support companion. Click the chat bubble to start a conversation.</p>
      </div>
      <ChatBubble />
    </main>
  );
}
