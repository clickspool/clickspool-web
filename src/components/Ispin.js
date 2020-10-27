import { connect } from 'dva';

import {
  Spin
} from 'antd';

import React from 'react';

import ReactDOM from 'react-dom';

import styles from './ispin.less';

const Ispin = ({spinning}) => {
  return <div 
            className={styles.spinnig_box}  style={{display:spinning?'block':'none'}}>
              <Spin className={styles.wrapper}  tip="Loading..." />
          </div>
     
}

const mapStateToProps = ({
  global:{
    spinning
  }
}) => ({spinning})

export default connect(mapStateToProps)(Ispin)
