import { View, Text, StyleSheet, Pressable, TextInput, Modal } from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Transaction } from "@/lib/transactionHandler";

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: string) => void;
}

export default function PaginationFooter({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onPerPageChange }: PaginationFooterProps) {
  
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.footer}>
      <Pressable
        onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color={"#333"} />
      </Pressable>
       <Modal
        visible={modalVisible} 
        transparent
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Transaction</Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Ionicons name="close-outline" size={24} color="#333" />
                </Pressable>
                

              </View>
          </View>
        </View>
      </Modal>

      <TextInput
        value={totalPages.toString()}
        onChangeText={ (v) => { onPerPageChange(v) }}
        placeholderTextColor={'gray'}
        placeholder="15"
        style={styles.input}
      />

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
  input:{
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10
  },
  pageBtn:{
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: "#e5e5e5",
      borderRadius: 6
  },
  pageBtnDisabled:{
      opacity: 0.5
  },
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