import React from "react";
import {
    Logout,
    Menu as MenuIcon,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import {
    useTheme,
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Typography,
} from "@mui/material";
import UserImage from "../assets/user (1).png";
import { useDispatch } from "react-redux";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { setIsLogin } from "../state/slices/User";
import SoftwareDetail from "../SoftwareDetail";
interface NavbarProps {
    isSideBarOpen: boolean;
    setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data: object | null;
}
const Navbar: React.FC<NavbarProps> = ({ isSideBarOpen, setIsSideBarOpen }) => {
    const theme: any = useTheme();
    const dispatch: Dispatch<UnknownAction> = useDispatch()
    return (
        <AppBar
            sx={{
                position: "static",
                background: "none",
                boxShadow: "none",
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: "space-between",
                }}
            >
                <FlexBetween>
                    <IconButton
                        onClick={() => {
                            setIsSideBarOpen(!isSideBarOpen);
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                </FlexBetween>
                <FlexBetween>
                    <IconButton
                        onClick={() => {
                            dispatch(setIsLogin())
                        }}
                    >
                        <Logout />
                    </IconButton>
                    <FlexBetween>
                        <IconButton
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                textTransform: "none",
                                gap: "1rem",
                            }}
                        >
                            <Box
                                component="img"
                                src={UserImage}
                                alt="user-image"
                                width="40px"
                                height="40px"
                                borderRadius="50%"
                                sx={{
                                    objectFit: "cover",
                                }}
                            />
                        </IconButton>
                        <Box textAlign={"left"}>
                            <Typography
                                fontSize={"0.9rem"}
                                fontWeight="bold"
                                sx={{ color: theme?.palette.secondary[100] }}
                            >
                                {SoftwareDetail?.softwareName || ""}
                            </Typography>
                        </Box>
                        <Box></Box>
                    </FlexBetween>
                </FlexBetween>
            </Toolbar>
        </AppBar>
    );
};
export default Navbar;