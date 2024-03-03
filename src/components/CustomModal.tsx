import React from "react";
import { Box, Modal, Fade, useTheme } from "@mui/material";
interface GlobalModalProps {
    open: boolean;
    children: React.ReactNode;
    size: "sm" | "md" | "lg";
    height?: string;
    isHeight?: boolean
}
const CustomModal: React.FC<GlobalModalProps> = ({ open, children, size, height = "auto", isHeight = false }) => {
    const theme: any = useTheme()
    const style = {
        boxShadow: 24,
        borderRadius: 2,
        bgcolor: theme?.palette?.mode === "dark" ? theme.palette.background.alt : theme.palette.secondary.main,
        p: 2,
        maxHeight: isHeight ? 'calc(100vh - 20px)' : 'calc(100vh - 120px)',
        overflowY: 'auto',
    };
    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ backdropFilter: "blur(5px)" }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <Box
                        sx={style}
                        height={height}
                        width={size === "sm" ? "500px" : size === "md" ? "800px" : "1000px"}
                    >
                        {children}
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};
export default CustomModal;