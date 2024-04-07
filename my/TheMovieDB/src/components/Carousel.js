import * as React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

function CarouselComponent({ data }) {
  const width = Dimensions.get("window").width;
  return (
    <Carousel
      loop
      width={width}
      height={width / 0.667}
      autoPlay={true}
      data={data}
      scrollAnimationDuration={1000}
      mode="parallax"
      style={{ borderColor: "red", borderWidth: 1 }}
      renderItem={({ item }) => (
        <View
          style={{
            flex: 1,
            //   borderWidth: 1,
            justifyContent: "center",
          }}
        >
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            }}
            style={{ flex: 1 }}
            resizeMode="stretch"
          />
        </View>
      )}
    />
  );
}

export default CarouselComponent;
