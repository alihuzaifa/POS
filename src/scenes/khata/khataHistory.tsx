import { useEffect, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import {
    Box,
    useTheme,
    useMediaQuery,
    Grid,
    Autocomplete,
    TextField,
    Button,
    Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Toolbar } from "../../components/Toolbar";
import { getStatus } from "../../GroupBy";
import { Close, Delete, Edit, RemoveRedEye, Save } from "@mui/icons-material";
import CustomModal from "../../components/CustomModal";
import { useFormik } from "formik";
import * as Yup from 'yup';
import toast from "react-hot-toast";
const KhataHistory = () => {
    const theme: any = useTheme();
    const [list, setList] = useState<object[]>([])
    const [khataHistoryList, setkhataHistoryList] = useState<object[]>([])
    const [transActionArray, setTransActionArray] = useState<object[]>([])
    const [khataUser, setkhataUser] = useState<any>("")
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [open, setOpen] = useState<boolean>(false);
    const [transactionOpen, setTransactionOpen] = useState<boolean>(false);
    const [deleteOpen, setdeleteOpen] = useState<boolean>(false);
    const [deleteObj, setDeleteObj] = useState<any>({});
    const [callAgain, setCallAgain] = useState<boolean>(false);
    interface MyFormValues {
        payment: number;
        remainingAmount: number;
        id: number;
        parentId: number;
    }
    const validationSchema = Yup.object({
        payment: Yup.number()
            .min(1, "Remaining Amount required")
            .max(Yup.ref('remainingAmount'), "Payment cannot exceed remaining amount")
            .required('Remaining Amount required'),
    });
    const formik = useFormik<MyFormValues>({
        initialValues: {
            payment: 0,
            remainingAmount: 0,
            id: 0,
            parentId: 0,
        },
        validationSchema: validationSchema,
        onSubmit: async (_values: MyFormValues) => {
            // Retrieve existing khata book data from local storage
            const existingKhataBook = localStorage.getItem('khata-book');
            // Check if khata book data exists
            if (existingKhataBook) {
                // Parse existing khata book data
                const parseData = JSON.parse(existingKhataBook);
                // Find the khata with matching parentId
                const findKhata = parseData.find(({ id }: any) => id == _values?.parentId);
                // Find the item within the khata with matching id
                const findItem = findKhata?.items?.find(({ id }: any) => id == _values?.id);
                // Prepare transaction object
                const obj = {
                    id: new Date().getTime(),
                    date: new Date(),
                    amount: _values?.payment
                };
                // Push the transaction object into the item's transactions array
                findItem.transactions?.push(obj);
                // Find the index of the item to update within the khata's items array
                const updateItem = findKhata?.items?.findIndex(({ id }: any) => id == _values?.id);
                // Update the item within the khata's items array
                findKhata.items.splice(updateItem, 1, findItem);
                // Find the index of the khata to update within the khata book data
                const updateKhataIndex = parseData?.findIndex(({ id }: any) => id == _values?.parentId);
                // Update the khata within the khata book data
                parseData.splice(updateKhataIndex, 1, findKhata);
                // Store the updated khata book data back into local storage
                localStorage.setItem("khata-book", JSON.stringify(parseData));
                // Display success message
                toast.success('Transactions Successful');
                // Reset the form
                formik.resetForm();
                // Toggle callAgain state to trigger re-render
                setCallAgain(!callAgain);
                setkhataUser('')
                setkhataHistoryList([])
                // Close the dialog
                setOpen(false);
            }
        }
    });
    const deleteSellItem = () => {
        const stockArray = localStorage.getItem('stock');
        const allList = [...list]
        const getKhata: any = allList?.find(({ id }: any) => id === deleteObj?.parentId);
        const findIndexNo: any = allList?.findIndex(({ id }: any) => id === deleteObj?.parentId);
        if (getKhata) {
            const itemsArray = getKhata.items;
            const deleteKhata = itemsArray?.filter(({ id }: any) => id !== deleteObj?.id)
            const getStockObj = itemsArray?.find(({ id }: any) => id === deleteObj?.id)
            if (stockArray) {
                const parseStock = JSON.parse(stockArray)
                let found = false;
                parseStock.forEach((obj: any) => {
                    const sum = obj?.transactions?.reduce((acc: any, obj: any) => {
                        return acc + obj?.amount
                    }, 0)
                    if (obj.time === getStockObj?.time) {
                        obj.quantity += getStockObj.quantity;
                        obj.time = obj?.time;
                        obj.totalAmount = sum;
                        if (obj.hasOwnProperty('id')) {
                            delete obj.id;
                        }
                        if (obj.hasOwnProperty('khataObjId')) {
                            delete obj.khataObjId;
                        }
                        found = true;
                    }
                });
                if (!found) {
                    const { name, quantity, price, transactions, vendorName, time } = getStockObj
                    const sum = transactions?.reduce((acc: any, obj: any) => {
                        return acc + obj?.amount
                    }, 0)
                    const obj = { name, price, transactions, quantity, vendorName, time, totalAmount: sum }
                    parseStock.push(obj);
                }
                localStorage.setItem('stock', JSON.stringify(parseStock))
            }
            getKhata.items = deleteKhata
            if (findIndexNo !== -1) {
                allList.splice(findIndexNo, 1, getKhata)
                localStorage.setItem('khata-book', JSON.stringify(allList))
                setList(allList)
                setDeleteObj({})
                setdeleteOpen(false)
                setkhataHistoryList([])
                setkhataUser('')
            }
        }
    }
    const columns = [
        {
            field: "name",
            headerName: "Item Name",
            flex: 1
        },
        {
            field: "price",
            headerName: "Price",
            flex: 1
        },
        {
            field: "quantity",
            headerName: "Quantity",
            flex: 1
        },
        {
            field: "totalAmount",
            headerName: "Amount",
            flex: 1
        },
        {
            field: "priceSum",
            headerName: "Recieve Amount",
            flex: 1
        },
        {
            field: "priceSum1",
            headerName: "Remaining Amount",
            flex: 1,
            renderCell: ({ row }: any) => {
                return row?.totalAmount - row?.priceSum

            }
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
            renderCell: ({ row }: any) => {
                const currentDate = new Date(row?.id);
                const day = currentDate.getDate();
                const month = currentDate.toLocaleString('default', { month: 'long' });
                const year = currentDate.getFullYear();
                const formattedDate = `${day} ${month} ${year}`
                return formattedDate
            }
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1
        },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            renderCell: ({ row }: { row: any }) => (
                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <span onClick={() => {
                        setTransActionArray(row?.transactions)
                        setTransactionOpen(true)
                        formik.resetForm()
                    }} style={{ cursor: "pointer", marginRight: "5px" }}>
                        <RemoveRedEye />
                    </span>
                    <span onClick={() => {
                        setdeleteOpen(true)
                        setDeleteObj(row)
                    }} style={{ cursor: "pointer", marginRight: "5px" }}>
                        <Delete />
                    </span>
                    {
                        row?.status != "Closed" &&
                        <span onClick={() => {
                            formik.setFieldValue('remainingAmount', row?.totalAmount - row?.priceSum)
                            formik.setFieldValue('id', row?.id)
                            formik.setFieldValue('parentId', row?.parentId)
                            setOpen(true)
                        }} style={{ cursor: "pointer" }}>
                            <Edit />
                        </span>
                    }
                </div>
            )
        },
    ]
    const init = () => {
        const existingData = localStorage.getItem('khata-book');
        if (existingData) {
            let parsedData = JSON.parse(existingData)?.map((obj: any) => {
                return { ...obj, label: obj?.userName }
            })
            parsedData = parsedData.filter((obj: any) => obj.items.length > 0);
            if (parsedData?.length === 0) {
                localStorage.removeItem("khata-book")
            }
            setList(parsedData)
        }
    }
    useEffect(() => {
        init()
    }, [callAgain])
    const sum = khataHistoryList.reduce((acc: number, value: any): number => {
        const amount = value?.totalAmount - value?.priceSum;
        return acc + amount;
    }, 0);
    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="KHATA HISTORY" subtitle="KHATA HISTORY OF ALL USERS" />
            </FlexBetween>
            <Grid container spacing={2} marginY={'1.5rem'}>
                <Grid item sm={6}>
                    <Autocomplete
                        disablePortal
                        fullWidth
                        size="small"
                        disableClearable
                        options={list}
                        value={khataUser}
                        onChange={(_e: any, v: any) => {
                            const itemsWithStatus = v.items.map((item: any) => getStatus(item, v?.id));
                            setkhataHistoryList(itemsWithStatus)
                            setkhataUser(v);
                        }}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Khata History"
                            />
                        }
                    />
                </Grid>
            </Grid>
            <Box
                mt="20px"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="160px"
                gap="20px"
                sx={{
                    "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
                }}
            >
                <Box
                    gridColumn="span 12"
                    gridRow="span 3"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                            borderRadius: "5rem",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: theme.palette.background.alt,
                            color: theme.palette.secondary[100],
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: theme.palette.background.alt,
                        },
                        "& .MuiDataGrid-footerContainer": {
                            backgroundColor: theme.palette.background.alt,
                            color: theme.palette.secondary[100],
                            borderTop: "none",
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `${theme.palette.secondary[200]} !important`,
                        },
                    }}
                >
                    <DataGrid
                        loading={false}
                        rows={khataHistoryList}
                        columns={columns}
                        slots={{
                            toolbar: Toolbar,
                        }}
                    />
                    <Typography sx={{ textAlign: "end", backgroundColor: theme.palette.background.alt, gap: "5px", fontSize: "16px", }}>
                        Total Amount{" "}{" "}{" "}{" "}{" "}{" "}{" "} {sum}
                    </Typography>
                </Box>
            </Box>
            <CustomModal open={open} size="md">
                <Grid container spacing={2}>
                    <Grid item sm={12} sx={{
                        display: 'flex', justifyContent: 'end'
                    }}>
                        <span onClick={() => { setOpen(false) }} style={{ cursor: "pointer" }}><Close /></span>
                    </Grid>
                    <Grid container spacing={2} marginY={'.2rem'}>
                        <Grid item sm={6}>
                            <TextField
                                variant="outlined"
                                size="small"
                                label="Remaining Payment"
                                value={formik.values.remainingAmount}
                                fullWidth
                                disabled
                                InputProps={{
                                    style: { width: '100%' }
                                }} />
                        </Grid>
                        <Grid item sm={6}>
                            <TextField
                                variant="outlined"
                                size="small"
                                name="payment"
                                value={formik.values.payment}
                                onChange={formik.handleChange}
                                error={formik.touched.payment && Boolean(formik.errors.payment)}
                                helperText={formik.touched.payment && formik.errors.payment}
                                label="Add Payment"
                                fullWidth
                                InputProps={{
                                    style: { width: '100%' }
                                }} />
                        </Grid>
                        <Grid item sm={12} sx={{ display: "flex", alignItems: 'center', justifyContent: 'end' }}>
                            <Button
                                sx={{
                                    backgroundColor: theme.palette.secondary.light,
                                    color: theme.palette.background.alt,
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    padding: "10px 20px",
                                }}
                                size="small"
                                onClick={formik.submitForm}
                            >
                                <Save sx={{ mr: "5px" }} />
                                SAVE
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </CustomModal>
            <CustomModal open={transactionOpen} size="md">
                <Grid container spacing={2}>
                    <Grid item sm={12} sx={{
                        display: 'flex', justifyContent: 'end'
                    }}>
                        <span onClick={() => { setTransactionOpen(false) }} style={{ cursor: "pointer" }}><Close /></span>
                    </Grid>
                    {
                        transActionArray?.map((obj: any, index: number) => {
                            const date = new Date(obj?.date)
                            return <Grid container spacing={2} marginY={'.2rem'} key={index}>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        label="Payment"
                                        value={obj?.amount}
                                        fullWidth
                                        disabled
                                        InputProps={{
                                            style: { width: '100%' }
                                        }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        label="Payment"
                                        value={date.toLocaleDateString()}
                                        fullWidth
                                        disabled
                                        InputProps={{
                                            style: { width: '100%' }
                                        }} />
                                </Grid>
                            </Grid>
                        })
                    }
                </Grid>
            </CustomModal>
            <CustomModal open={deleteOpen} size="sm">
                <Typography variant="h5" color={theme.palette.secondary[300]} textAlign={'center'}>
                    Are you sure you want to delete?
                </Typography>
                <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: '.5rem' }}>
                    <Button
                        sx={{
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.background.alt,
                            fontSize: "12px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                        onClick={() => {
                            deleteSellItem()
                        }}
                        size="small"
                    >
                        Yes
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.background.alt,
                            fontSize: "12px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                        onClick={() => {
                            setdeleteOpen(false)
                            // formik.submitForm()
                        }}
                        size="small"
                    >
                        No
                    </Button>
                </Box>
            </CustomModal>
        </Box>
    );
};
export default KhataHistory;