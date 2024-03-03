import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useDispatch } from 'react-redux';
import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { setIsForget } from '../../state/slices/User';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { ArrowBack } from '@mui/icons-material';
export default function Forget() {
    const dispatch: Dispatch<UnknownAction> = useDispatch()
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().when('isHide', (isHide: any, schema: any) => {
            if (!isHide) {
                return schema.required('Password is required');
            } else {
                return schema;
            }
        })
    });
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            isHide: true
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // Check if the 'isHide' property exists and is true in the values object
            if (values?.isHide) {
                // Retrieve 'users' data from localStorage
                const existingData = localStorage.getItem('users');
                if (existingData) {
                    // Parse existing users data from localStorage
                    let users = JSON.parse(existingData);
                    // Find user with provided email
                    let foundUser = users.find((user: { email: string }) => user.email === values.email);
                    if (foundUser) {
                        // If user is found, set 'isHide' to false and display success message
                        formik.setFieldValue('isHide', false);
                        toast.success("Valid Email");
                        return;
                    } else {
                        // If user is not found, display error message
                        toast.error("Invalid Credentials");
                        return;
                    }
                }
            } else {
                // Retrieve 'users' data from localStorage
                const existingData = localStorage.getItem('users');
                if (existingData) {
                    // Parse existing users data from localStorage
                    let users = JSON.parse(existingData);
                    // Find user with provided email
                    let foundUser = users.find((user: { email: string }) => user.email === values.email);
                    // Get index of the found user
                    let userIndex = users.findIndex((user: { email: string }) => user.email === values.email);
                    if (foundUser) {
                        // If user is found, update password and store updated users data in localStorage
                        foundUser.password = values.password;
                        users.splice(userIndex, 1, foundUser);
                        localStorage.setItem('users', JSON.stringify(users)); // Corrected line
                        toast.success("Now Login To Your Account");
                        dispatch(setIsForget());
                    } else {
                        // If user is not found, display error message
                        toast.error("Invalid Credentials");
                    }
                }
            }

        },
    });
    return (
        <Container component="main" maxWidth="xs">

            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                }}
            >
                <Avatar sx={{ bgcolor: 'secondary.main' }} >
                    <span onClick={() => {
                        dispatch(setIsForget())
                    }}>
                        <ArrowBack />
                    </span>
                </Avatar>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >

                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Forget Password
                </Typography>
                <form onSubmit={formik.handleSubmit} noValidate>
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
                    {
                        !formik?.values?.isHide &&
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="New Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </form>
            </Box>
        </Container>
    );
}