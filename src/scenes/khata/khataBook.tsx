import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import {
    Box,
    TextField,
    Grid,
    Autocomplete,
    Button,
    useTheme,
} from "@mui/material";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { groupTransactions } from "../../GroupBy";
import { Add } from "@mui/icons-material";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { KhataAccount } from "../../type";
interface itemList {
    label: string;
    time: string | number;
    history: any;
}
const KhataBook = () => {
    const theme: any = useTheme();
    const [stocks, setStocks] = useState<itemList[]>([])
    const [khataUser, setKhataUser] = useState<any>([])
    const [callAgain, setCallAgain] = useState<boolean>(false)
    const [quantity, setQuantity] = useState([])
    const validationSchema = Yup.object({
        khataUser: Yup.object().required('Khata User is required'),
        name: Yup.object().required('Item Name is required'),
        quantity: Yup.object().required('Item Quantity is required'),
        sellingQuantity: Yup.number()
            .min(1, 'Selling Quantity should be at least 1')
            .max(Yup.ref('quantityCount'), 'Selling Quantity cannot be greater than Quantity')
            .required('Selling Quantity is required'),
        quantityCount: Yup.number().min(1, 'Quantity Count should be at least 1').required('Quantity Count is required'),
        sellingPrice: Yup.number().min(1, "Selling Price required").required('Selling Price required'),
    });
    interface MyFormValues {
        name: any;
        quantity: any;
        sellingQuantity: number
        sellingPrice: number,
        userName: string,
        phoneNumber: number,
        khataUser: any, payment: number, quantityCount: number
    }
    const formik = useFormik<MyFormValues>({
        initialValues: {
            name: "",
            quantity: "",
            sellingQuantity: 0,
            sellingPrice: 0,
            userName: "",
            phoneNumber: 0, khataUser: "", payment: 0, quantityCount: 0
        },
        validationSchema: validationSchema,
        onSubmit: async (_values: MyFormValues) => {

            // Destructuring values from _values object
            const { phoneNumber, address, value } = _values?.khataUser!;
            const { label, vendorName } = _values?.name!;
            // Item Object Of Purchasing
            const itemObj: any = {
                name: label,
                id: new Date().getTime(),
                price: _values?.sellingPrice,
                quantity: _values?.sellingQuantity,
                transactions: [{
                    id: new Date().getTime(),
                    date: new Date(),
                    amount: _values?.payment
                }],
                khataObjId: value,
                vendorName, time: _values?.quantity?.time

            };
            // Khata Account Object
            const khataObj: any = {
                id: value,
                userName: _values?.khataUser?.label,
                phoneNumber,
                address,
                items: [itemObj],
                time: _values?.quantity?.time
            };
            // Retrieve existing khata book data from local storage
            const existingKhataBook: string | null = localStorage.getItem('khata-book');
            if (existingKhataBook) {
                // Parse existing khata book data
                let khataBook: any[] = JSON.parse(existingKhataBook);
                // Find index of the khata in the khata book
                const findKhataIndex: number = khataBook.findIndex(({ id }: any) => id === value);
                if (findKhataIndex !== -1) {
                    // If khata exists, push item to its items array
                    khataBook[findKhataIndex].items.push(itemObj);
                } else {
                    // If khata does not exist, add the whole khata object
                    khataBook.push(khataObj);
                }
                // Store updated khata book data back into local storage
                localStorage.setItem("khata-book", JSON.stringify(khataBook));
            } else {
                // If no existing khata book data, create a new one
                localStorage.setItem('khata-book', JSON.stringify([khataObj]));
            }
            // Retrieve existing stock data from local storage
            const existingStock: string | null = localStorage.getItem('stock');
            if (existingStock) {
                // Parse existing stock data
                const parsedData: any[] = JSON.parse(existingStock);
                // Update stock for the purchased item
                const updatedStock: any[] = parsedData.map((item: any) => {
                    if (item.time === _values?.quantity?.time) {
                        item.quantity -= _values.sellingQuantity;
                    }
                    return item;
                }).filter((item: any) => item.quantity > 0);
                localStorage.setItem('stock', JSON.stringify(updatedStock));
            }
            // Reset form
            formik.resetForm();
            // Display success message
            toast.success("Added Successfully");
            // Toggle callAgain state to trigger re-render
            setCallAgain(!callAgain);
            // Clear quantity array
            setQuantity([]);
        }
    });
    const init = () => {
        const existingData = localStorage.getItem('stock');
        const existingKhataUsers = localStorage.getItem('khata-users');
        if (existingData) {
            const parsedData = JSON.parse(existingData)
            const result = groupTransactions(parsedData);
            const itemList = result?.map(({ name, history, transaction, vendorName }) => {
                return { label: name, time: Number(new Date().getTime()), history, transaction, vendorName }
            })
            setStocks(itemList)
        }
        if (existingKhataUsers) {
            let parseData = JSON.parse(existingKhataUsers)?.map((obj: KhataAccount) => {
                return { label: obj?.userName, value: obj?.id, phoneNumber: obj?.phoneNumber, address: obj?.address }
            })
            setKhataUser(parseData)
        }
    }
    useEffect(() => {
        init()
    }, [callAgain])
    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title={"KHATA BOOKS"} subtitle={"Book For Managing All your customer khata's"} />
            </FlexBetween>
            <Grid container spacing={2} marginY={'1.5rem'}>
                <Grid item sm={6}>
                    <Autocomplete
                        disablePortal
                        fullWidth
                        size="small"
                        disableClearable
                        options={khataUser}
                        value={formik.values.khataUser}
                        onChange={(_e: any, v: any) => {
                            formik.setFieldValue('khataUser', v)
                        }}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Select Khata User"
                                error={formik.touched.khataUser && Boolean(formik.errors.khataUser)}
                            />
                        }
                    />
                </Grid>
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
                                return { ...obj, label: obj?.quantity }
                            })
                            setQuantity(quantityList)
                            formik.setFieldValue("name", v)
                        }}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Item Name"
                                error={formik.touched.name && Boolean(formik.errors.name)}
                            // helperText={formik.touched.name && formik.errors.name}
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
                        renderInput={(params) => <TextField {...params} label="Quantity"
                            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                        />}
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
                        label="Enter Payment"
                        value={formik.values.payment}
                        placeholder={`Enter Payment`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.payment && Boolean(formik.errors.payment)}
                        helperText={formik.touched.payment && formik.errors.payment}
                        name="payment"
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
        </Box>
    );
};
export default KhataBook;