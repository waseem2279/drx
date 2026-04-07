import ChatsList from "@/components/ChatsList";
import MessagesHeader from "@/components/MessagesHeader";
import { Stack } from "expo-router";
import { View } from "react-native";

import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const Messages = () => {
  const [filter, setFilter] = useState<string>("all");
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        borderWidth: 0,
        borderTopWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Stack.Screen
        options={{
          header: () => <MessagesHeader setFilter={setFilter} />,
        }}
      />
      <ChatsList filter={filter} />
    </View>
  );
};

export default Messages;
