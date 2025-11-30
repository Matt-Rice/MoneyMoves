import { useState } from "react"
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PaginatedTransactionsResponse, Transaction, Meta, PaginationLink, MetaLink } from "@/lib/transactionHandler";

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
        <>
          <HeaderFilters
            description={description}
            setDescription={setDescription}
            sortAmount={sortAmount}
            setSortAmount={setSortAmount}
            type={type}
            setType={setType}
            category={category}
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

          <ColumnsHeader />
        </>
      }
      stickyHeaderIndices={[0, 1]} // filters + column labels BOTH sticky
      ListFooterComponent={
        <PaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
        />
      }
    />
  );
}

interface HeaderFiltersProps {
  description: string;
  setDescription: (val: string) => void;
  sortAmount: "none" | "asc" | "desc";
  setSortAmount: (val: "none" | "asc" | "desc") => void;
  type: "all" | "income" | "expense";
  setType: (val: "all" | "income" | "expense") => void;
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

function HeaderFilters({
  description,
  setDescription,
  sortAmount,
  setSortAmount,
  type,
  setType,
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
    <View style={{ backgroundColor: "white", padding: 12 }}>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Search description..."
        style={styles.input}
      />

      <Picker
        selectedValue={sortAmount}
        onValueChange={(v) => setSortAmount(v)}
        style={styles.picker}
      >
        <Picker.Item label="Sort by amount" value="none" />
        <Picker.Item label="Low → High" value="asc" />
        <Picker.Item label="High → Low" value="desc" />
      </Picker>

      <Picker
        selectedValue={type}
        onValueChange={(v) => setType(v)}
        style={styles.picker}
      >
        <Picker.Item label="All Types" value="all" />
        <Picker.Item label="Income" value="income" />
        <Picker.Item label="Expense" value="expense" />
      </Picker>

      {/* DATE PICKERS */}
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

function ColumnsHeader() {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.col1Header}>Description</Text>
      <Text style={styles.col2Header}>Amount</Text>
      <Text style={styles.col3Header}>Type</Text>
      <Text style={styles.col4Header}>Date</Text>
    </View>
  );
}

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

function PaginationFooter({ currentPage, totalPages, onPageChange, onPerPageChange }: PaginationFooterProps) {
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
    input:{
        backgroundColor: "#f3f3f3",
        padding: 10,
        borderRadius: 6,
        marginBottom: 10  
    },
    picker:{
        backgroundColor: "#f3f3f3",
        marginBottom: 10  
    },
    dateBtn:{
        padding: 10,
        backgroundColor: "#f3f3f3",
        borderRadius: 6,
        marginBottom: 8
    },
    rowStyle:{
        flexDirection: "row",
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#ddd"
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
    col1Header:{ flex: 2, fontWeight: "bold" },
    col2Header:{ flex: 1, fontWeight: "bold" },
    col3Header:{ flex: 1, fontWeight: "bold" },
    col4Header:{ flex: 1, fontWeight: "bold" },
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