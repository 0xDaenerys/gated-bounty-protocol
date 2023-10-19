import {
  scrollSepolia,
  mantleTestnet,
  goerli,
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
  goerli as _Goerli, 
  polygonMumbai as _PolygonMumbai 
};
