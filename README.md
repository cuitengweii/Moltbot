# ClawdTM Clone

A complete clone of the ClawdTM website - Skills for OpenClaw marketplace.

## Features

- Responsive design with dark/light mode support
- Skill browsing and search functionality
- Category-based skill organization
- Modern UI with Tailwind CSS
- Supabase integration for backend
- Mobile-first design

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Backend**: Supabase
- **Build Tool**: Vite
- **Fonts**: Inter, JetBrains Mono

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
├── index.html          # Main HTML file
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
├── vite.config.js      # Vite configuration
└── README.md          # Project documentation
```

## Environment Variables

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
```

## Deployment

The project is configured for easy deployment to platforms like Vercel, Netlify, or GitHub Pages.

## License

MIT License