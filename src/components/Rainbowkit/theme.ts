import { midnightTheme, Theme } from "@rainbow-me/rainbowkit";

export const customTheme: Theme = Object.assign({}, midnightTheme(), {
	colors: Object.assign({}, midnightTheme().colors, {
	  accentColor: "#323232",
	  accentColorForeground: "white",
	  modalBackground: "#323232",
	  profileForeground: "#323232",
	  connectButtonBackground: "#323232",
	  modalBorder: "#323232",
	}),
	radii: Object.assign({}, midnightTheme().radii, {
	  connectButton: "6px",
	}),
  });
