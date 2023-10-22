import { Layout } from '../../components/Layout'
import { Link, useNavigate } from 'react-router-dom'

export const HomePage = () => {
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    // Use the navigate object to navigate to the desired route
    navigate(path)
  }

  return (
    <Layout>
      <div className="flex space-between py-20 gap-5">
        <div className="grow flex flex-col gap-6">
          <span className="text-8xl font-extrabold text-left">
            Gated Bounty Protocol
          </span>
          <span className="text-colorSecondaryLight text-left text-xl font-semibold">
            Welcome to the Gated Bounty Protocol, your gateway to decentralized
            rewards across multiple networks. Built on Ethereum, Polygon,
            Scroll, and Mantle, our platform connects you to a diverse ecosystem
            of opportunities for earning bounties and incentives. Whether you're
            a developer or an enthusiast seeking to participate in the growing
            decentralized landscape, we offer a seamless, secure, and rewarding
            experience that spans across these networks.
          </span>
          <span className="text-colorSecondaryLight text-left text-xl font-semibold">
            Gated Bounty Protocol allows one to create bounties and provide
            gating mechanisms for submissions such as giving access to hackers
            owning the verified soulbound NFT or certain amount of reputation
            ERC20 tokens.
          </span>
          <div className="flex flex-start gap-4">
            <button
              onClick={() => handleNavigate('/create')}
              className="bg-colorSecondaryDark text-white py-3 px-5 text-lg border border-2 border-solid border-colorSecondaryDark hover:bg-transparent hover:text-colorSecondaryDark"
            >
              Post a bounty
              <Link to="/create" />
            </button>
            <button
              onClick={() => handleNavigate('/bounties')}
              className="bg-transparent text-colorSecondaryDark py-3 px-5 text-lg border border-2 border-solid border-colorSecondaryDark hover:bg-colorSecondaryDark hover:text-white"
            >
              Solve bounties
              <Link to="/bounties" />
            </button>
          </div>
        </div>
        <img className="h-[550px] self-center" src="assets/random.png" />
      </div>
    </Layout>
  )
}
