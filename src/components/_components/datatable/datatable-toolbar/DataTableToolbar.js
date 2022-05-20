import React, { useState } from 'react'
import { Grid, Box, TextField, Button, DialogContentText } from '@mui/material'
import I18nManager from '../../../../core/I18nManager/I18nManager'
import useDialog from '../../../_hooks/dialog-hook/useDialog';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DataTableToolbar = ({ onSearchInputChange, onSearchByDate, onCreateButtonClick, filter_data, selectedRows, onDeleteDialogAgreePress }) => {

    const [filter, setFilter] = useState(filter_data)

    const [DeleteDialogPopup, openDeleteDialog, closeDeleteDialog] = useDialog({
        title: I18nManager.isRTL() ? "في انتظار حذف السجلات .." : "Awaiting deleteing records.."
    })

    const onStartDateChange = (value) => {
        if (new Date(filter.endDate) > new Date(value)) {
            setFilter({ ...filter, startDate: value })
        }
    };
    const onEndDateChange = (value) => {
        if (new Date(value) > new Date(filter.startDate)) {
            setFilter({ ...filter, endDate: value })
        }
    };

    const _onSearchByDate = () => {
        onSearchByDate(filter)
    }

    const _onDeleteDialogAgreePress = () => {
        closeDeleteDialog()
        onDeleteDialogAgreePress()
    }

    return (
        <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item lg={2} xs={12}>
                <TextField
                    onChange={onSearchInputChange}
                    label={I18nManager.isRTL() ? "بحث" : "Search"} variant="standard" />
            </Grid>
            <Grid item lg={8} xs={12} sx={{ display: 'flex' }}>
                <DatePicker
                    label={I18nManager.isRTL() ? "تاريخ البدء" : "Start Date"}
                    value={new Date(filter.startDate)}
                    onChange={onStartDateChange}
                    renderInput={(params) => <TextField {...params} />}
                />
                <Box sx={{ mx: 1 }}>
                    <DatePicker
                        label={I18nManager.isRTL() ? "تاريخ الانتهاء" : "End Date"}
                        value={new Date(filter.endDate)}
                        onChange={onEndDateChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Box>
                <Button onClick={_onSearchByDate} variant="contained">{I18nManager.isRTL() ? "بحث" : "Search"}</Button>
            </Grid>
            <Grid item lg={2} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button sx={{ mr: 1 }} disabled={selectedRows?.length == 0} onClick={openDeleteDialog} color="error" variant="contained">{I18nManager.isRTL() ? "حذف" : "Delete"}</Button>
                <Button onClick={onCreateButtonClick} color="success" variant="contained">{I18nManager.isRTL() ? "إنشاء" : "Create"}</Button>
            </Grid>
            <DeleteDialogPopup children={
                <DialogContentText>
                    {I18nManager.isRTL() ? "هل أنت متأكد من حذف هذه السجلات؟" : "Are you sure to delete these records?"}
                </DialogContentText>}
                actions={
                    <>
                        <Button onClick={closeDeleteDialog}>{I18nManager.isRTL() ? "لا أوافق" : "Disagree"}</Button>
                        <Button onClick={_onDeleteDialogAgreePress} autoFocus>{I18nManager.isRTL() ? "أوافق" : "Agree"}</Button>
                    </>
                }
            />
        </Grid>
    )
}
export default DataTableToolbar