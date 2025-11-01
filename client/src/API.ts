export async function chatWithAI(message: string): Promise<string> {
  const res = await fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  return data.response;
}

export async function trainAI(input: string, output: string) {
  await fetch('http://localhost:5000/train', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, output })
  });
}
