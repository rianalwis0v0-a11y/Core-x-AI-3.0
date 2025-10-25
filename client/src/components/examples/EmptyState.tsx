import EmptyState from "../EmptyState";

export default function EmptyStateExample() {
  return (
    <div className="h-96">
      <EmptyState
        onSuggestedPrompt={(prompt) => console.log("Suggested prompt:", prompt)}
      />
    </div>
  );
}
