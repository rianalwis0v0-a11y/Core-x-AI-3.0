
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./storage";
import { users, sessions } from "./db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function registerUser(username: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [user] = await db.insert(users).values({
    username,
    email,
    password: hashedPassword,
  }).returning();
  
  return user;
}

export async function loginUser(usernameOrEmail: string, password: string) {
  const [user] = await db.select()
    .from(users)
    .where(eq(users.username, usernameOrEmail))
    .limit(1);
  
  if (!user) {
    const [emailUser] = await db.select()
      .from(users)
      .where(eq(users.email, usernameOrEmail))
      .limit(1);
    
    if (!emailUser) {
      throw new Error("Invalid credentials");
    }
    
    const isValid = await bcrypt.compare(password, emailUser.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }
    
    return createSession(emailUser.id, emailUser.username);
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }
  
  return createSession(user.id, user.username);
}

async function createSession(userId: number, username: string) {
  const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: "7d" });
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  });
  
  return { token, userId, username };
}

export async function verifySession(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    
    const [session] = await db.select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1);
    
    if (!session || session.expiresAt < new Date()) {
      return null;
    }
    
    return decoded;
  } catch {
    return null;
  }
}

export async function logout(token: string) {
  await db.delete(sessions).where(eq(sessions.token, token));
}
