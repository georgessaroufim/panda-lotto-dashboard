import React from 'react'
import { PieChart, Pie, Cell } from 'recharts';
import { Box, Typography } from '@mui/material';
import I18nManager from '../../../core/I18nManager/I18nManager';
import { getNumberWithFloat } from '../../../core/common-service/CommonService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#5bc0de', '#d9534f'];
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    return (
        `${getNumberWithFloat(percent * 100, 1)}%`
    );
};

const OrdersPieChartStatistic = ({ data, title }) => {
    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom variant="overline" sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
            </Box>
            <PieChart width={350} height={350}>
                <Pie label={renderCustomizedLabel} data={data}
                    cx="50%" cy="50%" paddingAngle={7}
                    outerRadius={100} dataKey="total_orders">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                </Pie>
            </PieChart>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {data.map((item, index) => (
                    <Box key={index} sx={{
                        p: 1, mr: 1, mb: 1, borderRadius: 5, bgcolor: COLORS[index],
                        fontWeight: 'bold', fontSize: 12,
                    }}>
                        {item?.[I18nManager.isRTL() ? "nameAr" : "nameEn"]}
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default OrdersPieChartStatistic