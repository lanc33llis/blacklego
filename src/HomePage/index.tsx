/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import * as Location from "expo-location";
import NavBar from "../components/NavBar";
import Auth from "../components/AuthSol";
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Image,
} from "react-native";
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { mapStyle } from "./mapStyle";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import incidentsState from "../../recoil/atom/incidentsState";
import subscribeToDbState from "../../recoil/atom/subscribeToDb";
import incidentsSelector from "../../recoil/selector/incidentsSelector";
import { appDataState } from "../../recoil/atom/appAtom";
import Svg, { Circle } from "react-native-svg";

var markerImage = require("../../assets/Blue-Marker-sm.svg");

console.log(Dimensions.get("window").width);

const App = ({ navigation }: { navigation: any }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const setAppData = useSetRecoilState(appDataState);
  useRecoilValue(subscribeToDbState);
  const getNearbyIncidents = useRecoilValue(incidentsSelector);
  const mapRef = useRef<any>(null);
  console.log(getNearbyIncidents.length);
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
        });
        setLocation(location);
      }
    })();
  }, []);

  useEffect(() => {
    if (location) {
      setAppData((appData) => {
        return {
          ...appData,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            viewDistance: 1000,
          },
        };
      });
    }
  }, [location]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        // contentInsetAdjustmentBehavior="never"
        style={backgroundStyle}
      >
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        >
          <NavBar navigation={navigation} location={location} />
          <>
            {location?.coords && (
              <MapView
                ref={mapRef}
                key={getNearbyIncidents.length}
                customMapStyle={mapStyle}
                provider={PROVIDER_GOOGLE}
                style={styles.mapStyle}
                onLayout={() => {
                  console.log("map ready");
                  setAppData((appData) => {
                    return { ...appData, mapReady: true };
                  });
                  mapRef.current?.animateToRegion(
                    {
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    },
                    1000
                  );
                }}
                mapType="standard"
              >
                <Marker coordinate={location.coords}>
                  <View style={{ width: 50, height: 50 }}>
                    <Svg>
                      <Circle
                        cx="20"
                        cy="20"
                        r="15"
                        fill="#9ECAFF"
                        opacity={0.5}
                      />
                      <Circle cx="20" cy="20" r="10" fill="#0073FF" />
                    </Svg>
                  </View>
                </Marker>
                {getNearbyIncidents.map((incident, i) => (
                  <Marker
                    key={i}
                    coordinate={{
                      latitude: incident.location.latitude,
                      longitude: incident.location.longitude,
                    }}
                    onPress={() => {
                      console.log(incident.id);
                      navigation.navigate("Incident", {
                        incident,
                      });
                    }}
                  >
                    <View style={{ width: 50, height: 50 }}>
                      <Svg>
                        <Circle
                          cx="25"
                          cy="25"
                          r="22"
                          stroke="#E48A31"
                          strokeWidth={3}
                          fill="orange"
                          opacity={0.3}
                        />
                      </Svg>
                    </View>
                  </Marker>
                ))}
              </MapView>
            )}
            <Auth />
          </>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
  mapStyle: {
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default App;
