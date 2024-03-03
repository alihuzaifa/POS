import React, { useState } from "react";
import {
    Drawer,
    Box,
    IconButton,
    ListItem,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import {
    ChevronLeft,
    ChevronRightOutlined,
    Store,
    AccountBalance,
    AccountBalanceWallet,
    History,
    Person,
    Person2,
    Book,
    AtmOutlined,
    InventoryOutlined,
    Backup,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { useDispatch } from "react-redux";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { setCount } from "../state/slices/User";
import SoftwareDetail from "../SoftwareDetail";
interface SidebarProps {
    isNonMobile: boolean;
    drawerWidth: string;
    isSideBarOpen: boolean;
    setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    data: object | null;
}
const Sidebar: React.FC<SidebarProps> = ({
    isNonMobile,
    drawerWidth,
    isSideBarOpen,
    setIsSideBarOpen,
}) => {
    const [active, setActive] = useState<string>("purchase");
    const theme: any = useTheme();
    const dispatch: Dispatch<UnknownAction> = useDispatch()
    type nav = {
        text: string,
        icon: any,
    }
    const navItem: nav[] = [
        {
            text: "Purchase",
            icon: <Store />,
        },
        {
            text: "Stock List",
            icon: <Store />,
        },
        {
            text: "Billing",
            icon: <AccountBalance />,
        },
        {
            text: "Fake Bills",
            icon: <AccountBalanceWallet />,
        },
        {
            text: "User",
            icon: <Person />,
        },
        {
            text: "Khata User",
            icon: <Person2 />,
        },
        {
            text: "Khata Book",
            icon: <Book />,
        },
        {
            text: "Khata History",
            icon: <History />,
        },
        {
            text: "Order History",
            icon: <History />,
        },
        {
            text: "Pending Payment",
            icon: <AtmOutlined />,
        },
        {
            text: "Quotation",
            icon: <InventoryOutlined />,
        },
        // {
        //     text: "Bills Backup",
        //     icon: <Backup />,
        // },
        // {
        //     text: "Khata Backup",
        //     icon: <Backup />,
        // },
    ];
    return (
        <Box component="nav">
            {isSideBarOpen && (
                <Drawer
                    open={isSideBarOpen}
                    onClose={() => {
                        setIsSideBarOpen(false);
                    }}
                    variant="persistent"
                    anchor="left"
                    sx={{
                        width: drawerWidth,
                        "& .MuiDrawer-paper": {
                            color: theme.palette.secondary[200],
                            backgroundColor: theme.palette.background.alt,
                            boxSizing: "border-box",
                            borderWidth: isNonMobile ? 0 : "2px",
                            width: drawerWidth,
                        },
                    }}
                >
                    <Box width={"100%"}>
                        <Box m={"1.5rem 2rem 2rem 3rem"}>
                            <FlexBetween color={theme.palette.secondary.main}>
                                <Box display={"flex"} alignItems="center" gap={"0.5rem"}>
                                    <Typography variant="h4" fontWeight={"bold"}>
                                        {SoftwareDetail?.softwareName || ""}
                                    </Typography>
                                </Box>
                                {!isNonMobile && (
                                    <IconButton
                                        onClick={() => {
                                            setIsSideBarOpen(!isSideBarOpen);
                                        }}
                                    >
                                        <ChevronLeft />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        </Box>
                        <List>
                            {navItem?.map(({ text, icon }, index) => {
                                if (!icon) {
                                    return (
                                        <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                                            {text}
                                        </Typography>
                                    );
                                }
                                const lcText = text.toLowerCase();
                                return (
                                    <ListItem key={index} disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                setActive(lcText);
                                                dispatch(setCount(index))
                                            }}
                                            sx={{
                                                backgroundColor:
                                                    active === lcText
                                                        ? theme.palette.secondary[300]
                                                        : "transparent",
                                                color:
                                                    active === lcText
                                                        ? theme.palette.primary[600]
                                                        : theme.palette.secondary[100],
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    ml: "2rem",
                                                    color:
                                                        active === lcText
                                                            ? theme.palette.primary[600]
                                                            : theme.palette.secondary[200],
                                                }}
                                            >
                                                {icon}
                                            </ListItemIcon>
                                            <ListItemText primary={text} />
                                            {active === lcText && <ChevronRightOutlined />}
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Drawer>
            )}
        </Box>
    );
};
export default Sidebar;