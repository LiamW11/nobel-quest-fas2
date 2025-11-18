# GitHub Repository & Project Setup Guide

This guide explains how to set up the Nobel Quest repository in the TE4-Academy organization and configure GitHub Projects for team collaboration.

## Part 1: Repository Setup

### Step 1: Create Repository

1. **Navigate to TE4-Academy organization:**
   - Go to https://github.com/TE4-Academy

2. **Create new repository:**
   - Click "New repository" (green button)
   - Or go to: https://github.com/organizations/TE4-Academy/repositories/new

3. **Configure repository:**
   ```
   Repository name: nobel-quest-fas2
   Description: Nobel Prize educational games - Phase 2 production version
   Visibility: ○ Public  ● Private  (choose based on your preference)
   
   ⬜ Add a README file (We already have one)
   ⬜ Add .gitignore (We already have one)
   ⬜ Choose a license (Optional)
   ```

4. **Click "Create repository"**

### Step 2: Push Local Code

```powershell
# Navigate to your local project
cd C:\Users\herkommer\DEV\Arpad\TE4-Academy\nobel\fas-2

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Nobel Quest Fas 2 monorepo setup

- Monorepo structure with 3 games (match-master, timeline, trivia-rush)
- Shared modules (auth, repository, ui-components, utils)
- Firebase configuration and security rules
- GitHub Actions CI pipeline
- Comprehensive documentation
- Netlify deployment configs"

# Add remote
git remote add origin https://github.com/TE4-Academy/nobel-quest-fas2.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Create Development Branch

```powershell
# Create develop branch for ongoing work
git checkout -b develop
git push -u origin develop
```

**Branch strategy:**
- `main` - Production-ready code only
- `develop` - Integration branch for features
- `feature/*` - Individual feature branches

### Step 4: Configure Repository Settings

#### A. General Settings

1. Go to **Settings** tab
2. Under "General":
   - ✅ Require contributors to sign off on web-based commits
   - ✅ Automatically delete head branches (keeps repo clean)

#### B. Collaborators and Teams

1. Go to **Settings > Collaborators and teams**
2. Click "Add teams"
3. Add teams with appropriate permissions:

   | Team | Permission Level |
   |------|-----------------|
   | team-platform | Admin |
   | team-match-master | Write |
   | team-timeline | Write |
   | team-trivia-rush | Write |

**Note:** You need to create teams first (see Part 2).

#### C. Branch Protection Rules

1. Go to **Settings > Branches**
2. Click "Add branch protection rule"

**For `main` branch:**
```
Branch name pattern: main

Protect matching branches:
✅ Require a pull request before merging
   ✅ Require approvals (1)
   ✅ Dismiss stale pull request approvals when new commits are pushed
   ✅ Require review from Code Owners

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   Select: validate, security-check, test-build (from CI)

✅ Require conversation resolution before merging

✅ Require linear history

✅ Include administrators (enforce rules for everyone)

❌ Allow force pushes
❌ Allow deletions
```

3. Click "Create"

**For `develop` branch (optional, less strict):**
```
Branch name pattern: develop

✅ Require a pull request before merging
   ✅ Require approvals (1)
✅ Require status checks to pass
```

---

## Part 2: GitHub Teams Setup

### Step 1: Create Teams

1. Go to **TE4-Academy organization > Teams** tab
2. Or visit: https://github.com/orgs/TE4-Academy/teams

### Step 2: Create Team Platform

1. Click "New team"
2. Fill in:
   ```
   Team name: team-platform
   Description: Platform team - Manages shared services and infrastructure
   Parent team: (none)
   Visibility: ○ Visible  ● Secret
   ```
3. Click "Create team"
4. Add team members:
   - Click "Members" tab
   - Click "Add a member"
   - Search and add 2 platform team members
   - Set role: "Member"

### Step 3: Create Game Teams

Repeat for each game team:

**Team Match Master:**
```
Team name: team-match-master
Description: Match Master game development team
Parent team: (none)
```
Add 3 members.

**Team Timeline:**
```
Team name: team-timeline
Description: Timeline game development team
Parent team: (none)
```
Add 3 members.

**Team Trivia Rush:**
```
Team name: team-trivia-rush
Description: Trivia Rush game development team
Parent team: (none)
```
Add 3 members.

### Step 4: Give Teams Repository Access

For each team:
1. Go to team page
2. Click "Repositories" tab
3. Click "Add repository"
4. Search for "nobel-quest-fas2"
5. Set permission:
   - **team-platform:** Admin
   - **Other teams:** Write
6. Click "Add repository"

---

## Part 3: GitHub Projects Setup

### Step 1: Create Project Board

1. Go to **TE4-Academy organization > Projects** tab
2. Or visit: https://github.com/orgs/TE4-Academy/projects
3. Click "New project"
4. Choose template: **Board**
5. Name: `Nobel Quest - Fas 2 Development`
6. Description: `Task tracking for Nobel Quest Phase 2`
7. Click "Create project"

### Step 2: Configure Board Columns

Default columns are fine, but rename them:
1. **Backlog** → Keep as is
2. **Todo** → Keep as is
3. **In Progress** → Keep as is
4. **Done** → Keep as is

**Or create custom columns:**
- 📋 **Backlog** - Not yet started
- 🎯 **Ready** - Ready to be worked on
- 🔨 **In Progress** - Currently being worked on
- 👀 **Review** - Pull request open, awaiting review
- ✅ **Done** - Completed and merged

### Step 3: Add Custom Fields

Click "+ Add field" to add:

1. **Team**
   - Type: Single select
   - Options: Platform, Match Master, Timeline, Trivia Rush

2. **Priority**
   - Type: Single select
   - Options: 🔴 High, 🟡 Medium, 🟢 Low

3. **Estimate**
   - Type: Number
   - Description: Story points or hours

4. **Iteration** (optional)
   - Type: Iteration
   - Duration: 1 week

### Step 4: Create Initial Issues

Create issues for each team to get started:

#### Platform Team Issues

**Issue 1: Firebase Setup**
```markdown
Title: Set up Firebase project and configure authentication

Description:
## Tasks
- [ ] Create Firebase project
- [ ] Enable Google Authentication
- [ ] Configure Firestore database
- [ ] Deploy security rules
- [ ] Create Firestore indexes
- [ ] Document Firebase config

## Team
Platform

## Priority
High

## Estimate
4 hours
```

**Issue 2: Shared Modules**
```markdown
Title: Implement and test shared authentication module

Description:
## Tasks
- [ ] Test NobelAuth.loginWithGoogle()
- [ ] Test NobelAuth.logout()
- [ ] Test onAuthChange listener
- [ ] Add error handling
- [ ] Write usage documentation

## Team
Platform

## Priority
High
```

**Issue 3: Repository API Testing**
```markdown
Title: Test and validate repository API

Description:
## Tasks
- [ ] Test submitScore()
- [ ] Test getLeaderboard()
- [ ] Test getUserScores()
- [ ] Test saveProgress() / loadProgress()
- [ ] Validate error handling
- [ ] Performance testing

## Team
Platform

## Priority
High
```

#### Game Team Issues (Template)

```markdown
Title: Implement [Game Name] core game logic

Description:
## Tasks
- [ ] Review Fas-1 code for inspiration
- [ ] Design improved game logic
- [ ] Implement game state management
- [ ] Implement scoring system
- [ ] Implement timer
- [ ] Test game flow

## Team
[Match Master / Timeline / Trivia Rush]

## Priority
High

## Estimate
8 hours
```

Repeat for:
- Game UI implementation
- Authentication integration
- Leaderboard integration
- Mobile responsiveness
- Testing and polish

### Step 5: Create Views

Projects support multiple views for different perspectives:

**View 1: By Team**
1. Click "+" next to views
2. Select "Board"
3. Name: "By Team"
4. Group by: Team
5. Save

**View 2: By Priority**
1. Create new board view
2. Name: "By Priority"
3. Group by: Priority
4. Sort: High → Low

**View 3: Sprint Planning (Table)**
1. Create new table view
2. Name: "Sprint Planning"
3. Show columns: Title, Team, Priority, Estimate, Iteration
4. Filter: Status ≠ Done

### Step 6: Automate with GitHub Actions

Create `.github/workflows/project-automation.yml`:

```yaml
name: Project Automation

on:
  issues:
    types: [opened, reopened]
  pull_request:
    types: [opened, reopened]

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/TE4-Academy/projects/[PROJECT_NUMBER]
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

This auto-adds new issues/PRs to your project board.

---

## Part 4: Issue Labels

### Create Custom Labels

1. Go to **Issues > Labels**
2. Create these labels:

| Label | Color | Description |
|-------|-------|-------------|
| `team:platform` | #7057ff | Platform team tasks |
| `team:match-master` | #1d76db | Match Master team tasks |
| `team:timeline` | #0e8a16 | Timeline team tasks |
| `team:trivia-rush` | #d93f0b | Trivia Rush team tasks |
| `priority:high` | #d73a4a | High priority |
| `priority:medium` | #fbca04 | Medium priority |
| `priority:low` | #0e8a16 | Low priority |
| `good first issue` | #7057ff | Good for newcomers |
| `help wanted` | #008672 | Need help on this |
| `bug` | #d73a4a | Something isn't working |
| `enhancement` | #a2eeef | New feature or request |
| `documentation` | #0075ca | Documentation improvements |
| `question` | #d876e3 | Further information requested |
| `wontfix` | #ffffff | This will not be worked on |

---

## Part 5: Milestones

Create milestones for tracking progress:

1. Go to **Issues > Milestones**
2. Click "New milestone"

**Milestone 1: Infrastructure Setup**
```
Title: Infrastructure Setup
Due date: [1 week from start]
Description: Firebase, shared modules, CI/CD, documentation
```

**Milestone 2: Game Implementation**
```
Title: Game Implementation
Due date: [2 weeks from start]
Description: All three games functional with basic features
```

**Milestone 3: Integration & Polish**
```
Title: Integration & Polish
Due date: [3 weeks from start]
Description: Auth integration, leaderboards, mobile optimization
```

**Milestone 4: Event Ready**
```
Title: Event Ready
Due date: [Event date]
Description: Production deployment, tested with users, documentation complete
```

---

## Part 6: Team Collaboration Setup

### Enable Discussions

1. Go to **Settings > Features**
2. ✅ Enable Discussions
3. Go to **Discussions** tab
4. Create categories:
   - 💡 **Ideas** - New feature ideas
   - ❓ **Q&A** - Questions from team
   - 📣 **Announcements** - Updates from leadership
   - 🎓 **Learning** - Share resources and tips

### Set Up Notifications

**For team members:**
1. Watch the repository (top right)
2. Select "Custom" notifications
3. Enable:
   - ✅ Issues
   - ✅ Pull requests
   - ✅ Discussions
   - ❌ Releases (not needed yet)

### Create Templates

#### Issue Template

Create `.github/ISSUE_TEMPLATE/feature.md`:

```markdown
---
name: Feature Request
about: Suggest a new feature
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Description
Brief description of the feature

## Team
Which team will implement this?
- [ ] Platform
- [ ] Match Master
- [ ] Timeline
- [ ] Trivia Rush

## Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Priority
- [ ] High
- [ ] Medium
- [ ] Low

## Estimate
How long will this take? (hours or story points)
```

#### Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📝 Documentation
- [ ] ♻️ Refactoring
- [ ] 🧪 Tests

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested on mobile
- [ ] No console errors
- [ ] Integrated with shared modules

## Screenshots
(If applicable)

## Related Issues
Closes #[issue number]
```

---

## Part 7: Initial Team Meeting Agenda

### Kickoff Meeting (1 hour)

**Agenda:**
1. **Introduction (10 min)**
   - Project overview
   - Goals and timeline
   - Team structure

2. **Repository Walkthrough (15 min)**
   - Clone repository
   - Show folder structure
   - Explain shared modules
   - Demo existing games from Fas-1

3. **Workflow Demo (15 min)**
   - Create feature branch
   - Make a change
   - Create pull request
   - Code review process

4. **Task Assignment (15 min)**
   - Platform team: Firebase setup
   - Game teams: Review Fas-1 code
   - Everyone: Read documentation

5. **Q&A (5 min)**

**Action Items:**
- [ ] All team members clone repository
- [ ] Platform team starts Firebase setup
- [ ] Game teams review CONTRIBUTING.md
- [ ] Everyone reads ARCHITECTURE.md

---

## Quick Reference Commands

### For Teacher/Team Lead

```powershell
# Create repository (done via GitHub UI)

# Initialize local repo and push
cd C:\Users\herkommer\DEV\Arpad\TE4-Academy\nobel\fas-2
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TE4-Academy/nobel-quest-fas2.git
git push -u origin main

# Create develop branch
git checkout -b develop
git push -u origin develop

# Protect main branch (done via GitHub UI)
```

### For Students

```powershell
# Clone repository
git clone https://github.com/TE4-Academy/nobel-quest-fas2.git
cd nobel-quest-fas2

# Create feature branch
git checkout -b feature/my-feature

# Make changes, then commit
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature

# Create PR on GitHub
```

---

## Success Checklist

Before launching the project, verify:

### Repository Setup
- [ ] Repository created in TE4-Academy org
- [ ] Code pushed to main branch
- [ ] Develop branch created
- [ ] Branch protection rules configured
- [ ] CODEOWNERS file working

### Teams
- [ ] All 4 teams created
- [ ] Team members added
- [ ] Repository access granted
- [ ] Team roles configured

### Project Board
- [ ] Project created
- [ ] Columns configured
- [ ] Custom fields added
- [ ] Initial issues created
- [ ] Views configured
- [ ] Automation enabled

### Documentation
- [ ] README.md visible on repo homepage
- [ ] SETUP.md contains Firebase instructions
- [ ] ARCHITECTURE.md explains design
- [ ] CONTRIBUTING.md has workflow guide

### Collaboration
- [ ] Issue labels created
- [ ] Milestones created
- [ ] Issue templates added
- [ ] PR template added
- [ ] Discussions enabled

---

**You're all set! 🚀**

The repository and project board are ready for your team to start collaborating. Good luck with Phase 2!
