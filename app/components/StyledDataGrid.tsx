import { alpha, styled } from "@mui/material";
import { DataGrid, GridCallbackDetails, GridColDef, GridColumnHeaderParams, GridFeatureMode, GridPaginationModel, GridRowIdGetter, GridValidRowModel, gridClasses } from "@mui/x-data-grid";
import { StyledChip } from "./StyledChip";
import { BoldBox } from "./BoldBox";
import { formatDateAndTime } from "../utils/dateUtils";
import { DateBox } from "./DateBox";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.grey[50],
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
}));

interface GrayHeaderProps {
    headerName: string | undefined;
}

const GrayHeader = ({ headerName }: GrayHeaderProps) => {
    const StyledHeader = styled('div')(({ theme }) => ({
        color: theme.palette.grey[500],
    }));
    return (
        <StyledHeader>{headerName}</StyledHeader>
    );
};

const renderHeader = (params: GridColumnHeaderParams) => {
    return (
        <GrayHeader headerName={params.colDef.headerName} />
    );

}

export const StyledDataGrid = ({
    columns = [
        {
            field: 'username', headerName: 'Username', flex: 1, renderHeader, renderCell: (params: any) => {

                return (<BoldBox>{(params.value) ? params.value : 'NA'}</BoldBox>);
            },
        },
        {
            field: 'dateAndTime', headerName: 'Date & Time', flex: 1, renderHeader, renderCell: (params: any) => {
                return (<DateBox>{formatDateAndTime(params.value)}</DateBox>);
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderHeader,
            renderCell: (params: any) => {
                const child = params.value === 'Completed' ? 'Paid' : 'Pending';
                return (<StyledChip value={params.value} >{child}</StyledChip>);
            }
        },
        { field: 'value', headerName: 'Value', flex: 1, renderHeader, renderCell: (params: any) => { return (<BoldBox>{params.value}</BoldBox>); } },
    ],
    rows,
    rowCount,
    paginationMode,
    paginationModel,
    getRowId,
    onPaginationModelChange,
    loading,

}: {
    columns: GridColDef<GridValidRowModel>[],
    rows: readonly GridValidRowModel[],
    rowCount: number | undefined,
    paginationMode: GridFeatureMode | undefined,
    paginationModel: GridPaginationModel | undefined,
    getRowId: GridRowIdGetter<GridValidRowModel> | undefined,
    onPaginationModelChange: ((model: GridPaginationModel, details: GridCallbackDetails<any>) => void) | undefined,
    loading: boolean | undefined
}) => {
    return (
        <StripedDataGrid
            autoHeight
            // density="compact"
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            rowSelection={false}
            columns={columns}
            rows={rows}
            rowCount={rowCount}
            pagination
            paginationMode={paginationMode}
            paginationModel={paginationModel}
            pageSizeOptions={[10, 20, 30, 100]}
            getRowId={getRowId}
            onPaginationModelChange={onPaginationModelChange}
            loading={loading}></StripedDataGrid>
    );
};
