'use client'
import { TextField, alpha, styled } from '@mui/material';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { PageState, Payout, PayoutsWithMetadata } from './types/Payout';
import { paginatePayouts, searchPayouts } from './services/PayoutsService';

const columns = [
    {
        field: 'username', headerName: 'User', flex: 1, renderCell: (params: any) => {
            console.log('params is ', JSON.stringify(params.value));
            return (<div>{(params.value) ? params.value : 'NA'}</div>);
        }, renderHeader: (params: any) => {
            return (
                <div style={{ color: 'gray' }}>{params.colDef.headerName}</div>
            );
        }
    },
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


const PayoutsPage = () => {

    const cache = useMemo(() => new Map<string, Payout[]>(), []);
    const [pageState, setPageState] = useState<PageState>({
        data: [] as Payout[],
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

            let paginationMode = 'server';

            if (pageState.searchText) {
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


            if (paginationMode === 'server') {
                const paginatedData: PayoutsWithMetadata = await paginatePayouts(pageState.page + 1, pageState.pageSize);
                setPageState((prevState) => ({
                    ...prevState,
                    data: paginatedData.data.map((payout, index) => ({ ...payout, id: index })),
                    total: paginatedData.metadata.totalCount,
                    isLoading: false,
                    paginationMode,
                }));
            } else {
                const payoutSearchResults: Payout[] = await searchPayouts(pageState.searchText);
                console.log('payoutSearchResults is ', JSON.stringify(payoutSearchResults));
                cache.set(pageState.searchText, payoutSearchResults);
                setPageState((prevState) => ({
                    ...prevState,
                    data: payoutSearchResults.map((payout, index) => ({ ...payout, id: index })),
                    total: payoutSearchResults.length,
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
                            // console.log('row is ', JSON.stringify(row));
                            return row.id
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
export default PayoutsPage;