# Nobel Quest Fas-2 - Quick Start Checklist

## ✅ What's Already Done

The complete monorepo structure has been created with:
- ✅ 38 files across all folders
- ✅ 3 game applications (match-master, timeline, trivia-rush)
- ✅ Shared Firebase modules (auth, repository, UI)
- ✅ Firebase security rules and configuration
- ✅ GitHub Actions CI pipeline
- ✅ Comprehensive documentation (5 guides)
- ✅ Code owners and team structure
- ✅ Netlify deployment configs

## 📋 Teacher/Lead Tasks (Complete These First)

### 1. Firebase Setup (30 min) - REQUIRED FIRST
- [ ] Go to https://console.firebase.google.com/
- [ ] Create new project named "nobel-quest"
- [ ] Enable Google Authentication
- [ ] Create Firestore database (production mode)
- [ ] Deploy security rules from `firebase/firestore.rules`
- [ ] Copy Firebase config to `shared/firebase-config.js`
- [ ] Add localhost to authorized domains

**Detailed steps:** See `docs/SETUP.md` → "Firebase Setup"

### 2. GitHub Repository (20 min) - REQUIRED SECOND
```powershell
cd C:\Users\herkommer\DEV\Arpad\TE4-Academy\nobel\fas-2
git init
git add .
git commit -m "Initial commit: Nobel Quest Fas 2 monorepo"
git remote add origin https://github.com/TE4-Academy/nobel-quest-fas2.git
git push -u origin main
```

**Detailed steps:** See `docs/GITHUB-SETUP.md` → "Repository Setup"

### 3. Create Teams (15 min) - REQUIRED THIRD
- [ ] Create `team-platform` (2 members)
- [ ] Create `team-match-master` (3 members)
- [ ] Create `team-timeline` (3 members)
- [ ] Create `team-trivia-rush` (3 members)
- [ ] Give teams repository access
- [ ] Set up branch protection on `main`

**Detailed steps:** See `docs/GITHUB-SETUP.md` → "GitHub Teams Setup"

### 4. Create Project Board (15 min) - RECOMMENDED
- [ ] Create GitHub Project board
- [ ] Add custom fields (Team, Priority, Estimate)
- [ ] Create initial issues for each team
- [ ] Set up views (By Team, By Priority)

**Detailed steps:** See `docs/GITHUB-SETUP.md` → "GitHub Projects Setup"

---

## 👥 Team Platform Tasks (Week 1)

### Priority 1: Test Firebase Integration
- [ ] Clone repository
- [ ] Open `apps/match-master/index.html` in browser
- [ ] Test Google login works
- [ ] Test score submission works
- [ ] Test leaderboard loads
- [ ] Document any issues

### Priority 2: Create Integration Guide
- [ ] Write example of how to use NobelAuth
- [ ] Write example of how to use NobelRepo
- [ ] Create sample game flow
- [ ] Share with game teams

### Priority 3: Support Game Teams
- [ ] Answer questions in GitHub Discussions
- [ ] Review PRs from game teams
- [ ] Help debug integration issues

---

## 🎮 Game Teams Tasks (Week 1-2)

### Week 1: Setup & Planning
- [ ] Clone repository: `git clone https://github.com/TE4-Academy/nobel-quest-fas2.git`
- [ ] Read `docs/CONTRIBUTING.md` (Development workflow)
- [ ] Read `docs/ARCHITECTURE.md` (How it works)
- [ ] Review Fas-1 version of your game
- [ ] Plan improvements for Fas-2
- [ ] Create issues for your tasks
- [ ] Wait for Platform team to finish Firebase setup

### Week 2: Implementation
- [ ] Create feature branch: `git checkout -b feature/game-name-feature`
- [ ] Implement game logic (better than Fas-1!)
- [ ] Integrate `NobelAuth.loginWithGoogle()`
- [ ] Integrate `NobelRepo.submitScore()`
- [ ] Build leaderboard UI with `NobelUI.renderLeaderboard()`
- [ ] Test on desktop (Chrome, Firefox)
- [ ] Test on mobile
- [ ] Create Pull Request
- [ ] Address code review feedback
- [ ] Merge when approved

---

## 🚀 Deployment Checklist (Week 2-3)

