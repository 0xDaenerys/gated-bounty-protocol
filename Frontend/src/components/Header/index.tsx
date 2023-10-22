import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link, useNavigate } from "react-router-dom";
import { useAccount, useNetwork } from "wagmi";
import { EmbedSDK } from '@pushprotocol/uiembed';
import { useEffect } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const handleNavigate = (path: string) => {
    // Use the navigate object to navigate to the desired route
    navigate(path);
  };

  useEffect(() => {
    if (address && chain) {
      // 'your connected wallet address'
      EmbedSDK.init({
        chainId: 5,
        headerText: 'Gated Bounty Protocol', // optional
        targetID: 'sdk-trigger-id', // mandatory
        appName: 'consumerApp', // mandatory
        user: address, // mandatory
        viewOptions: {
          type: 'sidebar', // optional [default: 'sidebar', 'modal']
          showUnreadIndicator: true, // optional
          unreadIndicatorColor: '#cc1919',
          unreadIndicatorPosition: 'top-right',
        },
        theme: 'dark',
        isInitialized: true,
        onOpen: () => {
          console.log('-> client dApp onOpen callback');
        },
        onClose: () => {
          console.log('-> client dApp onClose callback');
        },
      });
    }

    return () => {
      EmbedSDK.cleanup();
    };
  }, [address, chain]);

  return (
    <div className="flex row justify-between bg-transparent">
      <div className="flex flex-row">
        <a
          href="/"
          className=" flex items-center text-2xl font-bold text-colorPrimaryDark"
        >
          GBP
        </a>
      </div>
      <div className="flex self-center gap-2">
        <button onClick={() => handleNavigate("/create")}>
          Create
          <Link to="/create" />
        </button>
        <button onClick={() => handleNavigate("/bounties")}>
          Bounties
          <Link to="/bounties" />
        </button>
        <button onClick={() => handleNavigate("/profile")}>
          Profile
          <Link to="/profile" />
        </button>
        <button onClick={() => handleNavigate("/spaces")}>
          Spaces
          <Link to="/spaces" />
        </button>
        <button id="sdk-trigger-id" className="hover:bg-colorPrimaryLight hover:border-none hover:text-colorSecondaryDark hover:outline-none">
          <div className="relative inline-flex w-fit">
            <div
              className="absolute bottom-auto left-auto right-[5px] top-[5px] z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-50 scale-y-50 rounded-full bg-pink-700 p-2.5 text-xs"></div>
            <div
              className="flex items-center justify-center rounded-lg bg-transparent text-center text-colorSeondaryDark ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22 22"
                fill="currentColor"
                className="h-8 w-8">
                <path
                  fill-rule="evenodd"
                  d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </button>
        <ConnectButton showBalance={false} />
      </div>
    </div>
  );
};
