# 📚 Book Recommendations Frontend

A modern, responsive React application built with Vite, TypeScript, and Tailwind CSS for AI-powered book recommendations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd "f:\projects\book recommendations\frontend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000 (make sure it's running)

## 🏗️ Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── books/         # Book-related components
│   │   └── common/        # Reusable components
│   ├── context/           # React context providers
│   ├── services/          # API services
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Features

### ✅ Already Implemented:
- **Authentication System**: Login/Register with JWT
- **Theme Toggle**: Dark/Light mode
- **Responsive Design**: Mobile-first approach
- **API Integration**: Axios with interceptors
- **Protected Routes**: Authentication guards
- **Context Management**: Auth and Theme contexts
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern styling

### 🚧 Next Steps to Complete:
1. Create BookRecommendations component
2. Create SearchForm component
3. Create BookCard component
4. Create FilterPanel component
5. Add loading states and error handling

## 📱 Responsive Design

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced for tablets (768px+)
- **Desktop**: Full desktop experience (1024px+)

## 🎯 Color Scheme

### Light Mode:
- Primary: Blue tones (#0ea5e9)
- Secondary: Purple accents (#d946ef)
- Accent: Yellow highlights (#eab308)

### Dark Mode:
- Background: Gray-900 (#111827)
- Cards: Gray-800 (#1f2937)
- Text: White/Gray-100

## 🔧 Configuration

### Environment Variables:
Create `.env` file in frontend directory:
```
VITE_API_BASE_URL=http://localhost:8000
```

### API Proxy:
Vite is configured to proxy `/api` requests to `http://localhost:8000`

## 📦 Dependencies

### Core:
- React 18.2.0
- TypeScript 5.2.2
- Vite 5.0.0

### UI & Styling:
- Tailwind CSS 3.3.5
- Lucide React (icons)
- React Hot Toast (notifications)

### Routing & API:
- React Router DOM 6.20.1
- Axios 1.6.2

## 🚀 Build & Deploy

### Development:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```

### Preview Production:
```bash
npm run preview
```

## 🎮 Usage

1. **Register/Login**: Create account or sign in
2. **Search**: Enter natural language queries
3. **Filter**: Use advanced filters for precise results
4. **Browse**: View book recommendations with covers
5. **Toggle Theme**: Switch between light/dark modes

## 📝 API Integration

The frontend connects to your FastAPI backend:
- **Auth**: `/auth/login`, `/auth/register`
- **Books**: `/recommendations`, `/recommendations/filters`
- **JWT**: Automatic token management

## 🎨 Customization

### Colors:
Edit `tailwind.config.js` to change color schemes

### Fonts:
Google Fonts (Inter + Playfair Display) included

### Components:
All components use Tailwind classes for easy customization

---

**Next**: Complete the book components to finish the application! 🚀