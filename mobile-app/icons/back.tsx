import { Ionicons } from "@expo/vector-icons";
import IconProps from "./exports";

export function BackIcon({ size, color }: IconProps) {
    return <Ionicons name="arrow-back" size={size} color={color} />;
  }