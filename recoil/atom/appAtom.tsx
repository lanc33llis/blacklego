import { atom, AtomEffect } from "recoil";

type AppData = {
  location: {
    latitude: number;
    longitude: number;
    viewDistance: number;
  };
  mapReady: boolean;
};

export const appDataState = atom<AppData | null>({
  key: "appData",
  default: null,
});
