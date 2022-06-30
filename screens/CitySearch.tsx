import React, { useState, useEffect, useRef } from "react";
import { vh, vw } from "react-native-expo-viewport-units";
import {
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Animated,
} from "react-native";
import animation from "../assets/images/animation.gif";
import { useFonts } from "expo-font";
import "react-native-gesture-handler";
import { current, forecast, urban } from "../data/earthData";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { Button, Portal, Dialog, Provider } from "react-native-paper";
import { Video, AVPlaybackStatus } from "expo-av";
import helpVideo from "../assets/images/helpVideo.mp4";

type Res = {
  data: {
    candidates: Array<{
      photos: Array<{ photo_reference: string }>;
      name: string;
    }>;
  };
};

type ImageData = {
  image?: {
    uri: string;
  };
  name: string;
};

//@ts-ignore
const horizontal = vw(100) > vh(100);
export const CitySearch: React.SFC<{}> = ({ navigation }) => {
  const [weather, setWeather] = useState(null);
  const [main, setMain] = useState(null);
  const [list, setList] = useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [location, setLocation] = useState("");
  const { promiseInProgress } = usePromiseTracker();
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [data, setData] = useState<ImageData>({
    image: undefined,
    name: "loading...",
  });
  const [error, setError] = useState<string | null>(null);
  const [sys, setSys] = useState(null);
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const [loaded] = useFonts({
    VarelaRound: require("../assets/fonts/VarelaRound-Regular.ttf"),
  });
  const getData = (res: Res) => {
    const data = res.data;
    const photoReference = data.candidates[0].photos[0]["photo_reference"];
    const name = data.candidates[0].name;
    const link = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&key=AIzaSyDsglUyv93_Gc5QfjX00r7drRMNLX6vFdQ&maxwidth=400&maxheight=400`;
    setData({
      image: { uri: link },
      name,
    });
  };
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim]);
  useEffect(() => {
    if (weather !== null && list !== null) {
      navigation.navigate("Data", {
        weather,
        main,
        list,
        data,
        sys,
        promiseInProgress,
      });
    }
  }, [weather, data, list]);
  useEffect(() => {
    try {
      trackPromise(
        current(location).then(({ data: { weather, main, sys } }) => {
          setWeather(weather);
          setMain(main);
          setSys(sys);
        }),

        forecast(location).then(({ data: { list } }) => {
          setList(list);
        }),
        //@ts-ignore
        urban(location)
          .then((res) => {
            getData(res);
          })
          .catch((err) => {
            console.log(err);
          }),
      );
    } catch (err) {
      setError(err);
    }
    return () => {
      setData({ image: { uri: "" }, name: "" });
    };
  }, [location]);
  if (!loaded) {
    return null;
  }

  return (
    <Provider>
      {/*@ts-ignore*/}
      <ImageBackground style={styles.container} source={animation}>
        <Animated.View
          style={{
            position: "absolute",
            top: vh(4),
            right: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [vw(-10), vw(4)],
            }),
            opacity: fadeAnim,
          }}
        >
          <Button
            icon={"comment-question"}
            color={"#00ACD1"}
            size={horizontal ? vh(8) : vw(8)}
            mode="contained"
            onPress={() => {
              setVisible(true);
            }}
            compact
            style={{
              borderRadius: 1000,
            }}
          ></Button>
        </Animated.View>
        <Animated.View
          style={{
            opacity: fadeAnim,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.hello}>Hello!</Text>

          <TextInput
            style={styles.input}
            onChangeText={onChangeSearch}
            value={searchQuery}
            placeholder="Type the name of a city..."
            returnKeyType="go"
            onSubmitEditing={() => {
              setLocation(searchQuery);
            }}
          />
          {error ? <Text>{error}</Text> : null}
        </Animated.View>
      </ImageBackground>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => {
            setVisible(false);
          }}
          style={{
            alignItems: "center",
          }}
        >
          <Video
            style={{
              width: horizontal ? vh(80) : vw(80),
              height: horizontal ? vh(80) : vw(80),
            }}
            source={helpVideo}
            useNativeControls
            resizeMode="cover"
          />
        </Dialog>
      </Portal>
    </Provider>
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
