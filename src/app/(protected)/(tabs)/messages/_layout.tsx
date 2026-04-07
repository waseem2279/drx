import PageHeader from "@/components/PageHeader";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

const MessagesLayout = () => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="search"
        options={{
          title: t("page.search-chats"),
          animation: "fade",
          animationDuration: 125,
          headerShadowVisible: false,
          header: (props) => <PageHeader {...props} />,
        }}
      />
    </Stack>
  );
};

export default MessagesLayout;
