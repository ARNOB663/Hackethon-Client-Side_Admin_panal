# Farmer Admin Panel

Admin dashboard for managing farmers and crop batches in Bangladesh.

## Features

- 📊 **Dashboard** - Overview stats for farmers and crop batches
- 👨‍🌾 **Farmer Management** - View, verify, suspend, and manage farmers
- 🌾 **Crop Batch Management** - Track harvests, storage locations, and crop data
- 🔐 **Admin Authentication** - Secure login for administrators

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **React Query** - Server state management
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd admin_front_end

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:8080`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── layout/     # Layout components (AdminLayout, Sidebar)
│   └── ui/         # shadcn/ui components
├── contexts/       # React contexts (Auth)
├── hooks/          # Custom hooks
├── lib/            # Utilities and API functions
├── pages/          # Page components
└── types/          # TypeScript type definitions
```

## License

MIT
