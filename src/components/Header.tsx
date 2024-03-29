import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface HeaderProps {
    title?: string;
    subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    const theme: any = useTheme();
    return (
        <Box>
            <Typography
                variant="h2"
                color={theme.palette.secondary[100]}
                fontWeight="bold"
                sx={{ mb: "5px" }}
            >
                {title || ""}
            </Typography>
            <Typography variant="h5" color={theme.palette.secondary[300]}>
                {subtitle || ""}
            </Typography>
        </Box>
    );
};

export default Header;