import ChatBubble from './components/ChatBubble';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="border-2 border-white p-4">
        <ChatBubble />
      </div>
    </div>
  );
}
