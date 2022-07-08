import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  Animated,
} from "react-native";
import { Header } from "react-native-elements";
import { vh, vw } from "react-native-expo-viewport-units";
import { useFonts } from "expo-font";
import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit";
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import {
  Colors,
  IconButton,
  Dialog,
  Portal,
  ToggleButton,
  Provider,
} from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
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
import Card from "../components/Card";

type WeatherData = {
  main: {
    temp: number;
    pressure: number;
  };
  rain?: {
    "3h": number;
  };
};

const horizontal = vw(100) > vh(100);

const weatherColorMap = {
  "clear sky": "#84ccf9",
  "few clouds": "#5da9e1",
  "scattered clouds": "#5e9ad9",
  "broken clouds": "#657fa0",
  "shower rain": "#374667",
  rain: "#374667",
  thunderstorm: "#040a21",
  snow: "#ffffff",
  mist: "#d7e9df",
};
export const Charts: React.SFC<{}> = ({ route }) => {
  const [time, setTime] = useState(
    `${new Date().getHours()}:${new Date().getMinutes()}`,
  );
  const { weather, image, list, background } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loaded] = useFonts({
    VarelaRound: require("../assets/fonts/VarelaRound-Regular.ttf"),
  });
  const [mode, setMode] = useState("temperature");
  const [timeMode, setTimeMode] = useState("hourly");
  const [visible, setVisible] = useState(false);
  const [pressure, setPressure] = useState(false);
  const [rain, setRain] = useState(false);
  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });
  console.log(list);
  const imageList = {
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
  const convertMode = (currMode: string, weatherData: WeatherData) => {
    let returned;
    switch (currMode) {
      case "temperature":
        returned = weatherData.main.temp.toFixed(0);
        break;
      case "pressure":
        returned = weatherData.main.pressure;
        break;
      case "rain":
        const rain = weatherData.rain || { "3h": 0 };
        returned = rain["3h"];
        break;
      default:
        returned = Math.floor(Math.random() * 100);
        break;
    }
    return returned;
  };
  useEffect(() => {
    let DateTimer = setInterval(() => {
      const d = new Date();
      const dString = `${d.getHours()}:${
        d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
      }`;
      if (time !== dString) {
        setTime(dString);
      }
    }, 1000);

    return () => clearInterval(DateTimer);
  }, []);
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

  const WeatherLabel = () => (
    <View style={styles.container}>
      <Text style={styles.Weather}>{weather.main}</Text>
    </View>
  );
  const LeftIcon = () => (
    <Image source={image} style={styles.leftIcon} resizeMode="contain"></Image>
  );
  const Time = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.time}>{time}</Text>
      </View>
    );
  };
  const stampToDate = (stamp: number) => {
    const date = new Date(stamp * 1000);
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hours =
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${month}-${day} ${hours}:${minutes}`;
  };
  const stampToTime = (stamp: number) => {
    const date = new Date(stamp * 1000);
    const hours =
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${hours}:${minutes}`;
  };
  return (
    <Provider>
      <ImageBackground source={{ uri: background }} style={styles.background}>
        <View style={styles.wrapper}>
          <Header
            placement="left"
            leftComponent={LeftIcon}
            centerComponent={WeatherLabel}
            rightComponent={Time}
            backgroundColor={weatherColorMap[weather.description]}
          />
          <Animated.View
            style={{
              right: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [vw(-10), 0],
              }),
              opacity: fadeAnim,
            }}
          >
            <IconButton
              icon={"cog"}
              color={Colors.white}
              size={horizontal ? vh(5) : vw(5)}
              style={{ alignSelf: "flex-end" }}
              onPress={showDialog}
            ></IconButton>
          </Animated.View>

          <Animated.View
            style={{
              height: horizontal
                ? fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, vh(30)],
                  })
                : fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, vw(90)],
                  }),
            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={{
                  labels: list.map((curr: { dt: number }) => {
                    return stampToTime(curr.dt);
                  }),
                  datasets: [
                    {
                      data: list.map((curr: WeatherData) =>
                        convertMode(mode, curr),
                      ),
                    },
                  ],
                }}
                width={horizontal ? vh(500) : vw(500)}
                height={horizontal ? vh(30) : vw(80)}
                yAxisInterval={1}
                chartConfig={{
                  backgroundGradientFrom: `#000`,
                  backgroundGradientTo: "#000",
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientToOpacity: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#fff",
                  },
                  decimalPlaces: 0,
                }}
                withHorizontalLabels={false}
                withVerticalLabels
                decorator={() => {
                  return tooltipPos.visible ? (
                    <View>
                      <Svg>
                        <Rect
                          x={tooltipPos.x - 15}
                          y={tooltipPos.y + 10}
                          width="40"
                          height="30"
                          fill="black"
                        />
                        <TextSVG
                          x={tooltipPos.x + 5}
                          y={tooltipPos.y + 30}
                          fill="white"
                          fontSize="16"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {tooltipPos.value}
                        </TextSVG>
                      </Svg>
                    </View>
                  ) : null;
                }}
                onDataPointClick={(data) => {
                  let isSamePoint =
                    tooltipPos.x === data.x && tooltipPos.y === data.y;

                  isSamePoint
                    ? setTooltipPos((previousState) => {
                        return {
                          ...previousState,
                          value: data.value,
                          visible: !previousState.visible,
                        };
                      })
                    : setTooltipPos({
                        x: data.x,
                        value: data.value,
                        y: data.y,
                        visible: true,
                      });
                }}
                withShadow={false}
                bezier
                withInnerLines={false}
                withOuterLines={false}
              />
            </ScrollView>
          </Animated.View>
          <Animated.View
            style={{
              position: "absolute",
              bottom: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [vh(-20), horizontal ? vh(7) : vw(7)],
              }),
            }}
          >
            <FlatList
              data={list}
              renderItem={({ item }) => {
                return (
                  <Card
                    image={codeToImage(item.weather[0].icon)}
                    temp={item.main.temp}
                    time={stampToDate(item.dt)}
                    pressure={item.main.pressure}
                    rain={item.rain ? item.rain["3h"] : 0}
                    includesPressure={pressure}
                    includesRain={rain}
                  ></Card>
                );
              }}
              keyExtractor={(item) => {
                return item["dt_txt"];
              }}
              horizontal
            ></FlatList>
          </Animated.View>
          <Portal>
            <Dialog
              visible={visible}
              onDismiss={hideDialog}
              style={{
                alignItems: "center",
                paddingBottom: horizontal ? vh(2) : vw(2),
              }}
            >
              <View style={styles.settings}>
                <Picker
                  selectedValue={mode}
                  onValueChange={(itemValue) => setMode(itemValue)}
                  style={{ width: "100%" }}
                >
                  <Picker.Item label="Temperature" value="temperature" />
                  <Picker.Item label="Pressure" value="pressure" />
                  <Picker.Item label="Rain" value="rain" />
                </Picker>
              </View>
              <ToggleButton.Row
                onValueChange={(value) =>
                  value === "pressure" ? setPressure(!pressure) : setRain(!rain)
                }
              >
                <ToggleButton
                  icon="gauge"
                  value="pressure"
                  style={{
                    marginRight: horizontal ? vh(1) : vw(1),
                    borderWidth: 0,
                  }}
                />
                <ToggleButton
                  icon="weather-rainy"
                  value="rain"
                  style={{ borderWidth: 0 }}
                />
              </ToggleButton.Row>
            </Dialog>
          </Portal>
        </View>
      </ImageBackground>
    </Provider>
  );
};

const styles = StyleSheet.create({
  Weather: {
    fontSize: horizontal ? vh(5) : vw(5),
    fontFamily: "VarelaRound",
    color: "#FFF",
  },
  leftIcon: {
    height: horizontal ? vh(10) : vw(10),
    width: horizontal ? vh(15) : vw(15),
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  time: {
    fontFamily: "VarelaRound",
    color: "#FFF",
    fontSize: horizontal ? vh(5) : vw(5),
  },
  settings: {
    flexDirection: "row",
    justifyContent: "center",
  },
  wrapper: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
  },
  background: {
    width: vw(100),
    height: vh(100),
    justifyContent: "center",
    alignItems: "center",
  },
});
