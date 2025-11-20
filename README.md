# Nexon - AI-Powered Content Creation Platform

## 🚀 Overview

Nexon is a comprehensive AI-powered platform that enables users to generate articles, blog titles, images, and perform various AI-driven tasks. Built with modern web technologies and integrated with multiple AI services.

## ✨ Features

- **AI Content Generation**
  - Write articles with customizable length
  - Generate catchy blog titles
  - Create images from text prompts
  - Background removal for images
  - Object removal from photos
  - Resume review and analysis

- **User Management**
  - Secure authentication with Clerk
  - User profiles and preferences
  - Creation history tracking
  - Like/Unlike functionality for community creations

- **Community Features**
  - Public creation gallery
  - Social interactions (likes, sharing)
  - User-generated content showcase

- **Premium Features**
  - Enhanced AI capabilities
  - Unlimited generations
  - Priority processing
  - Advanced image editing

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Clerk** - Authentication and user management
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Neon Database** - Serverless PostgreSQL
- **OpenAI API** - AI text generation (Gemini 2.0 Flash)
- **Cloudinary** - Image storage and manipulation
- **ClipDrop API** - AI image generation
- **Multer** - File upload handling

### Database
- **PostgreSQL** (via Neon)

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon account)
- Clerk account for authentication
- OpenAI API key
- Cloudinary account
- ClipDrop API key

#### Server (.env)
```env
PORT=5000
DATABASE_URL=your_neon_database_url
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_openai_api_key
CLIPDROP_API_KEY=your_clipdrop_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd nexon
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Set up environment variables**
   - Copy `.env.example` to `.env` in both client and server directories
   - Fill in your API keys and configuration values

5. **Start the development servers**

In terminal 1 (Server):
```bash
cd server
npm run dev
```

In terminal 2 (Client):
```bash
cd client
npm run dev
```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🌐 API Endpoints

### Authentication
- All endpoints require Clerk authentication
- JWT tokens are validated on each request

### AI Generation
- `POST /api/ai/generate-article` - Generate articles
- `POST /api/ai/generate-blog-titles` - Create blog titles
- `POST /api/ai/generate-image` - Text-to-image generation

### User Management
- `GET /api/user/get-user-creations` - Get user's creations
- `GET /api/user/get-public-creations` - Get community creations
- `POST /api/user/toggle-like-creation/:id` - Like/unlike creations

### File Upload
- `POST /api/ai/remove-background` - Remove image backgrounds
- `POST /api/ai/remove-object` - Remove objects from images

## 🚀 Deployment

### Vercel Deployment

1. **Frontend Deployment**
```bash
cd client
vercel --prod
```

2. **Backend Deployment**
```bash
cd server
vercel --prod
```

3. **Environment Variables**
   - Set all environment variables in Vercel dashboard
   - Update `VITE_BASE_URL` to production backend URL


1. Create Neon database
2. Run SQL migrations for required tables:

```sql
CREATE TABLE creations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  publish BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  creation_id INTEGER REFERENCES creations(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, creation_id)
);
```

## 🔐 Security Features

- **JWT Authentication** via Clerk
- **Input validation** and sanitization
- **Rate limiting** for API endpoints
- **CORS protection**
- **Environment variable protection**
- **SQL injection prevention**


### Premium Plan
- Unlimited generations
- Advanced AI models (GPT-4, DALL-E 3)
- Priority support
- Enhanced features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT models
- Clerk for authentication
- Cloudinary for image management
- ClipDrop for AI image generation
- Neon for serverless PostgreSQL
- Vercel for hosting platform


Built with ❤️ by [Muneeb Khan](https://github.com/Muneebkhnnn)