import { Autocomplete, Box, Button, Grid, TextField, Typography, useTheme } from "@mui/material";
import { Detector } from "react-detect-offline";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import { Download, Save } from "@mui/icons-material";
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomModal from "../../components/CustomModal";
import * as Yup from 'yup';
import { useFormik } from "formik";
import BillBackup from "../history/BillBackup";
const InternetConnectionChecker = () => {
    const [list, setList] = useState<object[]>([])
    const [loader, setLoader] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false);

    const init = () => {
        const existingData = localStorage.getItem('billing');
        if (existingData) {
            const parsedData = JSON.parse(existingData)
            setList(parsedData)
        }
    }
    useEffect(() => {
        init()
    }, [])
    const saveBackup = async () => {
        setLoader(true)
        const currentDate = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const currentMonth = currentDate.getMonth();
        const currentMonthName = monthNames[currentMonth];
        const currentYear = currentDate.getFullYear();
        const addMonthWithYearName = list?.map((obj: any) => {
            return { ...obj, month: currentMonthName, year: currentYear }
        })
        for (let index = 0; index < addMonthWithYearName.length; index++) {
            const element = addMonthWithYearName[index];
            const collectionRef = collection(db, "billing-detail");
            await addDoc(collectionRef, element);
        }
        localStorage.removeItem('billing');
        setList([]);
        toast.success('Bill Has Been Saved Successfully');
        setOpen(false)
        setLoader(false)
    }
    const validationSchema = Yup.object({
        year: Yup.object().required('Year is required'),
        month: Yup.object().required('Month is required'),
    });
    interface MyFormValues {
        year: object | string | undefined;
        month: object | string | undefined;
    }
    const formik = useFormik<MyFormValues>({
        initialValues: {
            year: "",
            month: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (_values: any) => {
            const { month, year } = _values
            const monthName = month?.label
            const yearName = year?.value
            const q = query(
                collection(db, "billing-detail"),
                where("month", "==", monthName),
                where("year", "==", yearName)
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const data: any[] = [];
                querySnapshot.forEach((doc) => {
                    data.push(doc?.data());
                });
                localStorage.setItem('billing-backup', JSON.stringify(data))
            });
            formik.resetForm();
            toast.success('Billing Get Successfully');
            return unsubscribe
        }
    });
    const months = [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 }
    ];
    const yearsArray = [
        { label: '2024', value: 2024 },
        { label: '2025', value: 2025 },
        { label: '2026', value: 2026 },
        { label: '2027', value: 2027 },
        { label: '2028', value: 2028 },
        { label: '2029', value: 2029 },
        { label: '2030', value: 2030 }
    ];
    const theme: any = useTheme();
    return <Detector
        render={({ online }) => (
            <div>
                {online ? (
                    <Box m="1.5rem 2.5rem">
                        <FlexBetween>
                            <Header title="BILLS BACKUP" subtitle="Save Bills For Future Use" />
                            {
                                list?.length > 0 &&
                                <Button
                                    sx={{
                                        backgroundColor: theme.palette.secondary.light,
                                        color: theme.palette.background.alt,
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        padding: "10px 20px",
                                    }}

                                    onClick={() => {
                                        setOpen(true)
                                    }}
                                    size="small"
                                >
                                    <Save sx={{ mr: "10px" }} />
                                    SAVE
                                </Button>
                            }
                        </FlexBetween>
                        <Grid container spacing={2} marginY={'1.5rem'}>
                            <Grid item sm={6}>
                                <Autocomplete
                                    disablePortal
                                    fullWidth
                                    size="small"
                                    disableClearable
                                    options={yearsArray}
                                    value={formik.values.year}
                                    onBlur={formik.handleBlur}
                                    onChange={(_, v) => {
                                        formik.setFieldValue('year', v)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Year"
                                            error={formik.touched.year && Boolean(formik.errors.year)}
                                            helperText={formik.touched.year && formik.errors.year}
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
                                    options={months}
                                    value={formik.values.month}
                                    onBlur={formik.handleBlur}
                                    onChange={(_, v) => {
                                        formik.setFieldValue('month', v)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Month"
                                            error={formik.touched.month && Boolean(formik.errors.month)}
                                            helperText={formik.touched.month && formik.errors.month}
                                        />
                                    }
                                />
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
                                    <Download sx={{ mr: "10px" }} />
                                    GET
                                </Button>
                            </Box>
                        </FlexBetween>
                        <CustomModal open={open} size="sm">
                            <Typography variant="h5" color={theme.palette.secondary[300]} textAlign={'center'}>
                                Are you sure you want to save bill information?
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
                                    disabled={loader}
                                    onClick={() => {
                                        saveBackup()
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
                                        setOpen(false)
                                    }}
                                    size="small"
                                >
                                    No
                                </Button>
                            </Box>
                        </CustomModal>
                        <BillBackup />
                    </Box>
                ) : (
                    <Box m="1.5rem 2.5rem">
                        <FlexBetween>
                            <Header title="OFFLINE" subtitle="Currently You Are Offline" />
                        </FlexBetween>
                        <BillBackup />
                    </Box>
                )}
            </div>
        )}
    />
}
export default InternetConnectionChecker;
