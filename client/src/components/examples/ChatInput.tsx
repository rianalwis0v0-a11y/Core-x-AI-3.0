import ChatInput from "../ChatInput";

export default function ChatInputExample() {
  return (
    <div className="h-32">
      <ChatInput
        onSend={(message) => console.log("Message sent:", message)}
        placeholder="Ask me anything..."
      />
    </div>
  );
}
