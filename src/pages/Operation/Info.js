import { connect } from 'dva';

import { Card,Upload } from 'antd';

import React, { PureComponent, Fragment } from 'react';

import { formatMessage } from 'umi/locale';

import styles from './info.less';

import _ from 'lodash';

@connect(
  ({
    seed: { regionMap,languageMap},
  })=>(
    {regionMap,languageMap}
  ))
class Customer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  componentDidMount() {
   
  }
  handlePreview=(file)=>{
      this.props.handlePreview(file);
  }
  render() {
    const gridStyle = {
        width: '33.3%',
        textAlign: 'center',
      }
    const {infomatin,regionMap,languageMap}=this.props;
    const  platformEnum= {
        '1':'Android',
        '2':'Ios',
        '3':'Android',
        '4':'Other',
      }
      
    const sex= infomatin.sex==1?formatMessage({ id: 'app.seed.male' }):formatMessage({ id: 'app.seed.female' })
    let region = {};
          if(regionMap.length){
            region = regionMap.find((item)=>{
              return item.value ==infomatin.region
            })
    }
    let dialects = '';
          if(languageMap.length){
            dialects = languageMap.filter((item)=>{
              return (infomatin.dialects.split(',')).indexOf(item.value+'')>-1
            }).reduce((prev,curr)=>{
              prev = `${prev},${curr.name}`
              return prev
          },'');
          }
   
    const ImageList=({text})=>{
        if(text&&text.length){
            let fileList= text.reduce((prev,curr,index)=>{
                prev.push({
                 uid:index+'',
                 url: curr,
                 thumbUrl:curr,
               })
               return prev;
              },[])
             return <Upload
                       listType="picture-card"
                       fileList={fileList}
                       showUploadList={{
                         showPreviewIcon:true,
                         showRemoveIcon:false
                       }}
                       onPreview={this.handlePreview}>
                     </Upload>
           }
          
           return '';
    }
    return (
      <Fragment>
          <Card>
            <Card.Grid style={gridStyle}>id:{infomatin.id} </Card.Grid>
            <Card.Grid style={gridStyle}><span className={styles.bold}>{formatMessage({ id: 'app.seed.name' })}:</span>{infomatin.name} </Card.Grid>
            <Card.Grid style={gridStyle}><span className={styles.bold}>{formatMessage({ id: 'app.seed.telephone' })}:</span>{infomatin.telephone}</Card.Grid>
            <Card.Grid style={gridStyle}><span className={styles.bold}>{formatMessage({ id: 'app.seed.sex' })}:</span>{sex}</Card.Grid>
            <Card.Grid style={gridStyle}><span className={styles.bold}>{formatMessage({ id: 'app.seed.age' })}:</span>{infomatin.age}</Card.Grid>
            <Card.Grid style={gridStyle}><span className={styles.bold}>Email:</span>{infomatin.email}</Card.Grid>
            <Card.Grid style={gridStyle}><span className={styles.bold}>Facebook_id:</span>{infomatin.facebook_id}</Card.Grid>
            <Card.Grid style={gridStyle}><span className={styles.bold}>{formatMessage({ id: 'app.seed.state' })}:</span>{region['name']}</Card.Grid>
            <Card.Grid style={gridStyle}><span className={styles.bold}>{formatMessage({ id: 'app.seed.lanage' })}:</span>{dialects.substring(1,dialects.length-1)}</Card.Grid>
            <Card.Grid style={gridStyle}><span className={styles.bold}>{formatMessage({ id: 'app.seed.create_at' })}:</span>{infomatin.create_at}</Card.Grid>
            <Card.Grid style={gridStyle}><span className={styles.bold}>{formatMessage({ id: 'app.seed.update_at' })}:</span>{infomatin.update_at}</Card.Grid>
            <Card.Grid style={gridStyle}><span className={styles.bold}>{formatMessage({ id: 'app.seed.platform' })}:</span>{platformEnum[infomatin.platform]}</Card.Grid>
        </Card>
        <Card title={formatMessage({ id: 'app.seed.screens' })} bordered={false}>
                <ImageList text={infomatin.screens}/>
        </Card>
      </Fragment>
       
    );
  }
}
export default Customer;
