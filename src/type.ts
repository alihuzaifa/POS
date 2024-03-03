interface Transaction {
    id: number;
    date: Date;
    amount: number;
}
export interface Item {
    id: string;
    name: string;
    price: number;
    quantity: number;
    transactions?: Transaction[];
}
export interface KhataAccount {
    id: number;
    userName: string;
    phoneNumber: number;
    address: string;
    items?: Item[];
}


