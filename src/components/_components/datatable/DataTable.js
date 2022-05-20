import React, { useEffect, useState, useRef, } from 'react';
import './DataTable.css'
import { useNavigate } from 'react-router-dom'
import { DataGrid, } from '@mui/x-data-grid';
import { IconButton, } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import I18nManager from '../../../core/I18nManager/I18nManager';
import DataTableToolbar from './datatable-toolbar/DataTableToolbar';
import dayjs from 'dayjs'
import DatatableLoadingOverlay from './datatable-loading-overlay/DatatableLoadingOverlay';
import DatatablePagination from './datatable-pagination/DatatablePagination';

const rowsPerPageOptions = [
    { value: 15, active: true },
    { value: 50, active: false },
    { value: 100, active: false },
    // { value: 'All', active: false },
]

const DataTable = ({
    data, columns, loading,
    onPageChangeProp, onRowClick, onCreateButtonClick, onDeleteDataTableRows,
}) => {
    const [pageSize, setPageSize] = useState(rowsPerPageOptions[0].value);
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState({
        startDate: dayjs(new Date()).subtract(1, 'month').format('YYYY-MM-DD'),
        endDate: dayjs(new Date()).add(1, 'day').format('YYYY-MM-DD'),
        sortBy: { field: 'id', sort: 'desc' }
    })
    const [selectedRows, setSelectedRows] = useState([])
    const mounted = useRef(true)
    const inputChangeTimeOut = useRef(null)
    let navigate = useNavigate()

    const onPageChange = (p) => {
        setPage(p)
        try {
            if (window.location.pathname.length > 3) {
                navigate('/' + window.location.pathname.split('/').pop() + '?p=' + (p + 1))
            }
        } catch (error) { }
    }

    const onPageSizeChange = (pSize) => {
        setPageSize(pSize)
    }

    const onMenuItemClick = (val) => {
        setPageSize(val)
    }

    const onSearchInputChange = (e) => {
        clearTimeout(inputChangeTimeOut.current)
        inputChangeTimeOut.current = setTimeout(() => {
            onPageChangeProp({ page: page + 1, pageSize, query: e.target.value, ...filter })
        }, 1000);
    }

    const onSortModelChange = (e) => {
        setFilter({ ...filter, sortBy: e[0] })
    }

    const onDeleteDialogAgreePress = () => {
        onDeleteDataTableRows({
            page: page + 1, pageSize, ...filter,
            id: selectedRows, action: 'delete',
        })
    }

    const onEditClick = (params) => () => {
        onRowClick(params)
    }

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (mounted.current) {
            const p = parseInt(urlParams.get('p'))
            if (!isNaN(p) && p > 0) {
                setPage(p - 1)
            }
        }
        return () => {
            mounted.current = false
        }
    }, [])

    useEffect(() => {
        if (mounted.current) {
            let tmp_f = { page: page + 1, pageSize, ...filter }
            onPageChangeProp(tmp_f)
            sessionStorage.setItem('datatable-filter', JSON.stringify(tmp_f))
        }
    }, [page, pageSize, filter])

    const columnHeaderStyle = {
        otherColumns: {
            flex: 1
        },
        avatarColumn: {
            width: 70,
            minWidth: 70,
            maxWidth: 70
        },
        firstColumn: {
            width: 50,
            minWidth: 50,
            maxWidth: 50
        }
    }

    const newCol = [{
        field: 'index', headerName: '#', renderCell: (params) => (
            (page * pageSize) + (params.api.getRowIndex(params.row.id) + 1)
        )
    }, ...columns,
    {
        field: "action", headerName: "-", sortable: false, headerAlign: 'center',
        renderCell: (params) => (
            <IconButton onClick={onEditClick(params)}>
                <EditIcon />
            </IconButton>
        )
    }].map(v => ({ ...v }, (v.field == 'id' || v.field == 'index' || v.field == 'action') ?
        { ...v, ...columnHeaderStyle.firstColumn } :
        (v.headerName == (I18nManager.isRTL() ? "الصورة" : "Avatar") ?
            { ...v, ...columnHeaderStyle.avatarColumn } :
            { ...v, ...columnHeaderStyle.otherColumns })
    ))

    return (
        <div style={{ width: '100%' }}>
            <DataTableToolbar
                filter_data={filter}
                onSearchInputChange={onSearchInputChange}
                onCreateButtonClick={onCreateButtonClick}
                onSearchByDate={setFilter}
                selectedRows={selectedRows}
                onDeleteDialogAgreePress={onDeleteDialogAgreePress}
            />
            <DataGrid
                columns={newCol || []}
                rows={data?.data || []}
                rowCount={data?.total || 0}
                page={page}
                onPageChange={onPageChange}
                pageSize={pageSize}
                onPageSizeChange={onPageSizeChange}
                // rowsPerPageOptions={rowsPerPageOptions}
                getCellClassName={(params) => { return "datagrid-cell" }}
                rowHeight={60}
                onSortModelChange={onSortModelChange}
                // onRowClick={onRowClick}
                autoHeight
                pagination
                paginationMode="server"
                hideFooterPagination={loading}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={setSelectedRows}
                loading={loading}
                components={{
                    LoadingOverlay: () => <DatatableLoadingOverlay />,
                    Pagination: () => <DatatablePagination
                        rowsPerPageOptions={rowsPerPageOptions}
                        onItemClick={onMenuItemClick} />,
                }}
            />
        </div>
    );
}

export default DataTable