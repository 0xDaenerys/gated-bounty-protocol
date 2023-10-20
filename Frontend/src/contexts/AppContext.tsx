import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { readContracts, useNetwork } from 'wagmi';
import { CONTRACTS } from '../config';
import { readContract } from 'wagmi/actions';
import { BountyAbi, BountyFactoryAbi } from '../abi';

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
  const { chain } = useNetwork();

  useEffect(() => {
    if (!chain || (chain && chain.unsupported)) return;

    (async function () {
      const bountiesData: any = await readContract({
        address: CONTRACTS[chain.id].bountyFactory,
        abi: BountyFactoryAbi,
        functionName: 'getAllBounties',
      });


      const bountiesList: { [x: `0x${string}`]: IBounty } = {};
      const activeBountiesList: Array<IBounty> = [];
      const upcomingBountiesList: Array<IBounty> = [];
      const finishedBountiesList: Array<IBounty> = [];
      bountiesData.map(async (address: `0x${string}`) => {
        if (address == '0x2cC80b80f33B600B6f11aa831eA58A41739Eb0e9') return;
        const bountyContract: any = {
          address: address,
          abi: BountyAbi
        };

        const contractData = await readContracts({
          contracts: [
            {
              ...bountyContract,
              functionName: 'getBountyMetaData',
            },
            {
              ...bountyContract,
              functionName: 'getBountyStartTime',
            },
            {
              ...bountyContract,
              functionName: 'getBountyEndTime',
            },
            {
              ...bountyContract,
              functionName: 'getBountyRequiredReputation',
            },
            {
              ...bountyContract,
              functionName: 'getBountyRequiredKYH',
            },
            {
              ...bountyContract,
              functionName: 'getBountyRewardPrice',
            },
            {
              ...bountyContract,
              functionName: 'getBountyGroupChatId',
            },
            {
              ...bountyContract,
              functionName: 'owner',
            },
          ]
        });
      
        const bounty: IBounty = {
          id: address,
          name: JSON.parse(contractData[0].result as any).name,
          description: JSON.parse(contractData[0].result as any).description,
          rewards: contractData[5].result as any,
          creator: (contractData[7].result as any),
          startTimestamp: Number(contractData[1].result),
          endTimestamp: Number(contractData[2].result),
          requiredReputationToken: Number(contractData[3].result),
          isKYHRequired: contractData[4].result as any,
        };

        const currentTimestamp = Date.now();
        if (currentTimestamp > bounty.endTimestamp) {
          finishedBountiesList.push(bounty);
          console.log(finishedBountiesList);
        } else if (currentTimestamp < bounty.startTimestamp) {
          upcomingBountiesList.push(bounty);
          console.log(upcomingBountiesList);
        } else {
          activeBountiesList.push(bounty);
          console.log(activeBountiesList);
        }

        bountiesList[address] = bounty;
      })
      setActiveBounties(activeBountiesList);
      setFinishedBounties(finishedBountiesList);
      setUpcomingBounties(upcomingBountiesList);
      setBountiesObj(bountiesList);
    }())
  }, [chain]);

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