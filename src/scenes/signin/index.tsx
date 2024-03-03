import Avatar from '@mui/material/Avatar'; // Importing Avatar component from MUI
import Button from '@mui/material/Button'; // Importing Button component from MUI
import TextField from '@mui/material/TextField'; // Importing TextField component from MUI
import Box from '@mui/material/Box'; // Importing Box component from MUI
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Importing LockOutlinedIcon component from MUI icons
import Typography from '@mui/material/Typography'; // Importing Typography component from MUI
import Container from '@mui/material/Container'; // Importing Container component from MUI
import { useDispatch } from 'react-redux'; // Importing useDispatch hook from react-redux for dispatching actions
import { Dispatch, UnknownAction } from '@reduxjs/toolkit'; // Importing Dispatch and UnknownAction types from redux toolkit
import { setIsForget, setIsLogin } from '../../state/slices/User'; // Importing action creators from User slice
import { useFormik } from 'formik'; // Importing useFormik hook from formik for form management
import * as Yup from 'yup'; // Importing Yup for form validation
import toast from 'react-hot-toast'; // Importing toast notification library
export default function SignIn() {
    const dispatch: Dispatch<UnknownAction> = useDispatch(); // Initializing dispatch function
    const validationSchema = Yup.object({ // Defining validation schema using Yup
        email: Yup.string().email('Invalid email address').required('Required'), // Email validation
        password: Yup.string().required('Required'), // Password validation
    });
    const formik = useFormik({ // Initializing formik
        initialValues: { // Initial form values
            email: '',
            password: '',
        },
        validationSchema: validationSchema, // Validation schema for formik
        onSubmit: (values) => { // Form submission handler
            
            const existingData = localStorage.getItem('users'); // Retrieving users data from localStorage
            if (existingData) { // If users data exists in localStorage
                let users = JSON.parse(existingData); // Parsing users data
                let foundUser = users.find((user: { email: string, password: string, verified: boolean }) => user.email === values.email && user.password === values.password); // Finding user with provided email and password
                if (foundUser) { // If user is found
                    dispatch(setIsLogin()); // Dispatching setIsLogin action
                    toast.success("Login Successfully"); // Displaying success toast message
                    formik.resetForm(); // Resetting form
                } else { // If user is not found
                    toast.error("Invalid Credentials"); // Displaying error toast message
                }
            } else { // If users data doesn't exist in localStorage
                let users: { email: string, password: string, verified: boolean, name: string }[] = []; // Initializing users array
                users.push({ email: values.email, password: values.password, verified: true, name: "Admin" }); // Pushing new user object
                localStorage.setItem('users', JSON.stringify(users)); // Storing users data in localStorage
                toast.success("Login Successfully"); // Displaying success toast message
                dispatch(setIsLogin()); // Dispatching setIsLogin action
                formik.resetForm(); // Resetting form
            }
        },
    });

    return (
        <Container component="main" maxWidth="xs"> {/* Main container */}
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> {/* Avatar for LockOutlinedIcon */}
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5"> {/* Sign in heading */}
                    Sign in
                </Typography>
                <form onSubmit={formik.handleSubmit} noValidate> {/* Form submission */}
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
                    /> {/* Email input field */}
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
                    /> {/* Password input field */}
                    <Typography textAlign={'end'}>
                        <span style={{ cursor: 'pointer', textDecorationLine: 'underline' }} onClick={() => {
                            dispatch(setIsForget())
                        }}>Forget Password?</span>
                    </Typography> {/* Forget password link */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button> {/* Sign in button */}
                </form>
            </Box>
        </Container>
    );
}