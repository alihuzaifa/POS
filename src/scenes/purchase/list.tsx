import { useEffect, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import {
    Box,
    useTheme,
    useMediaQuery,
    Grid,
    TextField,
    Typography,
    Button,
} from "@mui/material";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Close, Delete, Edit, RemoveRedEye, StarOutlineSharp } from "@mui/icons-material";
import CustomModal from "../../components/CustomModal";
import { groupTransactions } from "../../GroupBy";
interface historyObject {
    price: number,
    quantity: number,
    date: string,
    vendorName: string,
    time: string;
    purchaseTime: string;
    shippingCharges: number;
    status: boolean;
}
const PurchaseList = () => {
    const theme: any = useTheme();
    const [list, setList] = useState<object[]>([])
    const [history, setHistory] = useState<historyObject[]>([])
    const [open, setOpen] = useState<boolean>(false);
    const [deleteOpen, setdeleteOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>('');
    const [editId, setEditId] = useState<string>('');
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const columns = [
        {
            field: "name",
            headerName: "Item Name",
            flex: 1
        },
        {
            field: "quantity",
            headerName: "Quantity",
            flex: 1
        },
        {
            field: "totalPrice",
            headerName: "Total Amount",
            flex: 1
        },
        {
            field: "history",
            headerName: "History",
            flex: 1,
            renderCell: ({ row }: { row: any }) => <span onClick={() => {
                setOpen(true)
                setHistory(row?.history)
            }} style={{ cursor: "pointer" }}><RemoveRedEye /></span>
        },
    ]
    const init = () => {
        const existingData = localStorage.getItem('stock');
        if (existingData) {
            const parsedData = JSON.parse(existingData)
            const result = groupTransactions(parsedData)?.map((obj: any) => {
                return { ...obj, totalPrice: obj?.quantity * obj?.price }
            })
            result.forEach((item: any) => {
                const historySum = item.history.reduce((total: number, historyItem: any) => {
                    return total + (historyItem.price * historyItem.quantity);
                }, 0);
                item.totalPrice = historySum;
            });
            setList(result)
        }
    }
    useEffect(() => {
        init()
    }, [])
    function CustomToolbar() {
        return (
            <GridToolbarContainer
                sx={{
                    marginBottom: "8px ",
                    marginTop: "5px ",
                    backgroundColor: "transparent",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <GridToolbarColumnsButton />
                    <GridToolbarDensitySelector />

                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <GridToolbarQuickFilter
                        variant="outlined"
                        size="small"
                        placeholder="Search  Now "
                    />
                </div>
            </GridToolbarContainer>
        );
    }
    const deleteItem = (time: string): void => {
        setdeleteOpen(true)
        setDeleteId(time)

    }
    const total = list.reduce((acc, item: any) => acc + (item.totalPrice ?? 0), 0);
    return (
        <>
            <Box m="1.5rem 2.5rem">
                <FlexBetween>
                    <Header title="ALL STOCK" subtitle="ALL STOCK LIST" />
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
                                toolbar: CustomToolbar,
                            }}
                        />
                        <Typography sx={{ textAlign: "end", backgroundColor: theme.palette.background.alt, gap: "5px", fontSize: "16px", }}>
                            Total Amount{" "}{" "}{" "}{" "}{" "}{" "}{" "} {total}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <CustomModal open={open} size="md">
                <Grid container spacing={2}>
                    <Grid item sm={12} sx={{
                        display: 'flex', justifyContent: 'end'
                    }}>
                        <span onClick={() => { setOpen(false) }} style={{ cursor: "pointer" }}><Close /></span>
                    </Grid>
                    {
                        history.map((object: historyObject, index: number) => {
                            const currentDate = new Date(object?.purchaseTime);
                            const day = currentDate.getDate();
                            const month = currentDate.toLocaleString('default', { month: 'long' });
                            const year = currentDate.getFullYear();
                            const currentDate2 = new Date(object?.purchaseTime);
                            const day2 = currentDate2.getDate();
                            const month2 = currentDate2.toLocaleString('default', { month: 'long' });
                            const year2 = currentDate2.getFullYear();
                            const formattedDate = `${day} ${month} ${year}`;
                            const formattedDate2 = `${day2} ${month2} ${year2}`;
                            return <Grid container spacing={2} marginY={'.2rem'} key={index}>
                                <Grid item sm={2}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        value={object?.price}
                                        label="Price"
                                        fullWidth
                                        disabled
                                        InputProps={{
                                            style: { width: '100%' }
                                        }} />
                                </Grid>
                                <Grid item sm={2}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        value={object?.quantity}
                                        fullWidth
                                        disabled
                                        label="Quantity"
                                        InputProps={{
                                            style: { width: '100%' }
                                        }} />
                                </Grid>
                                <Grid item sm={2}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        value={object?.quantity * object?.price}
                                        fullWidth
                                        disabled
                                        label="Amount"
                                        InputProps={{
                                            style: { width: '100%' }
                                        }} />
                                </Grid>
                                <Grid item sm={2}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        value={object?.shippingCharges}
                                        fullWidth
                                        disabled
                                        label="Shipping Charges"
                                        InputProps={{
                                            style: { width: '100%' }
                                        }} />
                                </Grid>
                                <Grid item sm={2}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        value={formattedDate}
                                        fullWidth
                                        disabled
                                        label="Purchased Time"
                                        InputProps={{
                                            style: { width: '100%' }
                                        }} />
                                </Grid>
                                <Grid item sm={2}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        value={formattedDate2}
                                        fullWidth
                                        disabled
                                        label="Recieved Time"
                                        InputProps={{
                                            style: { width: '100%' }
                                        }} />
                                </Grid>
                                <Grid item sm={2}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        value={object?.status ? "Recieved" : "On The Way"}
                                        fullWidth
                                        disabled
                                        label="Status"
                                        InputProps={{
                                            style: { width: '100%' }
                                        }} />
                                </Grid>
                                <Grid item sm={1} sx={{ display: "flex", alignItems: 'center' }}>
                                    <span onClick={() => { deleteItem(object?.time) }}>
                                        <Delete sx={{ color: 'red', cursor: 'pointer' }} />
                                    </span>
                                    {
                                        !object?.status &&
                                        <span onClick={() => {
                                            setEditOpen(true)
                                            setEditId(object?.time)
                                        }}>
                                            <Edit sx={{ cursor: 'pointer' }} />
                                        </span>
                                    }
                                </Grid>
                            </Grid>
                        })
                    }

                </Grid>
            </CustomModal>
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
                            if (deleteId !== '') {
                                const time = deleteId
                                const existingData = localStorage.getItem('stock');
                                if (existingData) {
                                    const parsedData = JSON.parse(existingData)
                                    const filterStock = parsedData?.filter((item: any) => item?.time != time)
                                    localStorage.setItem('stock', JSON.stringify(filterStock))
                                    const groupedTransactions = groupTransactions(filterStock);
                                    setList(groupedTransactions)
                                    setOpen(false)
                                    setdeleteOpen(false)
                                    setDeleteId('')
                                }
                            }
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
                        }}
                        size="small"
                    >
                        No
                    </Button>
                </Box>
            </CustomModal>
            <CustomModal open={editOpen} size="sm">
                <Typography variant="h5" color={theme.palette.secondary[300]} textAlign={'center'}>
                    Are you sure that you have got your ordered?
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
                            if (editId !== '') {
                                const time = editId
                                const existingData = localStorage.getItem('stock');
                                if (existingData) {
                                    const parsedData = JSON.parse(existingData)
                                    const objectToUpdate = parsedData.find((obj: any) => obj.time === time);
                                    if (objectToUpdate) {
                                        objectToUpdate.status = true;
                                        objectToUpdate.recievedTime = new Date().getTime();
                                    }
                                    localStorage.setItem('stock', JSON.stringify(parsedData))
                                    const result = groupTransactions(parsedData)?.map((obj: any) => {
                                        return { ...obj, totalPrice: obj?.quantity * obj?.price }
                                    })
                                    result.forEach((item: any) => {
                                        const historySum = item.history.reduce((total: number, historyItem: any) => {
                                            return total + (historyItem.price * historyItem.quantity);
                                        }, 0);
                                        item.totalPrice = historySum;
                                    });
                                    setList(result)
                                    setOpen(false)
                                    setEditOpen(false)
                                    setEditId('')
                                }
                            }
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
                            setEditOpen(false)
                        }}
                        size="small"
                    >
                        No
                    </Button>
                </Box>
            </CustomModal>
        </>
    );
};
export default PurchaseList;