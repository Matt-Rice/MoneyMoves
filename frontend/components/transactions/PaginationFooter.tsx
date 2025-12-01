import { View, Text, StyleSheet, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export default function PaginationFooter({ currentPage, totalPages, onPageChange, onPerPageChange }: PaginationFooterProps) {
  return (
    <View style={styles.footer}>
      <Picker
        selectedValue={15}
        onValueChange={onPerPageChange}
        style={{ width: 150 }}
      >
        <Picker.Item label="10" value={10} />
        <Picker.Item label="15" value={15} />
        <Picker.Item label="25" value={25} />
        <Picker.Item label="50" value={50} />
      </Picker>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
        >
          <Text>Prev</Text>
        </Pressable>

        <Text style={{ marginHorizontal: 12 }}>
          {currentPage} / {totalPages}
        </Text>

        <Pressable
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={[styles.pageBtn, currentPage >= totalPages && styles.pageBtnDisabled]}
        >
          <Text>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    footer:{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderColor: "#ccc"
    },
    pageBtn:{
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "#e5e5e5",
        borderRadius: 6
    },
    pageBtnDisabled:{
        opacity: 0.5
    }
});