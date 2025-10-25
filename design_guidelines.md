# AI Assistant Design Guidelines

## Design Approach
**Selected Approach:** Design System with Modern Chat Interface References (ChatGPT, Claude.ai, Linear)
**Justification:** Chat applications require proven patterns for conversation flow, message clarity, and input handling. Drawing from leading AI interfaces ensures familiar, efficient user experience.

**Key Principles:**
- Conversation-first: Every design choice prioritizes clear communication
- Minimal distraction: Clean interface keeps focus on AI interaction
- Responsive flow: Seamless experience across all devices
- Professional simplicity: Modern without unnecessary decoration

## Typography System

**Font Stack:**
- Primary: Inter (Google Fonts) - clean, readable for UI and messages
- Monospace: JetBrains Mono - for code blocks in AI responses

**Hierarchy:**
- App title/branding: text-xl font-semibold
- Message content: text-base leading-relaxed
- Timestamps: text-xs
- Input placeholder: text-sm
- Code blocks: text-sm font-mono
- System messages: text-sm italic

## Layout & Spacing

**Spacing System:**
Primary units: 2, 4, 6, 8, 12, 16 (Tailwind scale)
- Message padding: p-4 to p-6
- Message gaps: space-y-4
- Container padding: px-4 md:px-6
- Input area padding: p-4

**Container Structure:**
- Maximum content width: max-w-4xl (centered for readability)
- Chat viewport: Full height minus header and input (dynamic)
- Messages container: Scrollable with overflow-y-auto
- Input fixed at bottom: sticky positioning

## Core Components

### Header
- Fixed top bar with app branding
- Height: h-14 to h-16
- Contains: Logo/title (left), optional controls (right)
- Border bottom for separation
- Padding: px-4 py-3

### Chat Container
- Full viewport height calculation (100vh minus header and input)
- Messages flow from top to bottom
- Auto-scroll to latest message
- Padding: p-4 to p-6

### Message Bubbles
**User Messages:**
- Aligned right (ml-auto)
- Max width: max-w-2xl
- Rounded corners: rounded-2xl
- Padding: px-4 py-3
- Margin bottom: mb-4

**AI Messages:**
- Aligned left
- Max width: max-w-3xl (wider for detailed responses)
- Rounded corners: rounded-2xl
- Padding: px-4 py-3
- Margin bottom: mb-4
- Includes typing indicator during generation

**Message Features:**
- Timestamp below each message: text-xs with opacity-60
- Line height for readability: leading-relaxed
- Support for markdown rendering in AI responses
- Code blocks with syntax highlighting (use highlight.js via CDN)

### Input Area
- Fixed/sticky bottom positioning
- Container padding: p-4
- Max width: max-w-4xl (centered)
- Border top for separation

**Input Field:**
- Multi-line textarea (rows: 1, auto-expand up to 5 rows)
- Rounded: rounded-2xl
- Padding: px-4 py-3
- Resize: resize-none (controlled programmatically)
- Focus ring for accessibility

**Send Button:**
- Position: Absolute right inside input container
- Icon-only (paper plane/send icon from Heroicons)
- Size: w-10 h-10
- Rounded: rounded-xl
- Disabled state when input empty

### Typing Indicator
- Three animated dots
- Appears in AI message position during response generation
- Simple pulse animation (opacity-based)
- Gap: gap-1 between dots
- Size: w-2 h-2 per dot

### Empty State
- Centered vertically and horizontally
- Welcome message: text-lg font-medium
- Suggested prompts in grid: grid-cols-1 md:grid-cols-2 gap-3
- Each suggestion as clickable card: p-4 rounded-xl border
- Fade out when conversation starts

### Code Block Rendering
- Full width within message
- Rounded corners: rounded-lg
- Language label in top-right
- Copy button in top-right corner
- Padding: p-4
- Monospace font
- Syntax highlighting via highlight.js

## Responsive Behavior

**Mobile (< 768px):**
- Single column layout
- Reduced padding: p-3 instead of p-6
- Message max-width: max-w-full with mx-4
- Input area: Full width with px-3
- Font sizes: Maintain base sizes (readable on mobile)

**Desktop (≥ 768px):**
- Centered layout with max-w-4xl
- Generous padding: p-6
- Message bubbles with defined max-widths
- Multi-line input more prominent

## Navigation & Controls

**Main Actions:**
- New conversation button (optional in header)
- Clear conversation (confirmation required)
- Settings/preferences icon (if needed)

**Message Actions (on hover):**
- Copy message text
- Regenerate response (AI messages only)
- Edit prompt (user messages only)

## Accessibility

- Semantic HTML: Use proper heading hierarchy, nav elements
- ARIA labels: Clear labels for icon buttons
- Keyboard navigation: Tab through messages, Enter to send
- Focus states: Visible focus rings on all interactive elements
- Screen reader: Announce new messages via aria-live regions
- Contrast: Ensure text readable against backgrounds

## Icons
**Library:** Heroicons (CDN)
**Usage:**
- Send icon: PaperAirplaneIcon
- New chat: PlusIcon
- Settings: Cog6ToothIcon
- Copy: ClipboardDocumentIcon
- Clear: TrashIcon

## Images
**No hero images needed** - this is a functional chat interface, not a landing page.

**Profile/Avatar Icons:**
- User avatar: 8x8 rounded circle (can use initials or icon)
- AI avatar: 8x8 rounded circle with robot/AI icon
- Position: Inline with message start

## Animations
**Minimal animations only:**
- Message slide-in: Subtle translate-y animation when new message appears
- Typing indicator: Gentle pulse opacity animation
- Button states: Standard hover/active transitions (handled by component)
- No scroll animations, no parallax effects

## Performance Considerations
- Virtualize long conversation histories (render only visible messages)
- Lazy load code highlighting library
- Debounce auto-expand textarea
- Optimize re-renders with proper React keys on messages