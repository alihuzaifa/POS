import React from 'react'
import Purchase from '../purchase'
import { useSelector } from 'react-redux'
import PurchaseList from '../purchase/list';
import Billing from '../billing';
import HistoryList from '../history/list';
import User from '../users';
import Khata from '../khata';
import KhataBook from '../khata/khataBook';
import KhataHistory from '../khata/khataHistory';
import Loan from '../loan';
import Quotation from '../quotation';
import InternetConnectionChecker from '../backup';
import KhataBackup from '../backup/KhataBackup';
interface RootState {
    user: any;
}
const Wrapper: React.FC = () => {
    const settingCount = useSelector((state: RootState) => state?.user?.count);
    return (
        <>
            {settingCount === 0 && <Purchase />}
            {settingCount === 1 && <PurchaseList />}
            {settingCount === 2 && <Billing />}
            {settingCount === 3 && <Billing fb={true} />}
            {settingCount === 4 && <User />}
            {settingCount === 5 && <Khata />}
            {settingCount === 6 && <KhataBook />}
            {settingCount === 7 && <KhataHistory />}
            {settingCount === 8 && <HistoryList />}
            {settingCount === 9 && <Loan />}
            {settingCount === 10 && <Quotation />}
            {settingCount === 11 && <InternetConnectionChecker />}
            {settingCount === 12 && <KhataBackup />}
        </>
    )
}
export default Wrapper