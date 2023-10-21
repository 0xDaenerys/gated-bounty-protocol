import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

export interface IBounty {
  id: string;
  name: string;
  description: string;
  rewards: bigint;
  creator: string;
  startTimestamp: number;
  endTimestamp: number;
  requiredReputationToken: number;
  isKYHRequired: boolean;
  groupChatId: string;
  bountyLevel: string;
  state: number;
  winner: string;
  submissions: Array<{ hacker: string, submissionLink: string }>;
};

export type BountiesList = Record<string, IBounty>;

// Define the shape of the context value
interface AppContextValue {
  bounties: BountiesList;
  setBounties: Dispatch<SetStateAction<BountiesList>>;
  activeBounties: Array<IBounty>;
  setActiveBounties: Dispatch<SetStateAction<Array<IBounty>>>;
  finishedBounties: Array<IBounty>;
  setFinishedBounties: Dispatch<SetStateAction<Array<IBounty>>>;
  upcomingBounties: Array<IBounty>;
  setUpcomingBounties: Dispatch<SetStateAction<Array<IBounty>>>;
}

// Define the initial values for your context
const initialContextValue: AppContextValue = {
  bounties: {},
  setBounties: () => {},
  activeBounties: [],
  setActiveBounties: () => {},
  finishedBounties: [],
  setFinishedBounties: () => {},
  upcomingBounties: [],
  setUpcomingBounties: () => {},
};

// Create the context with the initial values
export const AppContext = createContext<AppContextValue>(initialContextValue);


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

// AppProvider component to wrap your application with
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Define your state and functions
  const [bountiesObj, setBountiesObj] = useState({} as BountiesList);
  const [activeBounties, setActiveBounties] = useState<Array<IBounty>>([]);
  const [finishedBounties, setFinishedBounties] = useState<Array<IBounty>>([]);
  const [upcomingBounties, setUpcomingBounties] = useState<Array<IBounty>>([]);

  // Define the context value
  const contextValue: AppContextValue = {
    bounties: bountiesObj,
    setBounties: setBountiesObj,
    activeBounties,
    setActiveBounties,
    finishedBounties,
    setFinishedBounties,
    upcomingBounties,
    setUpcomingBounties
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppProvider;