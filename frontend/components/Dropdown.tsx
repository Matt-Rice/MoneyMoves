import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

/**
 * @typedef {Object} DropdownItem Interface for DropdownItem
 * @property {string} label the label to be displayed
 * @property {any} value the value of the specific item
 * @property {string} value the color of the specific item
 */
interface DropdownItem {
  label: string;
  value: any;
  color?: string;
}

/**
 * @typedef {Object} Props Interface for props of Dropdown
 * @property {string | undefined} label the label to be displayed
 * @property {DropdownItem[]} data the list of dropdown items
 * @property {any} value the value of the specific item
 * @property {void} onChange function that specifies what should happen when a change occurs to the list
 */
interface Props {
  label?: string;
  data: DropdownItem[];
  value: any;
  onChange: (value: any) => void;

  // Optional customizations
  placeholder?: string;
  containerStyle?: any;
  buttonStyle?: any;
  textStyle?: any;
  itemStyle?: any;
  itemTextStyle?: any;
  maxHeight?: number;
}

export default function Dropdown({
  label,
  data,
  value,
  onChange,
  placeholder = "Select...",
  containerStyle,
  buttonStyle,
  textStyle,
  itemStyle,
  itemTextStyle,
  maxHeight = 200,
}: Props) {
  const [open, setOpen] = useState(false);

  const progress = useSharedValue(0);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
    progress.value = withTiming(open ? 0 : 1, { duration: 220 });
  }, [open]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      height: interpolate(progress.value, [0, 1], [0, maxHeight]),
    };
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Button */}
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={toggle}>
        <Text style={[styles.buttonText, textStyle]}>
          {value
            ? data.find((d) => d.value === value)?.label
            : placeholder}
        </Text>
      </TouchableOpacity>

      {/* Animated dropdown */}
      <Animated.View style={[styles.dropdown, animatedStyle]}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.value.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, itemStyle]}
              onPress={() => {
                onChange(item.value);
                toggle();
              }}
            >
              <Text style={[styles.itemText, itemTextStyle, item.color && {color: item.color}]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },
  button: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    marginTop: 4,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});