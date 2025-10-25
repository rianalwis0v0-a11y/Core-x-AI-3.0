# Core X AI v3.0

## Overview

Core X AI v3.0 is an intelligent AI assistant application that provides a modern chat interface for users to interact with OpenAI's GPT-5 model. The application enables users to ask questions, get help with coding, and solve creative problems through a conversation-based interface inspired by leading AI chat applications like ChatGPT and Claude.ai.

The system is built as a full-stack web application with a React-based frontend and an Express.js backend, following a simple client-server architecture with in-memory storage for messages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (single route application)
- Tailwind CSS for utility-first styling with a custom design system

**UI Component Library**
- shadcn/ui components (New York style variant) built on Radix UI primitives
- Custom design system based on modern chat interfaces (ChatGPT, Claude.ai, Linear)
- Comprehensive component library including buttons, cards, dialogs, forms, and specialized chat components
- Theme system supporting light and dark modes with localStorage persistence

**State Management**
- TanStack Query (React Query) for server state management and data fetching
- React hooks for local component state
- Custom hooks for theme management and mobile detection

**Key Design Decisions**
- Conversation-first approach: All design choices prioritize clear communication
- Minimal distraction: Clean interface keeps focus on AI interaction
- Maximum content width of 4xl (centered) for optimal readability
- Custom markdown rendering for AI responses with syntax-highlighted code blocks
- Auto-expanding textarea input with Enter-to-send (Shift+Enter for new lines)

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server
- ESM modules throughout the codebase
- Custom middleware for request logging and JSON body parsing

**API Design**
- RESTful endpoints:
  - `GET /api/messages` - Retrieve all conversation messages
  - `POST /api/messages` - Send user message and receive AI response
  - `DELETE /api/messages` - Clear conversation history
- Streaming not currently implemented; responses are returned as complete messages

**AI Integration**
- OpenAI SDK integration with GPT-5 model
- System prompt configures AI as "Core X AI v3.0" with helpful, knowledgeable personality
- Conversation history maintained for context-aware responses
- Max completion tokens set to 8192
- Error handling for missing or invalid API keys

**Data Storage Strategy**
- In-memory storage using Map data structure (MemStorage class)
- Storage interface (IStorage) defined for potential future database implementations
- Messages include: id, role (user/assistant), content, and timestamp
- No persistence between server restarts - conversations are ephemeral

### Database Schema (Prepared but Not Active)

**PostgreSQL Schema Defined via Drizzle ORM**
- `users` table: id, username, password (for future authentication)
- `messages` table: id, content, role, timestamp (prepared for persistent storage)
- Schema uses `gen_random_uuid()` for ID generation
- Drizzle Kit configured for schema migrations
- Connection via Neon Database serverless driver (via DATABASE_URL environment variable)

**Current State**: Schema is defined but not actively used; application runs entirely on in-memory storage. The database infrastructure is ready for migration when persistence is needed.

### External Dependencies

**AI Services**
- OpenAI API (GPT-5 model)
  - Requires `OPENAI_API_KEY` environment variable
  - Used for chat completions with conversation history
  - Error handling for missing/invalid credentials

**Database (Configured but Inactive)**
- Neon Database (PostgreSQL)
  - Serverless PostgreSQL via `@neondatabase/serverless` driver
  - Requires `DATABASE_URL` environment variable (currently not used)
  - Drizzle ORM for schema management and type-safe queries

**UI Libraries**
- Radix UI primitives (20+ component packages) for accessible, unstyled UI components
- Lucide React for icons
- react-markdown for rendering AI responses with markdown support
- embla-carousel-react for carousel functionality
- date-fns for date formatting

**Development Tools**
- TypeScript for type safety across the stack
- Tailwind CSS with PostCSS for styling
- Replit-specific plugins for development environment integration (vite-plugin-runtime-error-modal, cartographer, dev-banner)

**Build & Runtime**
- esbuild for server-side bundling
- tsx for TypeScript execution in development
- Vite for frontend bundling and development

**Design Assets**
- Custom logo image stored in `attached_assets` directory
- Google Fonts: Architects Daughter, DM Sans, Fira Code, Geist Mono (loaded via HTML)