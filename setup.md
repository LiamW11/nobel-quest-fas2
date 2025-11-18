Here’s a ready-to-paste prompt you can give to your dev agent. You can tweak the tech stack bits if needed, but this should be a solid starting point.

---

**Prompt for Dev Agent**

You are my senior software architect and DevOps engineer.

Set up a **monorepo** and project structure for a school project with **3 small games** that share common services and must ONLY use **free tiers / free services**.

---

### 1. Context

We have three existing PoCs that we are now rebuilding for production-quality delivery:

* `Nobel Match Master`
* `Nobel Timeline`
* `Nobel Trivia Rush`

These three games will be released together as **one quest-like product**. They should:

* Share **authentication / user registration** via **Google Authentication**
* Share a **Repository API** (data storage layer) for saving progress, scores, and user state
* Be implemented in a way that is:

  * Simple enough for a **school project**
  * Uses **only free services** (e.g., free tiers of hosting, DB, auth)

We have **11 developers**, split into **3–5 teams**, covering:

* Game logic / UX
* Shared services (auth, storage)
* Deployment / infra / CI

Assume we are starting fresh and are allowed to restructure everything.

If you need to pick specific technologies, prefer:

* Web technologies (TypeScript/JavaScript, React or similar) for client
* Node.js / TypeScript for backend
* GitHub for source control & CI
* Popular, well-documented **free-tier** services (examples: Firebase, Supabase, Railway, Render, etc.) but keep cost at **0**.

---

### 2. Monorepo structure

Create a **single repository** with a clean modular layout. Suggest a concrete directory structure, for example:

* `/apps/`

  * `/apps/nobel-match-master/`
  * `/apps/nobel-timeline/`
  * `/apps/nobel-trivia-rush/`
* `/packages/`

  * `/packages/auth/`  ← shared Google Auth logic
  * `/packages/repository-api/`  ← shared API + data access
  * `/packages/ui/`  ← shared UI components, layout, branding
* `/infra/`  ← deployment configs, IaC if used, environment examples
* `/tools/`  ← scripts, codegen, dev utilities

Requirements:

1. Use a **workspace** mechanism (e.g., npm workspaces, pnpm workspaces, or Turborepo) so that:

   * Each app and package is its own project.
   * Shared packages (`auth`, `repository-api`, `ui`) can be imported from each game.
2. Provide a basic **README** explaining:

   * The overall structure
   * How to run each game locally
   * How shared packages are used

Output:

* The full folder structure
* Example `package.json` workspace config
* Short explanation for each directory

---

### 3. Shared Authentication (Google Authentication)

Design and scaffold a **shared authentication module** in `/packages/auth`:

Goals:

* Provide Google Sign-In / Sign-Up
* Keep code reusable for all three games
* Make it easy to plug into any app

Requirements:

1. Choose a solution that:

   * Works with the chosen frontend framework
   * Uses Google as the identity provider
   * DOES NOT require paid services (free tier only)
