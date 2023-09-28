'use client'
import { TextField, alpha, styled } from '@mui/material';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

interface Payout {
    id: number;
    amount: number;
    date: string;
}

interface PageState {
    data: Payout[] | null;
    total: number;
    isLoading: boolean;
    page: number;
    pageSize: number;
    searchText: string;
    paginationMode: 'client' | 'server';
}


const columns = [
    { field: 'username', headerName: 'User', flex: 1 },
    { field: 'dateAndTime', headerName: 'Date & Time', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1, renderCell: (params: any) => (<div style={{ color: params.value === 'Completed' ? 'green' : 'red' }}>{params.value}</div>) },
    { field: 'value', headerName: 'Value', flex: 1 },
];

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
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },
}));


const GridLayout = () => {

    const cache = useMemo(() => new Map<string, []>(), []);
    const [pageState, setPageState] = useState<PageState>({
        data: null,
        total: 0,
        isLoading: false,
        page: 0,
        pageSize: 10,
        searchText: '',
        paginationMode: 'client',
    });

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPageState((prevState) => ({ ...prevState, searchText: event.target.value, page: 0 }));
    };

    const fetchData = async () => {
        try {
            setPageState((prevState) => ({ ...prevState, isLoading: true }));

            let endpoint = 'https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts?page=' + (pageState.page + 1) + '&limit=' + pageState.pageSize;
            let paginationMode = 'server';

            if (pageState.searchText) {
                endpoint = `https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/search?query=${pageState.searchText}`;
                paginationMode = 'client';
            }

            if (paginationMode === 'client') {
                if (cache.has(pageState.searchText)) {
                    const data = cache.get(pageState.searchText);
                    setPageState((prevState) => ({ ...prevState, isLoading: false, data, total: data.length, paginationMode }));
                    console.log('cache hit');
                    return;
                }
            }

            const response = await fetch(endpoint);
            const data = await response.json();

            if (paginationMode === 'server') {
                setPageState((prevState) => ({
                    ...prevState,
                    data: data.data,
                    total: data.metadata.totalCount,
                    isLoading: false,
                    paginationMode,
                }));
            } else {
                cache.set(pageState.searchText, data);
                setPageState((prevState) => ({
                    ...prevState,
                    data: data,
                    total: data.length,
                    isLoading: false,
                    paginationMode,
                }));
            }


            console.log('data is ', JSON.stringify(data));



        } catch (error) {
            console.error(error);
            setPageState((prevState) => ({ ...prevState, isLoading: false }));
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageState.page, pageState.pageSize, pageState.searchText]);

    return (
        <div>
            <div>
                <h1>Payouts</h1>
            </div>
            <div style={{ flexDirection: 'column', marginLeft: '40px', marginRight: '40px' }}>

                <div id='subContainer' style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', flex: '1', alignItems: 'center' }}>
                        <div style={{ backgroundColor: 'rgba(153, 157, 255, 1)', width: '18px', height: '35px', borderRadius: '3px', marginRight: '15px' }}></div>
                        <h4>Payout History</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', flex: '1', justifyContent: 'flex-end' }}>
                        <TextField
                            size='small'
                            id="filled-search"
                            label="Search username"
                            type="search"
                            variant="filled"
                            value={pageState.searchText}
                            onChange={handleSearchChange}
                            autoComplete='off'
                        />
                    </div>
                </div>
                <div>

                    <StripedDataGrid
                        autoHeight
                        density='compact'
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                        }
                        columns={columns}
                        rows={pageState.data ?? []}
                        rowCount={pageState.total}
                        pagination
                        paginationMode={pageState.paginationMode}
                        paginationModel={{ page: pageState.page, pageSize: pageState.pageSize }}
                        pageSizeOptions={[10, 20, 30, 100]}
                        getRowId={(row) => {
                            console.log('row is ', JSON.stringify(row));
                            return row.username
                        }}
                        onPaginationModelChange={(newModel) => {
                            console.log('newModel is ', newModel);
                            setPageState((prevState) => ({ ...prevState, page: newModel.page, pageSize: newModel.pageSize }));
                        }}
                        loading={pageState.isLoading}
                    />
                </div>

            </div>
        </div>
    );
};
export default GridLayout;