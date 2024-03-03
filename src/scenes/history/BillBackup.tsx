import { useEffect, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import Logo from '../../assets/logo.png'
import {
    Box,
    useTheme,
    useMediaQuery,
    Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Toolbar } from "../../components/Toolbar";
import { Close, LocationOn, RemoveRedEye, WhatsApp } from "@mui/icons-material";
import CustomModal from "../../components/CustomModal";
import SoftwareDetail from "../../SoftwareDetail";
const SubHeadingText = ({ text }: { text: string }) => {
    return <Typography
        color={'black'}
        textAlign={'center'}
        className="text"
    >
        {text}
    </Typography>
}
const BillBackup = () => {
    const theme: any = useTheme();
    const [list, setList] = useState<object[]>([])
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [billView, setBillView] = useState<boolean>(false);
    const [bills, setbills] = useState<any>([]);
    const columns = [
        {
            field: "userName",
            headerName: "User Name",
            flex: 1
        },
        {
            field: "phoneNumber",
            headerName: "Phone Number",
            flex: 1
        },
        {
            field: "uniqueId",
            headerName: "Date",
            flex: 1,
            renderCell: ({ row }: any) => {
                const currentDate = new Date(row?.uniqueId);
                const day = currentDate.getDate();
                const month = currentDate.toLocaleString('default', { month: 'long' });
                const year = currentDate.getFullYear();
                const formattedDate = `${day} ${month} ${year}`;
                return formattedDate
            }
        },
        {
            field: "Actions",
            headerName: "Actions",
            flex: 1,
            renderCell: ({ row }: { row: any }) => <>
                <span onClick={() => {
                    setBillView(true)
                    setbills(row?.items)
                }} style={{ cursor: "pointer" }}><RemoveRedEye /></span>
            </>
        },
    ]
    const init = () => {
        const existingData = localStorage.getItem('billing-backup');
        if (existingData) {
            const parsedData = JSON.parse(existingData)?.map((_obj: any, index: number) => {
                return { ..._obj, id: index + 1 }
            })
            const groupedData = parsedData.reduce((acc: any, curr: any) => {
                if (!acc[curr.uniqueId]) {
                    acc[curr.uniqueId] = {
                        items: [],
                        uniqueId: curr.uniqueId,
                        name: curr.name,
                        phoneNumber: curr.phoneNumber,
                        userName: curr.userName
                    };
                }
                acc[curr.uniqueId].items.push(curr);
                return acc;
            }, {});
            const result = Object.values(groupedData)?.map((obj: any, index: number) => {
                return { ...obj, id: index + 1 }
            })
            setList(result)
        }
    }
    useEffect(() => {
        init()
    }, [])
    let formattedDate;
    let billNo;
    if (bills?.length > 0) {
        const currentDate = new Date(bills[0]?.uniqueId);
        billNo = bills[0]?.invoiceNo
        const day = currentDate.getDate();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        formattedDate = `${day} ${month} ${year}`;
    }
    return (
        <Box>
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
                            toolbar: Toolbar,
                        }}
                    />
                </Box>
            </Box>
            <CustomModal open={billView} size="lg">
                <Box sx={{
                    display: "flex",
                    justifyContent: 'end',
                    alignItems: "center"
                }}>
                    <span onClick={() => {
                        setBillView(false)
                    }}>
                        <Close />
                    </span>
                </Box>
                <Box sx={{
                    width: '100%',
                    backgroundColor: '#fff',
                    marginY: '1.5rem',
                    borderRadius: '1rem',
                    marginX: 'auto',
                    padding: '1rem'
                }}>
                    <Typography marginBottom={'-10px'} textAlign={'center'} className="text" fontSize={'18px'} fontWeight={'bold'} color={'black'}>Invoice</Typography>
                    <FlexBetween marginBottom={'1rem'}>
                        <Box component={"img"} src={Logo} sx={{ width: '150px', height: '100px', borderRadius: '6%' }} />
                        <Box width={'50%'}>
                            <Typography
                                variant="h3"
                                color={'black'}
                                fontWeight="bold"
                                sx={{
                                    textAlign: "center",
                                    marginTop: "1rem",
                                }}
                                className="personal-font"
                            >
                                {SoftwareDetail?.shopName || ""}
                            </Typography>
                            <Typography
                                color={"black"}
                                fontWeight="bold"
                                sx={{
                                    textAlign: "center",
                                    width: "70%",
                                    margin: "0px auto",
                                    fontSize: '12px'
                                }}
                                className="text"
                            >
                                {SoftwareDetail?.shopDescription || ""}
                            </Typography>
                        </Box>
                        <FlexBetween>
                            <Box>
                                <Typography
                                    color={'black'}
                                    textAlign={'center'}
                                    className="text"

                                >
                                    Azeem Badshah
                                </Typography>
                                <Typography
                                    color={'black'}
                                    textAlign={'center'}
                                    className="text"
                                    fontSize={'12px'}

                                >
                                    {SoftwareDetail?.number1}
                                </Typography>
                                <Typography
                                    color={'black'}
                                    textAlign={'center'}
                                    className="text"
                                    fontSize={'12px'}

                                >
                                    {SoftwareDetail?.number2}
                                </Typography>
                            </Box>
                            <Box sx={{
                                marginX: "5px"
                            }}>
                                <Typography
                                    color={'black'}
                                    textAlign={'center'}
                                    className="text"
                                    marginTop={'-3.2px'}

                                >
                                    <WhatsApp sx={{ color: 'green', fontSize: '16px', }} />   <span style={{ marginLeft: '-3px', }}>
                                        Hamza
                                    </span>
                                </Typography>
                                <Typography
                                    color={'black'}
                                    textAlign={'center'}
                                    className="text"
                                    fontSize={'12px'}

                                >
                                    {SoftwareDetail?.number3}
                                </Typography>
                                <Typography
                                    color={'black'}
                                    textAlign={'center'}
                                    className="text"
                                    fontSize={'12px'}

                                >
                                    {SoftwareDetail?.number4}
                                </Typography>
                            </Box>
                        </FlexBetween>
                    </FlexBetween>
                    <FlexBetween >
                        <Box >
                            <Typography
                                marginY={'.2rem'}
                                color={'black'}
                                className="text"
                            >
                                Name: {" "} <span style={{ textDecorationLine: "underline" }}>
                                    {bills[0]?.userName}
                                </span>
                            </Typography>
                            <Typography
                                marginY={'.2rem'}
                                color={'black'}
                                className="text"

                            >
                                Phone Number:{" "} <span style={{ textDecorationLine: "underline" }}>
                                    {bills[0]?.phoneNumber === 0 ? "" : "0" + bills[0]?.phoneNumber}
                                </span>
                            </Typography>
                        </Box>
                        <Box paddingRight={'7rem'}>

                            <Typography
                                color={'black'}
                                className="text"

                                marginY={'.2rem'}
                            >
                                Invoice No: {billNo}
                            </Typography>
                            <Typography
                                color={'black'}
                                className="text"

                                marginY={'.2rem'}
                            >
                                Date:{" "}
                                {formattedDate}
                            </Typography>
                        </Box>
                    </FlexBetween>
                    <FlexBetween border={'1px solid black'} borderBottom={'none'}>
                        <Typography
                            border={'1px solid black'}
                            width={'50%'}
                            textAlign={'center'}
                            sx={{
                                backgroundColor: "#000",
                                color: "#fff"
                            }}

                            className="text"

                        >
                            ITEM DETAIL
                        </Typography>
                        <Typography
                            color={'black'}
                            border={'1px solid black'}
                            width={'15%'}
                            textAlign={'center'}
                            sx={{
                                backgroundColor: "#000",
                                color: "#fff"
                            }}
                            className="text"

                        >
                            QUANTITY
                        </Typography>
                        <Typography
                            color={'black'}
                            border={'1px solid black'}
                            width={'15%'}
                            textAlign={'center'}
                            sx={{
                                backgroundColor: "#000",
                                color: "#fff"
                            }}
                            className="text"

                        >
                            PRICE
                        </Typography>
                        <Typography
                            color={'black'}
                            border={'1px solid black'}
                            width={'20%'}
                            textAlign={'center'}
                            sx={{
                                backgroundColor: "#000",
                                color: "#fff"
                            }}
                            className="text"

                        >
                            TOTAL
                        </Typography>
                    </FlexBetween>
                    <FlexBetween border={'1px solid black'}>
                        <Typography
                            color={'black'}
                            border={'1px solid black'}
                            width={'50%'}
                            height={'auto'}
                            minHeight={'220px'}
                            paddingX={'5px'}

                        >
                            {bills?.map((obj: any, key: number) => {
                                return <div key={key}>
                                    {obj?.name?.label}
                                </div>
                            })}
                        </Typography>

                        <Typography
                            color={'black'}
                            border={'1px solid black'}
                            width={'15%'}
                            textAlign={'center'}
                            height={'auto'}
                            minHeight={'220px'}

                        >
                            {bills?.map((obj: any, key: number) => {
                                return <div key={key}>
                                    {obj?.sellingQuantity}
                                </div>
                            })}
                        </Typography>
                        <Typography
                            color={'black'}
                            border={'1px solid black'}
                            width={'15%'}
                            textAlign={'center'}
                            height={'auto'}
                            minHeight={'220px'}

                        >
                            {bills?.map((obj: any, key: number) => {
                                return <div key={key}>
                                    {obj?.sellingPrice}
                                </div>
                            })}
                        </Typography>

                        <Typography
                            color={'black'}
                            border={'1px solid black'}
                            width={'20%'}
                            textAlign={'center'}
                            height={'auto'}
                            minHeight={'220px'}
                        >
                            {bills?.map((obj: any, key: number) => {
                                return <div key={key}>
                                    {obj?.totalPrice}
                                </div>
                            })}
                        </Typography>
                    </FlexBetween>
                    <FlexBetween >
                        <Typography
                            width={'50%'}
                            textAlign={'center'}
                        >
                        </Typography>
                        <Typography
                            width={'10%'}
                            textAlign={'center'}
                        >
                        </Typography>

                        <Typography
                            width={'35.2%'}
                            color={'black'}
                            border={'2px solid black'}
                            borderTop={'none'}
                            padding={'7px 2px'}
                            fontSize={'16px'}
                            className="text"

                        >
                            TOTAL:{" "} <span style={{ marginLeft: '14px' }}>{bills?.reduce((acc: number, { totalPrice }: any) => acc + totalPrice, 0) ?? 0}</span>
                        </Typography>
                    </FlexBetween>
                    <Typography
                        color={"black"}
                        sx={{
                            textAlign: "center",
                            fontSize: '14px',
                            marginY: '1rem'
                        }}
                        className="text"
                    >
                        <LocationOn sx={{ color: 'red', fontSize: '20px', paddingTop: '5px' }} /> <span>
                            {SoftwareDetail?.shopAddress || ""}
                        </span>
                    </Typography>
                    <FlexBetween marginTop={'1rem'}>
                        <Box sx={{ marginTop: '-14px' }}>
                            <SubHeadingText text="Thank you for purchase!" />
                        </Box>
                        <Box paddingRight={'2rem'} textAlign={'end'}>
                            <Typography
                                color={'black'}
                                sx={{ mb: "5px" }}
                            >
                                ___________________________
                            </Typography>
                            <SubHeadingText text="Signature" />
                        </Box>
                    </FlexBetween>
                </Box>
            </CustomModal>
        </Box>
    );
};
export default BillBackup;