'use client'
import { DataGrid, GridValueGetterParams } from '@mui/x-data-grid';
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { useMemo, useEffect, useState, ChangeEvent } from 'react';
import { Title } from './Title';
import { Grid, Typography } from '@mui/material';

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

const PayoutsGrid3 = () => {
    const [searchText, setSearchText] = useState('');

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

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPageState((prevState) => ({ ...prevState, searchText: event.target.value, page: 0 }));
    };

    const columns = [
        { field: 'username', headerName: 'User', width: 70, flex: 1 },
        { field: 'value', headerName: 'Value', width: 130, flex: 1 },
        { field: 'dateAndTime', headerName: 'Date & Time', width: 130, flex: 1 },
        { field: 'status', headerName: 'Status', width: 130, flex: 1 },
    ];

    return (
        <Container>
            <Typography>
                Payouts
            </Typography>


            <Container key='specialContainer' style={{ marginTop: 100, marginBottom: 100 }}>
                <Grid container item xs={12} display='flex' direction='row'>
                    <Grid item xs={6}>
                        <Typography>
                            Payouts History
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="filled-search"
                            label="Search field"
                            type="search"
                            variant="filled"
                            value={pageState.searchText}
                            onChange={handleSearchChange}
                        />
                    </Grid>

                </Grid>
                {/* <Title /> */}

                <Container >
                    <DataGrid
                        autoHeight
                        columns={columns}
                        rows={pageState.data ?? []}
                        rowCount={pageState.total}
                        pagination
                        paginationMode={pageState.paginationMode}
                        paginationModel={{ page: pageState.page, pageSize: pageState.pageSize }}
                        pageSizeOptions={[10, 20, 30, 100]}
                        getRowId={(row) => row.username}
                        onPaginationModelChange={(newModel) => {
                            console.log('newModel is ', newModel);
                            setPageState((prevState) => ({ ...prevState, page: newModel.page, pageSize: newModel.pageSize }));
                        }}
                        // onPageChange={handlePageChange}
                        // onPageSizeChange={handlePageSizeChange}
                        loading={pageState.isLoading}
                    />
                </Container>
            </Container>
        </Container>

    );
};

export default PayoutsGrid3;