# 🏠 House App - Real Estate Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)

A modern, full-stack real estate platform built with **Nuxt.js 4**, **TypeScript**, **Turso DB**, and **Vue.js 3**. Features include house listings, favorites management, viewing history, and comprehensive property management.

## ✨ Features

- 🏡 **House Listings**: Browse and search available properties
- ❤️ **Favorites**: Save and manage favorite properties
- 📊 **Search & Filter**: Advanced property search with multiple filters
- 📱 **Responsive Design**: Mobile-first, fully responsive interface
- 🎨 **Modern UI**: Clean, professional design with YBK branding
- 📈 **History Tracking**: Keep track of viewed properties
- 🔐 **Property Management**: Create, edit, and delete listings
- 🖼️ **Image Upload**: Support for property images with Vercel Blob storage
- ⚡ **Performance**: Fast loading with server-side rendering

## 🛠 Tech Stack

- **Frontend**: Nuxt.js 4, Vue.js 3, TypeScript, SCSS
- **Database**: Turso (SQLite-based)
- **Storage**: Vercel Blob Storage
- **Styling**: SCSS with custom design system
- **Testing**: Vitest
- **Linting**: ESLint with TypeScript support
- **ORM**: Drizzle ORM 

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

```bash
# Turso Database Configuration
TURSO_DB_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token_here

# Vercel Blob Storage (auto-generated when deployed to Vercel)
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here

# Cron Job Security (generate a random string)
CRON_SECRET=your_random_cron_secret_here
```

### Setup Turso Database

1. Install Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
2. Sign up: `turso auth signup`
3. Create database: `turso db create house-app`
4. Get database URL: `turso db show house-app --url`
5. Create auth token: `turso db tokens create house-app`
6. Add credentials to `.env` file

### Push Database Schema

```bash
pnpm db:push
```

### Seed Database with Default Houses

```bash
pnpm db:seed
```

### Vercel Blob Storage

When deployed to Vercel, the `BLOB_READ_WRITE_TOKEN` is automatically configured. For local development, you can create a test token from your Vercel project settings.

## 🚀 Live Demo

[View Live Demo](https://house-app-coral.vercel.app/)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for detailed information.

### 📋 Quick Start for Contributors

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/house-app.git`
3. **Create** a feature branch: `git checkout -b feature/your-feature-name`
4. **Make** your changes and test thoroughly
5. **Commit** with clear messages: `git commit -m "feat: add your feature"`
6. **Push** to your fork: `git push origin feature/your-feature-name`
7. **Create** a Pull Request with detailed description

### ⚠️ Important Notes

- 🔒 **No direct commits to main branch** - All changes must go through Pull Requests
- 👤 **Merge authority**: Only the repository owner can merge PRs
- ✅ **Testing required**: Ensure all tests pass before submitting PR
- 📝 **Documentation**: Update docs for any new features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### License Summary

- ✅ **Commercial use** allowed
- ✅ **Modification** allowed  
- ✅ **Distribution** allowed
- ✅ **Private use** allowed
- ❗ **License and copyright notice** must be included
- ❗ **No warranty** provided

## 👨‍💻 Author

**Yazan Bakour** - *YBK Digital Services*
- Website: [ybk.wtf](https://ybk.wtf)
- GitHub: [@yazan-bakour](https://github.com/yazan-bakour)
- Email: yazan@ybk.wtf

## 🙏 Acknowledgments

- Built with [Nuxt.js](https://nuxt.com/) - The Intuitive Vue Framework
- Database powered by [Turso](https://turso.tech/) - Edge SQLite
- Styled with custom SCSS design system
- Icons and imagery from various open-source projects

## 📊 Project Stats

- **Lines of Code**: 10,000+ (TypeScript, Vue, SCSS)
- **Components**: 15+ reusable Vue components
- **Pages**: 8+ fully responsive pages
- **Database Tables**: 2 (Houses, with extensible schema)
- **API Endpoints**: 8+ RESTful endpoints

---

**⭐ If you find this project helpful, please consider giving it a star!**

Made with ❤️ by [YBK Digital Services](https://ybk.wtf)
