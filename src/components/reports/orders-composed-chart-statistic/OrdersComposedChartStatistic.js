import React from 'react'
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, Legend, } from 'recharts';
import I18nManager from '../../../core/I18nManager/I18nManager';

const OrdersComposedChartStatistic = ({ data }) => {
    return (
        <ComposedChart
            layout="vertical"
            width={500}
            height={400}
            data={data}>
            <XAxis type="number" />
            <YAxis dataKey={I18nManager.isRTL() ? "firstNameAr" : "firstNameEn"} type="category" scale="band" />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed_orders" stackId="a" barSize={15} fill="#82ca9d" />
            <Bar dataKey="total_orders" stackId="a" barSize={15} fill="#413ea0" />
        </ComposedChart>
    )
}

export default OrdersComposedChartStatistic