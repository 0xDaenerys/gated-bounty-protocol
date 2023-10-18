import {
  scrollSepolia,
  mantleTestnet,
  sepolia,
  polygonMumbai
} from "wagmi/chains";

const _ScrollSepolia = {
  ...scrollSepolia,
  iconUrl: "assets/scrollLogo.jpeg",
};

const _MantleTestnet = {
  ...mantleTestnet,
  iconUrl: "assets/mantleLogo.png",
};

export { 
  _ScrollSepolia, 
  _MantleTestnet, 
  sepolia as _Sepolia, 
  polygonMumbai as _PolygonMumbai 
};
