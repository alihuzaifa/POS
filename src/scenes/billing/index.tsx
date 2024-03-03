import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import {
    Box,
    TextField,
    Grid,
    Autocomplete,
    Button,
    useTheme,
    Typography,
} from "@mui/material";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { groupTransactions } from "../../GroupBy";
import { Add, Delete, LocationOn, Save, WhatsApp } from "@mui/icons-material";
import { useFormik } from "formik";
import Logo from '../../assets/logo.png'
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import SoftwareDetail from "../../SoftwareDetail"
interface itemList {
    label: string;
    time: string;
    history: any;
}
const SubHeadingText = ({ text }: { text: string }) => {
    return <Typography
        color={'black'}
        textAlign={'center'}
        className="text"
    >
        {text}
    </Typography>
}
const Billing = ({ fb = false }) => {
    const theme: any = useTheme();
    const [stocks, setStocks] = useState<itemList[]>([])
    const [sellingItemList, setSellingItemList] = useState<any>([])
    const [callAgain, setCallAgain] = useState<boolean>(false)
    const [invoiceNo, setinvoiceNo] = useState<number>(0)
    const [quantity, setQuantity] = useState([])
    const validationSchema = Yup.object({
        name: Yup.object().required('Item Name is required'),
        quantity: Yup.object().required('Item Quantity is required'),
        sellingQuantity: Yup.number()
            .min(1, 'Selling Quantity should be at least 1')
            .max(Yup.ref('quantityCount'), 'Selling Quantity cannot be greater than Quantity')
            .required('Selling Quantity is required'),
        sellingPrice: Yup.number().min(1, "Selling Quantity required").required('Selling Quantity required'),
        phoneNumber: Yup.string()
    });
    interface MyFormValues {
        name: object | string | undefined;
        quantity: object | string | undefined;
        sellingQuantity: number
        sellingPrice: number,
        userName: string,
        isDisabledName: boolean,
        phoneNumber: number, quantityCount: number
    }
    function updateQuantityAndSaveInStockArrayAgain(data: any): any {
        const stocksObj = stocks?.find(({ time }: any) => time === data?.quantity?.parentId)
        const newHistoryObj = stocksObj?.history.map((obj: any) => obj.time === data?.quantity?.time ? { ...obj, quantity: obj?.quantity - data?.sellingQuantity } : obj);
        const newStockArray = stocks.map((obj: any) => obj.time === data?.quantity?.parentId ? { ...obj, history: newHistoryObj } : obj);
        setStocks(newStockArray)
        return { ...data, historyId: data?.quantity?.time };
    }
    const formik = useFormik<MyFormValues>({
        initialValues: {
            name: "",
            quantity: "",
            sellingQuantity: 0,
            sellingPrice: 0,
            userName: "",
            isDisabledName: false, phoneNumber: 0, quantityCount: 0
        },
        validationSchema: validationSchema,
        onSubmit: async (_values: MyFormValues) => {
            const object = {
                ..._values, totalPrice: ((_values?.sellingQuantity || 0) as number) * ((_values?.sellingPrice || 0) as number),
                sellingTime: new Date().getTime()
            }
            const updatedData = updateQuantityAndSaveInStockArrayAgain(object);
            setSellingItemList((pre: any) => {
                const previousObj = [...pre, { ...updatedData, id: new Date().getTime() }]
                return previousObj
            })
            setQuantity([])
            formik.resetForm();
            formik.setFieldValue('userName', _values?.userName)
            formik.setFieldValue('phoneNumber', _values?.phoneNumber)
            toast.success('Stock Add Successfully');
        }
    });
    const init = () => {
        const existingData = localStorage.getItem('stock');
        const existingBilling = localStorage.getItem('billing');
        if (existingData) {
            const parsedData = JSON.parse(existingData)?.filter(({ status }: { status: boolean }) => status === true)
            const result = groupTransactions(parsedData);
            const itemList = result?.map(({ name, time, history, transaction, vendorName }) => {
                return { label: name, time, history, transaction, vendorName }
            })
            setStocks(itemList)
        }
        if (existingBilling) {
            const parseData = JSON.parse(existingBilling)
            const lastInvoiceNo = parseData[parseData?.length - 1]?.invoiceNo;
            setinvoiceNo(lastInvoiceNo + 1 || 0)
        }
    }
    useEffect(() => {
        init()
    }, [callAgain])
    const deleteSellItem = (obj: any) => {
        const stocksObj = stocks?.find(({ time }: any) => time === obj?.quantity?.parentId)
        const newHistoryObj = stocksObj?.history.map((data: any) => data.time === obj?.historyId ? { ...data, quantity: (data?.quantity || 0) + (obj?.sellingQuantity || 0) } : data);
        const newStockArray = stocks.map((data: any) => data.time === (obj?.quantity?.parentId || null) ? { ...data, history: newHistoryObj } : data);
        setStocks(newStockArray)
        const filterItem = sellingItemList?.filter(({ id }: any) => id !== obj?.id)
        setSellingItemList(filterItem)
    }
    const columns = [
        {
            field: "userName",
            headerName: "User",
            flex: 1
        },
        {
            field: "name",
            headerName: "Item",
            flex: 1,
            renderCell: (({ row }: any) => {
                return row?.name?.label
            })
        },
        {
            field: "sellingQuantity",
            headerName: "Quantity",
            flex: 1
        },
        {
            field: "sellingPrice",
            headerName: "Price",
            flex: 1
        },
        {
            field: "totalPrice",
            headerName: "Total Amount",
            flex: 1
        },
        {
            field: "history",
            headerName: "History",
            flex: 1,
            renderCell: ({ row }: { row: any }) => <span onClick={() => {
                deleteSellItem(row)
            }} style={{ cursor: "pointer" }}><Delete /></span>
        },
    ]
    const saveRecord = () => {
        const existingData = localStorage.getItem('stock');
        const billingInfoExistingData = localStorage.getItem('billing');
        if (existingData) {
            const parsedData = JSON.parse(existingData)
            let biilingInfoArray = []
            if (billingInfoExistingData) {
                biilingInfoArray = JSON.parse(billingInfoExistingData)
            }
            const saveBillingArray = sellingItemList?.map((obj: any) => {
                const { name, phoneNumber, sellingPrice, sellingQuantity, totalPrice, userName, sellingTime, historyId } = obj
                return { name, phoneNumber, sellingPrice, sellingQuantity, totalPrice, userName, sellingTime, historyId, uniqueId: 0, invoiceNo }
            })
            const uniqueId = new Date().getTime();
            saveBillingArray.forEach((obj: any) => {
                obj.uniqueId = uniqueId;
                obj.invoiceNo = invoiceNo
            });
            parsedData.forEach((firstItem: any) => {
                const secondItem = saveBillingArray.find((secondItem: any) => secondItem.historyId === firstItem.time);
                if (secondItem) {
                    firstItem.quantity -= secondItem.sellingQuantity;
                }
            });
            const updatedArray = parsedData?.filter((item: any) => item.quantity > 0);
            localStorage.setItem('stock', JSON.stringify(updatedArray))
            localStorage.setItem('billing', JSON.stringify([...biilingInfoArray, ...saveBillingArray]))
            setCallAgain(!callAgain)
            setSellingItemList([])
            formik.resetForm()
        }
    }
    useEffect(() => {
        if (sellingItemList?.length === 0) {
            formik.resetForm()
        }
    }, [sellingItemList])
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    let formattedDate = `${day} ${month} ${year}`;
    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title={fb ? "F BILLS" : "SALE"} subtitle={fb ? "WELCOME TO BILL BOARD" : "WELCOME TO AVAILABLE STOCK"} />
            </FlexBetween>
            <Grid container spacing={2} marginY={'1.5rem'}>
                <Grid item sm={6}>
                    <Autocomplete
                        disablePortal
                        fullWidth
                        size="small"
                        disableClearable
                        options={stocks}
                        value={formik.values.name}
                        onBlur={formik.handleBlur}
                        onChange={(_e: any, v: any) => {
                            const quantityList = v?.history?.map((obj: any) => {
                                return { ...obj, label: obj?.quantity, parentId: v?.time }
                            })
                            setQuantity(quantityList)
                            formik.setFieldValue("name", v)
                        }}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Item Name"
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        }
                    />
                </Grid>
                <Grid item sm={6}>
                    <Autocomplete
                        disableClearable
                        fullWidth
                        size="small"
                        options={quantity}
                        value={formik.values.quantity}
                        onBlur={formik.handleBlur}
                        onChange={(_e: any, v: any) => {
                            formik.setFieldValue('quantity', v)
                            formik.setFieldValue('quantityCount', v?.quantity)
                        }}
                        renderInput={(params) => <TextField {...params} label="Quantity" error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                            helperText={formik.touched.quantity && formik.errors.quantity} />}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        variant="outlined"
                        type={"number"}
                        label="Enter selling Quantity"
                        value={formik.values.sellingQuantity}
                        placeholder={`Enter selling Quantity`}
                        name="sellingQuantity"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.sellingQuantity && Boolean(formik.errors.sellingQuantity)}
                        helperText={formik.touched.sellingQuantity && formik.errors.sellingQuantity}
                        size="small"
                        fullWidth
                        InputProps={{
                            style: { width: '100%' }
                        }} />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        variant="outlined"
                        type={"number"}
                        label="Enter selling Price"
                        value={formik.values.sellingPrice}
                        placeholder={`Enter selling Price`}
                        name="sellingPrice"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                        helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
                        size="small"
                        fullWidth
                        InputProps={{
                            style: { width: '100%' }
                        }} />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        variant="outlined"
                        type={"text"}
                        label="Enter User Name"
                        value={formik.values.userName}
                        placeholder={`Enter User Name`}
                        onChange={formik.handleChange}
                        disabled={formik.values.isDisabledName}
                        onBlur={formik.handleBlur}
                        name="userName"
                        size="small"
                        fullWidth
                        InputProps={{
                            style: { width: '100%' }
                        }} />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        variant="outlined"
                        type={"number"}
                        label="Enter User Number"
                        value={formik.values.phoneNumber}
                        placeholder={`Enter User Number`}
                        onChange={formik.handleChange}
                        disabled={formik.values.isDisabledName}
                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                        onBlur={formik.handleBlur}
                        name="phoneNumber"
                        size="small"
                        fullWidth
                        InputProps={{
                            style: { width: '100%' }
                        }} />
                </Grid>
            </Grid>
            <FlexBetween marginY={'1.5rem'}>
                <Box></Box>
                <Box>
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
                        <Add sx={{ mr: "10px" }} />
                        ADD
                    </Button>
                </Box>
            </FlexBetween>
            {
                sellingItemList?.length > 0 &&
                <>
                    <DataGrid
                        loading={false}
                        rows={sellingItemList}
                        columns={columns}
                    />
                    <FlexBetween marginY={'1.5rem'}>
                        <Box></Box>
                        <Box>
                            {!fb &&
                                <Button
                                    sx={{
                                        backgroundColor: theme.palette.secondary.light,
                                        color: theme.palette.background.alt,
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        padding: "10px 20px",
                                    }}
                                    size="small"
                                    onClick={saveRecord}
                                >
                                    <Save sx={{ mr: "10px" }} />
                                    SAVE
                                </Button>
                            }
                        </Box>
                    </FlexBetween>
                </>
            }
            <Box sx={{
                width: '80%',
                backgroundColor: '#fff',
                marginY: '1.5rem',
                borderRadius: '1rem',
                marginX: 'auto',
                padding: '1rem',
            }}>
                <Typography marginBottom={'-10px'} textAlign={'center'} className="text" fontSize={'18px'} fontWeight={'bold'} color={'black'}>Invoice</Typography>
                <FlexBetween marginBottom={'1rem'}>
                    <Box component={"img"} src={Logo} sx={{ width: '150px', height: '100px', borderRadius: '6%' }} />
                    <Box width={"50%"}>
                        <Typography
                            variant="h3"
                            color={'black'}
                            fontWeight="bold"
                            sx={{
                                textAlign: "center",
                                marginTop: "1rem",
                            }}
                            className="personal-font"
                        >
                            {SoftwareDetail.shopName}
                        </Typography>
                        <Typography
                            color={"black"}
                            fontWeight="bold"
                            sx={{
                                textAlign: "center",
                                width: "70%",
                                margin: "0px auto",
                                fontSize: '12px'
                            }}
                            className="text"
                        >
                            {SoftwareDetail?.shopDescription || ""}
                        </Typography>
                    </Box>
                    <FlexBetween>
                        <Box>
                            <Typography
                                color={'black'}
                                textAlign={'center'}
                                className="text"

                            >
                                Azeem Badshah
                            </Typography>
                            <Typography
                                color={'black'}
                                textAlign={'center'}
                                className="text"
                                fontSize={'12px'}

                            >
                                {SoftwareDetail?.number1}
                            </Typography>
                            <Typography
                                color={'black'}
                                textAlign={'center'}
                                className="text"
                                fontSize={'12px'}

                            >
                                {SoftwareDetail?.number2}
                            </Typography>
                        </Box>
                        <Box sx={{
                            marginX: "5px"
                        }}>
                            <Typography
                                color={'black'}
                                textAlign={'center'}
                                className="text"
                                marginTop={'-3.2px'}

                            >
                                <WhatsApp sx={{ color: 'green', fontSize: '16px', }} />   <span style={{ marginLeft: '-3px', }}>
                                    Mr Hamza
                                </span>
                            </Typography>
                            <Typography
                                color={'black'}
                                textAlign={'center'}
                                className="text"
                                fontSize={'12px'}

                            >
                                {SoftwareDetail?.number3}
                            </Typography>
                            <Typography
                                color={'black'}
                                textAlign={'center'}
                                className="text"
                                fontSize={'12px'}

                            >
                                {SoftwareDetail?.number4}
                            </Typography>
                        </Box>
                    </FlexBetween>
                </FlexBetween>
                <FlexBetween >
                    <Box >
                        <Typography
                            marginY={'.2rem'}
                            color={'black'}
                            className="text"
                        >
                            Name: {" "} <span style={{ textDecorationLine: "underline" }}>
                                {formik.values.userName}
                            </span>
                        </Typography>
                        <Typography
                            marginY={'.2rem'}
                            color={'black'}
                            className="text"

                        >
                            Phone Number:{" "} <span style={{ textDecorationLine: "underline" }}>
                                {formik?.values?.phoneNumber === 0 ? "" : "0" + formik?.values?.phoneNumber}
                            </span>

                        </Typography>
                    </Box>
                    <Box paddingRight={'7rem'}>

                        <Typography
                            color={'black'}
                            className="text"

                            marginY={'.2rem'}
                        >
                            Invoice No: {invoiceNo}
                        </Typography>
                        <Typography
                            color={'black'}
                            className="text"

                            marginY={'.2rem'}
                        >
                            Date: {formattedDate}
                        </Typography>
                    </Box>
                </FlexBetween>
                <FlexBetween border={'1px solid black'} borderBottom={'none'}>
                    <Typography
                        border={'1px solid black'}
                        width={'50%'}
                        textAlign={'center'}
                        sx={{
                            backgroundColor: "#000",
                            color: "#fff"
                        }}

                        className="text"

                    >
                        ITEM DETAIL
                    </Typography>
                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'15%'}
                        textAlign={'center'}
                        sx={{
                            backgroundColor: "#000",
                            color: "#fff"
                        }}
                        className="text"

                    >
                        QUANTITY
                    </Typography>
                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'15%'}
                        textAlign={'center'}
                        sx={{
                            backgroundColor: "#000",
                            color: "#fff"
                        }}
                        className="text"

                    >
                        PRICE
                    </Typography>
                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'20%'}
                        textAlign={'center'}
                        sx={{
                            backgroundColor: "#000",
                            color: "#fff"
                        }}
                        className="text"

                    >
                        TOTAL
                    </Typography>
                </FlexBetween>
                <FlexBetween border={'1px solid black'}>
                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'50%'}
                        height={'auto'}
                        minHeight={'220px'}
                        paddingX={'5px'}

                    >
                        {sellingItemList?.map((obj: any, key: number) => {
                            return <div key={key}>
                                {obj?.name?.label}
                            </div>
                        })}
                    </Typography>

                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'15%'}
                        textAlign={'center'}
                        height={'auto'}
                        minHeight={'220px'}

                    >
                        {sellingItemList?.map((obj: any, key: number) => {
                            return <div key={key}>
                                {obj?.sellingQuantity}
                            </div>
                        })}
                    </Typography>
                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'15%'}
                        textAlign={'center'}
                        height={'auto'}
                        minHeight={'220px'}

                    >
                        {sellingItemList?.map((obj: any, key: number) => {
                            return <div key={key}>
                                {obj?.sellingPrice}
                            </div>
                        })}
                    </Typography>

                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'20%'}
                        textAlign={'center'}
                        height={'auto'}
                        minHeight={'220px'}
                    >
                        {sellingItemList?.map((obj: any, key: number) => {
                            return <div key={key}>
                                {obj?.totalPrice}
                            </div>
                        })}
                    </Typography>
                </FlexBetween>
                <FlexBetween >
                    <Typography
                        width={'50%'}
                        textAlign={'center'}
                    >
                    </Typography>
                    <Typography
                        width={'10%'}
                        textAlign={'center'}
                    >
                    </Typography>

                    <Typography
                        width={'35.2%'}
                        color={'black'}
                        border={'2px solid black'}
                        borderTop={'none'}
                        padding={'7px 2px'}
                        fontSize={'16px'}
                        className="text"

                    >
                        TOTAL:{" "} <span style={{ marginLeft: '14px' }}>{sellingItemList?.reduce((acc: number, { totalPrice }: any) => acc + totalPrice, 0) ?? 0}</span>
                    </Typography>
                </FlexBetween>
                <Typography
                    color={"black"}
                    sx={{
                        textAlign: "center",
                        fontSize: '14px',
                        marginY: '1rem'
                    }}
                    className="text"
                >
                    <LocationOn sx={{ color: 'red', fontSize: '20px', paddingTop: '5px' }} /> <span>
                        {SoftwareDetail?.shopAddress || ""}
                    </span>
                </Typography>
                <FlexBetween marginTop={'1rem'}>
                    <Box sx={{ marginTop: '-14px' }}>
                        <SubHeadingText text="Thank you for purchase!" />
                    </Box>
                    <Box paddingRight={'2rem'} textAlign={'end'}>
                        <Typography
                            color={'black'}
                            sx={{ mb: "5px" }}
                        >
                            ___________________________
                        </Typography>
                        <SubHeadingText text="Signature" />
                    </Box>
                </FlexBetween>
            </Box>
            {/*  <Box sx={{
                width: '80%',
                backgroundColor: '#fff',
                marginTop: '1.5rem',
                // borderRadius: '1rem',
                marginX: 'auto',
                padding: '1rem',
                borderRight:'2rem solid black'

            }}>
                <FlexBetween>
                    <Typography className="text" fontSize={'18px'} fontWeight={'bold'} color={'black'} sx={{
                        backgroundColor: "black", color: 'white', padding: '12px', borderRadius: '10px'
                    }}>Invoice</Typography>
                    <Typography className="text" fontSize={'18px'} fontWeight={'bold'} color={'black'}>INVOICE 0</Typography>
                </FlexBetween>
                <FlexBetween>
                    <Typography
                        variant="h3"
                        color={'black'}
                        fontWeight="bold"
                        sx={{
                            textAlign: "center",
                            marginTop: "1rem",
                        }}
                        className="personal-font"
                    >
                        {settingObj?.shopName || "AL NOOR CABLE MERCHANT"}
                    </Typography>
                </FlexBetween>
                <FlexBetween>
                    <Typography
                        color={"black"}
                        fontWeight="bold"
                        sx={{
                            fontSize: '12px'
                        }}
                        className="text"
                    >
                        {settingObj?.shopDescription || "All types of Cable"}
                    </Typography>
                </FlexBetween>
                <FlexBetween>
                    <Typography
                        color={"black"}
                        variant="h5"
                        className="personal-font"
                        fontSize={'20px'}
                    >
                        <span style={{ textDecorationLine: "underline" }}>
                            BILLING TO:
                        </span>
                    </Typography>
                </FlexBetween>
                <FlexBetween>
                    <Box>
                        <Typography
                            marginY={'.2rem'}
                            color={'black'}
                            className="text"
                        >
                            Name: {" "} <span style={{ textDecorationLine: "underline" }}>
                                {formik.values.userName}
                            </span>
                        </Typography>
                        <Typography
                            marginY={'.2rem'}
                            color={'black'}
                            className="text"

                        >
                            Phone Number:{" "} <span style={{ textDecorationLine: "underline" }}>
                                {formik?.values?.phoneNumber === 0 ? "" : "0" + formik?.values?.phoneNumber}
                            </span>
                        </Typography>
                        <Typography
                            color={'black'}
                            className="text"

                            marginY={'.2rem'}
                        >
                            Date: {formattedDate}
                        </Typography>
                    </Box>

                </FlexBetween>
                <FlexBetween border={'1px solid black'} borderBottom={'none'}>
                    <Typography
                        border={'1px solid black'}
                        width={'50%'}
                        textAlign={'center'}
                        sx={{
                            backgroundColor: "#000",
                            color: "#fff"
                        }}

                        className="text"

                    >
                        ITEM DETAIL
                    </Typography>
                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'15%'}
                        textAlign={'center'}
                        sx={{
                            backgroundColor: "#000",
                            color: "#fff"
                        }}
                        className="text"

                    >
                        QUANTITY
                    </Typography>
                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'15%'}
                        textAlign={'center'}
                        sx={{
                            backgroundColor: "#000",
                            color: "#fff"
                        }}
                        className="text"

                    >
                        PRICE
                    </Typography>
                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'20%'}
                        textAlign={'center'}
                        sx={{
                            backgroundColor: "#000",
                            color: "#fff"
                        }}
                        className="text"

                    >
                        TOTAL
                    </Typography>
                </FlexBetween>
                <FlexBetween border={'1px solid black'}>
                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'50%'}
                        height={'auto'}
                        minHeight={'220px'}
                        paddingX={'5px'}

                    >
                        {sellingItemList?.map((obj: any, key: number) => {
                            return <div key={key}>
                                {obj?.name?.label}
                            </div>
                        })}
                    </Typography>

                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'15%'}
                        textAlign={'center'}
                        height={'auto'}
                        minHeight={'220px'}

                    >
                        {sellingItemList?.map((obj: any, key: number) => {
                            return <div key={key}>
                                {obj?.sellingQuantity}
                            </div>
                        })}
                    </Typography>
                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'15%'}
                        textAlign={'center'}
                        height={'auto'}
                        minHeight={'220px'}

                    >
                        {sellingItemList?.map((obj: any, key: number) => {
                            return <div key={key}>
                                {obj?.sellingPrice}
                            </div>
                        })}
                    </Typography>

                    <Typography
                        color={'black'}
                        border={'1px solid black'}
                        width={'20%'}
                        textAlign={'center'}
                        height={'auto'}
                        minHeight={'220px'}
                    >
                        {sellingItemList?.map((obj: any, key: number) => {
                            return <div key={key}>
                                {obj?.totalPrice}
                            </div>
                        })}
                    </Typography>
                </FlexBetween>
                <FlexBetween >
                    <Typography
                        width={'50%'}
                        textAlign={'center'}
                    >
                    </Typography>
                    <Typography
                        width={'10%'}
                        textAlign={'center'}
                    >
                    </Typography>

                    <Typography
                        width={'35.2%'}
                        color={'black'}
                        border={'2px solid black'}
                        borderTop={'none'}
                        padding={'7px 2px'}
                        fontSize={'16px'}
                        className="text"

                    >
                        TOTAL:{" "} <span style={{ marginLeft: '14px' }}>{sellingItemList?.reduce((acc: number, { totalPrice }: any) => acc + totalPrice, 0) ?? 0}</span>
                    </Typography>
                </FlexBetween>
                <Typography
                    color={"black"}
                    sx={{
                        fontSize: '14px',
                        marginY: '1rem'
                    }}
                    className="text"
                >
                    <LocationOn sx={{ color: 'red', fontSize: '20px', paddingTop: '5px' }} /> <span>
                        {settingObj?.shopAddress || "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make"}
                    </span>
                </Typography>
                <FlexBetween marginTop={'1rem'}>
                    <Box sx={{ marginTop: '-14px' }}>
                        <SubHeadingText text="Thank you for purchase!" />
                    </Box>
                    <Box paddingRight={'2rem'} textAlign={'end'}>
                        <Typography
                            color={'black'}
                            sx={{ mb: "5px" }}
                        >
                            ___________________________
                        </Typography>
                        <SubHeadingText text="Signature" />
                    </Box>
                </FlexBetween>
            </Box>
            <Box sx={{
                backgroundColor: "black",
                width: '80%',
                marginX: 'auto',
                padding: '1rem'
            }}>
                <FlexBetween sx={{
                    marginX: "5px"
                }}>
                    <Typography
                        textAlign={'center'}
                        className="text"

                    >
                        {phoneNumberList[0]?.userName || ""}
                    </Typography>
                    {
                        phoneNumberList?.slice(0, 2)?.map((obj: any) => {
                            return <Typography
                                textAlign={'center'}
                                className="text"
                                fontSize={'12px'}

                            >
                                {obj?.phoneNumber}
                            </Typography>
                        })
                    }
                </FlexBetween>
                <FlexBetween sx={{
                    marginX: "5px"
                }}>
                    <Typography
                        color={'black'}
                        textAlign={'center'}
                        className="text"
                        marginTop={'-3.2px'}

                    >
                        <span style={{ color: 'white', }}>
                            {phoneNumberList[2]?.userName || "Huzaifa"}
                        </span>
                    </Typography>
                    {
                        phoneNumberList?.slice(2, 4)?.map((obj: any) => {
                            return <Typography
                                textAlign={'center'}
                                className="text"
                                fontSize={'12px'}
                                color={'white'}
                            >
                                {obj?.phoneNumber || "0311260357"}
                            </Typography>
                        })
                    }
                </FlexBetween>
            </Box> */}
        </Box>
    );
};
export default Billing;