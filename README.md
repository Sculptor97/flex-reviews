# Flex Living Reviews Dashboard

A modern, responsive reviews management dashboard built with Next.js 15, TypeScript, and Tailwind CSS. This application allows property managers to view, filter, and manage guest reviews from multiple platforms including Airbnb, Booking.com, and VRBO.

## 🚀 Features

### Public Reviews Page
- **Featured Property Showcase**: Beautiful property display with Unsplash images
- **Guest Reviews**: Filterable and searchable review system
- **Rating System**: Star-based rating display with sentiment analysis
- **Responsive Design**: Mobile-first approach with modern UI/UX

### Dashboard Management
- **Review Management**: Approve, reject, and respond to reviews
- **Analytics Dashboard**: Comprehensive review analytics and insights
- **Multi-Platform Integration**: Support for Airbnb, Booking.com, and VRBO
- **Real-time Updates**: Live data synchronization

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Modern UI Components**: Built with Radix UI and custom design system
- **Brand Consistency**: Custom color palette (Teal, Cream, Sage)
- **Database Integration**: MongoDB with Mongoose ODM
- **API Routes**: RESTful API endpoints for review management

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1
- **UI Components**: Radix UI
- **Database**: MongoDB with Mongoose
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Package Manager**: pnpm

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **MongoDB** (local instance or MongoDB Atlas)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd reviews-dashboard-ts
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/flex-living-reviews
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flex-living-reviews

# Optional: Google API (for Google Reviews integration)
GOOGLE_API_KEY=your_google_api_key

# Optional: Hostaway API (for Hostaway integration)
HOSTAWAY_API_KEY=your_hostaway_api_key
HOSTAWAY_API_SECRET=your_hostaway_api_secret
```

### 4. Database Setup

If using a local MongoDB instance:

```bash
# Start MongoDB (if not already running)
mongod

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Run the Development Server

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
reviews-dashboard-ts/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── reviews/              # Review API endpoints
│   ├── dashboard/                # Management dashboard
│   ├── reviews/                  # Public reviews page
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   └── ui/                      # Radix UI components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── models/                      # Mongoose models
├── services/                    # API service functions
├── types/                       # TypeScript type definitions
└── public/                      # Static assets
```

## 🎨 Design System

The application uses a custom brand color palette:

- **Brand Teal**: `#284e4c` - Primary brand color
- **Brand Cream**: `#fffdf6` - Light background color
- **Brand Sage**: `#f1f3ee` - Subtle accent color
- **Brand Dark**: `#111827` - Text and dark elements

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
# The application automatically connects to MongoDB on startup
```

## 🌐 API Endpoints

### Reviews API
- `GET /api/reviews/combined` - Get all reviews
- `GET /api/reviews/google` - Get Google reviews
- `GET /api/reviews/hostaway` - Get Hostaway reviews

### Public Reviews
- `GET /api/reviews/public` - Get public reviews for display

## 📱 Pages

### Public Pages
- **Home** (`/`) - Landing page with overview
- **Reviews** (`/reviews`) - Public reviews showcase
- **Documentation** (`/documentation`) - API documentation

### Dashboard Pages
- **Dashboard** (`/dashboard`) - Main management dashboard
- **Reviews Management** (`/dashboard/reviews`) - Review approval system
- **Analytics** (`/dashboard/analytics`) - Review analytics
- **Google Integration** (`/google-integration`) - Google reviews setup

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `GOOGLE_API_KEY` | Google Places API key | No |
| `HOSTAWAY_API_KEY` | Hostaway API key | No |
| `HOSTAWAY_API_SECRET` | Hostaway API secret | No |

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Documentation](/documentation) page
2. Review the console for error messages
3. Ensure all environment variables are properly set
4. Verify MongoDB connection

## 🔄 Updates

To update dependencies:

```bash
# Update all dependencies
pnpm update

# Update specific package
pnpm update package-name
```

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
