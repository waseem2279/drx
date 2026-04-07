import CustomIcon from "@/components/CustomIcon";
import { TextRegular } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import { useDoctors } from "@/stores/useDoctorSearch";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchModal() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const doctors = useDoctors();

  const handleSearch = async (text: string) => {
    // Handle search input
    setSearchQuery(text);
    if (text.length > 0) {
      const results = doctors.filter((doctor) =>
        JSON.stringify(doctor).toLowerCase().includes(text.toLowerCase()),
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultPress = (doctor: any) => {
    // Naviagate to the chat screen
    router.navigate({
      pathname: "/(protected)/doctor/[id]",
      params: { id: doctor.uid },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchContainer}>
        <CustomIcon name="search" size={20} color={colors.mutedForeground} />
        <TextInput
          style={styles.searchInput}
          placeholder={t("form.search-doctors")}
          placeholderTextColor={colors.mutedForeground}
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleResultPress(item)}
          >
            <TextRegular
              style={[styles.resultTitle, { color: colors.foreground }]}
            >
              {item.firstName} {item.lastName}
            </TextRegular>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <TextRegular
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              {searchQuery.length > 0
                ? t("form.no-doctors-found")
                : t("form.start-typing-to-search-doctors")}
            </TextRegular>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    gap: 10,
  },
  searchInput: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
  },
  resultItem: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
  },
});
