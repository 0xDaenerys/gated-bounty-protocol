import React from 'react';
import './App.css'
import { WalletProvider } from './components'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { BountiesPage, BountyCreationPage, BountyPage, HomePage, ProfilePage } from './pages';
import AppProvider from './contexts/AppContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/create",
    element: <BountyCreationPage />
  },
  {
    path: "/bounties",
    element: <BountiesPage />
  },
  {
    path: "/bounty/:bountyId",
    element: <BountyPage />
  },
  {
    path: "/profile",
    element: <ProfilePage />
  }
]);

function App() {
  return (
    <WalletProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </WalletProvider>
  )
}

export default App
