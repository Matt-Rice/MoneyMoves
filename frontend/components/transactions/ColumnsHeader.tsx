import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from "react-native";
import HeaderFilters from "./HeaderFilters";

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

export default function ColumnsHeader({
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
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.headerRow}>
      <Text style={styles.col1Header}>Description</Text>
      <Text style={styles.col2Header}>Amount</Text>
      <Text style={styles.col3Header}>Type</Text>
      <Text style={styles.col4Header}>Date</Text>
      <Pressable onPress={() => setModalVisible(true)}>
        <Ionicons name="filter" size={20} color="#333" />
      </Pressable>

      <Modal
        visible={modalVisible} 
        transparent
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Transactions</Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Ionicons name="close-outline" size={24} color="#333" />
                </Pressable>
              </View>

              <HeaderFilters
                description={description}
                setDescription={setDescription}
                sortAmount={sortAmount}
                setSortAmount={setSortAmount}
                type={type}
                setType={setType}
                category={category}
                allCategories={['entertainment', 'utilities', 'groceries', 'rent', 'paycheck', 'miscellaneous']}
                setCategory={setCategory}
                fromDate={fromDate}
                toDate={toDate}
                showFromPicker={showFromPicker}
                showToPicker={showToPicker}
                setShowFromPicker={setShowFromPicker}
                setShowToPicker={setShowToPicker}
                setFromDate={setFromDate}
                setToDate={setToDate}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    headerRow:{
        flexDirection: "row",
        padding: 12,
        backgroundColor: "#e9e9e9",
        borderBottomWidth: 1,
        borderColor: "#ccc"
    },
    col1Header:{ flex: 2, fontWeight: "bold" },
    col2Header:{ flex: 1, fontWeight: "bold" },
    col3Header:{ flex: 1, fontWeight: "bold" },
    col4Header:{ flex: 1, fontWeight: "bold" },
    close:{ 
      marginTop: 20
    },
    modalView:{
      height: 700, 
      width: 400, 
      padding: 20, 
      backgroundColor: 'white', 
      borderRadius: 10
    },
    modalContainer:{
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'rgba(0,0,0,0.5)' 
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between", // pushes text left, close button right
      alignItems: "center",
      marginBottom: 10,
      padding: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center"
    },
});

