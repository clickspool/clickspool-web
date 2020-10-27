import { type, removeObjUndefined } from '@/utils/utils';
import {exportMaterialStat} from '@/services/activity';

import { connect } from 'dva';
import apiConfig from '@/utils/apiConfig';
import { getAuthority } from '@/utils/authority';
import {
  Input,
  Breadcrumb,
  Icon,
  Button,
  Pagination,
  Popover,
  Table,
  Form,
  Row,
  Col,
  Card,
  Select,
  DatePicker,
  Modal,
  Radio 
} from 'antd';

import React, { PureComponent } from 'react';
import echarts from 'echarts';

import _ from 'lodash';

import { formatMessage } from 'umi/locale';

import { operationEnum, getKey } from '../../../config/role.enum';

import styles from './Push.less';

const moment = require('moment');
const { Option } = Select;
const { RangePicker } = DatePicker;
const Search = Input.Search;


const dateFilter={
    today:{begin_date:moment().format('YYYY-MM-DD'),end_date:moment().format('YYYY-MM-DD')},
    yesterday:{begin_date:moment().add('day',-1).format('YYYY-MM-DD'),end_date:moment().add('day',-1).format('YYYY-MM-DD')},
    lastweek:{begin_date:moment().add('day',-7).format('YYYY-MM-DD'),end_date:moment().format('YYYY-MM-DD')},
    last30days:{begin_date:moment().add('day',-30).format('YYYY-MM-DD'),end_date:moment().format('YYYY-MM-DD')},
    month:{begin_date:moment().format('YYYY-MM-DD').replace(/^(\d{4}-\d{2}-)\d+/,"$101"),end_date:moment().format('YYYY-MM-DD')},
}

