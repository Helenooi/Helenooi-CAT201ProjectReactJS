import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import AddProductPage from './views/addproduct.jsx';  // Correct import
import UserMainPage from './views/usermain.jsx';

import Login from './views/login.jsx'; 

import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />, 
  },
  {
    path: "/addproduct",
    element: <AddProductPage />, 
  },

  {
    path: "/userpage",
    element: <UserMainPage />,  
  },

  {
    path: "/adminpage",
    element: <App />,  
  },
  {
    path: "/login",
    element: <Login />, 
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
