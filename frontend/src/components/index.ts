/**
 * Components Index
 * 
 * Central export file for all UI components in the DevFeed application.
 * 
 * Usage:
 * import Navbar from './components/navbar.astro';
 * import Searchbar from './components/searchbar.astro';
 * import PostCard from './components/postcard.astro';
 * import Highlights from './components/highlights.astro';
 * import RecentThreads from './components/recentthreads.astro';
 * import RightSidebar from './components/rightsidebar.astro';
 * import MainContent from './components/maincontent.astro';
 * import Layout from './components/layout.astro';
 */

// ============================================================================
// COMPONENT DOCUMENTATION
// ============================================================================

/**
 * NAVBAR
 * ------
 * Fixed left sidebar navigation component
 * 
 * Features:
 * - Logo and branding
 * - New Post button with modal integration
 * - Main navigation menu (Home, Explore, Top Liked, Notifications, Messages)
 * - Top Developers section (scrollable)
 * - Settings, Support, and User Profile
 * 
 * File: navbar.astro
 * Usage: <Navbar />
 */

/**
 * SEARCHBAR
 * ---------
 * Search input component with icon
 * 
 * Features:
 * - Rounded search input field
 * - Focus states and transitions
 * - Material Design icon
 * 
 * File: searchbar.astro
 * Props: None (Stateless)
 * Usage: <Searchbar />
 */

/**
 * POSTCARD
 * --------
 * Individual post/thread display component
 * 
 * Props:
 * - author (string): Post author name
 * - handle (string): Author's @ handle
 * - avatar (string): URL to author's profile picture
 * - timestamp (string): Post time (e.g., "2h ago")
 * - title? (string): Optional post title
 * - content (string): Post body content
 * - likes? (number): Number of likes
 * - replies? (number): Number of replies
 * - reposts? (number): Number of reposts
 * - image? (string): Optional image URL for post
 * 
 * Features:
 * - User profile with avatar
 * - Post content with optional title and image
 * - Engagement metrics (likes, replies, reposts)
 * - Action buttons (comment, repost, like, share)
 * - Hover effects and transitions
 * 
 * File: postcard.astro
 * Usage:
 * <PostCard
 *   author="Elena Vance"
 *   handle="@curator_vance"
 *   avatar="https://..."
 *   timestamp="2h"
 *   content="Post content here..."
 *   likes={80}
 *   replies={4}
 *   reposts={2}
 * />
 */

/**
 * HIGHLIGHTS
 * ----------
 * Featured/Curator Intelligence section component
 * 
 * Props:
 * - items? (HighlightItem[]): Array of highlight items
 *   - title (string): Highlight title
 *   - description (string): Full description text
 *   - insights? (string[]): Array of insight paragraphs
 *   - buttons? (Array): Call-to-action buttons
 *
 * Features:
 * - Featured content cards
 * - Icon badges
 * - Rich insights section
 * - Action buttons
 * - Hover effects
 * 
 * File: highlights.astro
 * Usage:
 * <Highlights
 *   items={[{
 *     title: "Example Title",
 *     description: "Description text...",
 *     insights: ["Insight 1"],
 *     buttons: [{ label: "Action" }]
 *   }]}
 * />
 */

/**
 * RECENTTHREADS
 * --------------
 * Recent discussions/threads list component
 * 
 * Props:
 * - threads? (ThreadItem[]): Array of thread items
 *   - title (string): Thread title
 *   - link (string): Thread URL/path
 *   - category? (string): Thread category
 * - title? (string): Section title (default: "Recent Threads")
 * 
 * Features:
 * - List of clickable thread titles
 * - Category badges
 * - Hover animations
 * - Bookmark icons
 * 
 * File: recentthreads.astro
 * Usage:
 * <RecentThreads
 *   title="Popular Threads"
 *   threads={[{
 *     title: "Thread Title",
 *     link: "/thread/1",
 *     category: "AI"
 *   }]}
 * />
 */

