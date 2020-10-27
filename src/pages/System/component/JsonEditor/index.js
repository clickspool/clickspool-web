import React, { Component } from 'react';
import "ace-builds";
import 'ace-builds/webpack-resolver';
import AceEditor from "react-ace";

class JsonEditor extends Component {
  render() {
    let { value, onChange, mode, onValidate } = this.props
    // const { onValidate } = this;
    mode = mode || 'markdown';
    return (
      <AceEditor
        mode={mode}
        theme='tomorrow'
        value={value}
        onChange={onChange}
        style={{
          height: '300px'
        }}
      />
    );
  }
}
export default JsonEditor;