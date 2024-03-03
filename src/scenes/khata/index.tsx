import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import {
    Add, Delete,
} from "@mui/icons-material";
import {
    Box,
    Button,
    useTheme,
    TextField,
    Grid,
    useMediaQuery,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Toolbar } from "../../components/Toolbar";
import { KhataAccount } from "../../type";
import CustomModal from "../../components/CustomModal";
const Khata = () => {
    const theme: any = useTheme();
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [list, setList] = useState<KhataAccount[]>([])
    const [callAgain, setCallAgain] = useState<boolean>(false)
    const [deleteOpen, setdeleteOpen] = useState<boolean>(false);
    const [deleteObj, setDeleteObj] = useState<any>({});
    const validationSchema = Yup.object({
        userName: Yup.string().required('User Name is required'),
        phoneNumber: Yup.number()
    });
    const formik = useFormik<KhataAccount>({
        initialValues: {
            userName: '',
            address: "", items: [],
            id: 0, phoneNumber: 0
        },
        validationSchema: validationSchema,
        onSubmit: async (_values: KhataAccount) => {
            const existingKhataUsers = localStorage.getItem('khata-users');
            if (existingKhataUsers) {
                let khataUsers = JSON.parse(existingKhataUsers);
                khataUsers.push({ ..._values, id: new Date().getTime() })
                localStorage.setItem('khata-users', JSON.stringify(khataUsers));
                toast.success("Added Successfully")
                formik.resetForm()
                setCallAgain(!callAgain)
            } else {
                let khataUsers: KhataAccount[] = [{ ..._values, id: new Date().getTime() }];
                localStorage.setItem('khata-users', JSON.stringify(khataUsers))
                toast.success("Added Successfully")
                formik.resetForm()
                setCallAgain(!callAgain)

            }
        }
    });
    const deleteSellItem = () => {
        const filterUser = list?.filter(({ id }: KhataAccount) => id !== deleteObj?.id)
        setList(filterUser)
        localStorage.setItem('khata-users', JSON.stringify(filterUser))
        setDeleteObj({})
        setdeleteOpen(false)
    }
    const columns = [
        {
            field: "userName",
            headerName: "Name",
            flex: 1
        },
        {
            field: "phoneNumber",
            headerName: "Phone Number",
            flex: 1
        },
       
        {
            field: "Actions",
            headerName: "Actions",
            flex: 1,
            renderCell: ({ row }: { row: any }) => <span onClick={() => {
                setdeleteOpen(true)
                setDeleteObj(row)
            }} style={{ cursor: "pointer" }}><Delete /></span>
        },
    ]
    const init = () => {
        const existingData = localStorage.getItem('khata-users');
        if (existingData) {
            const parsedData = JSON.parse(existingData)
            setList(parsedData)
        }
    }
    useEffect(() => {
        init()
    }, [callAgain])
    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="KHATA USER" subtitle="ADD KHATA USER" />
            </FlexBetween>
            <Grid container spacing={2} marginY={'1.5rem'}>
                <Grid item sm={6}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="User Name"
                        name="userName"
                        autoFocus
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        error={formik.touched.userName && Boolean(formik.errors.userName)}
                        helperText={formik.touched.userName && formik.errors.userName}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="phoneNumber"
                        label="Phone Number"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    />
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
                        rows={list}
                        columns={columns}
                        slots={{
                            toolbar: Toolbar,
                        }}
                    />
                </Box>
            </Box>
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
export default Khata;