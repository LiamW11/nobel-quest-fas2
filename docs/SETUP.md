# Nobel Quest - Setup Guide

This guide will walk you through setting up the Nobel Quest project from scratch.

## Table of Contents

1. [Firebase Setup](#firebase-setup)
2. [Google OAuth Setup](#google-oauth-setup)
3. [Local Development](#local-development)
4. [Netlify Deployment](#netlify-deployment)
5. [GitHub Repository Setup](#github-repository-setup)

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `nobel-quest` (or your preferred name)
4. **Disable** Google Analytics (not needed for this project)
5. Click "Create project"
6. Wait for project to be created (30-60 seconds)

### 2. Enable Firestore Database

1. In Firebase Console, click "Firestore Database" in left menu
2. Click "Create database"
3. Select "Start in **production mode**" (we'll add security rules next)
4. Choose a location close to your users (e.g., `europe-west3` for Europe)
5. Click "Enable"
6. Wait for database to be created

### 3. Deploy Security Rules

```powershell
# Install Firebase CLI globally (first time only)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Navigate to project directory
cd C:\Users\herkommer\DEV\Arpad\TE4-Academy\nobel\fas-2

# Initialize Firebase (select Firestore only)
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules
```

**Or manually:**
1. Go to Firestore Database > Rules tab
2. Copy content from `firebase/firestore.rules`
3. Paste into rules editor
4. Click "Publish"

### 4. Create Firestore Indexes

Go to Firestore > Indexes tab and create these composite indexes:

**Index 1: Leaderboard by game**
- Collection: `scores`
- Fields:
  - `gameId` (Ascending)
  - `score` (Descending)
  - `timestamp` (Ascending)

**Index 2: User's scores by game**
- Collection: `scores`
- Fields:
  - `gameId` (Ascending)
  - `userId` (Ascending)
  - `score` (Descending)

*Note: Firestore will auto-create these when you run queries. Watch console for index creation links.*

### 5. Enable Authentication

1. In Firebase Console, click "Authentication" in left menu
2. Click "Get started"
3. Click "Sign-in method" tab
4. Click "Google" provider
5. Toggle "Enable"
6. Enter support email (your email)
7. Click "Save"

---

## Google OAuth Setup

### 1. Configure OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project from dropdown
3. Navigate to "APIs & Services" > "OAuth consent screen"
4. Select "External" user type
5. Fill in:
   - **App name:** Nobel Quest
   - **User support email:** Your email
   - **Developer contact:** Your email
6. Click "Save and Continue"
7. Skip "Scopes" (click "Save and Continue")
8. Skip "Test users" (click "Save and Continue")
9. Click "Back to Dashboard"

### 2. Get Firebase Config

1. Go back to Firebase Console
2. Click gear icon > "Project settings"
3. Scroll to "Your apps" section
4. Click "</>" (Web) icon to add a web app
5. Enter app nickname: "Nobel Quest Web"
6. **Do NOT** check "Firebase Hosting"
7. Click "Register app"
8. Copy the `firebaseConfig` object

### 3. Update Project Config

Edit `shared/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",                    // Replace with your values
  authDomain: "nobel-quest.firebaseapp.com",
  projectId: "nobel-quest",
  storageBucket: "nobel-quest.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**⚠️ Important:** Do NOT commit real Firebase credentials to GitHub!
- Keep `YOUR_API_KEY` placeholders in version control
- Use environment variables or local config files (add to `.gitignore`)

---

## Local Development

### Option 1: Python HTTP Server

```powershell
# Navigate to project root
cd C:\Users\herkommer\DEV\Arpad\TE4-Academy\nobel\fas-2

# Start server
python -m http.server 8000

# Open browser to:
# http://localhost:8000/apps/match-master/
# http://localhost:8000/apps/timeline/
# http://localhost:8000/apps/trivia-rush/
```

### Option 2: Node.js HTTP Server

```powershell
# Install http-server globally (first time only)
npm install -g http-server

# Start server
http-server -p 8000

# Open browser to same URLs as above
```

### Option 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click any `index.html` file
3. Select "Open with Live Server"

### Testing Authentication

1. Open any game in browser
2. Click "Login with Google"
3. Select your Google account
4. Grant permissions
5. You should see game screen with your name

**Troubleshooting:**
- If popup is blocked, allow popups for localhost
- If "unauthorized domain" error, add `localhost` to Firebase authorized domains:
  - Firebase Console > Authentication > Settings > Authorized domains
  - Add `localhost`

---

## Netlify Deployment

### Setup (Per Game)

You'll deploy **3 separate Netlify sites** (one per game).

#### Match Master

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub
4. Select repository: `nobel-quest-fas2`
5. Configure:
   - **Base directory:** `apps/match-master`
   - **Build command:** (leave empty)
   - **Publish directory:** `.` (dot)
6. Click "Deploy site"
7. Wait for deployment (~30 seconds)
8. Site will be live at `random-name.netlify.app`
9. Rename site:
   - Site settings > Site details > Change site name
   - Set to: `nobel-match-master` (if available)

#### Repeat for Timeline and Trivia Rush

- **Timeline:** Base directory = `apps/timeline`, name = `nobel-timeline`
- **Trivia Rush:** Base directory = `apps/trivia-rush`, name = `nobel-trivia-rush`

### Add Netlify Domains to Firebase

1. Firebase Console > Authentication > Settings > Authorized domains
2. Click "Add domain"
3. Add:
   - `nobel-match-master.netlify.app`
   - `nobel-timeline.netlify.app`
   - `nobel-trivia-rush.netlify.app`

### Environment Variables (Optional)

If you want to keep Firebase config out of code:

1. Netlify site > Site settings > Environment variables
2. Add variables:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - etc.
3. Update `firebase-config.js` to read from `process.env`

*Note: For simplicity, you can keep config in code for this school project.*

---

## GitHub Repository Setup

### Create Repository in TE4-Academy Organization

1. Go to https://github.com/organizations/TE4-Academy/repositories/new
2. Enter repository name: `nobel-quest-fas2`
3. Description: "Nobel Prize educational games - Phase 2 production version"
4. Set to **Private** (or Public if preferred)
5. **Do NOT** initialize with README (we have one)
6. Click "Create repository"

### Push Local Code to GitHub

```powershell
# Navigate to project
cd C:\Users\herkommer\DEV\Arpad\TE4-Academy\nobel\fas-2

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Nobel Quest Fas 2 monorepo setup"

# Add remote
git remote add origin https://github.com/TE4-Academy/nobel-quest-fas2.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Create Teams

1. Go to https://github.com/orgs/TE4-Academy/teams
2. Create teams:
   - `team-platform` (2 members)
   - `team-match-master` (3 members)
   - `team-timeline` (3 members)
   - `team-trivia-rush` (3 members)
3. Add team members to each team
4. Give teams **Write** access to repository

### Enable Branch Protection

1. Repository > Settings > Branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request before merging
   - ✅ Require approvals (1)
   - ✅ Require status checks to pass (select CI jobs)
   - ✅ Require conversation resolution before merging
5. Click "Create"

### Verify CODEOWNERS

1. GitHub will automatically use `.github/CODEOWNERS`
2. Test by creating a PR that modifies `/apps/match-master/`
3. Verify that `@team-match-master` is auto-requested for review

---

## Verification Checklist

Before event day, verify:

### Firebase
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Google Authentication enabled
- [ ] Firebase config updated in code

### Local Development
- [ ] Can run games locally
- [ ] Can login with Google
- [ ] Scores save to Firestore
- [ ] Leaderboards load correctly

### Netlify
- [ ] All 3 games deployed
- [ ] Sites accessible via URLs
- [ ] Authentication works on live sites
- [ ] Authorized domains configured in Firebase

### GitHub
- [ ] Code pushed to organization repository
- [ ] Teams created and members added
- [ ] Branch protection enabled
- [ ] CODEOWNERS file working
- [ ] CI pipeline passing

---

## Troubleshooting

### "Firebase not defined" Error
- Check that Firebase SDK scripts are loaded before your code
- Verify script order in `index.html`

### "Auth domain not authorized"
- Add domain to Firebase Console > Authentication > Settings > Authorized domains

### "Permission denied" in Firestore
- Check security rules deployed correctly
- Verify user is authenticated
- Check user ID matches in score document

### Netlify Deploy Fails
- Verify base directory is correct
- Check that all referenced files exist
- Look at deploy logs for specific errors

### Scores Not Saving
- Open browser console for errors
- Check Firebase quota (Firestore Usage tab)
- Verify Firestore indexes created

---

## Next Steps

Once setup is complete:
1. Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
2. Read [CONTRIBUTING.md](CONTRIBUTING.md) to start developing
3. Assign tasks to teams using GitHub Issues/Projects

---

**Need help?** Contact the Platform team or create a GitHub Discussion.