/**
 * RIGHTSIDEBAR
 * ------------
 * Right sidebar with metrics and statistics
 * 
 * Props:
 * - title? (string): Section title (default: "Cognitive Load Index")
 * - items? (SidebarItem[]): Array of stat items
 *   - label (string): Stat label
 *   - value (string | number): Stat value
 *   - change? (string): Change indicator
 * 
 * Features:
 * - Analytics/metrics display
 * - Multiple stat cards
 * - Change indicators
 * - Info footer
 * - Responsive (hidden on screens < 1024px)
 * 
 * File: rightsidebar.astro
 * Usage:
 * <RightSidebar
 *   title="Statistics"
 *   items={[
 *     { label: "Total Users", value: "1,247", change: "↑ 23%" }
 *   ]}
 * />
 */

/**
 * MAINCONTENT
 * -----------
 * Main content area wrapper/container
 * 
 * Features:
 * - Centered content area
 * - Responds to navbar/sidebar widths
 * - Border styling
 * - Responsive layout adjustments
 * 
 * File: maincontent.astro
 * Usage:
 * <MainContent>
 *   <YourContent />
 * </MainContent>
 */

/**
 * LAYOUT
 * ------
 * Complete page layout combining all components
 * 
 * Props:
 * - title? (string): Page title (default: "DevFeed")
 * 
 * Includes:
 * - Full HTML structure
 * - Global styles and scrollbar styling
 * - Font imports (Inter, Material Symbols)
 * - All major components (Navbar, Searchbar, Highlights, etc.)
 * - Responsive layout setup
 * 
 * File: layout.astro
 * Usage:
 * <Layout title="My Page">
 *   <PostCard ... />
 *   <PostCard ... />
 * </Layout>
 */

// ============================================================================
// COMPONENT ARCHITECTURE
// ============================================================================

/*
Page Structure:
┌─────────────────────────────────────────────────────────────┐
│                        LAYOUT                               │
├─────────┬──────────────────────────────────┬─────────────────┤
│ NAVBAR  │         MAINCONTENT              │  RIGHTSIDEBAR   │
│         ├──────────────────────────────────┤                 │
│         │ [Header - Home]                  │                 │
│         ├──────────────────────────────────┤                 │
│         │ SEARCHBAR                        │                 │
│         ├──────────────────────────────────┤                 │
│         │ HIGHLIGHTS                       │                 │
│         │                                  │                 │
│         ├──────────────────────────────────┤                 │
│         │ RECENTTHREADS                    │                 │
│         │                                  │                 │
│         ├──────────────────────────────────┤                 │
│         │ POSTCARD                         │                 │
│         │ POSTCARD                         │                 │
│         │ POSTCARD                         │                 │
│         │ ...                              │                 │
│         │                                  │                 │
└─────────┴──────────────────────────────────┴─────────────────┘

Responsiveness:
- Desktop (>1024px): All 3 columns visible
- Tablet (768-1024px): No right sidebar
- Mobile (<768px): Full width, navbar collapses
*/

// ============================================================================
// STYLING GUIDELINES
// ============================================================================

/*
Color Palette:
- Background: #0f1419 (main), #171c21 (card)
- Text: white (primary), #99cbff (secondary), #64748b (tertiary)
- Borders: #30353b
- Accent: #1d9bf0 (primary blue)
- Hover: #1d2d3d

Shadows:
- Standard: shadow-lg shadow-#1d9bf0/10
- Hover: shadow-xl shadow-#1d9bf0/20

Transitions:
- Duration: duration-200 (standard)
- Effects: hover:brightness-110, hover:scale-[1.02]

Typography:
- Sans-serif: Inter (system fonts fallback)
- Material Symbols for icons
- Font sizes: text-sm (12px), text-base (16px), text-lg (18px), text-xl (20px)
*/

export default "index";
