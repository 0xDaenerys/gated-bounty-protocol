import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import { CONTRACTS } from '../config';
import { readContract } from 'wagmi/actions';
import { BountyFactoryAbi } from '../abi';

export interface IBounty {
    id: string;
    name: string;
    description: string;
    rewards: string;
    creator: string;
    startTimestamp: number;
    endTimestamp: number;
};
  
export type BountiesList = Record<string, IBounty>;

// Define the shape of the context value
interface AppContextValue {
  activeBounties: BountiesList;
  setActiveBounties: Dispatch<SetStateAction<BountiesList>>;
  finishedBounties: BountiesList;
  setFinishedBounties: Dispatch<SetStateAction<BountiesList>>;
}

// Create the context and provide default values
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Custom hook to access the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Prop type for the AppProvider component
interface AppProviderProps {
  children: React.ReactNode;
}

const activeBountiesList: BountiesList = {
    224: {
      id: "224",
      name: "Bounty#1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. fugiat nulla pariatur.",
      rewards: "2000 USDC",
      creator: "0x6d2e03b7EfFEae98BD302A9F836D0d6Ab0002766",
      startTimestamp: 1697023800,
      endTimestamp: 1697628600
    },
    46743: {
      id: "46743",
      name: "Bounty#2",
      creator: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
      description: "Lorem ipsum dolor sit amet, ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      rewards: "5000 USDC",
      startTimestamp: 1697123800,
      endTimestamp: 1697928600
    }
};
  
  const finishedBountiesList: BountiesList = {
    87843: {
      id: "87843",
      name: "Bounty#01",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. fugiat nulla pariatur.",
      rewards: "8000 USDC",
      creator: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
      startTimestamp: 1697023800,
      endTimestamp: 1697628600
    },
    43784: {
      id: "43784",
      name: "Bounty#02",
      description: "Lorem ipsum dolor sit amet, ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      rewards: "12000 USDC",
      creator: "0x6d2e03b7EfFEae98BD302A9F836D0d6Ab0002766",
      startTimestamp: 1697123800,
      endTimestamp: 1697928600
    },
    34784: {
      id: "34784",
      name: "Bounty#03",
      description: "Lorem ipsuis nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      rewards: "3000 USDC",
      creator: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
      startTimestamp: 1697023800,
      endTimestamp: 1697928600
    }
};

// AppProvider component to wrap your application with
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Define your state and functions
  const [activeBounties, setActiveBounties] = useState(activeBountiesList);
  const [finishedBounties, setFinishedBounties] = useState(finishedBountiesList);
  const { chain } = useNetwork();

  useEffect(() => {
    if(!chain || (chain && chain.unsupported)) return;
    
    (async function() {
      const bountiesData = await readContract({
        address: CONTRACTS[chain.id].bountyFactory,
        abi: BountyFactoryAbi,
        functionName: 'getAllBounties',
      });

      console.log(bountiesData);
    }())
  }, [chain]);

  // Define the context value
  const contextValue: AppContextValue = {
    activeBounties,
    setActiveBounties,
    finishedBounties,
    setFinishedBounties
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppProvider;