import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import Layout from './pages/Layout'
import WriteArticle from './pages/WriteArticle'
import RemoveBg from './pages/RemoveBg'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import { ClerkProvider } from '@clerk/clerk-react'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/ai",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "write-article", element: <WriteArticle /> },
      { path: "blog-titles", element: <BlogTitles /> },
      { path: "generate-images", element: <GenerateImages /> },
      { path: "remove-background", element: <RemoveBg /> },
      { path: "remove-object", element: <RemoveObject /> },
      { path: "review-resume", element: <ReviewResume /> },
      { path: "community", element: <Community /> },
    ]
  }
]);

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(

  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
    <RouterProvider router={router}>
    </RouterProvider>
  </ClerkProvider>
);
