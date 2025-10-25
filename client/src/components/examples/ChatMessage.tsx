import ChatMessage from "../ChatMessage";

export default function ChatMessageExample() {
  return (
    <div className="p-6 space-y-4 max-w-4xl">
      <ChatMessage
        role="user"
        content="What is machine learning?"
        timestamp={new Date()}
      />
      <ChatMessage
        role="assistant"
        content="Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. Here's a simple code example:

```python
from sklearn.linear_model import LinearRegression

# Create and train a model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)
```

The key concepts include:
- **Supervised Learning**: Learning from labeled data
- **Unsupervised Learning**: Finding patterns in unlabeled data
- **Deep Learning**: Neural networks with multiple layers"
        timestamp={new Date()}
      />
    </div>
  );
}
