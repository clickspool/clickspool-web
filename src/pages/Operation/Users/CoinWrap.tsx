// tslint:disable-next-line:ordered-imports
import React,{ useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { Input, Select } from 'antd';
import styles from './coinwrap.less';

const { Option } = Select;


export default function CoinWrap(props):any{

	const selectBefore = (
			<Select defaultValue="1" style={{ width: 90 }}>
					<Option value="1">+</Option>
					<Option value="0">-</Option>
			</Select>
	);
	const coinData=[
		{
			name:'clickspool币',
		},
		{
			name:'钻石',
		}
	]

		return (
			<>
			{
				coinData.map((item,index)=>	{
					// tslint:disable-next-line:jsx-key
					return (<div className={styles.input_wrap} key={index}>
														<div className={styles.input_lebal}>
															{item.name}：
														</div>
														<div className={styles.input_left}>
															<Input value={	111	}  disabled={true} />
														</div>
														<div className={styles.input_right}>
															<Input addonBefore={selectBefore} value=	"mysite" />
														</div>
														<div className={styles.input_lebal_end}>
																		=	4000
														</div>
												</div>)
				})
			}
				
			</>
		)
}