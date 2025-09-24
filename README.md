# Prime Verse - Next.js Version

This is a Next.js migration of the Prime Verse landing page with background video and particle effects.

## Features

- **Background Video**: Cloudflare Stream integration with HLS.js support
- **Particle System**: Animated particles in non-video areas
- **Custom Animations**: Fade-in effects and subtle glow animations
- **Responsive Design**: Mobile-first responsive layout
- **Custom Font**: Gonero-ExtraExpanded font integration
- **Interactive Elements**: Button ripple effects and smooth scrolling

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── pages/
│   ├── _app.tsx          # App component with global styles
│   └── index.tsx         # Main landing page
├── styles/
│   └── globals.css       # Global CSS styles
public/
└── fonts/                # Custom font files
```

## Technologies Used

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **HLS.js**: Video streaming support
- **CSS3**: Animations and responsive design

## Deployment

The app can be deployed on Vercel, Netlify, or any other platform that supports Next.js.

For Vercel deployment:

```bash
npm run build
```

## License

This project is private and proprietary.
