# Nobel Quest - Architecture

This document explains the technical architecture and design decisions for the Nobel Quest project.

## System Overview

```
┌─────────────────┐
│   Player        │
│   (Browser)     │
└────────┬────────┘
         │
         │ HTTPS
         │
         ▼
┌─────────────────────────────────────┐
│   Game App (Static HTML/JS)         │
│   - Match Master / Timeline / Trivia│
│   - Hosted on Netlify               │
└────────┬────────────────────────────┘
         │
         │ Import
         │
         ▼
┌─────────────────────────────────────┐
│   Shared Modules (/shared/)         │
│   - auth.js                         │
│   - repository.js                   │
│   - ui-components.js                │
└────────┬────────────────────────────┘
         │
         │ Firebase SDK
         │
         ▼
┌─────────────────────────────────────┐
│   Firebase (Backend)                │
│   ├─ Authentication (Google)        │
│   └─ Firestore (Database)           │
└─────────────────────────────────────┘
```

## Architecture Decisions

### 1. Monorepo Structure

**Decision:** Single repository with multiple apps and shared code.

**Rationale:**
- ✅ Easy code sharing between games
- ✅ Consistent tooling and standards
- ✅ Simplified dependency management
- ✅ Easier to onboard new developers
- ✅ Better for learning collaborative development

**Alternatives Considered:**
- ❌ Multi-repo (3 separate repositories): Too complex for 11 students, hard to share code
- ❌ Single-app with game switching: Doesn't teach modular architecture

### 2. Vanilla JavaScript (No Framework)

**Decision:** ES6 JavaScript without React/Vue/Angular.

**Rationale:**
- ✅ Students already know vanilla JS
- ✅ No build step (faster development)
- ✅ No npm dependencies (simpler setup)
- ✅ Focus on code quality, not framework learning
- ✅ Easier debugging for beginners
- ✅ Faster load times (no framework overhead)

**Alternatives Considered:**
- ❌ React: Steeper learning curve, requires build tools
- ❌ Vue: Same issues as React
- ❌ Svelte: Too new, less documentation

### 3. Firebase for Backend

**Decision:** Firebase Authentication + Firestore Database.

**Rationale:**
- ✅ **Free tier** handles 800 users easily
- ✅ No server code needed (fully managed)
- ✅ Google OAuth built-in (2 lines of code)
- ✅ Real-time database (live leaderboards)
- ✅ Excellent documentation
- ✅ Easy to learn and use
- ✅ Scales automatically

**Alternatives Considered:**
- ❌ Supabase: More complex setup, overkill for this project
- ❌ Custom Node.js backend: Requires server hosting, more code to maintain
- ❌ LocalStorage only: Can't share scores across devices/users

### 4. Netlify for Hosting

**Decision:** Deploy each game as separate Netlify site.

**Rationale:**
- ✅ **Free tier** covers bandwidth needs
- ✅ Auto-deploy from GitHub (no manual uploads)
- ✅ HTTPS by default (required for OAuth)
- ✅ Global CDN (fast worldwide)
- ✅ Easy rollbacks (deployment history)
- ✅ Team-friendly (each team deploys independently)

**Alternatives Considered:**
- ❌ Firebase Hosting: Requires build step, less flexible
- ❌ GitHub Pages: HTTPS issues with custom domains
- ❌ Vercel: Similar to Netlify but less generous free tier

### 5. Separate Netlify Sites (Not Monolith)

**Decision:** 3 separate sites instead of 1 site with routing.

