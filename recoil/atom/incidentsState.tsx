import { atom } from "recoil";

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

const incidentState = atom<Incident[]>({
  key: "incidentsState",
  default: [],
});

export default incidentState;
