import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { vh, vw } from "react-native-expo-viewport-units";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
const horizontal = vw(100) > vh(100);
const Card: React.SFC<{}> = ({ image, temp, time }) => {
  const [loaded] = useFonts({
    VarelaRound: require("../assets/fonts/VarelaRound-Regular.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.timetxt}>{time}</Text>
      <View style={styles.iconContainer}>
        <Image source={image} style={styles.icon} resizeMode="contain"></Image>
      </View>
      <Text style={styles.temptxt}>{temp.toFixed(0)}˚C</Text>
      <View style={styles.pressure}>
        <SimpleLineIcons name="speedometer" size={24} color="white" />
      </View>
      <View>
        <FontAwesome5 name="cloud-rain" size={24} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",

    marginHorizontal: horizontal ? vh(1) : vw(1),
  },
  pressure: {
    marginBottom: horizontal ? vh(1) : vw(1),
  },
  timetxt: {
    color: "white",
    fontFamily: "VarelaRound",
    fontSize: horizontal ? vh(2.5) : vw(2.5),
  },
  iconContainer: {
    marginVertical: horizontal ? vh(1) : vw(1),
    width: horizontal ? vh(13) : vw(13),
    height: horizontal ? vh(13) : vw(13),
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    height: horizontal ? vh(13) : vw(13),
  },
  temptxt: {
    color: "white",
    fontFamily: "VarelaRound",
    fontSize: horizontal ? vh(6.5) : vw(6.5),
  },
});

export default Card;
