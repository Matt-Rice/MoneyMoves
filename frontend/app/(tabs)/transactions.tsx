import { useEffect, useState } from "react"
import { View, Text, StatusBar, ScrollView } from "react-native";
import { PaginatedTransactionsResponse, Transaction, Meta, PaginationLink, MetaLink } from "@/lib/transactionHandler";
import { useApi } from "@/lib/api";
import TransactionsList from "@/components/transactions/TransactionsList";
import AddTransactionView from "@/components/transactions/AddTransaction";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [meta, setMeta] = useState<Meta>();
    const [transactionResponse, setResponse] = useState<PaginatedTransactionsResponse>();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const api = useApi();

    const onPageChange = (page: number) => {
    }
    
    const onPerPageChange = (perPage: number) => {
    }

    useEffect(() => {

        // Fetch transactions from API or local storage
        const fetchTransactions = async () => {
            
            setLoading(true);
            try{
                
                const response = await api.get('/api/transactions');

                const payload: PaginatedTransactionsResponse = response.data; 
                
                setResponse(payload);
                
                var fetchedTransactions: Transaction[] = payload.data;

                var fetchedMeta: Meta = payload.meta;
                setMeta(fetchedMeta);
                setCurrentPage(fetchedMeta.current_page);
                setTotalPages(fetchedMeta.last_page);
                setTransactions(fetchedTransactions);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
            finally{
                setLoading(false);  
            }
        };
        fetchTransactions();
    }, []); // Empty dependency array to run only once on mount

    return (
        <View style={styles.container}>
            <TransactionsList
                data = {transactions}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                onPerPageChange={onPerPageChange}
            />  
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#25292e',
    },
    listView:{
        height: 40
    }
}