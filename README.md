# JamByte

A modern web application built with Next.js, featuring a robust frontend and AWS backend integration.

## 🚀 Tech Stack

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Authentication**: AWS Cognito
- **Deployment**: Cloudflare Pages
- **UI Components**: [Headless UI](https://headlessui.com/), [Heroicons](https://heroicons.com/)
- **Animation**: [GSAP](https://greensock.com/gsap/), [Lottie](https://lottiefiles.com/)
- **PDF Processing**: [PDF-Lib](https://pdf-lib.js.org/)
- **Markdown Processing**: [React Markdown](https://github.com/remarkjs/react-markdown)

## 📋 Prerequisites

- Node.js (LTS version)
- pnpm
- AWS Account (for backend services)
- Cloudflare Account (for deployment)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd jambyte
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
# Add your environment variables here
```

## 🚀 Development

Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
src/
├── app/          # Next.js app router pages
├── components/   # Reusable UI components
├── context/      # React context providers
├── hooks/        # Custom React hooks
├── types/        # TypeScript type definitions
├── data/         # Data fetching and API utilities
└── images/       # Static images and assets
```

## 🧪 Testing

Run the linter:
```bash
pnpm lint
```

## 🚀 Deployment

The application is configured for deployment on Cloudflare Pages:

1. Build the project:
```bash
pnpm pages:build
```

2. Preview locally:
```bash
pnpm preview
```

3. Deploy to production:
```bash
pnpm deploy
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- All contributors and maintainers of the open-source packages used in this project
