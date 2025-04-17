import ChatBubble from './components/ChatBubble';

export default function Home() {
  return (
    <div className="fixed inset-0 bg-black w-screen h-screen flex items-center justify-center">
      <ChatBubble />
    </div>
  );
}