@Form.create()
@connect(
  ({
    activity: { data:{list},xList,pv,uv,rate },
    routing: {
      location: { pathname,query:{id,line_id} },
    },
    memberInfo: {
      data: { keys },
    },
  }) => ({
    id,
    line_id,
    list,
    keys,
    xList,pv,uv,rate,
    pathname,
  })
)
class Push extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        filters:'lastweek',
        filtersDatePicker:[],
        begin_date:dateFilter['lastweek']['begin_date'],
        end_date:dateFilter['lastweek']['end_date'],
    };
    this.myChart =null;
  }
  handleRadioGroup=(ev)=>{
    const v = ev.target.value
      this.setState({
        filters:v,
        begin_date:dateFilter[v]['begin_date'],
        end_date:dateFilter[v]['end_date'],
        filtersDatePicker:[]
    },()=>{
      this.updataConfiList()
    });
  }
  componentDidMount() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    const { dispatch,id } = this.props;
    dispatch({
      type: 'activity/getLineList',
    });
    dispatch({
      type: 'activity/getStatusList',
    });
    dispatch({
      type: 'activity/getList',
      payload: {id},
    });
    this.updataConfiList();
    // this.drawCharts();
  }
  updataConfiList=()=> {
    const {id, line_id,dispatch} = this.props;
    const {begin_date, end_date} = this.state;
    dispatch({
      type: 'activity/getMaterialStat',
      payload: {banner_id:id,line_id,begin_date,end_date},
    })
    .then(()=>{
      this.drawCharts();
    })
  }
  drawCharts=()=>{
    const { xList,pv,uv,rate} =this.props;
    if(!xList.length){
      this.myChart = null;
      return;
    }
    this.myChart = null;
    this.myChart = echarts.init(document.getElementById('echart-box'));
    var option = {
        color: ["#4285f4","#ec5a4e", "#fbbc05"],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data:['PV','UV','转化率(%)'],
        },
        xAxis: {
            data: xList,
            nameLocation:'end',//坐标轴名称显示位置。
            axisLabel : {//坐标轴刻度标签的相关设置。
                interval:0,
                rotate:"45"
            }
        },
        yAxis:[{
            type: 'value',
            name: '访问数',
            axisLabel: {
            formatter: '{value}'
             }
            },{
            type: 'value',
            name: '转化率',
            min: 0,
            max: 100,
             axisLabel: {
            formatter: '{value}%'
            }
            }],
            series: [{
            name: 'PV',
            type:'bar',
            barGap: '40%',
            data: pv
            },{
            name: 'UV',
            type:'bar',
            barGap: '40%',
            data: uv
            },{
            name: '转化率(%)',
            type: 'line',
            yAxisIndex: 1,
            data: rate
        }]
    }
    this.myChart.setOption(option);
  }

  onChangePicker=(item)=>{
      const filters = [moment(item[0]).format('YYYY-MM-DD'),moment(item[1]).format('YYYY-MM-DD')]
      this.setState({
        filters:'',
        filtersDatePicker:item,
        begin_date:filters[0],
        end_date:filters[1],
      },()=>{
        this.updataConfiList();
      })
  }

  handleExport=()=>{
    const {id, line_id} = this.props;
    const {begin_date, end_date} = this.state;
    window.open(`${apiConfig}/admin/material/exportMaterialStat?token=${getAuthority()}&banner_id=${id}&line_id=${line_id}&begin_date=${begin_date}&end_date=${end_date}&_t=${+new Date()}`);  
    // exportMaterialStat({
    //   line_id,
    //   banner_id:id,
    //   begin_date,
    //   end_date
    // })
  }

  render() {
    const {
      data,
      form: { getFieldDecorator },
      list,
      keys,
      pathname,
      xList,pv,uv,rate
    } = this.props;
    const {filters,filtersDatePicker} = this.state;
    const gridStyle = {
      width: '25%',
      textAlign: 'left',
      height:'80px'
    };
    
    return (
      <div className="content-box">
        <style>
          {`
            .content-box .ant-form-vertical .ant-form-item{
              padding-bottom: 0px;
            }
            #echart-box{
              height:500px;
              background:#fff;
              box-shadow:none !important;
            }
          `}
        </style>
        <div className={styles.breadcrumbBox}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="lock" />
              <span>{formatMessage({ id: 'menu.operation' })}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{formatMessage({ id: 'menu.operation.suppliesdata' })}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.addBtn}>
          <Card title={formatMessage({ id: 'app.activity.info' })} className={styles.card} bordered>
            <Card.Grid style={gridStyle}>
              {formatMessage({ id: 'app.activity.name' })}：{list.length?list[0].name:''}
            </Card.Grid>
            <Card.Grid style={gridStyle}>{formatMessage({ id: 'app.activity.pic' })}：{list.length?(<img src={list[0].banner_image}  style={{height:'40px',width:'40px'}}/>):'' }</Card.Grid>
            <Card.Grid style={gridStyle}>{formatMessage({ id: 'app.activity.channelNo' })}：{list.length?list[0].sort:''}</Card.Grid>
            <Card.Grid style={gridStyle}>{formatMessage({ id: 'app.activity.channel' })}：{list.length?list[0].line_name:''}</Card.Grid>
            <Card.Grid style={gridStyle}>{formatMessage({ id: 'app.activity.channelAve' })}：{list.length?(<span>{list[0].line_percent}%</span>):''}</Card.Grid>
            <Card.Grid style={{...gridStyle, width: '50%'}}>{formatMessage({ id: 'app.activity.activitytime' })}：{list.length?(<span>{list[0].begin_time}{formatMessage({ id: 'app.activity.to' })}{list[0].end_time}</span>):''}</Card.Grid>
            <Card.Grid style={gridStyle}>{formatMessage({ id: 'app.activity.status' })}：{list.length?list[0].status_name:''}</Card.Grid>
          </Card>
        </div>
        <Card 
          title={formatMessage({ id: 'app.activity.qushi' })}
          className={styles.card} 
          extra={
            <span>
              <Radio.Group value={filters} buttonStyle="solid" onChange={this.handleRadioGroup.bind(this)}>
                <Radio.Button value="today">{formatMessage({ id: 'app.activity.today' })}</Radio.Button>
                <Radio.Button value="yesterday">{formatMessage({ id: 'app.activity.yestoday' })}</Radio.Button>
                <Radio.Button value="lastweek">{formatMessage({ id: 'app.activity.lastweek' })}</Radio.Button>
                <Radio.Button value="last30days">{formatMessage({ id: 'app.activity.last30days' })}</Radio.Button>
                <Radio.Button value="month">{formatMessage({ id: 'app.activity.month' })}</Radio.Button>
              </Radio.Group>
              <RangePicker style={{ width: '240px',marginLeft:"10px" }} onChange={this.onChangePicker} value={filtersDatePicker}/>
              <Button style={{ marginLeft:"10px" }} icon="upload" onClick={this.handleExport}>{formatMessage({ id: 'app.activity.export' })}</Button>
            </span>
          }
          bordered>
          <div id="echart-box">
              {!xList.length&&
                (<p style={{textAlign:'center',lineHeight:'500px'}}>
                  {formatMessage({ id: 'app.activity.noData' })}
                </p>)}
          </div>
        </Card>
       
      </div>
    );
  }
}
export default Push;
