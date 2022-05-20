import React, { useState, } from 'react';
import { gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector, } from '@mui/x-data-grid';
import { Chip, Pagination, Menu, MenuItem, } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon, } from '@mui/icons-material';

const DatatablePagination = ({ onItemClick, rowsPerPageOptions }) => {
    const [data, setData] = useState(rowsPerPageOptions)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onClick = (index) => (e) => {
        e.preventDefault()
        setAnchorEl(null);
        var tmpData = [...data]
        data.forEach((element, i) => {
            element.active = i == index
        });
        setData(tmpData)
        onItemClick(data[index].value)
    };

    const onChange = (event, value) => {
        apiRef.current.setPage(value - 1)
    }

    const getActiveMenuItem = () => {
        return data.find(el => el.active)?.value
    }

    return (
        <div style={{ display: 'flex' }}>
            <Chip icon={<KeyboardArrowDownIcon />} label={getActiveMenuItem()}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick} />
            <Menu anchorEl={anchorEl} open={open}
                onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button', }}>
                {data.map((item, index) => (
                    <MenuItem key={index} onClick={onClick(index)}>{item.value}</MenuItem>
                ))}
            </Menu>
            <Pagination
                color="primary"
                count={pageCount}
                page={page + 1}
                onChange={onChange}
            />
        </div>
    );
}

export default DatatablePagination