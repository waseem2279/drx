import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextSemiBold } from "./StyledText";
import IconButton from "./IconButton";
import CustomIcon from "./CustomIcon";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useSetFilters } from "@/stores/useFilterStore";
import useAppContent from "@/hooks/useAppContent";

const DoctorsHeader = () => {
  const { t } = useTranslation();
  const setFilters = useSetFilters();
  const { specialties } = useAppContent();
  const searchFilters = useMemo(() => specialties, [specialties]);
  const scrollRef = useRef<typeof ScrollView | null>(null);
  const router = useRouter();
  const itemsRef = useRef<Array<typeof TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    (selected as any)?.measure((x: number) => {
      (scrollRef.current as any)?.scrollTo({
        x: x - 16,
        y: 0,
        animated: true,
      });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilters({ specialty: searchFilters[index] });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.actionRow}>
        <IconButton
          size={40}
          name={i18next.dir() === "rtl" ? "arrow-forward" : "arrow-back"}
          onPress={() => router.back()}
        />
        <TouchableOpacity
          onPress={() => router.navigate({ pathname: "/search-modal" })}
          style={styles.searchBtn}
        >
          <CustomIcon name="search" size={20} color={Colors.black} />
          <TextSemiBold style={{ color: Colors.lightText }}>
            {t("common.search")}
          </TextSemiBold>
        </TouchableOpacity>

        <IconButton
          size={40}
          name="sort"
          onPress={() => router.navigate("/(protected)/(modals)/filter")}
        />
      </View>

      <ScrollView
        ref={scrollRef as any}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          gap: 30,
          padding: 16,
        }}
      >
        {searchFilters.map((item, index) => (
          <TouchableOpacity
            onPress={() => selectCategory(index)}
            key={index}
            ref={(el: any) => (itemsRef.current[index] = el)}
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <TextSemiBold
              style={
                activeIndex === index
                  ? { color: Colors.black }
                  : { color: Colors.lightText }
              }
            >
              {item.replace(/\b\w/g, (char) => char.toUpperCase())}
            </TextSemiBold>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flexDirection: "column",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: Colors.faintGrey,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    gap: 16,
  },
  filterBtn: {
    height: 56,
    width: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    gap: 10,
    flex: 1,
    paddingHorizontal: 14,
    borderRadius: 30,
    borderColor: Colors.faintGrey,
    borderWidth: 1,
  },
});

export default DoctorsHeader;
