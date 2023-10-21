import { Layout } from "../../components/Layout";
import { useAppContext } from "../../contexts/AppContext";
import { BountyRow } from "..";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import { FormEvent, useEffect, useState } from "react";
import { CONTRACTS } from "../../config";
import { readContract } from "wagmi/actions";
import { BountyFactoryAbi, Erc20ReputationAbi, Erc721KYHAbi } from "../../abi";
import Blockies from 'react-blockies';
import { writeContract } from "wagmi/actions";

type ChainId = 5 | 80001 | 534351 | 5001;
const IMAGE_URI = "https://bafybeieqa3lrf3viuj5rkuhoiy2vitpz4yxmndk4v52kdh4jp544cw55va.ipfs.dweb.link/Verification_Badge.png";

export const ProfilePage = () => {
  const { activeBounties, finishedBounties, upcomingBounties } = useAppContext();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const [profileInfo, setProfileInfo] = useState<{
    reputationTokenBalance: bigint,
    kyhBalance: bigint,
    isVerified: boolean,
    isFetching: boolean
  }>({
    reputationTokenBalance: 0n,
    kyhBalance: 0n,
    isVerified: false,
    isFetching: false
  });
  const [kyhName, setKyhName] = useState('');
  const [kyhImg, setKyhImg] = useState('');

  const fetchTokenData = async () => {
    if (!address || !chain || (chain && chain.unsupported)) return;
    try {
      const reputationTokenData = await readContract({
        address: CONTRACTS[chain.id].erc20Reputation,
        abi: Erc20ReputationAbi,
        functionName: 'balanceOf',
        args: [address]
      });
      const kyhNftData = await readContract({
        address: CONTRACTS[chain.id].erc721KYH,
        abi: Erc721KYHAbi,
        functionName: 'balanceOf',
        args: [address]
      });

      if ((kyhNftData as bigint) > 0n) {
        const kyhNftUriData = await readContract({
          address: CONTRACTS[chain.id].erc721KYH,
          abi: Erc721KYHAbi,
          functionName: 'getOwnerTokenId',
          args:[address]
        });

        const kyhTokenUrI = await readContract({
          address: CONTRACTS[chain.id].erc721KYH,
          abi: Erc721KYHAbi,
          functionName: 'tokenURI',
          args:[kyhNftUriData]
        });

        const jsonBase64 = (kyhTokenUrI as string).split(',')[1];

        // Decode the base64 string to get the JSON data
        const jsonData = atob(jsonBase64);

        // Parse the JSON data
        const nftInfo = JSON.parse(jsonData);

        setKyhName(nftInfo.attributes[0].value);
        setKyhImg(IMAGE_URI);

        setProfileInfo({
          reputationTokenBalance: reputationTokenData as bigint,
          kyhBalance: kyhNftData as bigint,
          isVerified: true,
          isFetching: false
        });
      } else {
        setProfileInfo({
          reputationTokenBalance: reputationTokenData as bigint,
          kyhBalance: kyhNftData as bigint,
          isVerified: false,
          isFetching: false
        });
      }
    } catch (err) {
      alert(err);
      setProfileInfo({
        reputationTokenBalance: 0n,
        kyhBalance: 0n,
        isVerified: false,
        isFetching: false
      });
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!walletClient) {
      alert('Please connect your wallet first')
      return
    }

    try {
      const chainId: ChainId = (await walletClient.getChainId()) as ChainId
      const bountyFactoryContractAddress = CONTRACTS[chainId].bountyFactory

      await writeContract({
        address: bountyFactoryContractAddress,
        abi: BountyFactoryAbi,
        functionName: 'verifyUser',
        args: [kyhName],
      });

      await fetchTokenData();

    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    if (!address || !chain || (chain && chain.unsupported)) return;

    (async function () {
      setProfileInfo({
        reputationTokenBalance: 0n,
        kyhBalance: 0n,
        isVerified: false,
        isFetching: true
      });

      try {
        await fetchTokenData();
      } catch (err) {
        alert(err);
      }
    })();
  }, [address, chain])

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="flex drop-shadow-2xl gap-5 p-7 bg-colorSecondaryDark rounded-lg mt-16 mb-16 mx-auto w-full gap-12 h-full">
          <div className="rounded-lg overflow-hidden self-center">
            {
              !kyhImg 
              ?
                <Blockies 
                  scale={20}
                  seed={address || "0x00"}
                />
              :
                <img className="h-[160px] self-center" src={kyhImg} />
            }
          </div>
          {
              profileInfo.isFetching
            ?
              <div className="flex items-center justify-center ">
                <div className="w-8 h-8 border-b-4 border-white-900 rounded-full animate-spin"></div>
              </div>
            :
              profileInfo.isVerified
            ?
              <div className="flex self-center gap-5">
                <div className="flex flex-col gap-3 self-center text-left">
                  <span className="text-4xl font-extrabold self-center text-colorPrimaryLight">
                    {kyhName}
                  </span>
                  <span className="self-left align-left w-fit bg-colorSecondaryDark text-colorPrimaryLight text-sm font-medium mr-2 px-2.5 py-0.5 rounded-lg border-2 border-colorPrimaryLight">{Number(profileInfo.reputationTokenBalance)} Reputation Token</span>
                </div>
                <img className="h-[50px] self-center" src="assets/verifiedBadge.png" />
              </div>
            :
              <div className="flex flex-row">
                <form className="px-5 w-full flex flex-row gap-5 self-center" onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="githubRepoUrl" className="block mb-2 text-md font-semibold text-white text-left">
                        Enter your name
                    </label>
                    <input
                        type="text"
                        id="githubRepoUrl"
                        className="bg-colorSecondaryLight border-2 border-colorPrimaryLight text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
                        placeholder="Your Name"
                        value={kyhName}
                        onChange={(e) => setKyhName(e.target.value)}
                        required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-colorPrimaryLight text-colorSecondaryDark py-3 px-5 self-center text-lg hover:bg-colorPrimaryLight hover:opacity-75 hover:text-colorSecondaryDark hover:cursor-pointer"
                  >
                    Claim KYH & Reputation Token
                  </button>
                </form>
              </div>
          }
        </div>
        <div className="flex drop-shadow-2xl flex-col py-5 gap-5 px-7 bg-colorSecondaryDark rounded-lg mb-10 mx-auto w-full">
          <span className="text-3xl font-extrabold pb-3 text-left text-colorPrimaryLight">MY BOUNTIES</span>
          <div className="flex text-colorPrimaryLight font-bold text-lg">
            <span className="mr-7">S.No</span>
            <span className="text-left mr-[605px]">Bounty</span>
            <span className="mr-[62px]">Rewards</span>
            <span className="mr-[80px]">Start Time</span>
            <span>End Time</span>
          </div>
          {address &&
            activeBounties.map((bounty, index) => address === bounty.creator && <BountyRow bounty={bounty} index={index} />)
          }
          {address &&
            upcomingBounties.map((bounty, index) => address === bounty.creator && <BountyRow bounty={bounty} index={index} />)
          }
          {address &&
            finishedBounties.map((bounty, index) => address === bounty.creator && <BountyRow bounty={bounty} index={index} />)
          }
        </div>
      </div>
    </Layout>
  );
};
