# Nobel Quest - [Timeline]

Multiplayer-spel utvecklat i team @ TE4 Academy som del av Nobel Quest-projektet.

## Min roll
Jag var del av [Team namn]-teamet och ansvarade för:
- [Konkret del 1 - t.ex. "Implementation av spellogik"]
- [Konkret del 2 - t.ex. "Firebase authentication-integration"]
- [Konkret del 3 - t.ex. "Leaderboard UI"]

## Team
Utvecklat tillsammans med:
- [Teammedlem 1 - länk till deras GitHub]
- [Teammedlem 2 - länk till deras GitHub]
- [Teammedlem 3 - länk till deras GitHub]

Se original repo för komplett projektdokumentation: 
[Länk till TE4-Academy/nobel-quest-fas2]

# Nobel Quest - Fas 2

> **Production-ready Nobel Prize educational games with shared authentication and leaderboards**

Nobel Quest is a collection of three interactive games built for a school event, designed to educate players about Nobel Prize laureates while demonstrating modern web development practices.

## 🎮 Games

### 1. Nobel Match Master
Memory matching game featuring Nobel Prize winners. Test your memory by matching laureates with their achievements.

- **Tech:** Vanilla JavaScript ES6, Tailwind CSS
- **Play:** [Coming Soon]
- **Team:** @team-match-master

### 2. Nobel Timeline
Chronological puzzle game where players arrange Nobel Prize events in the correct order.

- **Tech:** Vanilla JavaScript ES6, Tailwind CSS
- **Play:** [Coming Soon]
- **Team:** @team-timeline

### 3. Nobel Trivia Rush
Fast-paced trivia game testing knowledge of Nobel Prize history and laureates.

- **Tech:** Vanilla JavaScript ES6, Tailwind CSS
- **Play:** [Coming Soon]
- **Team:** @team-trivia-rush

## 🏗️ Project Structure

```
nobel-quest/
├── apps/                      # Individual game applications
│   ├── match-master/         # Memory matching game
│   ├── timeline/             # Timeline sorting game
│   └── trivia-rush/          # Trivia quiz game
├── shared/                   # Shared code and resources
│   ├── js/                   # Shared JavaScript modules
│   │   ├── auth.js          # Authentication wrapper
│   │   ├── repository.js    # Database operations
│   │   ├── ui-components.js # Reusable UI components
│   │   └── utils.js         # Utility functions
│   ├── css/                 # Shared styles
│   └── firebase-config.js   # Firebase initialization
├── firebase/                # Firebase configuration
│   ├── firestore.rules      # Security rules
│   └── firestore.indexes.json
├── docs/                    # Documentation
├── data/                    # Shared game data
└── .github/                 # GitHub configuration
```

## 🚀 Quick Start

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Google account (for authentication)
- Text editor (VS Code recommended)

### For Players
1. Navigate to any game URL
2. Click "Login with Google"
3. Start playing!
4. Your scores will automatically save to the leaderboard

### For Developers

#### 1. Clone the Repository
```powershell
git clone https://github.com/TE4-Academy/nobel-quest-fas2.git
cd nobel-quest-fas2
```

#### 2. Set Up Firebase
See [docs/SETUP.md](docs/SETUP.md) for detailed instructions.

#### 3. Configure Firebase
Edit `shared/firebase-config.js` with your Firebase project credentials.

#### 4. Open a Game
Simply open any `apps/*/index.html` file in your browser, or use a local server:

```powershell
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000
```

Then visit: `http://localhost:8000/apps/match-master/`

## 🛠️ Technology Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| **Frontend** | Vanilla JavaScript ES6 | Simple, no build process, students already know it |
| **Styling** | Tailwind CSS (CDN) | Fast prototyping, mobile-responsive |
| **Auth** | Firebase Authentication | Free tier, Google Sign-In built-in |
| **Database** | Firebase Firestore | Free tier, real-time updates, simple API |
| **Hosting** | Netlify | Free tier, auto-deploy from GitHub |
| **CI/CD** | GitHub Actions | Free tier, automated testing |

## 👥 Team Structure

- **Team Platform** (2 developers): Shared services, infrastructure, Firebase
- **Team Match Master** (3 developers): Match Master game
- **Team Timeline** (3 developers): Timeline game
- **Team Trivia Rush** (3 developers): Trivia Rush game

## 📊 Event Readiness

### Tested For
- ✅ 800 total users over 1 day
- ✅ ~10 concurrent users at peak
- ✅ Mobile and desktop devices
- ✅ All major browsers

### Free Tier Limits (Well Within Capacity)
- Firebase Auth: Unlimited users
- Firestore: 50K reads/day, 20K writes/day
- Netlify: 100GB bandwidth/month
- GitHub Actions: 2000 minutes/month

**Estimated Usage:**
- Auth: 800 logins/day ✅
- Reads: ~5K/day ✅
- Writes: ~3K/day ✅
- Bandwidth: <1GB/month ✅

## 🔐 Authentication Flow

1. User clicks "Login with Google"
2. Firebase shows Google Sign-In popup
3. User selects Google account
4. Game receives user profile (name, email, ID)
5. Game unlocks and user can play
6. Scores automatically tied to user account

## 📈 Leaderboard System

- **Global Leaderboards**: Top 10 scores per game
- **Personal Stats**: User's best scores and history
- **Real-time Updates**: Leaderboards refresh automatically
- **Anti-cheat**: Firestore security rules prevent score manipulation

## 🎯 Learning Objectives

### For Students (Developers)
- ✅ Collaborative software development
- ✅ Git workflow with pull requests
- ✅ Code review process
- ✅ Firebase integration
- ✅ Security best practices
- ✅ CI/CD pipelines
- ✅ Code quality improvement through refactoring

### For Students (Players)
- 🧠 Learn about Nobel Prize history
- 🏆 Competitive gameplay with leaderboards
- 🎮 Engaging educational content

## 📚 Documentation

- [Setup Guide](docs/SETUP.md) - Firebase and deployment setup
- [Architecture](docs/ARCHITECTURE.md) - Technical design decisions
- [Contributing](docs/CONTRIBUTING.md) - Development workflow

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Commit: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Create a Pull Request
6. Wait for review from code owners

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

## 📝 License

This project is created for educational purposes at TE4 Academy.

## 🙏 Acknowledgments

- Nobel Prize data from [NobelPrize.org](https://www.nobelprize.org/)
- Firebase for free tier services
- Netlify for hosting
- Tailwind CSS for styling
- All students and teachers at TE4 Academy

## 📞 Support

- **Issues:** Use GitHub Issues for bug reports and feature requests
- **Discussions:** Use GitHub Discussions for questions
- **Team Chat:** [Your communication platform]

---

**Built with ❤️ by TE4 Academy students**
