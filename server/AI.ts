import fs from 'fs';
import path from 'path';

// Path to your database
const dbPath = path.join(__dirname, 'database.json');

interface TrainingExample {
  input: string;
  output: string;
}

interface Database {
  trainingData: TrainingExample[];
}

// Read database
export function readDatabase(): Database {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

// Add new training example
export function addTrainingExample(input: string, output: string) {
  const db = readDatabase();
  db.trainingData.push({ input, output });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// Example: Get AI response (simple lookup)
export function getAIResponse(input: string): string {
  const db = readDatabase();
  const match = db.trainingData.find(d => d.input.toLowerCase() === input.toLowerCase());
  return match ? match.output : "I don't know that yet.";
                                   }
