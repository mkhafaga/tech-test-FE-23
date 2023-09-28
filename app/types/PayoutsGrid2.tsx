'use client'
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const columns = [
    { field: 'username', headerName: 'User', width: 70, flex: 1 },
    { field: 'value', headerName: 'Value', width: 130, flex: 1 },
    { field: 'dateAndTime', headerName: 'Date & Time', width: 130, flex: 1 },
    { field: 'status', headerName: 'Status', width: 130, flex: 1 },
];

const PayoutsGrid2 = () => {
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
            console.log('SEARCH MODE')
            setPageState(old => ({ ...old, isLoading: true }))
            const response = await fetch(`https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/search?query=${pageState.searchText}`)
            const json = await response.json();
            console.log(`json is ${JSON.stringify(json)}`);
            setPageState(old => ({ ...old, isLoading: false, data: json/*, data: json.data, total: json.metadata.totalCount*/ }))


        }
        fetchData()
    }, [pageState.page, pageState.pageSize, pageState.searchText])

    return (
        <div>
            PayoutsGrid
            <TextField
                id="filled-search"
                label="Search field"
                type="search"
                variant="filled"
                value={pageState.searchText}
                onChange={(e) => {
                    console.log(`e.target.value is ${e.target.value}`);
                    setPageState(old => ({ ...old, searchText: e.target.value }))
                }}
            />
            <Container style={{ marginTop: 100, marginBottom: 100 }}>
                <DataGrid
                    autoHeight
                    rows={pageState.data ?? []}
                    // rowCount={pageState.total}
                    loading={pageState.isLoading}
                    pageSizeOptions={[10, 30, 50, 70, 100]}
                    pagination
                    paginationMode={'client'}
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



export default PayoutsGrid2;