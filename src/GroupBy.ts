export function groupTransactions(parsedData: any) {
    const groupedTransactions = parsedData.reduce((acc: any, transaction: any) => {
        const { name, price, quantity, time, vendorName, status, shippingCharges, recievedTime, purchaseTime } = transaction;
        const key = name;
        if (!acc[key]) {
            acc[key] = {
                ...transaction,
                history: []
            };
        } else {
            acc[key].quantity += quantity;
            acc[key].price += price;
        }
        acc[key].history.push({ price, quantity, vendorName, time, date: new Date(time).toLocaleDateString(), status, recievedTime, shippingCharges, purchaseTime });
        return acc;
    }, {});
    const result = Object.values(groupedTransactions)?.map((obj: any, index) => {
        return { ...obj, id: index + 1 };
    });
    return result;
}
export function getStatus(object: any, id: number) {
    const { price, transactions, quantity } = object;
    const priceSum = transactions.reduce((total: number, transaction: any) => total + parseFloat(transaction.amount), 0);
    return { ...object, status: priceSum >= price * quantity ? "Closed" : "Open", priceSum, totalAmount: price * quantity, parentId: id };
}