# Colo Sagu Website

Official website for Colo Sagu organization.

## Project Structure

This project uses a monorepo structure with both frontend (React/Vite) and backend (Express) in the same repository:

```
/
├─ server/             # Backend Express code (PM2)
├─ dist/               # Frontend build output (Vite)
├─ src/                # Frontend source code
├─ public/             # Public assets
└─ (Other files)       # Configuration files
```

## Persistent Upload Directories

The application uses these persistent upload directories that should be set up on the VPS:

```
/srv/data/colosagu/
├─ gallery/            # Gallery images
├─ blog-images/        # Blog post images
└─ lovable-uploads/    # Other uploads
```

## Development Setup

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/colosagu-website.git
   cd colosagu-website
   ```

2. Create a `.env` file based on `env.template`

   ```bash
   cp env.template .env
   # Edit .env with your local configuration
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Start development servers
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start frontend in development mode
- `npm run dev:server` - Start backend in development mode
- `npm run build` - Build frontend for production
- `npm run start` - Start backend server directly with Node.js
- `npm run start:pm2` - Start backend server with PM2
- `npm run restart` - Restart backend server with PM2
- `npm run stop` - Stop backend server with PM2
- `npm run logs` - View backend server logs from PM2
