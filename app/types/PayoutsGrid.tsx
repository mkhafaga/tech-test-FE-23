'use client'
import Container from "@mui/material/Container";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const columns = [
    { field: 'username', headerName: 'User', width: 70, flex: 1 },
    { field: 'value', headerName: 'Value', width: 130, flex: 1 },
    { field: 'dateAndTime', headerName: 'Date & Time', width: 130, flex: 1 },
    { field: 'status', headerName: 'Status', width: 130, flex: 1 },
];

const PayoutsGrid = () => {
    const [pageState, setPageState] = useState({
        isLoading: false,
        data: [],
        total: 0,
        page: 0,
        pageSize: 10,
        mode: 'list',
        searchText: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            if (pageState.mode === 'list') {
                console.log('LIST MODE')
                setPageState(old => ({ ...old, isLoading: true }))
                const response = await fetch(`https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts?page=${pageState.page + 1}&limit=${pageState.pageSize}`)
                const json = await response.json();
                console.log(`json is ${JSON.stringify(json)}`);
                setPageState(old => ({ ...old, isLoading: false, data: json.data, total: json.metadata.totalCount }))
            } else {
                console.log('SEARCH MODE')
                setPageState(old => ({ ...old, isLoading: false }))
            }

        }
        fetchData()
    }, [pageState.page, pageState.pageSize])

    return (
        <div>
            PayoutsGrid
            <Container style={{ marginTop: 100, marginBottom: 100 }}>
                <DataGrid
                    autoHeight
                    rows={pageState.data}
                    rowCount={pageState.total}
                    loading={pageState.isLoading}
                    pageSizeOptions={[10, 30, 50, 70, 100]}
                    pagination
                    paginationMode={pageState.mode === 'list' ? 'server' : 'client'}
                    getRowId={(row) => row.username}
                    onPaginationModelChange={(newModel) => {
                        console.log('Does the model change??!');
                        console.log(`newModel is ${JSON.stringify(newModel)}`);
                        setPageState(old => ({ ...old, page: newModel.page, pageSize: newModel.pageSize }))
                    }}
                    paginationModel={{ page: pageState.page, pageSize: pageState.pageSize }}
                    columns={columns}
                />
            </Container>
        </div>
    );
};



export default PayoutsGrid;