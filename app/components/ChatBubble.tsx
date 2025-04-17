"use client";

export default function ChatBubble() {
  return (
    <div className="relative">
      {/* Simple circle with gradient */}
      <div 
        className="w-[200px] h-[200px] rounded-full"
        style={{
          background: 'radial-gradient(circle at center, #FFFFFF, #93C5FD)'
        }}
      />
    </div>
  );
}
