import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import { Camera, CameraType } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { gun } from "../../App";

function SubmitPage({ route }: { route: any }) {
  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      what: "",
      dangerLevel: "",
      Description: "",
    },
    mode: "onChange",
  });

  const [type, setType] = useState(CameraType.back);
  const [cameraReady, setCameraReady] = useState(false);
  const [mediaBase64, setMediaBase64] = useState("");
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const camRef = useRef<Camera>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  function onSnap() {
    if (camRef.current) {
      camRef.current.takePictureAsync({ base64: true }).then((data) => {
        // encode to base64
        const base64 = `data:image/jpg;base64,${data.base64}`;
        setMediaBase64(base64);
      });
    }
  }

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

  type FormData = {
    what: string;
    image: string;
    title: string;
    location: {
      latitude: string;
      longitude: string;
    };
    date: string;
  };
  const uploadToGun = (data: FormData) => {
    const incident = {
      title: data.title,
      description: data.what,
      location: {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
      },
      image: data.image,
      date: data.date,
    };
    gun.get("incidents").set(incident);
  };

  return (
    <>
      {(mediaBase64.length === 0 && (
        <View
          style={{ ...styles.containerStyle, ...StyleSheet.absoluteFillObject }}
        >
          <Camera
            style={{
              ...styles.containerStyle,
              ...StyleSheet.absoluteFillObject,
            }}
            type={type}
            onCameraReady={() => setCameraReady(true)}
            ref={camRef}
          />
          <View
            style={{
              ...styles.containerStyle,
              ...StyleSheet.absoluteFillObject,
            }}
          >
            {cameraReady && (
              <View
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  bottom: 100,
                  position: "absolute",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity>
                  <MaterialIcons
                    name="flip-camera-ios"
                    size={48}
                    color="white"
                    onPress={toggleCameraType}
                    style={{ marginRight: 60 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <MaterialIcons
                    name="photo-camera"
                    size={48}
                    color="white"
                    onPress={onSnap}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )) || (
        <View style={styles.containerStyle}>
          <ScrollView contentContainerStyle={styles.scrollViewStyle}>
            <Text style={styles.headingStyle}>Submit Incident</Text>
            <FormBuilder
              control={control}
              setFocus={setFocus}
              formConfigArray={[
                {
                  type: "text",
                  name: "What",

                  rules: {
                    required: {
                      value: true,
                      message: "What is required",
                    },
                  },
                  textInputProps: {
                    label: "What",
                  },
                },

                {
                  type: "text",
                  name: "Danger Level",
                  rules: {
                    required: {
                      value: true,
                      message: "Date is required",
                    },
                  },
                  textInputProps: {
                    label: "Danger Level (1-10)",
                  },
                },

                {
                  type: "text",
                  name: "Description",
                  rules: {
                    required: {
                      value: true,
                      message: "Date is required",
                    },
                  },
                  textInputProps: {
                    label: "More Details?",
                  },
                },
              ]}
            />
            <Text style={{ fontSize: 16, paddingBottom: 16 }}>
              Location:
              {"\n"}
              {route.params?.location?.coords.latitude},{" "}
              {route.params?.location?.coords.longitude}
              {"\n\n"}
              Time:
              {"\n"}
              {new Date().toLocaleString()}
            </Text>
            <Button
              mode={"contained"}
              style={{ backgroundColor: "black" }}
              onPress={handleSubmit((data: any) => {
                console.log(data);
                console.log({
                  title: data.What,
                  // image: mediaBase64,
                  what: data.Description,
                  location: {
                    latitude: route.params?.location?.coords.latitude,
                    longitude: route.params?.location?.coords.longitude,
                  },
                  date: new Date().toLocaleString(),
                });
                uploadToGun({
                  title: data.What,
                  image: mediaBase64,
                  what: data.Description,
                  location: {
                    latitude: route.params?.location?.coords.latitude,
                    longitude: route.params?.location?.coords.longitude,
                  },
                  date: new Date().toLocaleString(),
                });
              })}
            >
              Submit
            </Button>
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    // ...StyleSheet.absoluteFillObject,
  },
  scrollViewStyle: {
    flex: 1,
    padding: 15,
    // marginTop: 50,
    justifyContent: "center",
  },
  headingStyle: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 50,
  },
});

export default SubmitPage;
