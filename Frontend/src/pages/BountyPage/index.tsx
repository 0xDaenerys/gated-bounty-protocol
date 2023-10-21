import { FormEvent, useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { useParams } from "react-router-dom";
import { IBounty, useAppContext } from "../../contexts/AppContext";
import { timestampToDateTimeStrings } from "../../helpers";
import { formatEther, isAddressEqual } from "viem";
import { CURRENCY } from "../../config/chains";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import { ChatUIProvider, ChatViewComponent } from '@pushprotocol/uiweb';
import { useFetchBountiesData } from "../../hooks";
import { BountyAbi, BountyFactoryAbi } from "../../abi";
import { waitForTransaction, writeContract } from "wagmi/actions";
import { ChainId } from "..";
import { CONTRACTS } from "../../config";

export const BountyPage = () => {
  const { bounties } = useAppContext(); // Use the AppContext to access data
  const { bountyId } = useParams(); // Get the bountyId from the URL
  const { chain } = useNetwork();
  useFetchBountiesData();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(true);
  const [bountyData, setBountyData] = useState<IBounty>({} as IBounty);
  const [bountyStatus, setBountyStatus] = useState('');
  const [submissionGithubRepoUrl, setSubmissionGithubRepoUrl] = useState('');
  const [winnerAddress, setWinnerAddress] = useState('');

  const addSubmission = async (event: FormEvent) => {
    event.preventDefault();
    
    try {
      const bountyContractAddress = bountyId;

      await writeContract({
        address: bountyContractAddress as `0x${string}`,
        abi: BountyAbi,
        functionName: 'addSubmission',
        args: [address, submissionGithubRepoUrl],
      });
    } catch (err) {
      alert(err);
    }
  };

  const declareWinner = async (event: FormEvent) => {
    event.preventDefault();

    if (!walletClient) {
      alert('Please connect your wallet first')
      return
    }
    
    try {
      const chainId: ChainId = (await walletClient.getChainId()) as ChainId
      const bountyFactoryContractAddress = CONTRACTS[chainId].bountyFactory;

      const { hash } = await writeContract({
        address: bountyFactoryContractAddress as `0x${string}`,
        abi: BountyFactoryAbi,
        functionName: 'declareBountyWinner',
        args: [bountyData.id, winnerAddress],
      });
      await waitForTransaction({ hash: hash });

      setBountyData({
        ...bountyData,
        state: 1
      });
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    if (!bountyId) return;

    // Check if the bountyId exists in bounties
    if (bounties[bountyId]) {
      const bountyData = bounties[bountyId];
      setBountyData(bounties[bountyId]);
      const currentTimestamp = Date.now();
      if (currentTimestamp > bountyData.endTimestamp) {
        setBountyStatus("Finished");
      } else if (currentTimestamp < bountyData.startTimestamp) {
        setBountyStatus("Upcoming");
      } else {
        setBountyStatus("Active");
      }
      setIsLoading(false);
    }
  }, [bounties, bountyId]);

  return (
    <Layout>
      {isLoading ? (
        // Show a loader while loading
        <div className="flex justify-center items-center h-[80vh]">
          <span className="h-10 animate-bounce text-5xl font-bold">Loading...</span>
        </div>
      ) : (
        // Render the content once loading is complete
        <div className="pt-16">
          <div className="flex gap-10">
            <div 
              className="flex grow drop-shadow-2xl bg-colorSecondaryDark items-center gap-10 p-4 py-10 rounded-md font-medium text-md text-white" 
            >
              <div className="flex flex-col px-5 w-full text-left gap-4">
                <span className="text-5xl font-bold text-colorPrimaryLight">Bounty Details</span>
                <span className="text-2xl font-bold text-colorPrimaryLight pt-8"><span className="text-white font-medium">Name:</span> {bountyData.name}</span>
                <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">Description:</span> {bountyData.description}</span>
                <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">Rewards:</span> {formatEther(bountyData.rewards)} {chain && chain.unsupported === false && CURRENCY[chain?.id]}</span>
                <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">Start Time:</span> {timestampToDateTimeStrings(bountyData.startTimestamp).date}, {timestampToDateTimeStrings(bountyData.startTimestamp).time}</span>
                <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">End Time:</span> {timestampToDateTimeStrings(bountyData.endTimestamp).date}, {timestampToDateTimeStrings(bountyData.endTimestamp).time}</span>
                <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">Status:</span> {bountyStatus}</span>
              </div>
            </div>
            <div
              className="flex bg-colorSecondaryDark drop-shadow-2xl items-center gap-10 py-4 rounded-md font-medium text-md text-white min-w-[400px] h-[200px]"
            >
              {bountyStatus === "Active" 
                ?
                <form className="px-5 w-full" onSubmit={addSubmission}>
                  <div className="mb-6">
                    <label htmlFor="githubRepoUrl" className="block mb-2 text-md font-semibold text-white text-left">
                        GitHub Repo URL
                    </label>
                    <input
                        type="text"
                        id="githubRepoUrl"
                        className="bg-colorSecondaryLight border-2 border-colorPrimaryLight text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
                        placeholder="https://github.com/username/reponame"
                        value={submissionGithubRepoUrl}
                        onChange={(e) => setSubmissionGithubRepoUrl(e.target.value)}
                        required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-colorPrimaryLight text-colorSecondaryDark py-3 px-5 text-lg hover:bg-colorPrimaryLight hover:opacity-75 hover:text-colorSecondaryDark hover:cursor-pointer"
                  >
                    Submit
                  </button>
                </form>
                :
              (bountyStatus === "Finished" && address && isAddressEqual(address, bountyData.creator as any) && bountyData.state === 0)
                ?
                <form className="px-5 w-full" onSubmit={declareWinner}>
                  <div className="mb-6">
                    <label htmlFor="githubRepoUrl" className="block mb-2 text-md font-semibold text-white text-left">
                        Hacker Address
                    </label>
                    <input
                        type="text"
                        id="githubRepoUrl"
                        className="bg-colorSecondaryLight border-2 border-colorPrimaryLight text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
                        placeholder="0xabc..."
                        value={winnerAddress}
                        onChange={(e) => setWinnerAddress(e.target.value)}
                        required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-colorPrimaryLight text-colorSecondaryDark py-3 px-5 text-lg hover:bg-colorPrimaryLight hover:opacity-75 hover:text-colorSecondaryDark hover:cursor-pointer"
                  >
                    Declare Winner
                  </button>
                </form>
                :
              (bountyStatus === "Finished" && bountyData.state === 1) 
                ?
                <div className="flex flex-col px-5 w-full">
                  <span className="text-3xl font-bold text-colorPrimaryLight text-left">Winner</span>
                  <span className="text-2xl font-medium py-5 text-center">{bountyData.winner || winnerAddress}</span>
                </div>
                :
                <></>
              }
            </div>
          </div>
          {bountyStatus !== "Upcoming" && bountyData.submissions.length !== 0 &&
            <div 
              className="flex grow drop-shadow-2xl bg-colorSecondaryDark items-center gap-10 py-4 px-4 my-10 rounded-md font-medium text-md text-white" 
            >
              <div className="flex flex-col px-5 w-full text-left gap-4">
                <span className="text-3xl font-bold text-colorPrimaryLight pb-5">Submissions</span>
                <div className="flex flex-col gap-3">
                  {
                    bountyData.submissions.map((submission, index) => {
                      return (
                        <div className="flex flex-col drop-shadow-2xl bg-colorSecondaryLight items-start gap-2 text-left align-left p-4 rounded-md font-medium text-md text-white">
                          <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">S.No:</span> {index+1}</span>
                          <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">User Address:</span> {submission.hacker}</span>
                          <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">Submission:</span> {submission.submissionLink}</span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          }
          <div className="h-[600px] my-10">
            {address && walletClient &&
              <ChatUIProvider account={address} signer={walletClient}>
                <ChatViewComponent 
                  chatId={bountyData.groupChatId}
                  isConnected={true}
                />
              </ChatUIProvider>
            }
          </div>
        </div>
      )}
    </Layout>
  );
};
