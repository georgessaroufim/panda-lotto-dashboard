import React from 'react'
import { Box, Grid, Typography } from '@mui/material';

const OrderCardStatistic = ({ title, bgcolor, buttonText }) => {
    return (
        <Box sx={{ boxShadow: 3, p: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom variant="overline" sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
            </Box>
            <Grid sx={{ mt: 1, p: 1, bgcolor, borderRadius: 1, textAlign: 'center', color: 'black' }}>
                <Typography color="black" gutterBottom variant="span">
                    {buttonText}
                </Typography>
            </Grid>
        </Box>
    )
}
export default OrderCardStatistic