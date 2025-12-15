import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CategoryFilter from "./CategoryFilter";
import Dropdown from "../Dropdown";

interface HeaderFiltersProps {
  description: string;
  setDescription: (val: string) => void;
  sortAmount: "none" | "asc" | "desc";
  setSortAmount: (val: "none" | "asc" | "desc") => void;
  type: "all" | "income" | "expense";
  setType: (val: "all" | "income" | "expense") => void;
  allCategories : string[];
  category: string[];
  setCategory: (val: string[]) => void;
  fromDate: Date | null;
  toDate: Date | null;
  showFromPicker: boolean;
  showToPicker: boolean;
  setShowFromPicker: (val: boolean) => void;
  setShowToPicker: (val: boolean) => void;
  setFromDate: (val: Date | null) => void;
  setToDate: (val: Date | null) => void;
}

export default function HeaderFilters({
  description,
  setDescription,
  sortAmount,
  setSortAmount,
  type,
  setType,
  allCategories,
  category,
  setCategory,
  fromDate,
  toDate,
  showFromPicker,
  showToPicker,
  setShowFromPicker,
  setShowToPicker,
  setFromDate,
  setToDate
}: HeaderFiltersProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.filterLabel}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholderTextColor={'gray'}
        placeholder="Search description..."
        style={styles.input}
      />

      <Text style={styles.filterLabel}>Sort Amount</Text>
      <Picker
        selectedValue={sortAmount}
        onValueChange={(v) => setSortAmount(v)}
        style={styles.picker}
      >
        <Picker.Item label="Sort by amount" value="none" color="black"/>
        <Picker.Item label="Low → High" value="asc" color="black"/>
        <Picker.Item label="High → Low" value="desc" color="black" />
      </Picker>

      <Text style={styles.filterLabel}>Type</Text>
      <Picker
        selectedValue={type}
        onValueChange={(v) => setType(v)}
        style={styles.picker}
      >
        <Picker.Item label="All Types" value="all" color="black" />
        <Picker.Item label="Income" value="income" color="black" />
        <Picker.Item label="Expense" value="expense" color="black" />
      </Picker>

      <Text style={styles.filterLabel}>Category</Text>
      <CategoryFilter
        category={category}
        setCategory={setCategory}
        allCategories={allCategories}
      />

      {/* DATE PICKERS */}
      <Text style={styles.filterLabel}>Date Range</Text>
      <Pressable onPress={() => setShowFromPicker(true)}>
        <Text style={styles.dateBtn}>
          From: {fromDate ? fromDate.toDateString() : "Select date"}
        </Text>
      </Pressable>
      {showFromPicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowFromPicker(false);
            if (date) setFromDate(date);
          }}
        />
      )}

      <Pressable onPress={() => setShowToPicker(true)}>
        <Text style={styles.dateBtn}>
          To: {toDate ? toDate.toDateString() : "Select date"}
        </Text>
      </Pressable>
      {showToPicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowToPicker(false);
            if (date) setToDate(date);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: "white", 
    padding: 12 
  },
  input:{
      backgroundColor: "#f3f3f3",
      padding: 10,
      borderRadius: 6,
      marginBottom: 10
  },
  filterLabel: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 6,
      textAlign: "center"
  },
  picker:{
      backgroundColor: "#f3f3f3",
      color: "black",
      marginBottom: 10
  },
  dateBtn:{
      padding: 10,
      backgroundColor: "#f3f3f3",
      borderRadius: 6,
      marginBottom: 8
  },
});