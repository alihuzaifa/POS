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
import CustomModal from "../../components/CustomModal";
const User = () => {
    const theme: any = useTheme();
    interface MyFormValues {
        email: string;
        name: string;
        password: string;
        verified: boolean;
        id?: boolean
    }
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [list, setList] = useState<MyFormValues[]>([])
    const [callAgain, setCallAgain] = useState<boolean>(false)
    const [deleteOpen, setdeleteOpen] = useState<boolean>(false);
    const [deleteObj, setDeleteObj] = useState<any>({});
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        name: Yup.string().required('Name is required'),
        password: Yup.string().required('Required'),
    });
    const formik = useFormik<MyFormValues>({
        initialValues: {
            email: '',
            password: '',
            verified: true, name: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (_values: MyFormValues) => {
            const existingData = localStorage.getItem('users');
            if (existingData) {
                let users = JSON.parse(existingData);
                users.push(_values)
                localStorage.setItem('users', JSON.stringify(users));
                toast.success("Added Successfully")
                formik.resetForm()
                setCallAgain(!callAgain)
            }
        }
    });
    const deleteSellItem = () => {
        const filterUser = list?.filter(({ id }: MyFormValues) => id !== deleteObj?.id)
        setList(filterUser)
        localStorage.setItem('users', JSON.stringify(filterUser))
        setDeleteObj({})
        setdeleteOpen(false)
    }
    const columns = [
        {
            field: "name",
            headerName: "Name",
            flex: 1
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1
        },
        {
            field: "password",
            headerName: "Password",
            flex: 1
        },
        {
            field: "Actions",
            headerName: "Actions",
            flex: 1,
            renderCell: ({ row }: { row: any }) => list?.length > 1 ? <span onClick={() => {
                setdeleteOpen(true)
                setDeleteObj(row)
            }} style={{ cursor: "pointer" }}><Delete /></span> : <span></span>
        },
    ]
    const init = () => {
        const existingData = localStorage.getItem('users');
        if (existingData) {
            const parsedData = JSON.parse(existingData)?.map((_obj: any, index: number) => {
                return { ..._obj, id: index + 1 }
            })
            setList(parsedData)
        }
    }
    useEffect(() => {
        init()
    }, [callAgain])
    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="USER" subtitle="ADD USERS" />
            </FlexBetween>
            <Grid container spacing={2} marginY={'1.5rem'}>
                <Grid item sm={6}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                </Grid>
                <Grid item sm={6}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
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
export default User;