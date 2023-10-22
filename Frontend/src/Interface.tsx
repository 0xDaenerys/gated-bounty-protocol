import { RouterProvider, createHashRouter } from 'react-router-dom';
import { BountiesPage, BountyCreationPage, BountyPage, HomePage, ProfilePage, SpacesPage } from './pages';
import { useFetchBountiesData } from './hooks';

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
  },
  {
    path: "/spaces",
    element: <SpacesPage />
  }
]);

export const Interface = () => {
    useFetchBountiesData();

    return <RouterProvider router={router} />
};