import { RouterProvider, createHashRouter } from 'react-router-dom';
import { BountiesPage, BountyCreationPage, BountyPage, HomePage, ProfilePage } from './pages';
import { ChatUIProvider } from '@pushprotocol/uiweb';
import { useAccount, useWalletClient } from 'wagmi';

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
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();

    return (
        (address && walletClient) 
            ?  
        <ChatUIProvider account={address} signer={walletClient}>
          <RouterProvider router={router} />
        </ChatUIProvider>
            :
        <RouterProvider router={router} />
    )
};