import React from "react";
import { Text, Pressable, View } from "react-native";

const NavBar = ({
  navigation,
  location,
}: {
  navigation: any;
  location: any;
}) => {
  console.log("location: ", location);
  return (
    <>
      <Pressable
        style={{
          backgroundColor: "black",
          position: "absolute",
          paddingVertical: 50,
          bottom: 80,
          left: 0,
          zIndex: 100,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("Submit", { location })}
      >
        <Text style={{ color: "white" }}>REPORT</Text>
      </Pressable>
    </>
  );
};

export default NavBar;
