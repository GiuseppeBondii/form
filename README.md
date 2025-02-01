# FormalLogic Quest 🔍🚀

[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-181717.svg)](https://pages.github.com)
[![React Version](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)


**Live Demo:**  
https://giuseppebondii.github.io/form/

## ✨ Features

- **📁 GitHub-Powered** - Directly read quizzes from any public GitHub repository
- **⏳ Progress Persistence** - Local storage saves user's progress automatically
- **🎮 Interactive Flow** - Conditional question branching based on answers
- **📱 Fully Responsive** - Optimized for all screen sizes
- **🔐 Zero Backend** - 100% client-side with GitHub as content CMS
- **⚡ Instant Setup** - Deploy to GitHub Pages in minutes

## 🚀 Getting Started

### For Content Creators
1. Create a `.txt` file in your GitHub repo with this format:
   ```txt
   Question 1 :->: answer1
   Question 2 :->: answer2
   Final congratulatory message (optional)
   ```
2. Build your quiz URL:
   ```
   https://giuseppebondii.github.io/form/#/form/<owner>/<repo>/<branch>/<path-to-file>
   ```
3. Share the link with your audience!

### For Developers
```bash
# Clone repository
git clone https://github.com/GiuseppeBondii/form.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🧩 Quiz File Format
Example (`sample-quiz.txt`):
```txt
What is the capital of France? :->: Paris
Solve: 2 + 2 = ? :->: 4
Who created Linux? :->: Linus Torvalds
Congratulations! You've completed the quiz! 🎉
```

## 🛠️ Technical Stack

- **Framework**: React 19 + Vite
- **State Management**: React Hooks
- **Routing**: React Router 7
- **Styling**: CSS Modules + Custom Properties
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## ⚠️ Important Notes

- All quiz content remains property of the original GitHub repository owners
- Maximum recommended file size: 50KB
- Supports UTF-8 encoded text files only

---

**Crafted with ❤️ by Giuseppe Bondi**  
[Report an Issue](https://github.com/GiuseppeBondii/form/issues) | [View Changelog](CHANGELOG.md)
