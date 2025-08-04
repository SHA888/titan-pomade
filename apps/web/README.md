# Titan Pomade - Web Application

This is the frontend application for Titan Pomade, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- pnpm 8.x

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy the example environment file and update the values:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
src/
├── app/                  # App Router pages and layouts
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Input, etc.)
│   ├── layout/          # Layout components
│   └── features/        # Feature-specific components
├── lib/                 # Utility functions and API client
└── styles/              # Global styles and theme
```

## 🛠️ Development

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Create a production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# App Environment
NODE_ENV=development

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Authentication (to be configured later)
# NEXT_PUBLIC_AUTH0_DOMAIN=
# NEXT_PUBLIC_AUTH0_CLIENT_ID=
# NEXT_PUBLIC_AUTH0_AUDIENCE=
```

## 🎨 Styling

This project uses:

- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) for accessible UI components
- [Lucide Icons](https://lucide.dev/) for icons

## 📦 Dependencies

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- next-themes for dark/light mode
- sonner for toast notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
