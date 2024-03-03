import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import {
    Add,
} from "@mui/icons-material";
import {
    Box,
    Button,
    useTheme,
    TextField,
    Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import toast from "react-hot-toast";
const Purchase = () => {
    const theme: any = useTheme();
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        quantity: Yup.number().required('Quantity is required').positive('Quantity must be positive').integer('Quantity must be an integer'),
        totalAmount: Yup.number().required('Price is required').min(1, "Price is required"),
        shippingCharges: Yup.number().required('Price is required').min(1, "Price is required"),
    });
    interface MyFormValues {
        name: string;
        quantity: number;
        price: number;
        totalAmount: number;
        shippingCharges: number;
        vendorName: string;
    }
    const formik = useFormik<MyFormValues>({
        initialValues: {
            name: '',
            quantity: 0,
            price: 0,
            totalAmount: 0,
            vendorName: "",
            shippingCharges: 0
        },
        validationSchema: validationSchema,
        onSubmit: async (_values: MyFormValues) => {
            const existingData = localStorage.getItem('stock');
            const currentDate: Date = new Date();
            const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
            const formattedDate: string = currentDate.toLocaleDateString('en-US', options);
            const price = _values?.shippingCharges + _values?.totalAmount * _values?.quantity / 100
            const object = {
                ..._values,
                price: price,
                time: currentDate.getTime(),
                transaction: [
                    {
                        time: currentDate.getTime(),
                        date: formattedDate,
                    }
                ],
                status: false,
                purchaseTime: new Date().getTime(),
                recievedTime: new Date().getTime()
            };
            if (existingData) {
                const parsedData = JSON.parse(existingData);
                const updatedData = [...parsedData, object];
                localStorage.setItem("stock", JSON.stringify(updatedData));
            } else {
                const newData = [object];
                localStorage.setItem("stock", JSON.stringify(newData));
            }
            formik.resetForm();
            toast.success('Stock Add Successfully');
        }
    });
    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="PURCHASE" subtitle="WELCOME TO YOUR STOCK" />
            </FlexBetween>
            <Grid container spacing={2} marginY={'1.5rem'}>
                <Grid item sm={6}>
                    <TextField
                        variant="outlined"
                        type={"text"}
                        label="Enter Item Name"
                        value={formik.values.name}
                        placeholder={`Enter Item Name`}
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
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
                        label="Enter Item Quantity"
                        placeholder={`Enter Item Quantity`}
                        size="small"
                        fullWidth
                        name="quantity"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.quantity}
                        error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                        helperText={formik.touched.quantity && formik.errors.quantity}
                        InputProps={{
                            style: { width: '100%' }
                        }} />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        variant="outlined"
                        type={"number"}
                        label="Total Amount"
                        placeholder={`Total Amount`}
                        size="small"
                        fullWidth
                        name="totalAmount"
                        value={formik.values.totalAmount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.totalAmount && Boolean(formik.errors.totalAmount)}
                        helperText={formik.touched.totalAmount && formik.errors.totalAmount}
                        InputProps={{
                            style: { width: '100%' }
                        }} />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        variant="outlined"
                        type={"number"}
                        label="Shipping Charges"
                        size="small"
                        fullWidth
                        name="shippingCharges"
                        value={formik.values.shippingCharges}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.shippingCharges && Boolean(formik.errors.shippingCharges)}
                        helperText={formik.touched.shippingCharges && formik.errors.shippingCharges}
                        InputProps={{
                            style: { width: '100%' }
                        }} />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        variant="outlined"
                        type={"text"}
                        label="Vendor Name"
                        size="small"
                        fullWidth
                        name="vendorName"
                        value={formik.values.vendorName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.vendorName && Boolean(formik.errors.vendorName)}
                        helperText={formik.touched.vendorName && formik.errors.vendorName}
                        InputProps={{
                            style: { width: '100%' }
                        }} />
                </Grid>
            </Grid>
            <FlexBetween>
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
                        onClick={() => {
                            formik.submitForm()
                        }}
                        size="small"
                    >
                        <Add sx={{ mr: "10px" }} />
                        ADD
                    </Button>
                </Box>
            </FlexBetween>
        </Box>
    );
};
export default Purchase;