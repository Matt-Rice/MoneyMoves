import { useState } from "react"
import { View, Text, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import HeaderFilters from "./HeaderFilters";
import ColumnsHeader from "./ColumnsHeader";
import PaginationFooter from "./PaginationFooter";
import { Transaction } from "@/lib/transactionHandler";

interface TransactionsListProps {
  data: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export default function TransactionsList({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onPerPageChange
}: TransactionsListProps) {
  // ----- FILTER STATES -----
  const [description, setDescription] = useState("");
  const [sortAmount, setSortAmount] = useState<"none" | "asc" | "desc">("none");
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [category, setCategory] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  // Date picker visibility flags
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // ----- RENDER ITEM -----
  const renderItem = ({ item }: { item: Transaction}) => (
    <View style={styles.rowStyle}>
      <Text style={styles.col1}>{item.description}</Text>
      <Text style={styles.col2}>${item.amount}</Text>
      <Text style={styles.col3}>{item.type}</Text>
      <Text style={styles.col4}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <FlashList
      data={data}
      //estimatedItemSize={70}
      renderItem={renderItem}
      ListHeaderComponent={

          <ColumnsHeader 
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
      }
      stickyHeaderIndices={[0]}
      // ListFooterComponent={
      //   <PaginationFooter
      //     currentPage={currentPage}
      //     totalPages={totalPages}
      //     onPageChange={onPageChange}
      //     onPerPageChange={onPerPageChange}
      //   />
      // }
    />
  );
}

const styles = StyleSheet.create({
    rowStyle:{
        flexDirection: "row",
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "white"
        
    },
    headerRow:{
        flexDirection: "row",
        padding: 12,
        backgroundColor: "#e9e9e9",
        borderBottomWidth: 1,
        borderColor: "#ccc"
    },
    col1:{ flex: 2 },
    col2: { flex: 1 },
    col3: { flex: 1 },
    col4: { flex: 1 },
});



// Flashlist component to display transactions
// export default function TransactionsList(data: Array<Transaction>,  meta: Meta, links: PaginationLink) {
//     return (
//         <FlashList
//             data={data}
//             renderItem={({ item }) => (
//                 <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
//                     <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.description}</Text>
//                 </View>
//             )} 
//             ListHeaderComponent={() => (
//                 <View style={styles.headerContainer}>
//                     <Text style={{ fontSize: 22, fontWeight: "600" }}>Transactions</Text>
//                     <Text style={{ color: "#666" }}>Latest activity</Text>
//                     <
//                 </View>
//             )}
//             stickyHeaderIndices={[0]}
//             ListFooterComponent={ () => (
//                 <View style={styles.footerContainer}>
//                     <Text style={{ textAlign: "left", padding: 16, color: "#666" }}></Text>
//                 </View>

//             )}
//         />
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },

//     footerContainer:{
//         padding: 16,
//         borderTopWidth: 1,
//         borderColor: '#1b1010ff',
//         backgroundColor: '#4d0707ff',
//     },

//     headerContainer: {
//         padding: 16,
//         borderTopWidth: 1,
//         borderColor: '#1b1010ff',
//         backgroundColor: '#4d0707ff',
//     }
// });