import React, { useEffect, useRef, useState } from 'react';
import CalcAudio from './CalcAudio'
import { Row, Col, Button,Icon } from 'antd';

function isAssetTypeAnAudio(ext) {
 return [
 'mp3','acc'].
  some((item) =>{
    return (ext.toLowerCase()).indexOf(item)>-1;
  })
}

function UploadImage(props) {

 const { onUpload, url, defaulturl} = props;
 const inputRef = useRef();
 const onUploadChange = ()=>{
  const MouseEvents=document.createEvent("MouseEvents");
   MouseEvents.initEvent("click", true, true);
   inputRef.current.value = null;
   inputRef.current.dispatchEvent(MouseEvents);
 }

 const onChange = (evt) => {
  const file = inputRef.current.files[0];

  if(!isAssetTypeAnAudio(file.type)){
    props.onUpload({msg:'格式不正确'});
    return
  }
  new CalcAudio(file,1)
  .then((res)=>{
    props.onUpload({...res,code:0});
  })
 }

 return (
  <>
  <Row type="flex">
      <Col style={{width:'150px'}}>
         <input type="file" ref={inputRef} style={{display:'none'}} onChange={onChange}/>
         <Button icon="cloud-upload" onClick={onUploadChange}>上传音频</Button>
      </Col>
      <Col span={12}>
        <a href={defaulturl?defaulturl:url} target="_bank">
          {(defaulturl||url)&&<Icon type="file-jpg" />}
        </a>
      </Col> 
   </Row>
   </>
 )
}

export default UploadImage