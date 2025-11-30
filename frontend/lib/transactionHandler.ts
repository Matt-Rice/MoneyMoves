export type Transaction = {
    id: number;
    user_id: number;
    type: 'income' | 'expense';
    category?: string;
    date: string;
    description?: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export type PaginationLink = {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export type MetaLink = {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

export type Meta = {
    current_page: number;
    from: number;
    last_page: number;
    links: MetaLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}
export type PaginatedTransactionsResponse = {
    data: Transaction[];
    links: PaginationLink;
    meta: Meta;

}