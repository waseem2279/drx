import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Image } from "expo-image";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import Colors from "@/constants/Colors";
import { TextSemiBold } from "@/components/StyledText";
import useAppContent from "@/hooks/useAppContent";
import { storage } from "../../../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

const width = Dimensions.get("window").width;

const DoctorCarousel = () => {
  const refCarousel = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { imageUrls } = useAppContent(); // <-- these are storage paths

  const [downloadUrls, setDownloadUrls] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function loadUrls() {
      if (imageUrls.length === 0) return;

      const urls = await Promise.all(
        imageUrls.map(async (path) => {
          const storageRef = ref(storage, path);
          return await getDownloadURL(storageRef);
        })
      );

      setDownloadUrls(urls);
    }

    loadUrls();
  }, [imageUrls]);

  console.log(imageUrls);

  return (
    downloadUrls.length > 0 && (
      <View style={styles.container}>
        <TextSemiBold style={styles.header}>Featured doctors</TextSemiBold>

        <Carousel
          ref={refCarousel}
          autoPlay
          autoPlayInterval={3000}
          width={width}
          height={width * 0.66666}
          data={downloadUrls}
          onProgressChange={progress}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxAdjacentItemScale: 0.9,
            parallaxScrollingOffset: 125,
          }}
          renderItem={({ item }) => (
            <Image
              style={styles.image}
              source={{ uri: item }} // <-- works now
              contentFit="contain"
              transition={250}
            />
          )}
        />
      </View>
    )
  );
};

export default DoctorCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 12,
    borderBottomColor: Colors.faintGrey,
    borderBottomWidth: 1,
  },
  image: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    fontSize: 16,
    marginHorizontal: 16,
  },
});
