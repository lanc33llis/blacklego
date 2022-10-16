import HomePage from "./src/HomePage";
import { RecoilRoot } from "recoil";
import React, { Suspense } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SubmitPage from "./src/SubmitPage";
import SolanaPage from "./src/SolanaPage";
import Gun from "gun";
import { Text } from "react-native";
import "gun/lib/then";
import IncidentPage from "./src/IncidentPage";
// import "gun/lib/mobile.js"; // most important!
// // import SEA from "gun/sea";
// // import "gun/lib/radix.js";
// // import "gun/lib/radisk.js";
// // import "gun/lib/store.js";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import asyncStore from "gun/lib/ras.js";

const Stack = createNativeStackNavigator();
export const gun = Gun({
  peers: ["http://34.125.76.34:8000/gun"],
});

// suspend
const App = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<Text>Loading...</Text>}>
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: "white",
              text: "white",
              background: "white",
              border: "gray",
              notification: "white",
              card: "black",
            },
          }}
        >
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="Submit" component={SubmitPage} />
            <Stack.Screen name="Incident" component={IncidentPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </Suspense>
    </RecoilRoot>
  );
};

export default App;
