import * as turf from "@turf/turf";
import { gun } from "../../App";
import { selector } from "recoil";
import { appDataState } from "../atom/appAtom";
import incidentsState from "../atom/incidentsState";
import subscribeToDbState from "../atom/subscribeToDb";

type Incident = {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  image: string;
  date: string;
};

const incidentsSelector = selector({
  key: "incidentsSelector",
  get: async ({ get }) => {
    const appData = get(appDataState);
    const sub = get(subscribeToDbState);
    console.log("sub", sub.length);
    console.log("selector ran");
    if (appData) {
      const { latitude, longitude, viewDistance } = appData.location;

      const allIncidents: any = {};
      const data = (
        await Promise.all(
          (
            await Promise.all(
              Object.keys((await gun.get("incidents").then())!._[">"]).map(
                (key, i) => gun.get("incidents").get(key).then()
              )
            )
          ).map(async (e) => {
            console.log("this ran");
            if (e && e.location) {
              e.id = e._["#"];
              allIncidents[e._["#"]] = e;
              // console.log(e);
              return gun.get(e.location["#"]).then();
            } else {
              return null;
            }
          })
        )
      ).forEach((e) => {
        console.log("got there");
        if (e) {
          const upper = e._["#"].split("/")[0];
          allIncidents[upper] = {
            ...allIncidents[upper],
            location: e,
          };
        }
      });

      // console.log(allIncidents);
      const incidents = Array.from(Object.values(allIncidents))
        .filter((incident) => {
          if (incident.location?.latitude && incident.location?.longitude) {
            // console.log(incident.location);
            const incidentPoint = turf.point([
              incident.location.longitude,
              incident.location.latitude,
            ]);
            const userPoint = turf.point([longitude, latitude]);
            const distance = turf.distance(userPoint, incidentPoint, {
              units: "meters",
            });
            console.log(distance);
            return distance < viewDistance;
          } else {
            return false;
          }
        })
        .map((i: any) => {
          let { _: t1, ...t } = i;
          let { _: t2, ...l } = t.location;
          t.location = l;
          return t as Incident;
        });

      console.log(incidents.length);
      return incidents;
    } else {
      return [];
    }
  },
  set: ({ set, get }, newValue) => {
    // console.log(newValue);
    set(incidentsState, newValue);
  },
});

export default incidentsSelector;
