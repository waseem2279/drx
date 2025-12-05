import { TextRegular, TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const Biography = ({ doctor }: { doctor: any }) => {
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const [showFullBio, setShowFullBio] = useState(true);

  return (
    <View
      style={{
        flexDirection: "column",
        gap: 8,
        borderTopWidth: 1,
        borderColor: Colors.light.faintGrey,
        paddingTop: 16,
      }}
    >
      <TextRegular
        style={{
          fontSize: 16,
          color: "#000",
          lineHeight: 20,
        }}
        numberOfLines={showFullBio ? undefined : 5}
        onTextLayout={(e) => {
          const { lines } = e.nativeEvent;
          setIsTextTruncated(lines.length > 5);
        }}
      >
        {doctor.biography}
      </TextRegular>
      {isTextTruncated && !showFullBio && (
        <TouchableOpacity
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F0F0F0",
            borderRadius: 8,
            padding: 16,
          }}
          onPress={() => setShowFullBio(true)}
        >
          <TextSemiBold
            style={{
              fontSize: 14,
              color: "#000",
            }}
          >
            Show more
          </TextSemiBold>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Biography;
