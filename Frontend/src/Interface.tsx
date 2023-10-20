import { RouterProvider, createHashRouter } from 'react-router-dom';
import { BountiesPage, BountyCreationPage, BountyPage, HomePage, ProfilePage } from './pages';

const router = createHashRouter([
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

export const Interface = () => {
    return <RouterProvider router={router} />
};