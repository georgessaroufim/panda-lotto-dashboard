import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Grid, Card, Divider, CardHeader, Box, List, ListItem, ListItemIcon, ListItemText, Checkbox, Button, Paper } from '@mui/material';
import I18nManager from '../../../core/I18nManager/I18nManager';
import useDialog from '../../_hooks/dialog-hook/useDialog';

const not = (a, b) => {
    return a.filter((value) => b.indexOf(value) === -1);
}

const intersection = (a, b) => {
    return a.filter((value) => b.indexOf(value) !== -1);
}

const union = (a, b) => {
    return [...a, ...not(b, a)];
}

const OrderingTransferListDialog = forwardRef(({ data, onDisagreeClick, onAgreeClick }, ref) => {
    const mounted = useRef(true)
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState(data);
    const [right, setRight] = useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const [ReorderDialogPopup, openReorderDialog, closeReorderDialog] = useDialog({
        title: I18nManager.isRTL() ? "إعادة الترتيب.." : "Reordering.."
    })

    useImperativeHandle(ref, () => ({
        call_openReorderDialog() {
            openReorderDialog()
        },
        call_closeReorderDialog() {
            closeReorderDialog()
        },
    }), [])

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedAllRight = () => {
        setRight(right.concat(left));
        setLeft(not(left, left));
        setChecked(not(checked, left));
    }

    const handleCheckedAllLeft = () => {
        setLeft(left.concat(right));
        setRight(not(right, right));
        setChecked(not(checked, right));
    }

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title, items) => (
        <Card>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{ width: 200, height: 230, bgcolor: 'background.paper', overflow: 'auto', }}
                dense component="div" role="list">
                {items.map((value, index) => {
                    return (
                        <ListItem key={index} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox checked={checked.indexOf(value) !== -1} tabIndex={-1} disableRipple />
                            </ListItemIcon>
                            <ListItemText primary={value?.[I18nManager.isRTL() ? "titleEn" : "titleEn"]} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    const _onAgreeClick = () => {
        handleCheckedAllRight()
        setTimeout(() => {
            onAgreeClick(right.concat(left))
        }, 100)
    }

    useEffect(() => {
        mounted.current = true
        if (mounted.current) {
            setLeft(data)
        }
        return () => {
            mounted.current = false
        };
    }, [data]);

    return (
        <ReorderDialogPopup children={
            <Box>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item>{customList(I18nManager.isRTL() ? "الترتيب القديم" : "Old Order", left)}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedAllRight}
                                disabled={left.length === 0}
                                aria-label="move all right"
                            >
                                ≫
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedRight}
                                disabled={leftChecked.length === 0}
                                aria-label="move selected right"
                            >
                                &gt;
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedLeft}
                                disabled={rightChecked.length === 0}
                                aria-label="move selected left"
                            >
                                &lt;
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedAllLeft}
                                disabled={right.length === 0}
                                aria-label="move all left"
                            >
                                ≪
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>{customList(I18nManager.isRTL() ? "الترتيب الجديد" : "New Order", right)}</Grid>
                </Grid>
                <Grid sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onDisagreeClick}>{I18nManager.isRTL() ? "لا أوافق" : "Disagree"}</Button>
                    <Button onClick={_onAgreeClick} autoFocus>{I18nManager.isRTL() ? "أوافق" : "Agree"}</Button>
                </Grid>
            </Box>
        } />
    );
})

export default OrderingTransferListDialog