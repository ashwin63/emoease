"use client";

export default function ChatBubble() {
  return (
    <div className="relative">
      {/* Outer glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-[100px]" />
      
      {/* Inner bubble */}
      <div className="relative w-[200px] h-[200px] rounded-full bg-gradient-to-b from-white via-blue-200 to-blue-400">
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/80 via-transparent to-transparent" />
      </div>
    </div>
  );
}
