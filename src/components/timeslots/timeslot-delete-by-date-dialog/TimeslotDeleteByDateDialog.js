import React, { forwardRef, Fragment, useState, useImperativeHandle } from 'react'
import dayjs from 'dayjs'
import useDialog from '../../_hooks/dialog-hook/useDialog'
import { Grid, ToggleButton, ToggleButtonGroup, TextField, Button, DialogContentText } from '@mui/material'
import I18nManager from '../../../core/I18nManager/I18nManager'
import { daysOfTheWeek } from '../../../core/constants/constants';

const TimeslotDeleteByDateDialog = forwardRef(({ onDeleteDialogAgreePress }, ref) => {

    const [selectedDays, setSelectedDays] = useState([]);
    const [filter, setFilter] = useState({
        deleteStartDate: dayjs(new Date()).subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ss'),
        deleteEndDate: dayjs(new Date()).add(1, 'day').format('YYYY-MM-DDTHH:mm:ss'),
    })
    const [DeleteDialogPopup, openDeleteDialog, closeDeleteDialog] = useDialog({
        title: I18nManager.isRTL() ? "في انتظار حذف السجلات .." : "Awaiting deleteing records.."
    })

    useImperativeHandle(ref, () => ({
        call_openDeleteDialog() {
            openDeleteDialog()
        },
        call_closeDeleteDialog() {
            closeDeleteDialog()
        }
    }), [])

    const handleDaysOfTheWeek = (event, days) => {
        if (days.length) {
            setSelectedDays(days);
        }
    };

    const onDateChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'deleteStartDate':
                if (new Date(filter.deleteEndDate) > new Date(value)) {
                    setFilter({ ...filter, [name]: value })
                }
                break;
            case 'deleteEndDate':
                if (new Date(value) > new Date(filter.deleteStartDate)) {
                    setFilter({ ...filter, [name]: value })
                }
                break
            default:
                break;
        }
    };

    return (
        <DeleteDialogPopup children={
            <Fragment>
                <DialogContentText>
                    {I18nManager.isRTL() ? "هل أنت متأكد من حذف هذه السجلات؟" : "Are you sure to delete these records?"}
                </DialogContentText>
                <Grid item xs={12} sx={{ my: 2 }}>
                    <ToggleButtonGroup
                        value={selectedDays}
                        onChange={handleDaysOfTheWeek}>
                        {daysOfTheWeek.map((item, index) => (
                            <ToggleButton key={index} value={index} aria-label={item.title}>
                                {item.title}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex' }}>
                    <TextField
                        fullWidth
                        label={I18nManager.isRTL() ? "تاريخ البدء" : "Start Date"}
                        type="datetime-local"
                        name="deleteStartDate"
                        value={filter.deleteStartDate}
                        onChange={onDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        sx={{ mx: 1 }}
                        fullWidth
                        label={I18nManager.isRTL() ? "تاريخ الانتهاء" : "End Date"}
                        type="datetime-local"
                        name="deleteEndDate"
                        value={filter.deleteEndDate}
                        onChange={onDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
            </Fragment>}
            actions={
                <>
                    <Button onClick={closeDeleteDialog}>{I18nManager.isRTL() ? "لا أوافق" : "Disagree"}</Button>
                    <Button onClick={onDeleteDialogAgreePress({ filter, selectedDays })} autoFocus>{I18nManager.isRTL() ? "أوافق" : "Agree"}</Button>
                </>
            }
        />
    )
})

export default TimeslotDeleteByDateDialog