### Netlify Setup (Platform Team)
- [ ] Create Netlify account (if needed)
- [ ] Deploy Match Master (base dir: `apps/match-master`)
- [ ] Deploy Timeline (base dir: `apps/timeline`)
- [ ] Deploy Trivia Rush (base dir: `apps/trivia-rush`)
- [ ] Add Netlify domains to Firebase authorized domains
- [ ] Test all 3 games on production URLs
- [ ] Share URLs with game teams for testing

### Pre-Event Testing
- [ ] Load test with 50+ users
- [ ] Test on various devices (iOS, Android, laptop)
- [ ] Verify scores save correctly
- [ ] Verify leaderboards update
- [ ] Test error scenarios (offline, Firebase down)
- [ ] Prepare fallback plan

---

## 📖 Documentation to Read

### Everyone Should Read:
1. **README.md** - Project overview (5 min read)
2. **docs/CONTRIBUTING.md** - How to contribute (15 min read)

### Platform Team Should Read:
3. **docs/SETUP.md** - Firebase & deployment (20 min read)
4. **docs/ARCHITECTURE.md** - Technical design (20 min read)
5. **docs/GITHUB-SETUP.md** - Repo setup (15 min read)

### Game Teams Can Skim:
6. **docs/ARCHITECTURE.md** - Understand shared modules (10 min skim)

---

## 🎯 Success Criteria

### Week 1: Infrastructure ✅
- [x] Monorepo created
- [x] Documentation complete
- [ ] Firebase set up (Teacher)
- [ ] GitHub repo created (Teacher)
- [ ] Teams configured (Teacher)
- [ ] Platform team verified Firebase works

### Week 2: Games Working
- [ ] All 3 games have basic gameplay
- [ ] All 3 games integrate authentication
- [ ] All 3 games save scores
- [ ] All 3 games show leaderboards
- [ ] Mobile responsive

### Week 3: Event Ready
- [ ] All games deployed to Netlify
- [ ] Load tested with 100+ users
- [ ] No critical bugs
- [ ] Documentation updated
- [ ] Team trained on event day procedures

### Event Day: Success! 🎉
- [ ] 800 users play games
- [ ] Scores save reliably (>95%)
- [ ] Leaderboards work
- [ ] No major crashes
- [ ] Players have fun!

---

## 🆘 Quick Help

### I can't login to Firebase
→ Check `docs/SETUP.md` → "Troubleshooting" → "Auth domain not authorized"

### Scores aren't saving
→ Check browser console for errors
→ Verify user is logged in
→ Check Firebase Console → Firestore → Rules

### Git push rejected
→ Pull latest changes: `git pull origin main`
→ Resolve conflicts
→ Try push again

### CI pipeline failing
→ Check GitHub Actions tab for error details
→ Usually a JavaScript syntax error
→ Run `node -c filename.js` locally to check

### Need more help?
→ Create GitHub Issue (once repo is set up)
→ Ask Platform team
→ Check documentation in `/docs/`

---

## 📞 Key Links (After Setup)

- **Repository:** https://github.com/TE4-Academy/nobel-quest-fas2
- **Firebase Console:** https://console.firebase.google.com/
- **Netlify Dashboard:** https://app.netlify.com/
- **GitHub Projects:** https://github.com/orgs/TE4-Academy/projects

---

## 🎓 Today's Learning Goals

### For Students
- ✅ Understand monorepo structure
- ✅ Learn Git workflow (branch, commit, PR)
- ✅ Understand Firebase basics
- ✅ Practice code reviews
- ✅ Write clean, documented code

### For Teachers
- ✅ Set up cloud infrastructure (Firebase)
- ✅ Configure team collaboration (GitHub)
- ✅ Manage project workflow
- ✅ Guide students through process

---

## 🏁 Get Started Now!

### Right Now (Teacher):
1. Open `docs/SETUP.md`
2. Follow "Firebase Setup" section
3. Create Firebase project
4. Update `shared/firebase-config.js`

### Then (Teacher):
5. Open `docs/GITHUB-SETUP.md`
6. Create GitHub repository
7. Push code to GitHub
8. Create teams

### Finally (Students):
9. Clone repository
10. Read documentation
11. Start building!

---

**Everything is ready. Let's build something amazing! 🚀**
