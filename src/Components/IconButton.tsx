import React from "react";
import { TouchableOpacity, GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconButtonProps = {
  icon: string;
  onPress?: (event: GestureResponderEvent) => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export default function IconButton({
  icon,
  onPress,
  size = 20,
  color = "#fff",
  style,
  accessibilityLabel,
}: IconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={style} accessibilityLabel={accessibilityLabel}>
      <Ionicons name={icon as any} size={size} color={color} />
    </TouchableOpacity>
  );
}
