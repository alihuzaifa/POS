import { useEffect, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import {
    Box,
    useTheme,
    useMediaQuery,
    Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Toolbar } from "../../components/Toolbar";
const Loan = () => {
    const theme: any = useTheme();
    const [khataHistoryList, setkhataHistoryList] = useState<object[]>([])
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
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
            field: "remainingAmount",
            headerName: "Payment",
            flex: 1
        },
    ]
    const init = () => {
        const existingData = localStorage.getItem('khata-book');
        if (existingData) {
            const parsedData = JSON.parse(existingData)?.map((obj: any) => {
                return { ...obj, label: obj?.userName }
            })
            let newArray = parsedData?.map((obj: any) => {
                const remainingAmount = obj.items.reduce((acc: number, item: any) => {
                    const transactionAmount = item.transactions.reduce((acc: number, transaction: any) => acc + parseInt(transaction.amount), 0);
                    return acc + (Number(item.quantity) * Number(item.price)) - transactionAmount;
                }, 0);
                return { ...obj, remainingAmount };
            });
            setkhataHistoryList(newArray)
        }
    }
    useEffect(() => {
        init()
    }, [])
    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="PENDING PAYMENT" subtitle="PENDING PAYMENT OF ALL USERS" />
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
                        rows={khataHistoryList}
                        columns={columns}
                        slots={{
                            toolbar: Toolbar,
                        }}
                    />
                    <Typography sx={{ textAlign: "end", backgroundColor: theme.palette.background.alt, gap: "5px", fontSize: "16px", }}>
                        Total Amount{" "}{" "}{" "}{" "}{" "}{" "}{" "} {
                            khataHistoryList?.reduce((acc: number, value: any): number => {
                                return acc + (value?.remainingAmount || 0);
                            }, 0)
                        }
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
export default Loan;