**Rationale:**
- ✅ **Independent deployments** (teams don't block each other)
- ✅ Easier rollbacks (per-game, not all-or-nothing)
- ✅ Simpler URL structure (`nobel-match-master.netlify.app`)
- ✅ No routing logic needed
- ✅ Better for learning CI/CD

**Trade-offs:**
- ⚠️ Shared code duplicated in each deployment (acceptable, it's just JS files)
- ⚠️ 3 Netlify sites to manage (still free tier)

### 6. Module Pattern (No npm Packages)

**Decision:** Use browser modules (`<script>` tags) instead of npm/webpack.

**Rationale:**
- ✅ Zero build configuration
- ✅ Instant reload (no compilation)
- ✅ Easier for students to understand
- ✅ Works in any browser without polyfills
- ✅ Simpler debugging (source maps not needed)

**How it works:**
```html
<!-- Load Firebase -->
<script src="CDN/firebase.js"></script>

<!-- Load shared modules -->
<script src="../../shared/firebase-config.js"></script>
<script src="../../shared/js/auth.js"></script>
<script src="../../shared/js/repository.js"></script>

<!-- Load game code -->
<script src="js/game.js"></script>
```

Each module attaches to `window` object:
```javascript
// In shared/js/auth.js
window.NobelAuth = { ... };

// In game code
NobelAuth.loginWithGoogle();
```

## Data Model

### Firestore Collections

#### `scores` Collection
```javascript
{
  id: "auto-generated",
  userId: "firebase-auth-uid",
  userName: "John Doe",
  userEmail: "john@school.com",
  gameId: "match-master" | "timeline" | "trivia-rush",
  score: 1500,
  timeSeconds: 45,
  metadata: {
    // Game-specific data
    matches: 12,
    difficulty: "medium"
  },
  timestamp: Timestamp
}
```

**Indexes:**
1. `(gameId, score DESC, timestamp ASC)` - For leaderboards
2. `(gameId, userId, score DESC)` - For user's best scores
3. `(userId, timestamp DESC)` - For user's recent games

#### `progress` Collection (Optional)
```javascript
{
  id: "{userId}_{gameId}",  // Composite key
  userId: "firebase-auth-uid",
  gameId: "match-master",
  data: {
    // Game-specific state
    level: 3,
    completed: true,
    unlocks: ["achievement1"]
  },
  updatedAt: Timestamp
}
```

## Security Model

### Firestore Security Rules

**Principle:** Read is public, write is authenticated and validated.

```javascript
// Anyone can read scores (for leaderboards)
allow read: if true;

// Only authenticated users can create scores
// Score must belong to the authenticated user
// No updates/deletes (immutable scores)
allow create: if request.auth != null
              && request.resource.data.userId == request.auth.uid
              && request.resource.data.score >= 0;

allow update, delete: if false;
```

**Why immutable scores?**
- Prevents cheating (can't edit score after submission)
- Simpler logic (no need to handle updates)
- Better for auditing (all scores preserved)

**Anti-Cheat Measures:**
1. ✅ Firestore rules enforce userId matches auth
2. ✅ Scores validated server-side (must be number >= 0)
3. ⚠️ Client-side validation only (scores can still be faked)

**For Production (Future):**
- Add server-side score validation (Cloud Functions)
- Add rate limiting (max X scores per hour)
- Add anomaly detection (impossible scores flagged)

## Authentication Flow

```
┌─────────┐
│ Player  │
└────┬────┘
     │ 1. Click "Login"
     ▼
┌─────────────────┐
│ NobelAuth.      │
│ loginWithGoogle()│
└────┬────────────┘
     │ 2. Show popup
     ▼
┌─────────────────┐
│ Google Sign-In  │
│ (Firebase)      │
└────┬────────────┘
     │ 3. User authenticates
     ▼
┌─────────────────┐
│ Firebase Auth   │
│ Returns user    │
└────┬────────────┘
     │ 4. onAuthStateChanged
     ▼
┌─────────────────┐
│ Game Unlocked   │
│ Show player name│
└─────────────────┘
```

**Key Points:**
- Firebase handles all OAuth complexity
- No passwords stored (Google manages that)
- User profile (name, email) from Google
- Unique user ID from Firebase

## Shared Code Architecture

### Module: `auth.js`

**Purpose:** Wrap Firebase Authentication with simple API.

**API:**
```javascript
await NobelAuth.loginWithGoogle()      // Returns user object
await NobelAuth.logout()                // Logs out user
const user = NobelAuth.getCurrentUser() // Get current user or null
NobelAuth.onAuthChange(callback)        // Listen to auth changes
```

**Why wrapper?**
- Abstracts Firebase details
- Consistent API across games
- Easier to test/mock
- Could swap Firebase later

### Module: `repository.js`

**Purpose:** Wrap Firestore operations.

**API:**
```javascript
await NobelRepo.submitScore(gameId, score, timeSeconds)
const leaderboard = await NobelRepo.getLeaderboard(gameId, limit)
const userScores = await NobelRepo.getUserScores(gameId)
await NobelRepo.saveProgress(gameId, data)
const progress = await NobelRepo.loadProgress(gameId)
```

**Why wrapper?**
- Hide Firestore complexity
- Type-safe operations
- Error handling in one place
- Could add caching later

### Module: `ui-components.js`

**Purpose:** Reusable UI helpers.

**API:**
```javascript
NobelUI.showToast(message, type)
NobelUI.showLoading() / hideLoading()
NobelUI.renderLeaderboard(scores, containerId)
NobelUI.showConfirm(message, onConfirm)
```

**Why shared UI?**
- Consistent look/feel across games
- DRY principle
- Easier to update UI globally

## CI/CD Pipeline

```
┌──────────────┐
│ Push to main │
└──────┬───────┘
       │
       ▼
┌────────────────────┐
│ GitHub Actions     │
│ ├─ Validate JS     │
│ ├─ Security check  │
│ └─ Test build      │
└──────┬─────────────┘
       │ If passed
       ▼
┌────────────────────┐
│ Netlify Auto-Deploy│
│ ├─ Match Master    │
│ ├─ Timeline        │
│ └─ Trivia Rush     │
└────────────────────┘
```

**Why simple CI?**
- No tests (yet) - focus on code quality
- Validates syntax only
- Checks for common mistakes
- Fast feedback (<1 minute)

## Performance Considerations

### Load Time Optimization
- ✅ Firebase SDK from CDN (cached globally)
- ✅ Tailwind from CDN (fast)
- ✅ No large dependencies
- ✅ Minimal JavaScript (<50KB total)
- ✅ Images lazy-loaded (or placeholders)

**Expected Load Time:** <2 seconds on 3G

### Database Optimization
- ✅ Firestore indexes for fast queries
- ✅ Limit leaderboard to top 10 (not fetching all)
- ✅ Read cache (Firestore auto-caches)
- ⚠️ No pagination (okay for 800 users)

### Scalability
**Current limits (free tier):**
- 50K reads/day = 5K users × 10 leaderboard checks ✅
- 20K writes/day = 5K score submissions ✅
- 800 users/day well within limits ✅

**If scaling needed:**
1. Use Firestore snapshot listeners (real-time updates)
2. Add client-side caching (localStorage)
3. Implement pagination for leaderboards
4. Upgrade to Firebase Blaze plan (pay-as-you-go)

## Error Handling Strategy

### Client-Side Errors
```javascript
try {
  await NobelRepo.submitScore(...);
  NobelUI.showToast('Score saved!', 'success');
} catch (error) {
  console.error(error);
  NobelUI.showToast('Failed to save score', 'error');
  // Optionally: save to localStorage as backup
}
```

### Offline Support (Future)
- Detect offline: `!navigator.onLine`
- Queue writes to localStorage
- Sync when back online

## Testing Strategy

### Manual Testing Checklist
- [ ] Login works on all games
- [ ] Scores save correctly
- [ ] Leaderboards show correct order
- [ ] Mobile responsive
- [ ] Works in Chrome, Firefox, Safari

### Automated Testing (Future)
- Unit tests for shared modules (Jest)
- E2E tests for game flows (Playwright)
- Visual regression tests (Percy)

## Future Enhancements

### Phase 3 Ideas
1. **User profiles** - Avatar, bio, achievements
2. **Global leaderboard** - Cross-game rankings
3. **Achievements system** - Badges for milestones
4. **Social features** - Share scores, challenge friends
5. **Admin dashboard** - Manage games, view analytics
6. **Real-time multiplayer** - Compete live
7. **Mobile app** - PWA or React Native

### Technical Debt
- [ ] Add TypeScript for better type safety
- [ ] Add unit tests for shared modules
- [ ] Implement proper error monitoring (Sentry)
- [ ] Add analytics (Google Analytics)
- [ ] Optimize images (compress, WebP)
- [ ] Add service worker (PWA, offline mode)

## Lessons Learned (To Be Updated)

*This section will be filled after the project is complete.*

---

**Questions?** Open a GitHub Discussion or ask the Platform team.
