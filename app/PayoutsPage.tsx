'use client'
import { TextField } from '@mui/material';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { PageState, Payout, PayoutsWithMetadata } from './types/Payout';
import { paginatePayouts, searchPayouts } from './services/PayoutsService';
import { StyledDataGrid } from './components/StyledDataGrid';

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
                    setPageState((prevState) => ({
                        ...prevState,
                        isLoading: false,
                        data,
                        total: data ? data.length : 0,
                        paginationMode
                    }));
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
                const resultsWithIDs = payoutSearchResults.map((payout, index) => ({ ...payout, id: index }));
                cache.set(pageState.searchText, resultsWithIDs);
                setPageState((prevState) => ({
                    ...prevState,
                    data: resultsWithIDs,
                    total: payoutSearchResults.length,
                    isLoading: false,
                    paginationMode,
                }));
            }

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
                        <div style={{
                            backgroundColor: 'rgba(153, 157, 255, 1)',
                            width: '18px',
                            height: '35px',
                            borderRadius: '3px',
                            marginRight: '15px'
                        }}></div>
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

                    {/* <StripedDataGrid
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
                            return row.id
                        }}
                        onPaginationModelChange={(newModel) => {
                            console.log('newModel is ', newModel);
                            setPageState((prevState) => ({
                                ...prevState,
                                page: newModel.page,
                                pageSize: newModel.pageSize
                            }));
                        }}
                        loading={pageState.isLoading}></StripedDataGrid> */}
                    <StyledDataGrid
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                        }
                        rows={pageState.data ?? []}
                        rowCount={pageState.total}
                        paginationMode={pageState.paginationMode}
                        paginationModel={{ page: pageState.page, pageSize: pageState.pageSize }}
                        getRowId={(row) => {
                            console.log('row is ', JSON.stringify(row.id));
                            return row.id
                        }}
                        onPaginationModelChange={(newModel) => {
                            console.log('newModel is ', newModel);
                            setPageState((prevState) => ({
                                ...prevState,
                                page: newModel.page,
                                pageSize: newModel.pageSize
                            }));
                        }}
                        loading={pageState.isLoading}></StyledDataGrid>
                </div>

            </div>
        </div>
    );
};
export default PayoutsPage;
