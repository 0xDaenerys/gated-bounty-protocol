import { Layout } from "../../components/Layout";
import { useAppContext } from "../../contexts/AppContext";
import { BountyRow } from "..";
import { useAccount } from "wagmi";

export const ProfilePage = () => {
  const { activeBounties, finishedBounties, upcomingBounties } = useAppContext();
  const { address } = useAccount()

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="flex drop-shadow-2xl flex-col py-5 gap-5 px-7 bg-colorSecondaryDark rounded-lg mt-16 mb-10 mx-auto">
          <span className="text-3xl font-extrabold pb-3 text-left text-colorPrimaryLight">MY ACTIVE BOUNTIES</span>
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

        </div>
        <div className="flex drop-shadow-2xl flex-col py-5 gap-5 px-7 bg-colorSecondaryDark rounded-lg mb-10 mx-auto">
          <span className="text-3xl font-extrabold pb-3 text-left text-colorPrimaryLight">MY UPCOMING BOUNTIES</span>
          <div className="flex text-colorPrimaryLight font-bold text-lg">
            <span className="mr-7">S.No</span>
            <span className="text-left mr-[605px]">Bounty</span>
            <span className="mr-[62px]">Rewards</span>
            <span className="mr-[80px]">Start Time</span>
            <span>End Time</span>
          </div>
          {address &&
            upcomingBounties.map((bounty, index) => address === bounty.creator && <BountyRow bounty={bounty} index={index} />)
          }
        </div>
        <div className="flex drop-shadow-2xl flex-col py-5 gap-5 px-7 bg-colorSecondaryDark rounded-lg mb-10 mx-auto">
          <span className="text-3xl font-extrabold pb-3 text-left text-colorPrimaryLight">MY FINISHED BOUNTIES</span>
          <div className="flex text-colorPrimaryLight font-bold text-lg">
          <span className="mr-7">S.No</span>
            <span className="text-left mr-[605px]">Bounty</span>
            <span className="mr-[62px]">Rewards</span>
            <span className="mr-[80px]">Start Time</span>
            <span>End Time</span>
          </div>
          <div className="flex flex-col gap-5 opacity-50">
            {address &&
              finishedBounties.map((bounty, index) => address === bounty.creator && <BountyRow bounty={bounty} index={index} />)
            }
          </div>
        </div> 
      </div>
    </Layout>
  );
};
