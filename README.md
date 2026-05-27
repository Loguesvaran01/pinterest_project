# PinVault 📌 — Pinterest-Inspired Full Stack Application

<div align="center">

![PinVault](https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&h=400&fit=crop&auto=format)

**A production-quality Pinterest-inspired visual discovery platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-latest-green?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=flat-square)](https://framer.com/motion)
[![Express.js](https://img.shields.io/badge/Express.js-4-grey?style=flat-square&logo=express)](https://expressjs.com)

</div>

---

## ✨ Features

### Frontend
- 🎨 **Pinterest-style masonry grid** with CSS columns
- ∞ **Infinite scroll** using Intersection Observer API
- 🔐 **JWT Authentication** with Zustand persistent store
- 🌙 **Dark mode** support with smooth transitions
- 💫 **Framer Motion** animations throughout
- 📱 **Mobile-first responsive** design
- 🔍 **Live search** with category filtering
- ❤️ **Like & Save** with optimistic UI updates
- 💬 **Comment system** with real-time updates
- 📸 **Drag-and-drop** image upload with preview
- 💀 **Skeleton loading** effects
- 🎯 **SEO optimized** with Next.js metadata API

### Backend
- 🛡️ **JWT Authentication** with bcrypt password hashing
- 📂 **RESTful API** architecture
- 🖼️ **Cloudinary** image upload and management
- 🔒 **Rate limiting** with express-rate-limit
- ✅ **Input validation** with express-validator
- 🪝 **Helmet** security headers
- 📊 **MongoDB** with Mongoose ODM
- 🔄 **Pagination** with cursor-based infinite scroll support
- 👥 **Follow/Unfollow** system
- 🌱 **Database seeder** with sample data

---

## 📁 Folder Structure

```
pinterest project/
├── client/                     # Next.js 14 Frontend
│   ├── app/                    # App Router pages
│   │   ├── page.tsx            # Homepage
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   ├── post/[id]/          # Post detail
│   │   ├── profile/[username]/ # User profile
│   │   ├── create/             # Create post
│   │   ├── explore/            # Explore page
│   │   ├── search/             # Search page
│   │   ├── saved/              # Saved posts
│   │   ├── globals.css         # Global styles
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── layout/             # Navbar, HeroSection, DarkModeProvider
│   │   ├── posts/              # PinCard, MasonryGrid, CategoryFilter
│   │   ├── profile/            # Profile components
│   │   └── ui/                 # EmptyState, Modal, etc.
│   ├── services/               # Axios API services
│   ├── store/                  # Zustand state management
│   ├── types/                  # TypeScript interfaces
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   └── public/                 # Static assets
│
└── server/                     # Node.js + Express Backend
    ├── controllers/             # Business logic
    ├── routes/                  # API route definitions
    ├── models/                  # Mongoose schemas
    ├── middleware/              # Auth, validation, error handling
    ├── config/                  # Database & Cloudinary config
    ├── utils/                   # Seeder & helpers
    └── server.js               # Entry point
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org)
- **MongoDB** — Local or [MongoDB Atlas](https://cloud.mongodb.com) (free)
- **Cloudinary** account — [Sign up free](https://cloudinary.com)

---

### 1. Clone & Install

```bash
# Clone the project
git clone <your-repo-url>
cd "pinterest project"

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

### 2. Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pinvault
JWT_SECRET=your_super_secret_key_at_least_32_chars
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

**Frontend** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=PinVault
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 3. Database Setup

```bash
# Start MongoDB locally (or use Atlas)
mongod

# Seed database with sample data
cd server
npm run seed
```

**Demo accounts after seeding:**
| Email | Password |
|-------|----------|
| alex@pinvault.com | password123 |
| sarah@pinvault.com | password123 |
| jake@pinvault.com | password123 |
| mia@pinvault.com | password123 |

---

### 4. Run the Application

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# → Running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# → Running on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

---

## 📡 API Reference

### Auth Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |
| PUT | `/api/auth/change-password` | Change password |

### Post Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/posts` | Get all posts (paginated) |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts` | Create post (auth) |
| PUT | `/api/posts/:id` | Update post (auth, owner) |
| DELETE | `/api/posts/:id` | Delete post (auth, owner) |
| POST | `/api/posts/:id/like` | Toggle like (auth) |
| POST | `/api/posts/:id/save` | Toggle save (auth) |
| GET | `/api/posts/saved` | Get saved posts (auth) |

### User Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users/:username` | Get profile |
| GET | `/api/users/:username/posts` | Get user posts |
| PUT | `/api/users/profile/update` | Update profile (auth) |
| POST | `/api/users/:id/follow` | Toggle follow (auth) |
| GET | `/api/users/search?q=` | Search users |
| GET | `/api/users/me/suggestions` | Follow suggestions (auth) |

### Comment Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/comments/:postId` | Get post comments |
| POST | `/api/comments/:postId` | Add comment (auth) |
| PUT | `/api/comments/:id` | Update comment (auth) |
| DELETE | `/api/comments/:id` | Delete comment (auth) |
| POST | `/api/comments/:id/like` | Like comment (auth) |

---

## ☁️ Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo, set root directory to `client`
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
5. Deploy!

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set root directory to `server`
4. **Build command:** `npm install`
5. **Start command:** `node server.js`
6. Add environment variables (same as `.env`)
7. Set `NODE_ENV=production`
8. Deploy!

### Database → MongoDB Atlas

1. Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Get connection string and set `MONGODB_URI` in Render

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| **State** | Zustand with persistence |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, bcryptjs |
| **Images** | Cloudinary, Multer |
| **Icons** | Lucide React |
| **Validation** | express-validator |
| **Security** | Helmet, express-rate-limit |

---

## 🛠️ Development Commands

```bash
# Backend
npm run dev          # Dev server with nodemon
npm start            # Production start
npm run seed         # Seed database

# Frontend
npm run dev          # Next.js dev server
npm run build        # Production build
npm start            # Serve production build
npm run lint         # ESLint check
```

---

## 🔮 Future Roadmap

- [ ] Board/Collection system (like Pinterest boards)
- [ ] Real-time notifications with Socket.io
- [ ] Image AI tagging with Cloudinary AI
- [ ] PWA support
- [ ] Google OAuth login
- [ ] Email notifications
- [ ] Stories/Reels feature
- [ ] Analytics dashboard

---

## 📄 License

MIT License — feel free to use this project for your portfolio!

---

<div align="center">
  Built with ❤️ by the PinVault team | Ready for production 🚀
</div>
