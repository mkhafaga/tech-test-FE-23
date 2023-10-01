'use client'
import React from 'react';
import {ChangeEvent, useEffect, useRef, useState} from 'react';
import {PageState, Payout, PayoutsWithMetadata} from './types';
import {paginatePayouts, searchPayouts} from './services/PayoutsService';
import StyledDataGrid from './components/StyledDataGrid';
import {useDebounce} from './hooks/useDebounce';
import {GridFeatureMode} from "@mui/x-data-grid";
import {Snackbar, Alert} from "@mui/material";
import useCache from "./hooks/useCache";
import StyledHeader from "@/app/components/StyledHeader";
import StyledRootBox from "@/app/components/StyledRootBox";
import WidgetTitle from "@/app/components/WidgetTitle";
import StyledSearchField from "@/app/components/StyledSearchField";
import {COLUMNS} from '@/app/utils/tableCoumns'
import SubContainer from "@/app/components/SubContainer";

const DEFAULT_DEBOUNCE_TIME: number = 1000;
const DEFAULT_PAGE_SIZE: number = 10;
const DEFAULT_PAGE_INDEX: number = 0;


export default function PayoutsPage({initialPageState,}: { initialPageState: PageState, }) {
    const initialFetch = useRef(true);
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, DEFAULT_DEBOUNCE_TIME);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [loading, setLoading] = useState(false);
    const [pageState, setPageState] = useState<PageState>(initialPageState);
    const [showErrorSnackBar, setShowErrorSnackBar] = useState(false);
    const cacheGet = useCache<Payout[]>();
    const paginationMode: GridFeatureMode = !!searchText ? 'client' : 'server';
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPage(DEFAULT_PAGE_INDEX);
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
            (async () => await fetchData())();
        }
    }, [page, pageSize, debouncedSearchText]);

    return (<>
        {showErrorSnackBar && <Snackbar open autoHideDuration={6000} onClose={() => setShowErrorSnackBar(false)}>
            <Alert severity="error">Error completing your request!</Alert>
        </Snackbar>}
        <StyledHeader value='Payouts' />
        <StyledRootBox>
            <SubContainer>
                <WidgetTitle />
                <StyledSearchField value={searchText} onChange={handleSearchChange}/>
            </SubContainer>
            <StyledDataGrid
                data-testid="payouts-grid"
                columns={COLUMNS}
                data-role="grid"
                rows={pageState.data ?? []}
                rowCount={pageState.total}
                paginationMode={paginationMode}
                paginationModel={{page, pageSize}}
                getRowId={(row) => row.id}
                onPaginationModelChange={({page, pageSize}) => {
                    setPage(page);
                    setPageSize(pageSize);
                }}
                loading={loading}
            />
        </StyledRootBox>
    </>);
};
