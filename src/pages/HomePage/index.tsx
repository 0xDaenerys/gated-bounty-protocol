import React from "react";
import { Layout } from "../../components/Layout";
import { Link, useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    // Use the navigate object to navigate to the desired route
    navigate(path);
  };

  return (
    <Layout>
      <div className="flex space-between py-20 gap-5">
        <div className="grow flex flex-col gap-6">
          <span className="text-8xl font-extrabold text-left">Gated Bounty Protocol</span>
          <span className="text-colorSecondaryLight text-left text-xl font-semibold">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</span>
          <div className="flex flex-start gap-4">
            <button 
              onClick={() => handleNavigate("/create")}
              className="bg-colorSecondaryDark text-white py-3 px-5 text-lg border border-2 border-solid border-colorSecondaryDark hover:bg-transparent hover:text-colorSecondaryDark"
            >
              Post a bounty
              <Link to="/create" />
            </button>
            <button 
              onClick={() => handleNavigate("/bounties")}
              className="bg-transparent text-colorSecondaryDark py-3 px-5 text-lg border border-2 border-solid border-colorSecondaryDark hover:bg-colorSecondaryDark hover:text-white"
            >
              Solve bounties
              <Link to="/bounties" />
            </button>
          </div>
        </div>
        <img className="h-[550px]" src="assets/random.png" />
      </div>
    </Layout>
  );
};
