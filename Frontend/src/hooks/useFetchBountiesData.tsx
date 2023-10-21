import { useContext, useEffect } from 'react';
import { readContracts, useNetwork } from 'wagmi';
import { BOUNTY_LEVEL, CONTRACTS } from '../config';
import { readContract } from 'wagmi/actions';
import { BountyAbi, BountyFactoryAbi } from '../abi';
import { AppContext, IBounty } from '../contexts/AppContext';

export const useFetchBountiesData = () => {
    const { chain } = useNetwork();
    const { setActiveBounties, setFinishedBounties, setUpcomingBounties, setBounties } = useContext(AppContext)

    const fetchBountiesData = async () => {
        if (!chain || (chain && chain.unsupported)) return;

        const bountiesData: any = await readContract({
            address: CONTRACTS[chain.id].bountyFactory,
            abi: BountyFactoryAbi,
            functionName: 'getAllBounties',
          });
      
          const bountiesList: { [x: `0x${string}`]: IBounty } = {};
          const activeBountiesList: Array<IBounty> = [];
          const upcomingBountiesList: Array<IBounty> = [];
          const finishedBountiesList: Array<IBounty> = [];
      
          // Use map instead of forEach and collect promises in an array
          const promises = bountiesData.map(async (address: `0x${string}`) => {
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
                {
                  ...bountyContract,
                  functionName: 'getBountyLevel'
                }
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
              groupChatId: contractData[6].result as any,
              bountyLevel: BOUNTY_LEVEL[contractData[8].result as any]
            };
      
            const currentTimestamp = Date.now();
            if (currentTimestamp > bounty.endTimestamp) {
              finishedBountiesList.push(bounty);
            } else if (currentTimestamp < bounty.startTimestamp) {
              upcomingBountiesList.push(bounty);
            } else {
              activeBountiesList.push(bounty);
            }
      
            bountiesList[address] = bounty;
          });
      
          // Wait for all promises to resolve
          await Promise.all(promises);

          activeBountiesList.sort((a, b) => a.endTimestamp - b.endTimestamp);
          finishedBountiesList.sort((a, b) => a.endTimestamp - b.endTimestamp);
          upcomingBountiesList.sort((a, b) => a.endTimestamp - b.startTimestamp);
      
          setActiveBounties(activeBountiesList);
          setFinishedBounties(finishedBountiesList);
          setUpcomingBounties(upcomingBountiesList);
          setBounties(bountiesList);
    }

  useEffect(() => {
    fetchBountiesData();
  }, [chain]);

  return { fetchBountiesData };
};
