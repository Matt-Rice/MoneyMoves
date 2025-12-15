import { useEffect } from "react"
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native"
import { Picker } from "@react-native-picker/picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import CategoryFilter from "./CategoryFilter"
import { Transaction } from "@/lib/transactionHandler"

interface AddTransactionProps {
    // addTransaction: Transaction | undefined,
    // setAddTransaction: (val: Transaction) => void,
    description: string;
    setDescription: (val: string) => void;
    amount: number;
    setAmount: (val: number) => void;
    type: "all" | "income" | "expense";
    setType: (val: "all" | "income" | "expense") => void;
    allCategories : string[];
    category: string[];
    setCategory: (val: string[]) => void;
    date: Date;
    setDate: (val: Date) => void;
    showPicker: boolean;
    setShowPicker: (val: boolean) => void;
}

export default function AddTransactionView({
// addTransaction,
// setAddTransaction
description,
setDescription,
amount,
setAmount,
type,
setType,
allCategories,
category,
setCategory,
date,
setDate,
showPicker,
setShowPicker
}: AddTransactionProps){
    return(
      <View style={styles.container}>
          <Text>Add Transactions</Text>
          <Text style={styles.filterLabel}>Description</Text>
              <TextInput
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={'gray'}
              placeholder="Enter description..."
              style={styles.input}
              />

          <Text style={styles.filterLabel}>Amount</Text>
              <TextInput
              value={amount.toString()}
              onChangeText={(val: string) => setAmount(parseFloat(val))}
              placeholderTextColor={'gray'}
              placeholder="Enter Amount..."
              style={styles.input}
              />

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

        <Pressable onPress={() => setShowPicker(true)}>
          <Text style={styles.dateBtn}>
            To: {date ? date.toDateString() : "Select date"}
          </Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            onChange={(event, date) => {
              setShowPicker(false);
              if (date) setDate(date);
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

