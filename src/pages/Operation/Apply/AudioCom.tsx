
 import React, { useState } from 'react';
 import styles from './audio.less';

 export default function AudioCom(props){
  let voice = null
  const [bofang,setBofang] = useState(false)
  return <div className={styles.add_yuyin} onClick={() => {
    setBofang(true)
    if(voice){
      voice.pause();
    }
    voice = new Audio(props.sound);
    voice.loop = false;
    voice.addEventListener('ended', ()=> {  
      voice.pause();
    }, false);
    voice.play();
  }}>
    <div className={styles.r_yuyin}>
        {props.duration||0}'' <s className={bofang?styles.bofang:''} />
    </div>
  </div>
}