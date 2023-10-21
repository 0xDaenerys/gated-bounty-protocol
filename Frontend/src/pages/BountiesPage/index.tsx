import { useContext, useMemo } from "react";
import { Layout } from "../../components/Layout";
import { timestampToDateTimeStrings } from "../../helpers";
import { AppContext, IBounty } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { formatEther } from "viem";
import { CURRENCY } from "../../config/chains";
import { useNetwork } from "wagmi";
import { useFetchBountiesData } from "../../hooks";

export const BountyRow = ({ bounty, index }: {
  bounty: IBounty
  index: number
}) => {
  const navigate = useNavigate();
  const { id, name, description, rewards, startTimestamp, endTimestamp, bountyLevel } = bounty;
  const { date: startDate, time: startTime } = timestampToDateTimeStrings(startTimestamp);
  const { date: endDate, time: endTime } = timestampToDateTimeStrings(endTimestamp);
  const { chain } = useNetwork();

  const handleNavigate = useMemo(
    () => (id: string) => {
      navigate(`/bounty/${id}`);
    },
    [navigate]
  );

  return (
    <div
      className="flex drop-shadow-2xl bg-colorSecondaryLight items-center gap-10 p-4 rounded-md font-medium text-md text-white cursor-pointer"
      key={index}
      onClick={() => handleNavigate(id)}
    >
      <span className="min-w-max font-bold text-xl">{index}</span>
      <div className="flex flex-row gap-5 grow">
        <div className="flex flex-col text-left max-w-[440px]">
          <span className="font-bold text-xl">{name}</span>
          <span>{description}</span>
        </div>
        <span className="self-center bg-colorSecondaryDark text-colorPrimaryLight text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full border-2 border-colorPrimaryLight">{bountyLevel}</span>
      </div>
      <span className="min-w-max font-bold text-xl">{formatEther(rewards)} {chain && chain.unsupported === false && CURRENCY[chain?.id]}</span>
      <div className="flex flex-col min-w-max">
        <span className="font-bold text-xl">{startDate}</span>
        <span>{startTime}</span>
      </div>
      <div className="flex flex-col min-w-max">
        <span className="font-bold text-xl">{endDate}</span>
        <span>{endTime}</span>
      </div>
    </div>
  );
}

export const BountiesPage = () => {
  const { activeBounties, finishedBounties, upcomingBounties } = useContext(AppContext);
  useFetchBountiesData();

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="flex drop-shadow-2xl flex-col py-5 gap-5 px-7 bg-colorSecondaryDark rounded-lg mt-16 mb-10 mx-auto">
          <span className="text-3xl font-extrabold pb-6 text-left text-colorPrimaryLight">ACTIVE</span>
          <div className="flex text-colorPrimaryLight font-bold text-lg">
            <span className="mr-7">S.No</span>
            <span className="text-left pr-[560px]">Bounty</span>
            <span className="pr-[82px]">Rewards</span>
            <span className="pr-[100px]">Started</span>
            <span className="pr-[50px]">Ends</span>
          </div>
          {
            activeBounties.map((bounty, index) => <BountyRow bounty={bounty} index={index} />)
          }
          {
            activeBounties.length === 0 &&
            <span className="text-colorSecondaryLight font-medium text-xl">No Bounties to show.</span>
          }
        </div>
        <div className="flex drop-shadow-2xl flex-col py-5 gap-5 px-7 bg-colorSecondaryDark rounded-lg mb-10 mx-auto">
          <span className="text-3xl font-extrabold pb-6 text-left text-colorPrimaryLight">UPCOMING</span>
          <div className="flex text-colorPrimaryLight font-bold text-lg">
            <span className="pr-7">S.No</span>
            <span className="text-left pr-[560px]">Bounty</span>
            <span className="pr-[82px]">Rewards</span>
            <span className="pr-[110px]">Starts</span>
            <span className="pr-[50px]">Ends</span>
          </div>
          {
            upcomingBounties.map((bounty, index) => <BountyRow bounty={bounty} index={index} />)
          }
          {
            upcomingBounties.length === 0 &&
            <span className="text-colorSecondaryLight font-medium text-xl">No Bounties to show.</span>
          }
        </div>
        <div className="flex drop-shadow-2xl flex-col py-5 gap-5 px-7 bg-colorSecondaryDark rounded-lg mb-10 mx-auto">
          <span className="text-3xl font-extrabold pb-6 text-left text-colorPrimaryLight">FINISHED</span>
          <div className="flex text-colorPrimaryLight font-bold text-lg">
            <span className="pr-7">S.No</span>
            <span className="text-left pr-[560px]">Bounty</span>
            <span className="pr-[82px]">Rewards</span>
            <span className="pr-[100px]">Started</span>
            <span className="pr-[50px]">Ended</span>
          </div>
          {
              finishedBounties.length === 0 
              ?
              <span className="text-colorSecondaryLight font-medium text-xl">No Bounties to show.</span>
              :
              <div className="flex flex-col gap-5 opacity-50">
              {
                finishedBounties.map((bounty, index) => <BountyRow bounty={bounty} index={index} />)
              }
            </div>
          }
        </div>
      </div>
    </Layout>
  );
};
