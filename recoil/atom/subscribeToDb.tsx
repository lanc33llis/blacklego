import { atom, AtomEffect } from "recoil";
import { gun } from "../../App";

const syncToGun =
  (): AtomEffect<any[]> =>
  ({ setSelf, trigger }) => {
    if (trigger === "get") {
      gun.get("incidents").once((data) => {
        console.log("Loaded from gun");
        setSelf((s) => s.concat(data));
      });
    }

    gun.get("incidents").on((data) => {
      console.log("New Incidents");
      setSelf((s) => s.concat(data));
    });

    return () => {
      gun.get("incidents").off();
    };
  };

const subscribeToDbState = atom<any[]>({
  key: "subscribeToDbState",
  default: [],
  effects: [syncToGun()],
});

export default subscribeToDbState;
