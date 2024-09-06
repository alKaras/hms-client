import React from 'react';
import ContentAdminStyle from './ContentAdmin.module.scss';
import {BarChart} from '@mui/x-charts/BarChart';
import {LineChart} from "@mui/x-charts";

export default function ContentAdmin(props) {
    return (
        <>
            <div className={ContentAdminStyle.root}>
                <div className={ContentAdminStyle.cardContent}>
                    <div className={ContentAdminStyle.card}>
                        <div className={ContentAdminStyle.number}>123</div>
                        <div className={ContentAdminStyle.desc}>Доступних клієнтів</div>
                    </div>
                    <div className={ContentAdminStyle.card}>
                        <div className={ContentAdminStyle.number}>40</div>
                        <div className={ContentAdminStyle.desc}>відвідувань на день</div>
                    </div>
                    <div className={ContentAdminStyle.card}>
                        <div className={ContentAdminStyle.number}>5</div>
                        <div className={ContentAdminStyle.desc}>Рейтинг лікарні</div>
                    </div>
                </div>
                    <LineChart
                        xAxis={[{data: [1, 2, 3, 5, 8, 10]}]}
                        series={[
                            {
                                data: [2, 5.5, 2, 8.5, 1.5, 5],
                            },
                        ]}
                        width={1000}
                        height={300}
                    />
            </div>
        </>
    );
}
