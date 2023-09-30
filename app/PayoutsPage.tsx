'use client'
import React from 'react';
import {TextField} from '@mui/material';
import {ChangeEvent, useEffect, useRef, useState} from 'react';
import {PageState, Payout, PayoutsWithMetadata} from './types/Payout';
import {paginatePayouts, searchPayouts} from './services/PayoutsService';
import {StyledDataGrid} from './components/StyledDataGrid';
import {useDebounce} from './hooks/useDebounce';
import {GridFeatureMode} from "@mui/x-data-grid";
import {Snackbar} from "@mui/material";
import useCache from "./hooks/useCache";

const DEFAULT_PAGE_SIZE = 10;
const COLUMNS = [
    {
        field: 'username',
        headerName: 'Username',
        type: 'username',
    },
    {
        field: 'dateAndTime',
        headerName: 'Date & Time',
        type: 'dateAndTime',
    },
    {
        field: 'status',
        headerName: 'Status',
        type: 'status',
    },
    {
        field: 'value',
        headerName: 'Value',
        type: 'value',
    },
];

export default function PayoutsPage({initialPageState,}: { initialPageState: PageState, }) {
    const initialFetch = useRef(true);
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 1000);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [loading, setLoading] = useState(false);
    const [pageState, setPageState] = useState<PageState>(initialPageState);
    const [showErrorSnackBar, setShowErrorSnackBar] = useState(false);
    const cacheGet = useCache<Payout[]>();
    const paginationMode: GridFeatureMode = !!searchText ? 'client' : 'server';
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPage(0);
        setSearchText(event.target.value);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            if (paginationMode === 'client') {
                const data = await cacheGet(searchText, async () => await searchPayouts(searchText));
                setPageState({
                    data: data,
                    total: data.length,
                });
            } else {
                const paginatedData: PayoutsWithMetadata = await paginatePayouts(page + 1, pageSize);
                setPageState({
                    data: paginatedData.data,
                    total: paginatedData.metadata.totalCount,
                });
            }
        } catch (error) {
            setShowErrorSnackBar(true);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialFetch.current) {
            initialFetch.current = false;
        } else {
            console.log('fetching');
            (async () => await fetchData())();
        }
    }, [page, pageSize, debouncedSearchText]);

    return <div>
        {/*TODO styled + Alert */}
        {showErrorSnackBar && <Snackbar
            open
            autoHideDuration={6000}
            onClose={() => setShowErrorSnackBar(false)}
            message="Error completing your request!"
        />}
        <h1>Payouts</h1>
        <div style={{flexDirection: 'column', marginLeft: '40px', marginRight: '40px'}}>
            <div id='subContainer' style={{display: 'flex'}}>
                <div style={{display: 'flex', flexDirection: 'row', flex: '1', alignItems: 'center'}}>
                    <div style={{
                        backgroundColor: 'rgba(153, 157, 255, 1)',
                        width: '18px',
                        height: '35px',
                        borderRadius: '3px',
                        marginRight: '15px'
                    }}></div>
                    <h4>Payout History</h4>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', flex: '1', justifyContent: 'flex-end'}}>
                    <TextField
                        data-role="searchbox"
                        size='small'
                        id="filled-search"
                        label="Search username"
                        type="search"
                        variant="outlined"
                        value={searchText}
                        onChange={handleSearchChange}
                        autoComplete='off'
                    />
                </div>
            </div>
            <StyledDataGrid
                data-testid="payouts-grid"
                columns={COLUMNS}
                data-role="grid"
                rows={pageState.data ?? []}
                rowCount={pageState.total}
                paginationMode={paginationMode}
                paginationModel={{page, pageSize}}
                getRowId={(row) => row.id}
                onPaginationModelChange={(({page, pageSize}) => {
                    setPage(page);
                    setPageSize(pageSize);
                })}
                loading={loading}
            />
        </div>
    </div>;
};
