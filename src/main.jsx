import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import AddProductPage from './views/addproduct.jsx';  // Correct import
import UserMainPage from './views/usermain.jsx';
import UserProfilePage from "./views/userprofile"
import Login from './views/login.jsx'; 
import UserViewProduct from './views/user_viewProduct.jsx';
import UserCart from './views/cart.jsx';

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
    path: "/profile",  // Add this route for the UserProfilePage
    element: <UserProfilePage role="user"/>,
  },
  {
    path: "/login",
    element: <Login />, 
  },
  {
    path: "/products",
    element: <UserViewProduct role="user"/>, 
  },
  {
    path: "/cart",
    element: <UserCart/>, 
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
