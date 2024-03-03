import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarQuickFilter } from "@mui/x-data-grid";
export function Toolbar() {
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
                {/* <GridToolbarExport /> */}
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