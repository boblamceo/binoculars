import React from "react";
import { vw } from "react-native-expo-viewport-units";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
} from "react-native";
import animation from "../assets/images/animation.gif";
import { useFonts } from "expo-font";

export const CitySearch: React.SFC<{}> = () => {
  const [loaded] = useFonts({
    VarelaRound: require("../assets/fonts/VarelaRound-Regular.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <ImageBackground style={styles.container} source={animation}>
      <Text style={styles.hello}>Hello!</Text>

      <TextInput
        style={styles.input}
        placeholder="Type the name of a city..."
        returnKeyType="go"
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  hello: {
    color: "#00ACD1",
    fontSize: vw(20),
    fontFamily: "VarelaRound",
  },
  input: {
    borderWidth: 1,
    width: vw(77.78),
    height: vw(11.35),
    borderRadius: vw(77.78),
    paddingHorizontal: vw(5),
    backgroundColor: "#FFF",
    fontSize: vw(4),
  },
});
