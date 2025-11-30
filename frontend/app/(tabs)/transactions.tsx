import { useEffect, useState } from "react"
import { View, Text, StatusBar } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { PaginatedTransactionsResponse, Transaction, Meta, PaginationLink, MetaLink } from "@/lib/transactionHandler";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Array<Transaction>>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Fetch transactions from API or local storage
        const fetchTransactions = async () => {
            setLoading(true)
            var fetchedTransactions: Array<Transaction> = [
                {
                    id: 1,
                    user_id: 1,
                    type: 'income',
                    category: 'paycheck',
                    date: '2024-06-01',
                    description: 'June Salary',
                    amount: 5000,
                    createdAt: '2024-06-01T10:00:00Z',
                    updatedAt: '2024-06-01T10:00:00Z',
                },
            ]
            
            setTransactions(fetchedTransactions)
        }
    });

    return (
        <View></View>
    );
}