2. Define:

   * The expected environment variables (e.g., `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc.)
   * A simple API for the games, e.g.:

     * `loginWithGoogle()`
     * `logout()`
     * `getCurrentUser()`
3. Provide:

   * Sample usage snippets for each game app
   * Notes on how to set up Google OAuth in the Google Cloud console (at a high level)

Output:

* Directory structure for `/packages/auth`
* Example code skeletons (no need to be fully complete, but enough to show intended API)
* Documentation section in the README for how games should use this auth module

---

### 4. Repository API (Shared Data Storage)

We need a **Repository API** that all three games can use to:

* Store user progress
* Store scores / stats
* Potentially store some simple game state

Constraints:

* Must use **only free services**
* Should be as simple as possible for a school project
* Prefer hosted solutions with a free tier (e.g., Firebase Firestore, Supabase Postgres, or similar)

Tasks:

1. Propose **one concrete stack** for the Repository API, including:

   * Backend runtime (likely Node.js/TypeScript)
   * Hosting (free tier)
   * Database (free tier)
2. Design the `repository-api` package in `/packages/repository-api`:

   * Provide a small client library that the games can call, e.g.:

     * `saveProgress(userId, gameId, progressData)`
     * `getProgress(userId, gameId)`
     * `submitScore(userId, gameId, score)`
     * `getLeaderboard(gameId)`
   * Decide whether this is:

     * A thin client around HTTP endpoints
     * Or directly using an SDK (e.g., Firebase SDK) wrapped in helper functions
3. Document:

   * How to run the Repository API locally (if it’s a separate service)
   * How to use it from each game
   * Required environment variables and configuration

Output:

* Proposed tech stack (clearly justified for free tier + simplicity)
* API design (functions/endpoints and payload structures)
* Example integration code from one game

---

### 5. Game Apps

For each game:

* `Nobel Match Master`
* `Nobel Timeline`
* `Nobel Trivia Rush`

Set up a minimal app skeleton in `/apps/<game-name>` that:

1. Integrates the shared `auth` package:

   * Basic login/logout flow
   * Shows logged-in user name or ID
2. Integrates the `repository-api` package:

   * On some dummy action (e.g., pressing a button), call `saveProgress` or `submitScore`.
3. Uses shared UI components from `/packages/ui` (even if it’s just a button and layout to start with).

Also:

* Make sure each app has its own `README` section or file describing:

  * How to run it locally
  * What parts are shared vs local

Output:

* Suggested tech stack for the game frontends
* Scaffold/boilerplate structure for one game, then apply same pattern for the others

---

### 6. CI / CD (GitHub, free-only)

Set up or describe a minimal **CI pipeline** using GitHub Actions that:

1. Installs dependencies & runs tests/lint for:

   * Changed apps
   * Changed packages
2. On pull requests:

   * Runs checks (lint/tests/build) only for affected workspaces
3. Optionally, for main branch:

   * Build artifacts or trigger deployment workflows (if we choose a free hosting solution)

Constraints:

* Use only GitHub’s **free tier** features
* Keep workflows simple and easy to understand

Output:

* Example `.github/workflows/ci.yml`
* Explanation of how “changed files → affected projects” is handled (it can be simple, e.g., by path filters)

---

### 7. Developer Experience & Team Setup

We have **11 developers** across **3–5 teams**. Help us structure collaboration:

1. Propose a **CODEOWNERS** file mapping directories to teams, e.g.:

   * `/apps/nobel-match-master` → `@team-match-master`
   * `/apps/nobel-timeline` → `@team-timeline`
   * `/apps/nobel-trivia-rush` → `@team-trivia`
   * `/packages/auth`, `/packages/repository-api`, `/packages/ui` → `@team-platform`
2. Recommend a **branching strategy**:

   * e.g., trunk-based with feature branches and short-lived PRs
3. Suggest a lightweight **GitHub Project** configuration:

   * One org-level project filtering by labels: `game:match-master`, `game:timeline`, `game:trivia`, `area:platform`
   * Views per game and per team

Output:

* Example `CODEOWNERS` file
* Short guidelines for branches, PRs, and labels

---

### 8. Deliverables

Produce:

1. A **proposed repository structure** (tree view)
2. Example configuration files:

   * Root `package.json` (with workspaces)
   * One or more `package.json` files for apps and packages
   * Example `.github/workflows/ci.yml`
   * Example `CODEOWNERS`
3. Skeleton code examples for:

   * `auth` package interface
   * `repository-api` package interface
   * One game app integrating both
4. A concise **top-level README** describing:

   * Project overview
   * How to set up environment variables
   * How to run everything locally
   * How the three games share auth and storage

Always keep in mind:
**This is a school project. All services must be on free tiers or completely free. Prioritize simplicity and clarity over heavy enterprise patterns.**

---
