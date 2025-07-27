# Just an Agent - AI-Powered assitant platform

Nexly is a modern AI-powered assistant platform with a Next.js frontend and Express.js backend, featuring comprehensive authentication, search capabilities, and AI integration.

## ✨ Features

### 🔐 Authentication & User Management

- **OAuth Integration**: Google and GitHub authentication
- **Local Authentication**: Email/password registration and login
- **JWT Token Management**: Secure authentication with HTTP-only cookies
- **User Profiles**: Profession-based user categorization with 21+ professions
- **Password Security**: bcrypt hashing with secure password policies

### 🎨 Frontend Features

- **Modern UI**: Built with Next.js 13+ App Directory and TypeScript
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Support**: Dark, light, and system theme switching
- **Component Library**: shadcn/ui components for consistent design
- **Form Validation**: Client-side and server-side validation
- **Password Visibility**: Toggle functionality for password fields
- **Profession Selector**: Searchable combobox with 21+ professions

### 🤖 AI & Search Capabilities

- **AI-powered search**: Groq integration with configurable models
- **Web Search**: Exa API integration for real-time web search
- **Session management**: Persistent conversation memory
- **Memory service**: Context-aware AI responses
- **Configurable AI models**: Support for multiple AI providers

### 🛡️ Security & Performance

- **Rate Limiting**: Express rate limiting for API protection
- **CORS Configuration**: Secure cross-origin resource sharing
- **Helmet Security**: Security headers and protection
- **Environment Configuration**: Comprehensive environment variable management
- **Session Security**: Secure session management with secrets

## 🏗️ Project Structure

```
nexly/
├── frontend/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/             # Next.js 13+ App Directory
│   │   │   ├── auth/        # Authentication pages
│   │   │   │   ├── success/ # OAuth success handler
│   │   │   │   └── error/   # OAuth error handler
│   │   │   ├── sign-in/     # Sign-in page
│   │   │   ├── sign-up/     # Sign-up page
│   │   │   ├── globals.css  # Global styles
│   │   │   ├── layout.tsx   # Root layout with theme provider
│   │   │   └── page.tsx     # Home page
│   │   ├── components/      # React Components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── combobox.tsx
│   │   │   │   └── ...
│   │   │   ├── signIn.tsx   # Sign-in form component
│   │   │   ├── signUp.tsx   # Sign-up form component
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── lib/
│   │   │   └── utils.ts     # Utility functions
│   │   └── services/
│   │       └── auth.ts      # Authentication service
│   ├── components.json      # shadcn/ui configuration
│   ├── next.config.ts       # Next.js configuration
│   ├── package.json         # Frontend dependencies
│   └── tsconfig.json        # TypeScript configuration
│
└── backend/                  # Express.js Backend Application
    ├── config/              # Configuration files
    │   ├── constants.js     # Environment constants
    │   ├── database.js      # MongoDB connection
    │   └── passport.js      # OAuth strategies
    ├── controllers/         # Route controllers
    │   ├── authController.js # Authentication logic
    │   ├── chatHistoryController.js
    │   ├── healthController.js
    │   ├── searchController.js
    │   └── sessionController.js
    ├── middleware/          # Custom middleware
    │   ├── auth.js         # JWT authentication middleware
    │   └── index.js        # Middleware exports
    ├── models/             # Data models
    │   ├── User.js         # User model with OAuth support
    │   ├── ChatHistory.js  # Chat history model
    │   └── groq.js         # Groq AI model configuration
    ├── routes/             # API routes
    │   ├── auth.js         # Authentication routes
    │   └── index.js        # Route exports
    ├── services/           # Business logic services
    │   ├── ai.js           # AI service integration
    │   ├── cache.js        # Caching service
    │   ├── chatHistory.js  # Chat history management
    │   ├── memory.js       # Memory service
    │   └── search.js       # Search service with Exa API
    ├── utils/              # Utility functions
    │   ├── benchmark.js    # Performance benchmarking
    │   └── helpers.js      # Helper functions
    ├── .env                # Environment variables
    ├── package.json        # Backend dependencies
    └── server.js           # Main server file
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local MongoDB
- Google Cloud Console account (for Google OAuth)
- GitHub Developer account (for GitHub OAuth)
- Groq API account
- Exa API account

### 1. Clone the Repository

```bash
git clone https://github.com/Jayanth1312/nexly.git
cd nexly
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
# Environment
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=your-mongodb-connection-string

