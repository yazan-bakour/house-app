# Nuxt Minimal Starter

This project is a web application for House listing. built with VueJs, Nuxt 4, Typescript, SCSS, and Vite. 

## Setup

Make sure to install dependencies:

```bash

pnpm install

## Development Server

Start the development server on `http://localhost:3000`:

```bash

pnpm dev

```

## Production

Build the application for production:

```bash

pnpm build

```

Locally preview production build:

```bash

pnpm preview

```

## Environment Variables

To run this project, you must create a `.env` file in the project root with the following variables:

```
DTT_API_KEY=your_api_key_here
DTT_API_URL=/api/houses
```

Replace `your_api_key_here` with your actual API key. These variables are required for the app to connect to the DTT API.
