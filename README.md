<div align="center">
  <img src="frontend/website/public/LeetBuddyLogo.svg" alt="LeetBuddy Logo" width="200"/>

  # LeetBuddy

  ### AI-Powered LeetCode Assistant

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)](https://chromewebstore.google.com/detail/nlemdecocfoaimdbfgpilfgdmcllhphn)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org/)

  [Website](https://leetbuddy.app) • [Chrome Extension](https://chromewebstore.google.com/detail/nlemdecocfoaimdbfgpilfgdmcllhphn) • [Report Bug](https://github.com/LeetBuddyAI/LeetBuddy/issues) • [Request Feature](https://github.com/LeetBuddyAI/LeetBuddy/issues)
</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Locally](#running-locally)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Available Scripts](#available-scripts)
  - [Tech Stack](#tech-stack)
- [Deployment](#deployment)
  - [Website & Backend](#website--backend)
  - [Chrome Extension](#chrome-extension)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## About

**LeetBuddy** is a free, open-source Chrome extension that provides AI-powered assistance for LeetCode problems. It helps developers improve their coding interview skills by offering contextual hints, explanations, edge case generation, and an interactive whiteboard - all without leaving the LeetCode page.

### Why LeetBuddy?

- **Learn, Don't Cheat**: Get hints and guidance without spoiling the solution
- **Context-Aware**: Automatically understands the problem, your code, and your progress
- **100% Free**: No paywalls, subscriptions, or hidden costs
- **Open Source**: Transparent, community-driven development
- **Privacy-Focused**: No tracking or data collection

---

## Features

### 🤖 Smart AI Assistant
- **Natural Language Chat**: Ask questions in plain English
- **Context Detection**: Automatically reads problem statements, constraints, and your code
- **Streaming Responses**: Real-time AI responses for better UX

### 💡 Intelligent Hints
- **Progressive Hints**: Get just enough help without revealing the solution
- **Edge Case Generator**: Discover test cases you might have missed
- **Complexity Analysis**: Understand time/space complexity of your approach

### ✏️ Interactive Whiteboard
- **Visual Diagrams**: Draw trees, graphs, arrays, and data structures
- **Image Recognition**: AI analyzes your drawings to provide explanations
- **Persistent Sessions**: Chat history saved per problem

### 🎨 Developer Experience
- **Multiple Modes**: Chat and Whiteboard interfaces
- **Syntax Highlighting**: Beautiful code rendering with Prism.js
- **Markdown Support**: Rich text formatting in responses
- **Session Management**: Conversations persist across page refreshes

---

## Architecture

LeetBuddy uses a microservices architecture with Docker containerization:

```
┌─────────────────────────────────────────────────────────────┐
│                         NGINX (Port 80)                     │
│  ┌────────────┬──────────────────┬───────────────────────┐  │
│  │ Static     │ /health          │ /api/LLM              │  │
│  │ Files      │ (Health Check)   │ (Extension API)       │  │
│  └────────────┴──────────────────┴───────────────────────┘  │
└──────┬───────────────┬────────────────────┬─────────────────┘
       │               │                    │
       ▼               ▼                    ▼
┌──────────────┐ ┌──────────────┐   ┌──────────────┐
│   Website    │ │   Website    │   │  Extension   │
│   Frontend   │ │   Backend    │   │   Backend    │
│              │ │              │   │              │
│ React + Vite │ │ Express.js   │   │ Express.js   │
│ TailwindCSS  │ │ (Port 3001)  │   │ (Port 3002)  │
└──────────────┘ └──────────────┘   └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │    Redis     │
                                    │  (Upstash)   │
                                    │              │
                                    │ Chat Session │
                                    │  Management  │
                                    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Google Gemini│
                                    │     API      │
                                    │              │
                                    │  AI Model    │
                                    └──────────────┘
```

### Components

1. **Website Frontend**: Marketing website built with React, Vite, and TailwindCSS
2. **Website Backend**: Health checks and basic routing (Express.js)
3. **Extension Backend**: LLM API endpoints with streaming support (Express.js)
4. **Chrome Extension**: React-based extension with Chat and Whiteboard modes
5. **Redis**: Session management for chat history (external via Upstash)
6. **NGINX**: Reverse proxy and static file serving

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 22.0.0 or higher ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Google Chrome** ([Download](https://www.google.com/chrome/))
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LeetBuddyAI/LeetBuddy.git
   cd LeetBuddy
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   This installs dependencies for:
   - Root project
   - Backend (`backend/`)
   - Website frontend (`frontend/website/`)
   - Extension frontend (`frontend/extension/`)

### Configuration

1. **Copy the environment template**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**

   Edit `.env` with your settings:

   ```bash
   # Application Environment
   NODE_ENV=development
   PORT=10000

   # Website Backend
   CHROME_EXTENSION_ORIGIN=chrome-extension://your-extension-id

   # Extension Backend
   GEMINI_API_KEY=your-gemini-api-key
   MODEL=gemini-2.5-flash
   INSTRUCTIONS="You are a helpful coding assistant for LeetCode problems."

   # Backend Ports (internal to container)
   WEBSITE_PORT=3001
   EXTENSION_PORT=3002

   # Redis Configuration (for extension chat sessions)
   REDIS_URL=your-redis-url

   # Frontend Environment Variables
   VITE_SITE_URL=https://leetbuddy.app
   VITE_VIDEO_URL=https://example.com/demo-video.mp4
   VITE_CHROME_STORE_URL=https://chromewebstore.google.com/detail/nlemdecocfoaimdbfgpilfgdmcllhphn

   # Development NGINX Port
   NGINX_PORT=80
   ```

   **Required API Keys:**

   - **GEMINI_API_KEY**: Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - **REDIS_URL**: Create a free Redis database at [Upstash](https://upstash.com/)

### Running Locally

#### Option 1: Quick Start (Recommended)

```bash
npm run fresh
```

This command will:
1. Clean all dependencies and caches
2. Reinstall all packages
3. Rebuild Docker images from scratch
4. Start all services

**Access the application:**
- Website: [http://localhost](http://localhost)
- Health Check: [http://localhost/health](http://localhost/health)
- Extension Backend: [http://localhost/api/LLM](http://localhost/api/LLM)

#### Option 2: Manual Docker Setup

```bash
# Build and start services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

#### Option 3: Development Mode (Without Docker)

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Website Frontend
npm run dev:website

# Terminal 3 - Extension Frontend
npm run dev:extension
```

### Loading the Chrome Extension

1. Build the extension:
   ```bash
   npm run build:extension
   ```

2. Open Chrome and navigate to:
   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** (toggle in top right)

4. Click **"Load unpacked"**

5. Select the directory:
   ```
   frontend/extension/dist/
   ```

6. The extension should now appear in your Chrome toolbar!

7. Navigate to any [LeetCode problem](https://leetcode.com/problems/) and click the LeetBuddy icon

---

## Development

### Project Structure

```
LeetBuddy/
├── backend/
│   ├── extension/           # Extension backend service
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   └── services/        # Business logic (LLM, Redis)
│   ├── website/             # Website backend service
│   │   ├── controllers/     # Health check controllers
│   │   └── routes/          # Health routes
│   ├── shared/              # Shared utilities
│   │   ├── cors.js          # CORS configuration
│   │   ├── errorHandlers.js # Error handling middleware
│   │   ├── logger.js        # Logging utilities
│   │   ├── rateLimiter.js   # Rate limiting
│   │   ├── redis.js         # Redis client wrapper
│   │   └── security.js      # Helmet security config
│   └── index.js             # Backend entry point
├── frontend/
│   ├── extension/           # Chrome extension
│   │   ├── public/          # Extension manifest & assets
│   │   └── src/
│   │       ├── background/  # Background script
│   │       ├── components/  # React components
│   │       ├── tabs/        # Chat & Whiteboard tabs
│   │       └── utils/       # Helper functions
│   └── website/             # Marketing website
│       └── src/
│           ├── components/  # React components
│           ├── pages/       # Page components
│           ├── hooks/       # Custom React hooks
│           └── data/        # Static data & SEO
├── nginx/
│   ├── default.conf         # Production nginx config
│   └── default.conf.dev     # Development nginx config
├── docker-compose.yml       # Docker orchestration
├── Dockerfile               # Production Docker image
├── Dockerfile.dev           # Development Docker image
├── render.yaml              # Render.com deployment config
└── .env                     # Environment variables
```

### Available Scripts

#### Root Level Scripts

```bash
# Development
npm run dev              # Start backend in development mode
npm run dev:website      # Start website frontend dev server
npm run dev:extension    # Start extension frontend dev server

# Building
npm run build            # Build website frontend
npm run build:website    # Build website frontend
npm run build:extension  # Build extension frontend
npm run build:all        # Build both frontends

# Installation
npm run install:all      # Install all dependencies
npm run install:backend  # Install backend dependencies only
npm run install:website  # Install website frontend dependencies
npm run install:extension # Install extension frontend dependencies

# Cleaning
npm run clean            # Remove node_modules, dist, lock files
npm run clean:modules    # Remove all node_modules
npm run clean:dist       # Remove all dist directories
npm run clean:locks      # Remove all package-lock files

# Reset & Rebuild
npm run reset            # Clean, reinstall, rebuild everything
npm run reset:hard       # Hard reset with cache clean
npm run fresh            # Hard reset + Docker rebuild (recommended)
npm run nuke             # Nuclear option: delete everything

# Docker
npm run docker:clean     # Remove Docker containers, volumes, images
npm run docker:reset     # Clean Docker and rebuild from scratch

# Testing
npm test                 # Run tests (placeholder)
```

#### Backend Scripts

```bash
cd backend
npm start               # Start production server
npm run dev             # Start with nodemon (auto-reload)
npm test                # Run backend tests
```

#### Frontend Website Scripts

```bash
cd frontend/website
npm run dev             # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

#### Frontend Extension Scripts

```bash
cd frontend/extension
npm run dev             # Start Vite dev server with HMR
npm run build           # Build for production (creates dist/)
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

### Tech Stack

#### Frontend (Website)
- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS 4
- **Routing**: React Router 7
- **Icons**: Lucide React
- **SEO**: Custom meta tags + JSON-LD structured data

#### Frontend (Extension)
- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS 4
- **Whiteboard**: tldraw
- **Markdown**: react-markdown + remark-gfm
- **Syntax Highlighting**: Prism.js + prism-react-renderer
- **Icons**: React Icons
- **State Management**: React Context API
- **UUID**: uuid v11

#### Backend
- **Runtime**: Node.js 22+
- **Framework**: Express.js 5
- **AI Model**: Google Gemini 2.5 Flash (@google/genai)
- **Database**: Redis (ioredis) via Upstash
- **Security**:
  - Helmet (security headers)
  - CORS with origin validation
  - Rate limiting (express-rate-limit)
- **Utilities**:
  - Compression
  - dotenv (environment variables)
  - Custom error handlers
  - Structured logging

#### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: NGINX
- **Deployment**: Render.com
- **CDN**: Cloudflare (for production)
- **External Services**:
  - Upstash Redis (session management)
  - Google Gemini API (AI responses)

#### Development Tools
- **Linting**: ESLint 9
- **Hot Reload**: Vite HMR, Nodemon
- **Environment Management**: dotenv

---

## Deployment

### Website & Backend

The website and backend are deployed on [Render.com](https://render.com) with automatic deployment from the `main` branch.

#### Production Deployment

1. **Push to main branch**
   ```bash
   git push origin main
   ```

2. Render.com automatically:
   - Detects changes
   - Builds Docker image using `Dockerfile`
   - Runs database migrations (if any)
   - Deploys to production
   - Runs health checks

#### Manual Deployment (Render.com)

1. **Configure Render service** using `render.yaml`
2. **Set environment variables** in Render dashboard (not synced from repo)
3. **Deploy manually** from Render dashboard if needed

#### Environment Variables (Production)

Set these in Render.com dashboard:

```bash
NODE_ENV=production
PORT=10000
REDIS_URL=<your-upstash-redis-url>
GEMINI_API_KEY=<your-gemini-key>
CHROME_EXTENSION_ORIGIN=chrome-extension://nlemdecocfoaimdbfgpilfgdmcllhphn
MODEL=gemini-2.5-flash
INSTRUCTIONS="<your-custom-instructions>"
VITE_SITE_URL=https://leetbuddy.app
VITE_VIDEO_URL=<your-cdn-video-url>
VITE_CHROME_STORE_URL=https://chromewebstore.google.com/detail/nlemdecocfoaimdbfgpilfgdmcllhphn
```

### Chrome Extension

#### Building for Production

1. **Build the extension**
   ```bash
   npm run build:extension
   ```

2. **Create distribution package**
   ```bash
   cd frontend/extension/dist
   zip -r ../extension.zip .
   cd ..
   ```

   This creates `frontend/extension/extension.zip`

#### Extension Manifest

Key settings in `frontend/extension/public/manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "LeetBuddy",
  "version": "1.1.1",
  "permissions": ["activeTab", "storage"],
  "host_permissions": ["https://leetcode.com/*"],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

---

## Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/LeetBuddy.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Write meaningful commit messages
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run fresh  # Full rebuild and test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Describe your changes in detail

### Contribution Guidelines

- **Code Quality**: Write clean, maintainable code
- **Documentation**: Update README and code comments
- **Testing**: Test thoroughly before submitting
- **Commits**: Use clear, descriptive commit messages
- **Issues**: Check existing issues before creating new ones
- **Respect**: Be respectful and constructive in discussions

### Areas for Contribution

- 🐛 **Bug Fixes**: Fix bugs listed in [Issues](https://github.com/LeetBuddyAI/LeetBuddy/issues)
- ✨ **Features**: Implement new features or improve existing ones
- 📝 **Documentation**: Improve README, code comments, or guides
- 🎨 **UI/UX**: Enhance design and user experience
- 🧪 **Testing**: Add unit tests, integration tests, or E2E tests
- 🌐 **Translations**: Add support for multiple languages
- ♿ **Accessibility**: Improve accessibility features

### Development Tips

- Use `npm run fresh` for a clean rebuild when switching branches
- Test the extension in Chrome before submitting PRs
- Check browser console for errors during development
- Use `npm run lint` to catch style issues early

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:

✅ **You can:**
- Use this code commercially
- Modify the code
- Distribute the code
- Use it privately
- Sublicense the code

❌ **You must:**
- Include the original copyright notice
- Include a copy of the MIT License

❌ **Limitations:**
- The software is provided "as is", without warranty
- Authors are not liable for any damages

---

## Support

### Getting Help

- **Documentation**: Start with this README
- **Issues**: [GitHub Issues](https://github.com/LeetBuddyAI/LeetBuddy/issues)
- **Email**: leetbuddyrsfn@gmail.com
- **Website**: [leetbuddy.app](https://leetbuddy.app)

### Reporting Bugs

When reporting bugs, please include:

1. **Description**: What happened vs. what you expected
2. **Steps to Reproduce**: Detailed steps to recreate the issue
3. **Environment**:
   - OS (Windows/macOS/Linux)
   - Node.js version (`node --version`)
   - Chrome version
   - Extension version
4. **Screenshots**: If applicable
5. **Error Messages**: Console logs or error messages

### Feature Requests

We love hearing your ideas! When requesting features:

1. **Search existing requests** to avoid duplicates
2. **Describe the feature** in detail
3. **Explain the use case** - why is this needed?
4. **Provide examples** - how would it work?

---

## Acknowledgments

### Built With

- [Google Gemini](https://ai.google.dev/) - AI model powering intelligent responses
- [Upstash](https://upstash.com/) - Redis database for session management
- [Render](https://render.com/) - Cloud hosting platform
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [tldraw](https://tldraw.dev/) - Whiteboard library
- [Express.js](https://expressjs.com/) - Backend framework

### Core Team

- **Brian Manomaisupat** - Frontend, Session management
- **Lucian Cheng** - Frontend, API use, Hosting
- **Nicholas Jano** - Backend, API use, Redis/Docker setup
- **Nathan Chan** - Frontend, Input forms
- **Jay Liang** - Marketing, Growth, QA

### Special Thanks

- The LeetCode community for inspiration
- All users who provide feedback and bug reports
- Open source contributors who make projects like this possible

---

<div align="center">

  ### Made with ❤️ by the LeetBuddy Team

  **Star this repo if you find it helpful!** ⭐

  [Website](https://leetbuddy.app) • [Chrome Extension](https://chromewebstore.google.com/detail/nlemdecocfoaimdbfgpilfgdmcllhphn) • [GitHub](https://github.com/LeetBuddyAI)

</div>
