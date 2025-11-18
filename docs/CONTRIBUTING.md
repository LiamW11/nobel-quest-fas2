# Contributing to Nobel Quest

Thank you for contributing to Nobel Quest! This guide will help you get started.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Pull Request Process](#pull-request-process)
6. [Team Responsibilities](#team-responsibilities)

---

## Code of Conduct

### Our Pledge

We are committed to creating a welcoming and inclusive environment for all team members.

**We expect all contributors to:**
- ✅ Be respectful and constructive
- ✅ Help each other learn and grow
- ✅ Ask questions when uncertain
- ✅ Give and receive feedback gracefully
- ✅ Focus on what's best for the project

**Unacceptable behavior:**
- ❌ Disrespectful or discriminatory comments
- ❌ Personal attacks or harassment
- ❌ Publishing others' private information
- ❌ Copying code without attribution
- ❌ Committing directly to `main` branch

---

## Getting Started

### 1. Clone the Repository

```powershell
git clone https://github.com/TE4-Academy/nobel-quest-fas2.git
cd nobel-quest-fas2
```

### 2. Set Up Your Environment

Follow the [Setup Guide](SETUP.md) to configure Firebase and local development.

### 3. Find an Issue to Work On

1. Go to [GitHub Issues](https://github.com/TE4-Academy/nobel-quest-fas2/issues)
2. Look for issues labeled:
   - `good first issue` - Easy tasks for beginners
   - `help wanted` - Tasks needing assignees
   - `team:your-team` - Tasks for your team
3. Comment on the issue: "I'd like to work on this"
4. Wait for assignment (or self-assign if you have permission)

### 4. Create a Feature Branch

```powershell
# Get latest code
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Example branch names:
# feature/match-master-card-flip
# feature/timeline-drag-drop
# fix/leaderboard-sorting
# docs/update-readme
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code improvements without changing behavior
- `test/` - Adding or updating tests

---

## Development Workflow

### Daily Workflow

```powershell
# 1. Start your day - get latest code
git checkout main
git pull origin main
git checkout your-feature-branch
git merge main  # Merge latest changes into your branch

# 2. Make changes
# Edit files...

# 3. Test your changes
# Open in browser, test manually

# 4. Commit frequently (every logical change)
git add .
git commit -m "Add card flip animation"

# 5. Push to GitHub
git push origin your-feature-branch

# 6. When feature is complete, create Pull Request
```

### Commit Message Guidelines

**Format:**
```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation change
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat: add card flip animation to match master

Added CSS transitions for smooth card flipping.
Animation duration is 300ms with ease-out timing.

Closes #23
```

```
fix: leaderboard sorting incorrect

Fixed bug where scores were sorting alphabetically
instead of numerically. Added parseInt() conversion.

Fixes #45
```

**Tips:**
- ✅ Use present tense ("add" not "added")
- ✅ Keep subject under 50 characters
- ✅ Explain *what* and *why*, not *how*
- ✅ Reference issue numbers (`Closes #123`)

---

## Coding Standards

### JavaScript Style Guide

#### 1. Use Modern ES6+ Features

```javascript
// ✅ Good
const scores = await NobelRepo.getLeaderboard('match-master');
const topScore = scores[0];

// ❌ Avoid
var scores = []; // Use const/let instead
```

#### 2. Use Descriptive Names

```javascript
// ✅ Good
const calculateFinalScore = (baseScore, timeBonus) => {
  return baseScore + timeBonus;
};

// ❌ Avoid
const calc = (x, y) => x + y; // What does this calculate?
```

#### 3. Add Comments for Complex Logic

```javascript
// ✅ Good
// Calculate bonus points based on remaining time
// 10 points per second remaining, max 300 points
const timeBonus = Math.min(remainingSeconds * 10, 300);

// ❌ Avoid
const timeBonus = Math.min(remainingSeconds * 10, 300); // No comment
```

#### 4. Use Async/Await for Promises

```javascript
// ✅ Good
async function submitScore(score) {
  try {
    await NobelRepo.submitScore('match-master', score, timeElapsed);
    NobelUI.showToast('Score saved!', 'success');
  } catch (error) {
    NobelUI.showToast('Failed to save score', 'error');
  }
}

// ❌ Avoid
function submitScore(score) {
  NobelRepo.submitScore('match-master', score, timeElapsed)
    .then(() => NobelUI.showToast('Score saved!', 'success'))
    .catch(error => NobelUI.showToast('Failed to save score', 'error'));
}
```

#### 5. Avoid Global Variables

```javascript
// ✅ Good - Module pattern
const GameState = {
  score: 0,
  level: 1,
  isPlaying: false
};

// ❌ Avoid
let score = 0;      // Global scope
let level = 1;      // Hard to track
let isPlaying = false;
```

#### 6. Error Handling is Required

```javascript
// ✅ Good
async function loadData() {
  try {
    const data = await fetch('/api/data');
    return data.json();
  } catch (error) {
    console.error('Failed to load data:', error);
    NobelUI.showToast('Error loading data', 'error');
    return null;
  }
}

// ❌ Avoid
async function loadData() {
  const data = await fetch('/api/data'); // No error handling!
  return data.json();
}
```

### HTML Best Practices

```html
<!-- ✅ Good -->
<button id="start-btn" class="nobel-btn nobel-btn-primary" aria-label="Start game">
  Start Game
</button>

<!-- ❌ Avoid -->
<button onclick="startGame()">Start</button> <!-- Inline handlers, no classes -->
```

### CSS Best Practices

```css
/* ✅ Good - Use Tailwind utilities */
<div class="bg-white rounded-lg shadow-lg p-6">

/* ✅ Good - Custom CSS for game-specific styles */
.card {
  transition: transform 0.3s ease-out;
}

.card:hover {
  transform: translateY(-4px);
}

/* ❌ Avoid - Inline styles */
<div style="background: white; padding: 20px;">
```

### File Organization

```
apps/match-master/
├── index.html          # Main HTML file
├── js/
│   ├── config.js      # Configuration and initialization
│   ├── game.js        # Game logic
│   └── ui.js          # UI rendering
├── css/
│   └── game.css       # Game-specific styles
└── netlify.toml       # Deployment config
```

**Guidelines:**
- ✅ One concern per file (separation of concerns)
- ✅ Keep files under 300 lines
- ✅ Group related functions together
- ✅ Put constants at top of file

---

## Pull Request Process

### Before Creating PR

**Checklist:**
- [ ] Code follows style guidelines
- [ ] Tested in browser (Chrome + Firefox minimum)
- [ ] Tested on mobile (or responsive mode)
- [ ] No console errors
- [ ] Committed with descriptive messages
- [ ] Synced with latest `main` branch

### Creating a Pull Request

1. **Push your branch:**
   ```powershell
   git push origin feature/your-feature
   ```

2. **Go to GitHub repository**

3. **Click "Compare & pull request"**

4. **Fill out PR template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Documentation
   - [ ] Refactoring

   ## Testing
   - [ ] Tested in Chrome
   - [ ] Tested in Firefox
   - [ ] Tested on mobile

   ## Screenshots (if UI changes)
   [Add screenshots here]

   ## Related Issues
   Closes #123
   ```

5. **Request review from team:**
   - GitHub will auto-request based on CODEOWNERS
   - Or manually add reviewers

6. **Wait for review** (usually 1 day max)

### Review Process

**As a Reviewer:**
1. ✅ Check code quality and style
2. ✅ Test the changes locally
3. ✅ Leave constructive comments
4. ✅ Approve if good, or request changes

**Example Review Comments:**
```
✅ Good comment:
"Great work! Consider extracting this into a helper function 
for better reusability. See line 45."

❌ Bad comment:
"This is wrong." (Not helpful, no explanation)
```

**As an Author:**
1. ✅ Address all review comments
2. ✅ Make requested changes
3. ✅ Push updates
4. ✅ Reply to comments when done

### Merging

**Requirements:**
- ✅ At least 1 approval from code owner
- ✅ All CI checks passing
- ✅ No merge conflicts
- ✅ All conversations resolved

**Who merges:**
- Platform team merges shared code PRs
- Game teams merge their own PRs (after approval)

**Merge method:** Squash and merge (keeps history clean)

---

## Team Responsibilities

### Team Platform

**Ownership:**
- `/shared/` - All shared modules
- `/firebase/` - Database and security rules
- `/.github/` - CI/CD and workflows
- Root config files

**Duties:**
- ✅ Maintain shared code quality
- ✅ Help game teams with integration issues
- ✅ Review all PRs touching shared code
- ✅ Monitor Firebase usage and errors
- ✅ Keep documentation updated
- ✅ Manage deployments

**Weekly Tasks:**
- Review Firebase console for errors
- Check CI pipeline status
- Update dependencies if needed
- Hold office hours for questions

### Team Match Master

**Ownership:**
- `/apps/match-master/` - All game code

**Duties:**
- ✅ Implement memory matching game
- ✅ Integrate auth and repository modules
- ✅ Build leaderboard UI
- ✅ Test on mobile and desktop
- ✅ Review PRs from team members

**Deliverables:**
- Functional match master game
- Integration with Firebase
- Polished UI
- Documentation of game mechanics

### Team Timeline

**Ownership:**
- `/apps/timeline/` - All game code

**Duties:** (Same as Match Master, for Timeline game)

### Team Trivia Rush

**Ownership:**
- `/apps/trivia-rush/` - All game code

**Duties:** (Same as Match Master, for Trivia Rush game)

---

## Communication

### Channels

- **GitHub Issues** - Task tracking and bug reports
- **GitHub Discussions** - Questions and ideas
- **Pull Request comments** - Code review
- **[Your team chat]** - Quick questions

### Stand-ups (Recommended)

**Daily (5-10 minutes):**
1. What did you do yesterday?
2. What will you do today?
3. Any blockers?

**Format:** Async in chat or quick video call

### Asking for Help

**Before asking:**
1. Read documentation
2. Search GitHub Issues
3. Check browser console for errors
4. Try debugging with `console.log()`

**When asking:**
```
❌ Bad: "It doesn't work"

✅ Good: 
"I'm trying to submit a score but getting this error:
[paste error message]

I've checked:
- User is logged in ✅
- Firebase config is correct ✅
- Console shows: [paste console output]

Code: [link to file or paste relevant snippet]
```

---

## Common Tasks

### Adding a New Feature

1. Create issue describing the feature
2. Get approval from team/teacher
3. Create feature branch
4. Implement feature
5. Test thoroughly
6. Create PR
7. Address review feedback
8. Merge when approved

### Fixing a Bug

1. Create issue describing the bug
2. Reproduce the bug locally
3. Create fix branch
4. Fix and test
5. Create PR referencing issue
6. Merge when approved

### Updating Documentation

1. Edit `.md` files
2. Preview changes (VS Code has Markdown preview)
3. Create PR
4. Merge when approved (usually quick)

---

## Tips for Success

### Do's ✅
- Commit small, focused changes
- Test before pushing
- Write descriptive commit messages
- Ask questions early
- Help teammates when stuck
- Review others' code carefully
- Keep branches up to date

### Don'ts ❌
- Don't commit directly to `main`
- Don't push broken code
- Don't ignore CI failures
- Don't copy code without understanding
- Don't leave TODOs forever
- Don't merge without approval

---

## Resources

### Learning Resources
- [JavaScript ES6 Features](https://es6-features.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Git Basics](https://git-scm.com/book/en/v2)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Tools
- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) - Debugging
- [GitHub Desktop](https://desktop.github.com/) - Git GUI (alternative to CLI)

---

**Questions?** Open a GitHub Discussion or ask your team lead!

**Happy coding! 🚀**
