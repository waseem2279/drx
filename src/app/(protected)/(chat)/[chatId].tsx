import Avatar from "@/components/Avatar";
import IconButton from "@/components/IconButton";
import CustomIcon from "@/components/CustomIcon";
import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useUserPresence } from "@/hooks/useUserPresence";
import { useChatsById } from "@/stores/useChatStore";
import { useUserData } from "@/stores/useUserStore";
import { getChatId, getSenderAvatar, getSenderName } from "@/utils/chatUtils";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import React, { useEffect, useMemo, useState } from "react";
import { I18nManager, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Bubble,
  Chat,
  Composer,
  InputToolbar,
} from "@kesha-antonov/react-native-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { db, functions } from "../../../../firebaseConfig";
import { useTranslation } from "react-i18next";
// Import ar and en locales from dayjs
import "dayjs/locale/ar";
import "dayjs/locale/en";
import { fetchAppointmentStatus } from "@/api/appointments";
import LoadingScreen from "@/components/LoadingScreen";
import { useTheme } from "@/hooks/useTheme";

interface Message {
  _id: number | string;
  text: string;
  createdAt: number;
  user: User;
}

interface User {
  _id: number | string;
  name: string;
  avatar: string;
}

const ChatRoom = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { chatId } = useLocalSearchParams();
  const chatIdParam = String(chatId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<{
    message: string;
    ongoing: boolean;
  } | null>(null);
  const userData = useUserData();
  const [loading, setLoading] = useState(true);
  const chat = useChatsById(chatIdParam);
  const insets = useSafeAreaInsets();
  const chatTheme = useMemo(
    () => ({
      colors: {
        accent: colors.primary,
        background: colors.background,
        surface: colors.background,
        incomingBubble: Colors.peach,
        outgoingBubble: Colors.lightLavender,
        incomingText: Colors.black,
        outgoingText: Colors.black,
        incomingMeta: Colors.black,
        outgoingMeta: Colors.black,
        inputBarBackground: colors.background,
        inputBackground: Colors.lightGrey,
        inputText: Colors.black,
        inputFieldBorder: Colors.faintGrey,
        placeholder: Colors.lightText,
      },
      radii: {
        bubble: 12,
        bubbleGrouped: 12,
      },
      spacing: {
        bubblePaddingH: 8,
        bubblePaddingV: 3,
        screenEdge: 8,
        betweenGroups: 8,
        withinGroup: 2,
      },
      typography: {
        message: {
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "400" as const,
        },
        time: {
          fontSize: 10,
          fontWeight: "400" as const,
        },
      },
    }),
    [colors.background, colors.primary],
  );

  // Firestore references
  const messagesRef = useMemo(
    () => collection(db, "chats", chatIdParam, "messages"),
    [chatIdParam],
  );

  const otherUser =
    userData?.role === "doctor"
      ? chat?.participants.patient
      : chat?.participants.doctor;

  useEffect(() => {
    if (!userData?.uid || !otherUser?.uid) return;

    const loadStatus = async () => {
      const result = await fetchAppointmentStatus(userData.uid, otherUser.uid);
      setStatus(result);
    };

    loadStatus();
  }, [userData?.uid, otherUser?.uid]);

  // Mainly used to fetch the chat data and messages
  useEffect(() => {
    if (!chat) return;

    // Fetch chat messages
    const unsubscribeMessages = onSnapshot(messagesRef, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt =
          (data.createdAt as Timestamp | undefined)?.toMillis?.() ??
          (data.createdAt as Timestamp | undefined)?.toDate?.().getTime() ??
          Date.now();

        return {
          _id: data.id || doc.id,
          text: data.text,
          createdAt,
          user: {
            _id: data.senderId,
            name: getSenderName(data.senderId, chat),
            avatar: getSenderAvatar(data.senderId, chat),
          },
        };
      });

      // Sort messages by createdAt in descending order
      setMessages(
        loadedMessages.sort((a, b) => b.createdAt - a.createdAt),
      );
      setLoading(false);
    });

    return () => unsubscribeMessages();
  }, [chat, messagesRef]);

  // Handle whenever the user sends a message
  const onSend = async (newMessages: Message[] = []) => {
    if (!userData || !chatId || newMessages.length === 0) return;

    const message = newMessages[0]; // GiftedChat sends 1 at a time by default

    if (!message.text || message.text.trim() === "") return;

    try {
      httpsCallable(
        functions,
        "sendMessage",
      )({
        chatId: chatIdParam,
        text: message.text.trim(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Loading logic
  if (loading || !userData || !status) return <LoadingScreen />;

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Stack.Screen
        options={{
          header: () => <ChatHeader chatId={chatId as string} />,
        }}
      />
      <Chat
        colorScheme="light"
        locale={i18n.language}
        theme={chatTheme}
        messagesContainerStyle={{
          backgroundColor: colors.background,
        }}
        textInputProps={{
          placeholder: t("chat.type-a-message"),
        }}
        renderInputToolbar={(props) => {
          return (
            <View
              style={{
                padding: 8,
                borderTopWidth: 1,
                borderTopColor: Colors.faintGrey,
              }}
            >
              {status.ongoing || userData.role === "doctor" ? (
                <InputToolbar
                  {...props}
                  primaryStyle={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: Colors.faintGrey,
                    gap: 8,
                  }}
                  containerStyle={{
                    borderTopWidth: 0,
                  }}
                />
              ) : (
                <TextSemiBold
                  style={{ color: Colors.lightText, textAlign: "center" }}
                >
                  {status.message}
                </TextSemiBold>
              )}
            </View>
          );
        }}
        renderComposer={(props) => {
          return (
            <Composer
              {...props}
              textInputProps={{
                ...props.textInputProps,
                style: [
                  props.textInputProps?.style,
                  {
                    textAlign: I18nManager.isRTL ? "right" : "left",
                    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
                    flex: 1,
                  },
                ],
              }}
              isMultiline
            />
          );
        }}
        renderSend={(props) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (props.onSend) {
                  props.onSend({ text: props.text }, true);
                }
              }}
              style={{
                padding: 8,
                backgroundColor: colors.primary,
                borderRadius: 9999,
                marginHorizontal: 8,
              }}
            >
              <CustomIcon name="send" size={16} color={colors.background} />
            </TouchableOpacity>
          );
        }}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userData.uid, // Let giftedchat know who is the current user
        }}
        renderAvatar={(props) => {
          return (
            <Avatar
              {...props}
              size={40}
              source={
                props.currentMessage.user.name.toLowerCase() === "system"
                  ? require("@/../assets/images/icon.png")
                  : otherUser!.image
              }
              // Gets users initials
              initials={props.currentMessage.user.name
                .split(" ")
                .map((name) => name.charAt(0))
                .join("")}
            />
          );
        }}
        renderDay={(props) => {
          const date = props.createdAt ? new Date(props.createdAt) : new Date();

          return (
            <View
              style={{
                alignItems: "center",
                marginVertical: 16,
              }}
            >
              <TextRegular style={{ color: Colors.lightText, fontSize: 12 }}>
                {date.toLocaleDateString(i18n.language, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </TextRegular>
            </View>
          );
        }}
        renderTime={(props) => {
          const time = props.currentMessage.createdAt
            ? new Date(props.currentMessage.createdAt).toLocaleTimeString(
                i18n.language,
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true, // Change to false if you prefer 24-hour format
                },
              )
            : "";

          return (
            <View
              style={{
                borderRadius: 12,
                alignSelf:
                  props.position === "left" ? "flex-start" : "flex-end",
              }}
            >
              <TextRegular
                style={{
                  color: Colors.black,
                  fontSize: 10,
                  textAlign: "center",
                }}
              >
                {time}
              </TextRegular>
            </View>
          );
        }}
        renderMessageText={(props) => {
          const { currentMessage } = props;

          return (
            <View
              style={{
                paddingHorizontal: 8,
                paddingTop: 6,
              }}
            >
              <TextRegular
                style={{
                  fontSize: 14,
                  color: Colors.black,
                  lineHeight: 20,
                  textAlign: "left", // Keep text left-aligned inside bubbles
                }}
              >
                {currentMessage.text}
              </TextRegular>
            </View>
          );
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: Colors.peach,
                  borderRadius: 12,
                  maxWidth: "76%",
                },
                right: {
                  backgroundColor: Colors.lightLavender,
                  borderRadius: 12,
                  maxWidth: "76%",
                },
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default ChatRoom;

const ChatHeader = ({ chatId }: { chatId: string }) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const userData = useUserData();
  const chatData = useChatsById(chatId as string);
  const isDoctor = userData?.role === "doctor";

  const otherUser = isDoctor
    ? chatData?.participants.patient
    : chatData?.participants.doctor;

  const presence = useUserPresence(otherUser?.uid);

  if (!chatData || !otherUser) {
    return null; // or a loading spinner
  }
  const callId = getChatId(userData?.uid as string, otherUser.uid);

  const handleCall = async () => {
    try {
      const docRef = doc(db, "chats", chatId);
      await updateDoc(docRef, { hasActiveCall: true });

      // Send a call notification to the other user
      // Pass in the other user's uid
      if (userData?.role === "doctor") {
        httpsCallable(
          functions,
          "sendCallNotification",
        )({
          callId,
          calleeId: otherUser.uid,
          lastName: userData?.lastName,
        });
      }
    } catch (err) {
      console.error("Error updating chat document:", err);
    }

    router.navigate({
      pathname: "/(protected)/(call)/[callId]",
      params: {
        otherPersonFirstName: otherUser.firstName,
        otherPersonLastName: otherUser.lastName,
        chatId,
        callId,
        callerType: userData?.role === "doctor" ? "caller" : "callee",
      },
    });
  };

  // Replace fake values with actual data soon
  return (
    <View
      style={[
        header.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={header.left}>
        <IconButton
          name={i18n.dir() === "ltr" ? "arrow-back" : "arrow-forward"}
          onPress={() => router.back()}
        />
        <View style={header.chatInfo}>
          <TextSemiBold style={header.chatTitle}>
            {t("chats.header", {
              lastName: chatData.participants.doctor.lastName,
            })}
          </TextSemiBold>
          <TextSemiBold
            style={[
              header.onlineStatus,
              { color: presence === "online" ? Colors.green : Colors.grey },
            ]}
          >
            {t(presence === "online" ? "chats.online" : "chats.offline", {
              firstName: otherUser.firstName,
              lastName: otherUser.lastName,
            })}
          </TextSemiBold>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleCall}
        style={[
          header.callButton,
          chatData.hasActiveCall || isDoctor
            ? header.callButton_On
            : header.callButton_Off,
        ]}
        disabled={!isDoctor && !chatData.hasActiveCall}
      >
        <CustomIcon name="videocam" size={24} color={colors.background} />
      </TouchableOpacity>
    </View>
  );
};

const header = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  chatInfo: {
    flexDirection: "column",
  },
  chatTitle: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
  },
  onlineStatus: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: "left",
  },
  callButton: {
    borderRadius: 9999,
    paddingVertical: 8,

    justifyContent: "center",
    alignItems: "center",
  },
  callButton_On: {
    backgroundColor: Colors.green,
    paddingHorizontal: 16,
  },
  callButton_Off: {
    backgroundColor: Colors.lightGrey2,
    paddingHorizontal: 8,
  },
});
