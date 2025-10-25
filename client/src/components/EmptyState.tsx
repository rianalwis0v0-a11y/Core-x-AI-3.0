import { Card } from "@/components/ui/card";
import { Sparkles, Code, Lightbulb, BookOpen } from "lucide-react";

interface EmptyStateProps {
  onSuggestedPrompt: (prompt: string) => void;
}

const suggestedPrompts = [
  {
    icon: Sparkles,
    text: "Explain quantum computing in simple terms",
    prompt: "Can you explain quantum computing in simple terms?",
  },
  {
    icon: Code,
    text: "Help me debug this Python code",
    prompt: "I have a Python function that's not working as expected. Can you help me debug it?",
  },
  {
    icon: Lightbulb,
    text: "Give me creative project ideas",
    prompt: "Can you suggest some creative project ideas I could work on?",
  },
  {
    icon: BookOpen,
    text: "Teach me about machine learning",
    prompt: "I want to learn about machine learning. Where should I start?",
  },
];

export default function EmptyState({ onSuggestedPrompt }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold mb-2" data-testid="text-welcome">
          Welcome to AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Your intelligent companion powered by deep learning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
        {suggestedPrompts.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <Card
              key={index}
              className="p-4 hover-elevate active-elevate-2 cursor-pointer transition-all"
              onClick={() => onSuggestedPrompt(suggestion.prompt)}
              data-testid={`card-suggestion-${index}`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm leading-relaxed">{suggestion.text}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
