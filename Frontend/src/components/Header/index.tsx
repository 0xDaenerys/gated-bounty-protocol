import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    // Use the navigate object to navigate to the desired route
    navigate(path);
  };
  
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
				<ConnectButton showBalance={false} />
			</div>
		</div>
	);
};
