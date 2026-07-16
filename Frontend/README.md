# CodeX Frontend

This directory contains the React + Vite frontend application for the CodeX Club platform. It encompasses public landing pages, event listings, and a comprehensive portal for members and administrators.

## 🚀 Tech Stack

The Frontend is built using modern web technologies to ensure a fast, responsive, and maintainable application:

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & `react-redux`
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Rich Text Editing:** [TinyMCE React](https://www.tiny.cloud/docs/integrations/react/)

## 📦 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

Navigate into the `Frontend` directory and install the dependencies:

```bash
cd Frontend
npm install
```

### Environment Variables

Create a `.env` file in the root of the `Frontend` directory. You can configure frontend-specific variables here:

```env
# Example environment variables
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

*(Note: Vite requires custom environment variables to be prefixed with `VITE_`)*.

### Development Server

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The app will typically be available at `http://localhost:5173`.

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev` — Starts the Vite development server.
- `npm run build` — Compiles and minifies the application for production.
- `npm run preview` — Boots up a local static web server that serves the files from `dist` (useful to preview the production build locally).
- `npm run lint` — Runs ESLint across the codebase to catch errors and enforce code style.

## 🧪 Testing

There are no automated tests included by default in the `Frontend` directory. 
Please add unit or integration tests (e.g., using Jest or Cypress) in the root `Testing/` directory, and update the CI/CD pipeline accordingly.

## 🤝 Contributing

For details on setting up the full stack locally (Frontend + Backend + MongoDB) and contributing guidelines, please refer to the [Root CONTRIBUTING.md](../CONTRIBUTING.md).
