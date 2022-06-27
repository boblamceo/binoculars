import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { vh, vw } from "react-native-expo-viewport-units";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
const horizontal = vw(100) > vh(100);
const Card: React.SFC<{}> = ({
  image,
  temp,
  time,
  pressure,
  rain,
  includesRain,
  includesPressure,
}) => {
  const [loaded] = useFonts({
    VarelaRound: require("../assets/fonts/VarelaRound-Regular.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <View
      style={[
        styles.container,
        {
          marginHorizontal:
            !includesPressure && !includesRain
              ? horizontal
                ? vh(7)
                : vw(7)
              : horizontal
              ? vh(6)
              : vw(6),
        },
      ]}
    >
      <Text style={styles.timetxt}>
        {time
          .slice(0, time.length - 3)
          .split("")
          .reverse()
          .join("")
          .slice(0, 11)
          .split("")
          .reverse()
          .join("")}
      </Text>
      <View style={styles.iconContainer}>
        <Image
          source={image}
          style={{
            height:
              !includesPressure && !includesRain
                ? horizontal
                  ? vh(14)
                  : vw(14)
                : horizontal
                ? vh(13)
                : vw(13),
          }}
          resizeMode="contain"
        ></Image>
      </View>
      <Text
        style={[
          styles.temptxt,
          {
            fontSize:
              !includesPressure && !includesRain
                ? horizontal
                  ? vh(7)
                  : vw(7)
                : horizontal
                ? vh(6.5)
                : vw(6.5),
          },
        ]}
      >
        {temp.toFixed(0)}˚C
      </Text>
      {includesPressure ? (
        <View style={styles.pressure}>
          <SimpleLineIcons
            name="speedometer"
            size={horizontal ? vh(2.5) : vw(2.5)}
            color="white"
          />
          <Text style={styles.values}>{pressure} hPa</Text>
        </View>
      ) : null}
      {includesRain ? (
        <View style={styles.rain}>
          <FontAwesome5
            name="cloud-rain"
            size={horizontal ? vh(2.5) : vw(2.5)}
            color="white"
          />
          <Text style={styles.values}>{rain} mm/hr</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  values: {
    color: "white",
    fontFamily: "VarelaRound",
    marginLeft: horizontal ? vh(1) : vw(1),
    fontSize: horizontal ? vh(2.5) : vw(2.5),
  },
  pressure: {
    marginBottom: horizontal ? vh(2) : vw(2),
    flexDirection: "row",
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
  temptxt: {
    color: "white",
    fontFamily: "VarelaRound",
  },
  rain: {
    flexDirection: "row",
  },
});

export default Card;
