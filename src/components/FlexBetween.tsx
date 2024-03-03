import React from "react";
import { Box, SxProps, Theme } from "@mui/system";
import { styled } from "@mui/system";
interface FlexBetweenProps {
    children: React.ReactNode;
    sx?: SxProps<Theme>;
}
const FlexBetween = styled(Box)<FlexBetweenProps>(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}));

export default FlexBetween;
