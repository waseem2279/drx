import { FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { TextRegular } from "./StyledText";
import countryCodes from "@/../assets/data/country_codes.json";
import Divider from "./Divider";
import { Country, useSetCountry } from "@/stores/useCountryStore";
import { router } from "expo-router";

interface CountryCode {
  name: string;
  code: string;
  dial_code: string;
  emoji: string;
}

interface HandlePress {
  (item: CountryCode): void;
}

const CountryCodes = () => {
  const setCountry = useSetCountry();

  const handlePress: HandlePress = (item) => {
    setCountry(item as Country);
    router.back();
  };

  // Sort country codes by name
  countryCodes.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <FlatList
      data={countryCodes}
      keyExtractor={(item) => `${item.name}-${item.code}`}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{ paddingVertical: 8 }}
          onPress={() => handlePress(item)}
        >
          <TextRegular>
            {item.emoji} {item.name} ({item.dial_code})
          </TextRegular>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingBottom: 48, paddingHorizontal: 16 }}
      style={{ backgroundColor: "#fff", height: 256 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CountryCodes;
