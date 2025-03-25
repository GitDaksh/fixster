# 🛠️ Fixster

<div align="center">
  
  <p align="center">
    An AI-powered code debugging and development assistant
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#usage">Usage</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

## ✨ Features

- 🤖 **AI-Powered Debugging** - Get intelligent suggestions and fixes for your code
- 💻 **Interactive Code Editor** - Built-in Monaco editor with syntax highlighting
- 🌈 **Multi-Language Support** - JavaScript, TypeScript, Python, Java, and C++
- 💬 **AI Chat Assistant** - Real-time coding help and explanations
- 📁 **Project Management** - Organize and manage your coding projects
- 🌙 **Dark Mode** - Easy on the eyes with a beautiful dark theme
- 🔄 **Real-time Updates** - Instant feedback and code analysis
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14 with App Router
- **UI Components**: Tailwind CSS
- **Authentication**: Clerk
- **AI Integration**: Google Gemini
- **Code Editor**: Monaco Editor
- **State Management**: React Hooks
- **Animations**: Framer Motion
- **Icons**: Lucide Icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key
- Clerk account

### Installation

1. Clone the repository
```bash
git clone https://github.com/GitDaksh/fixster.git
cd fixster
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

1. **Sign in** using your account
2. **Create a new project** or select an existing one
3. **Write or paste code** in the editor
4. **Run the code** to see the output
5. **Get AI assistance** through the chat interface
6. **Save your work** and manage projects

## 🎯 Key Features in Detail

### AI Code Analysis
- Real-time code debugging suggestions
- Performance optimization tips
- Security vulnerability detection
- Best practices recommendations

### Project Management
- Create and organize multiple projects
- Save code snippets
- Track debugging history
- Share projects with team members

### Code Editor Features
- Syntax highlighting
- Auto-completion
- Error detection
- Multiple language support
- File saving and downloading

### Chat Assistant
- Context-aware coding help
- Code explanations
- Best practices guidance
- Error troubleshooting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.dev/)
- [Google Gemini](https://deepmind.google/technologies/gemini/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/GitDaksh">GitDaksh</a>
</div>
