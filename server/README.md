# Dev Tools Server

TypeScript Express backend server for the tools-for-frontend application.

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the server in development mode with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3001` (or the port specified in `.env`).

### Build

Build the TypeScript code:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

### Environment Variables

Create a `.env` file in the server directory:

```
PORT=3001
NODE_ENV=development
```

## Project Structure

```
server/
├── src/
│   ├── index.ts          # Main server entry point
│   ├── routes/           # API routes
│   └── middleware/       # Express middleware
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check without building

