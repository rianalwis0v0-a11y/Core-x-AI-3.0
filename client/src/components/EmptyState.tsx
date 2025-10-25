import { Card } from "@/components/ui/card";
import { Code, Lightbulb, BookOpen, Brain } from "lucide-react";
import logoUrl from "@assets/file_00000000d59861faa5d2b201fab77f3a (1)_1761396857368.png";

interface EmptyStateProps {
  onSuggestedPrompt: (prompt: string) => void;
}

const suggestedPrompts = [
  {
    icon: Brain,
    text: "Explain neural networks in simple terms",
    prompt: "Can you explain neural networks in simple terms?",
  },
  {
    icon: Code,
    text: "Help me build a machine learning model",
    prompt: "I want to build a machine learning model. Can you help me get started?",
  },
  {
    icon: Lightbulb,
    text: "Give me AI project ideas",
    prompt: "Can you suggest some AI and machine learning project ideas?",
  },
  {
    icon: BookOpen,
    text: "Teach me about deep learning",
    prompt: "I want to learn about deep learning. Where should I start?",
  },
];

export default function EmptyState({ onSuggestedPrompt }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
          <img src={logoUrl} alt="Core X AI" className="w-full h-full" />
        </div>
        <h1 className="text-2xl font-semibold mb-2" data-testid="text-welcome">
          Welcome to Core X AI v3.0
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
