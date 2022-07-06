import React, { useEffect, useRef } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { Colors, DataTable, IconButton } from "react-native-paper";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import loader from "../assets/images/loader.gif";
import BrokenClouds from "../assets/images/BrokenClouds.png";
import ClearD from "../assets/images/ClearD.png";
import ClearN from "../assets/images/ClearN.png";
import FewCloudsD from "../assets/images/FewCloudsD.png";
import FewCloudsN from "../assets/images/FewCloudsN.png";
import Fog from "../assets/images/Fog.png";
import RainD from "../assets/images/RainD.png";
import RainN from "../assets/images/RainN.png";
import ScatteredClouds from "../assets/images/ScatteredClouds.png";
import ShowerRain from "../assets/images/ShowerRain.png";
import Snow from "../assets/images/Snow.png";
import Thunder from "../assets/images/Thunder.png";
import { useFonts } from "expo-font";

const horizontal = vw(100) > vh(100);

type ImageList = {
  "01": Array<any>;
  "02": Array<any>;
  "03": Array<any>;
  "04": Array<any>;
  "09": Array<any>;
  "10": Array<any>;
  "11": Array<any>;
  "13": Array<any>;
  "50": Array<any>;
};

const imageList: ImageList = {
  "01": [ClearD, ClearN],
  "02": [FewCloudsD, FewCloudsN],
  "03": [ScatteredClouds, ScatteredClouds],
  "04": [BrokenClouds, BrokenClouds],
  "09": [ShowerRain, ShowerRain],
  "10": [RainD, RainN],
  "11": [Thunder, Thunder],
  "13": [Snow, Snow],
  "50": [Fog, Fog],
};

const codeToImage = (code: string) => {
  const codeArr = code.split("");
  const weather = `${codeArr[0]}${codeArr[1]}`;
  const time = codeArr[2] === "d" ? 0 : 1;
  return imageList[weather][time];
};
//@ts-ignore
export const Data: React.SFC<{}> = ({ route, navigation }) => {
  const { weather, main, list, data, sys, promiseInProgress } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loaded] = useFonts({
    VarelaRound: require("../assets/fonts/VarelaRound-Regular.ttf"),
  });
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim]);
  if (!loaded) {
    return null;
  }

  const unixtotime = (unix_timestamp: number) => {
    const date = new Date(unix_timestamp * 1000);
    const hours = date.getHours();
    const minutes = `${date.getMinutes()}`;
    return `${hours}:${
      10 > minutes.substring(-2)
        ? `0${minutes.substring(-2)}`
        : minutes.substring(-2)
    }`;
  };
  return (
    <ImageBackground
      source={{
        uri: data.image.uri,
      }}
      style={styles.background}
    >
      {promiseInProgress ? (
        <Image source={loader} style={styles.loader}></Image>
      ) : (
        <>
          <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.top}>
              <View style={styles.topLeft}>
                <Text style={styles.city}>
                  {data.name.length > 14
                    ? `${data.name.substring(0, 14)}...`
                    : data.name}
                </Text>
                <Text style={styles.temperature}>{main.temp.toFixed(0)}˚C</Text>
              </View>
              <View style={styles.topRight}>
                <Text style={styles.highAndLow}>
                  H: {main.temp_max.toFixed(0)}˚C
                </Text>
                <Text style={styles.highAndLow}>
                  L: {main.temp_min.toFixed(0)}˚C
                </Text>
              </View>
            </View>
            <ScrollView
              style={styles.bottom}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={codeToImage(weather[0].icon)}
                style={styles.icon}
              ></Image>
              <Text style={[styles.description]}>{weather[0].main}</Text>
              <IconButton
                icon="arrow-right-bold"
                color={Colors.cyan500}
                onPress={() =>
                  navigation.navigate("Charts", {
                    weather: weather[0],
                    image: codeToImage(weather[0].icon),
                    list: list,
                    background: data.image.uri,
                  })
                }
                style={{
                  alignSelf: "flex-end",
                }}
                size={horizontal ? vh(9) : vw(9)}
                animated
                accessibilityLabel="Charts"
                accessibilityRole="button"
              ></IconButton>
              <DataTable style={[styles.table]}>
                <DataTable.Row>
                  <DataTable.Cell numeric>
                    <SimpleLineIcons name="speedometer" color="white" />
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> Pressure</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> {main.pressure} hPa</Text>
                  </DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell numeric>
                    <Ionicons name="water" color="white" />
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> Humidity</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}>{main.humidity}%</Text>
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell numeric>
                    <FontAwesome5 name="temperature-high" color="white" />
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> Feels Like</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}>{main.feels_like}˚C</Text>
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell numeric>
                    <Feather name="sunrise" color="white" />
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> Sunrise</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}>
                      {unixtotime(sys.sunrise)}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell numeric>
                    <Feather name="sunset" color="white" />
                  </DataTable.Cell>
                  <DataTable.Cell style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}> Sunset</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric style={{ flex: 2 }}>
                    {" "}
                    <Text style={{ color: "white" }}>
                      {unixtotime(sys.sunset)}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </ScrollView>
          </Animated.View>
        </>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: vw(100),
    height: vh(100),
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    width: vw(20),
    height: vw(20),
  },
  container: {
    width: horizontal ? vh(120) : vw(80),
    height: horizontal ? vh(80) : vw(120),
    borderRadius: horizontal ? vh(5) : vw(5),
    paddingHorizontal: horizontal ? vh(5) : vw(5),
    paddingVertical: horizontal ? vh(5) : vw(5),
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
  top: {
    borderBottomWidth: 1,
    paddingHorizontal: horizontal ? vh(2) : vw(2),
    paddingVertical: horizontal ? vh(2) : vw(2),
    justifyContent: "space-between",
    flexDirection: "row",
  },
  topLeft: { flexDirection: "column" },
  city: {
    color: "#969696",
    fontSize: horizontal ? vh(4.6) : vw(4.6),
    fontFamily: "VarelaRound",
  },
  temperature: {
    fontSize: horizontal ? vh(10) : vw(10),
    fontFamily: "VarelaRound",
    color: "white",
  },
  topRight: { flexDirection: "column", justifyContent: "center" },
  highAndLow: {
    fontFamily: "VarelaRound",
    fontSize: horizontal ? vh(5.5) : vw(5.5),
    color: "white",
  },
  bottom: {
    paddingHorizontal: horizontal ? vh(2) : vw(2),
    paddingVertical: horizontal ? vh(2) : vw(2),
  },
  description: {
    fontFamily: "VarelaRound",
    fontSize: horizontal ? vh(5) : vw(5),
    color: "white",
  },
  icon: {
    marginBottom: horizontal ? vh(1) : vw(1),
  },
  table: {
    backgroundColor: "#121212",
    marginTop: horizontal ? vh(3) : vw(3),
    borderRadius: horizontal ? vh(3) : vw(3),
    color: "white",
  },
});
