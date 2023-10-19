import { ReactNode } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
import {
  _ScrollSepolia,
  _MantleTestnet,
  _PolygonMumbai,
  _Goerli
} from "./chains";
import { customTheme } from "./theme";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";

const { chains, publicClient } = configureChains(
  [_Goerli, _PolygonMumbai, _ScrollSepolia, _MantleTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "EthOnline Hack",
  projectId: `${process.env.REACT_APP_WC_PROJECT_ID}`,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider coolMode chains={chains} theme={customTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
