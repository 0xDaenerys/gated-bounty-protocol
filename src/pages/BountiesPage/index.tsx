import React, { useMemo, useState } from "react";
import { Layout } from "../../components/Layout";
import { timestampToDateTimeStrings } from "../../helpers";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export const BountyRow = ({ bounty, index }: { 
  bounty: { 
    id: string,
    name: string;
    description: string;
    rewards: string;
    creator: string;
    startTimestamp: number;
    endTimestamp: number; 
  }, 
  index: number
}) => {
  const navigate = useNavigate();
  const { id, name, description, rewards, startTimestamp, endTimestamp } = bounty;
  const { date: startDate, time: startTime } = timestampToDateTimeStrings(startTimestamp);
  const { date: endDate, time: endTime } = timestampToDateTimeStrings(endTimestamp);

  const handleNavigate = useMemo(
    () => (id: string) => {
      navigate(`/bounty/${id}`);
    },
    [navigate]
  );

  return (
    <div 
      className="flex bg-colorSecondaryLight items-center gap-10 p-4 rounded-md font-medium text-md text-white cursor-pointer" 
      key={index}
      onClick={() => handleNavigate(id)}
    >
      <span className="min-w-max font-bold text-xl">{index}</span>
      <div className="flex flex-col text-left ">
        <span className="font-bold text-xl">{name}</span>
        <span>{description}</span>
      </div>
      <span className="min-w-max font-bold text-xl">{rewards}</span>
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
  const { activeBounties, finishedBounties } = useAppContext();

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="flex flex-col py-5 gap-5 px-7 bg-colorSecondaryDark rounded-lg mt-16 mb-10 mx-auto">
          <span className="text-3xl font-extrabold pb-6 text-left text-colorPrimaryLight">ACTIVE</span>
          <div className="flex text-colorPrimaryLight font-bold text-lg">
            <span className="mr-7">S.No</span>
            <span className="text-left mr-[605px]">Bounty</span>
            <span className="mr-[82px]">Rewards</span>
            <span className="mr-[100px]">Started</span>
            <span>Ends</span>
          </div>
          {
            Object.values(activeBounties).map((bounty, index) => <BountyRow bounty={bounty} index={index} />)
          }
        </div>
        <div className="flex flex-col py-5 gap-5 px-7 bg-colorSecondaryDark rounded-lg mb-10 mx-auto">
          <span className="text-3xl font-extrabold pb-6 text-left text-colorPrimaryLight">FINISHED</span>
          <div className="flex text-colorPrimaryLight font-bold text-lg">
            <span className="mr-7">S.No</span>
            <span className="text-left mr-[605px]">Bounty</span>
            <span className="mr-[82px]">Rewards</span>
            <span className="mr-[100px]">Started</span>
            <span>Ended</span>
          </div>
          <div className="flex flex-col gap-5 opacity-50">
            {
              Object.values(finishedBounties).map((bounty, index) => <BountyRow bounty={bounty} index={index} />)
            }
          </div>
        </div> 
      </div>
    </Layout>
  );
};
