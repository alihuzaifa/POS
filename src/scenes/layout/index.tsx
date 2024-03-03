import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import Wrapper from "../wrapper";
const Layout = (): React.ReactNode => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    return (
        <Box
            display={isNonMobile ? "flex" : "block"}
            width={"100%"}
            height={"100%"}
        >
            <Sidebar
                data={{}}
                isNonMobile={isNonMobile}
                drawerWidth={"250px"}
                isSideBarOpen={isSideBarOpen}
                setIsSideBarOpen={setIsSideBarOpen}
            />
            <Box
                sx={{
                    flexGrow: 1,
                }}
            >
                <Navbar
                    data={{}}
                    isSideBarOpen={isSideBarOpen}
                    setIsSideBarOpen={setIsSideBarOpen}
                />
                <Wrapper />
            </Box>
        </Box>
    );
};
export default Layout;