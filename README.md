# BookHub - Book Discovery Platform

A modern, SEO-optimized book discovery platform built with Nuxt 4, featuring authentication, book browsing, and category exploration.

## Features

- 🔐 **Authentication System** - Login and registration with form validation
- 📚 **Book Browsing** - Browse and search through book collections
- 🏷️ **Categories** - Explore books by category
- 🔍 **Search Functionality** - Search books by title or author
- 📱 **Responsive Design** - Mobile-first, fully responsive UI
- ⚡ **Performance Optimized** - Image optimization, lazy loading, and code splitting
- 🎯 **SEO Optimized** - Meta tags, structured data, and semantic HTML
- 🎨 **Modern UI** - Built with Nuxt UI and Tailwind CSS
- 🔒 **Type Safe** - Full TypeScript support

## Tech Stack

- **Framework**: Nuxt 4
- **UI Library**: Nuxt UI
- **Styling**: Tailwind CSS
- **Image Optimization**: @nuxt/image
- **SEO**: @nuxtjs/seo
- **Validation**: Zod
- **Fonts**: Google Fonts (Inter, Playfair Display)

## Project Structure

```
app/
├── components/          # Vue components
│   ├── AppHeader.vue    # Main navigation header
│   ├── AppFooter.vue    # Site footer
│   ├── BookCard.vue     # Book card component
│   └── CategoryCard.vue # Category card component
├── composables/         # Composable functions
│   ├── useApi.ts        # API client with error handling
│   └── useAuth.ts       # Authentication state management
├── layouts/             # Layout components
│   ├── default.vue      # Default layout with header/footer
│   └── auth.vue         # Authentication pages layout
├── middleware/          # Route middleware
│   ├── auth.ts          # Protected routes
│   └── guest.ts         # Guest-only routes
├── pages/               # Application pages
│   ├── index.vue        # Homepage
│   ├── auth/            # Authentication pages
│   │   ├── login.vue    # Login page
│   │   └── register.vue # Registration page
│   └── books/           # Book pages
│       └── index.vue    # Books listing page
└── css/                 # Global styles
    └── main.css         # Main stylesheet
```

## Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd nuxt
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file (optional, for API configuration):

```env
API_BASE_URL=https://api.example.com
SITE_URL=https://bookhub.com
```

4. Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your application.

## API Integration

The application is fully API-ready. Configure your API endpoint in `nuxt.config.ts` or via environment variables:

```typescript
runtimeConfig: {
  public: {
    apiBase: process.env.API_BASE_URL || 'https://api.example.com';
  }
}
```

### Expected API Endpoints

The application expects the following API structure:

#### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

**Login Response:**

```json
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token-here"
}
```

#### Books

- `GET /books` - Get books list (supports query params: `page`, `limit`, `search`, `sort`)
- `GET /books/:id` - Get book details
- `GET /books/search?q=query` - Search books

**Books Response:**

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### Categories

- `GET /categories` - Get categories list
- `GET /categories/:id/books` - Get books by category

## Features in Detail

### Authentication

- **Login Page** (`/auth/login`): Email/password authentication with validation
- **Register Page** (`/auth/register`): User registration with password confirmation
- **Auth State Management**: Persistent authentication using localStorage
- **Protected Routes**: Use `middleware: 'auth'` in page meta
- **Guest Routes**: Use `middleware: 'guest'` for login/register pages

### SEO Optimization

- Meta tags for all pages
- Open Graph tags for social sharing
- Twitter Card support
- Structured data (JSON-LD)
- Semantic HTML
- Proper heading hierarchy
- Alt text for images

### Performance

- Image optimization with @nuxt/image
- Lazy loading for images
- Code splitting
- Compressed assets
- Optimized fonts loading

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm generate` - Generate static site

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Vue 3 Composition API
- Nuxt 4 conventions

## Customization

### Changing Colors

Edit `nuxt.config.ts` to customize the color scheme. The app uses Nuxt UI's default color palette.

### Adding New Pages

1. Create a new `.vue` file in `app/pages/`
2. Use `useSeoMeta()` for SEO
3. Add navigation links in `AppHeader.vue`

### API Error Handling

The `useApi` composable includes automatic error handling:

- 401 errors automatically log out users
- Error messages are displayed to users
- Network errors are handled gracefully

## Deployment

### Build for Production

```bash
pnpm build
```

### Deploy to Vercel/Netlify

The application is ready for deployment on platforms like Vercel or Netlify. Make sure to set environment variables:

- `API_BASE_URL` - Your API endpoint
- `SITE_URL` - Your site URL (for SEO)

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