# External APIs
EXA_SEARCH_API_KEY=your-exa-search-api-key
EXA_API_KEY=your-exa-api-key
GROQ_API_KEY=your-groq-api-key

# Groq Model Configuration
MODEL_NAME=llama-3.1-70b-versatile
MODEL_TEMPERATURE=0.7
MODEL_MAX_TOKENS=1200

# Performance & Memory Configuration
MAX_MEMORY_SIZE=250
SEARCH_TIMEOUT=15000
MODEL_TIMEOUT=15000

# JWT & Session (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration
RESEND_API_KEY=RESEND_API_STARTS_WITH: re
EMAIL_FROM=Nexly <onboarding@resend.dev>

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. OAuth Setup

#### Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Add authorized JavaScript origins: `http://localhost:3000`

#### GitHub OAuth:

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:5000/auth/github/callback`

## 🖥️ Running the Application

### Development Mode

1. **Start the Backend Server:**

```bash
cd backend
npm start
```

Backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server:**

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### Production Mode

1. **Build the Frontend:**

```bash
cd frontend
npm run build
npm start
```

2. **Run Backend in Production:**

```bash
cd backend
NODE_ENV=production npm start
```

## 📡 API Endpoints

### Authentication Routes

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `GET /auth/google` - Google OAuth initiation
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/github` - GitHub OAuth initiation
- `GET /auth/github/callback` - GitHub OAuth callback

### Application Routes

- `GET /health` - Health check endpoint
- `POST /search` - AI-powered search
- `GET /sessions` - Get user sessions
- `POST /sessions` - Create new session
- `GET /chat-history` - Get chat history

## 🛠️ Technologies Used

### Frontend

- **Next.js 15+** - React framework with App Directory
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **next-themes** - Theme management
- **axios** - HTTP client
- **js-cookie** - Cookie management
- **Lucide React** - Icon library

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database and ODM
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **Groq AI** - AI model integration
- **Exa API** - Web search capabilities
- **Langchain** - AI framework

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

## 🔒 Security Features

- **JWT Authentication** with secure HTTP-only cookies
- **OAuth 2.0** integration with Google and GitHub
- **Password hashing** with bcryptjs
- **Rate limiting** to prevent abuse
- **CORS** configuration for secure cross-origin requests
- **Helmet** for security headers
- **Environment variable** protection
- **Input validation** on both client and server

## 🎨 UI/UX Features

- **Responsive design** for all screen sizes
- **Dark/Light/System theme** support
- **Accessible components** with proper ARIA labels
- **Loading states** and error handling
- **Form validation** with user feedback
- **Professional design** with consistent styling
- 
## 🔧 Configuration

### Environment Variables

All sensitive configuration is managed through environment variables. See the installation section for complete `.env` setup.

### AI Model Configuration

- Supports multiple Groq AI models
- Configurable temperature and token limits
- Timeout management for reliability

### Search Configuration

- Exa API integration for web search
- Configurable search timeouts
- Memory management for optimal performance

## 📚 Development

### Adding New Features

1. Backend routes go in `/backend/routes/`
2. Frontend pages go in `/frontend/src/app/`
3. Shared components go in `/frontend/src/components/`
4. API services go in `/frontend/src/services/`

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Consistent naming conventions
- Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 👥 Authors

- **Jayanth Paladugu** - Initial work and development

## 🙏 Acknowledgments

- shadcn/ui for the excellent component library
- Groq for AI capabilities
- Exa for search functionality
- Vercel for Next.js framework
