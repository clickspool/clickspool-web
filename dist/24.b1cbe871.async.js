(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[24],{"+Ggq":function(e,t,a){"use strict";var n=a("tAuX"),i=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a("q1tI"));a("14J3");var o=i(a("BMrR"));a("+L6B");var s=i(a("2/Rp"));a("OaEy");var l=i(a("2fM7")),d=i(a("2Taf")),c=i(a("vZ4D")),u=i(a("MhPg")),p=i(a("l4Ni")),f=i(a("ujKo"));a("y8nQ");var m,h,g,v=i(a("Vl3Y")),y=a("LLXN"),b=i(a("EdlO"));function M(e){return function(){var t,a=(0,f.default)(e);if(w()){var n=(0,f.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,p.default)(this,t)}}function w(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var E=(m=v.default.create(),m((g=function(e){(0,u.default)(a,e);var t=M(a);function a(){var e;(0,d.default)(this,a);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return e=t.call.apply(t,[this].concat(i)),e.handleValues=function(){e.props.form.validateFields(function(t,a){t||e.props.search(a)})},e.reset=function(){e.props.form.resetFields(),e.props.search()},e}return(0,c.default)(a,[{key:"render",value:function(){var e=this.props,t=e.form,a=t.getFieldDecorator,n=(t.getFieldValue,e.positions),i=(void 0===n&&new Map,e.clients),d=(void 0===i&&new Map,e.cates,e.statuses,e.batchLoading),c=e.batchDisable,u=e.batchOnline,p=e.batchOffline,f=l.default.Option,m=[{id:1,title:(0,y.formatMessage)({id:"app.audit.status.waiting"})},{id:2,title:(0,y.formatMessage)({id:"app.audit.status.pass"})},{id:3,title:(0,y.formatMessage)({id:"app.audit.status.fail"})}].map(function(e){var t=e.id,a=e.title;return r.default.createElement(f,{key:t,value:t},a)}),h=[{id:0,title:(0,y.formatMessage)({id:"app.audit.search.mcn.not"})},{id:1,title:(0,y.formatMessage)({id:"app.audit.search.mcn.is"})}].map(function(e){var t=e.id,a=e.title;return r.default.createElement(f,{key:t,value:t},a)});return r.default.createElement(v.default,{autoComplete:"off",className:b.default["search-wraper"]},r.default.createElement(o.default,{className:"operation-bar ".concat(b.default.operations),gutter:10,type:"flex"},r.default.createElement("div",{className:b.default.operation},a("status")(r.default.createElement(l.default,{placeholder:(0,y.formatMessage)({id:"app.scene.tools.search.status"})},r.default.createElement(f,{value:"",className:b.default.all},(0,y.formatMessage)({id:"app.scene.tools.search.allstatus"})),m))),r.default.createElement("div",{className:b.default.operation},a("is_mcn")(r.default.createElement(l.default,{placeholder:(0,y.formatMessage)({id:"app.audit.search.mcn"})},h))),r.default.createElement("div",{className:b.default["operation-btn"]},r.default.createElement(s.default,{type:"primary",icon:"search",onClick:this.handleValues},(0,y.formatMessage)({id:"app.scene.tools.search.btn"}))),r.default.createElement("div",{className:b.default["operation-btn"]},r.default.createElement(s.default,{type:"primary",onClick:this.reset},(0,y.formatMessage)({id:"app.scene.tools.search.reset"}))),u&&r.default.createElement("div",{className:b.default["operation-btn"]},r.default.createElement(s.default,{type:"primary",onClick:u,loading:d,disabled:c},(0,y.formatMessage)({id:"app.audit.option.pass.batch"}))),p&&r.default.createElement("div",{className:b.default["operation-btn"]},r.default.createElement(s.default,{type:"danger",onClick:p,loading:d,disabled:c},(0,y.formatMessage)({id:"app.audit.option.reject.batch"})))))}}]),a}(r.PureComponent),h=g))||h),S=E;t.default=S},EdlO:function(e,t,a){e.exports={operation:"antd-pro-pages-operation-audit-components-operation-bar.css-operation","operation-btn":"antd-pro-pages-operation-audit-components-operation-bar.css-operation-btn","search-wraper":"antd-pro-pages-operation-audit-components-operation-bar.css-search-wraper","search-btn":"antd-pro-pages-operation-audit-components-operation-bar.css-search-btn",all:"antd-pro-pages-operation-audit-components-operation-bar.css-all",offline:"antd-pro-pages-operation-audit-components-operation-bar.css-offline"}},NgsT:function(e,t,a){e.exports={hide:"antd-pro-components-preview-video-style.m-hide",wraper:"antd-pro-components-preview-video-style.m-wraper",mask:"antd-pro-components-preview-video-style.m-mask",content:"antd-pro-components-preview-video-style.m-content"}},SlRJ:function(e,t,a){"use strict";var n=a("tAuX"),i=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=i(a("2Taf")),o=i(a("vZ4D")),s=i(a("MhPg")),l=i(a("l4Ni")),d=i(a("ujKo")),c=n(a("q1tI")),u=i(a("UbMB")),p=i(a("NgsT"));function f(e){return function(){var t,a=(0,d.default)(e);if(m()){var n=(0,d.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,l.default)(this,t)}}function m(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var h=u.default.bind(p.default),g=function(e){(0,s.default)(a,e);var t=f(a);function a(){return(0,r.default)(this,a),t.apply(this,arguments)}return(0,o.default)(a,[{key:"render",value:function(){var e=this.props,t=e.url,a=e.visible,n=e.hide;return console.info("Preview__",{url:t,visible:a,hide:n}),c.default.createElement("div",{className:h("wraper",{hide:!a})},c.default.createElement("div",{className:p.default.mask,onClick:n}),c.default.createElement("video",{className:p.default.content,controls:!0,src:t}))}}]),a}(c.PureComponent),v=g;t.default=v},eo2C:function(e,t,a){"use strict";var n=a("tAuX"),i=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("g9YV");var r=i(a("wCAj"));a("+L6B");var o=i(a("2/Rp"));a("/zsF");var s=i(a("PArb"));a("P2fV");var l=i(a("NJEC"));a("+BJd");var d=i(a("mr32"));a("Pwec");var c=i(a("CtXQ"));a("2qtc");var u=i(a("kLXV")),p=i(a("2Taf")),f=i(a("vZ4D")),m=i(a("rlhR")),h=i(a("MhPg")),g=i(a("l4Ni")),v=i(a("ujKo"));a("5NDa");var y=i(a("5rEg")),b=a("MuoO"),M=n(a("q1tI")),w=a("LLXN"),E=i(a("71zH")),S=i(a("SlRJ")),k=i(a("+Ggq")),R=i(a("sYb+"));function N(e){return function(){var t,a=(0,v.default)(e);if(_()){var n=(0,v.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,g.default)(this,t)}}function _(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var C=function(e,t,a,n){var i,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)o=Reflect.decorate(e,t,a,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(o=(r<3?i(o):r>3?i(t,a,o):i(t,a))||o);return r>3&&o&&Object.defineProperty(t,a,o),o},O=(y.default.Search,function(e){(0,h.default)(a,e);var t=N(a);function a(e){var n;return(0,p.default)(this,a),n=t.call(this,e),n.audit=function(e,t,a){e.preventDefault(),n.props.dispatch({type:"audit/patchStatus",payload:{id:t,status:"pass"===a?2:3}})},n.fetchPage=function(e,t){var a=n.state.search,i=void 0===a?{}:a;n.props.dispatch({type:"audit/fetch",payload:Object.assign({page:e,page_size:t},i)})},n.showEdit=function(e,t){var a=t.id;e.preventDefault(),n.setState({editId:a})},n.hideEdit=function(){n.setState({editId:null})},n.showAdd=function(){n.setState({adding:!0})},n.hideAdd=function(){n.setState({adding:!1})},n.preview=function(e){n.setState({previewShowing:!0,previewUrl:e.currentTarget.dataset.url})},n.hidePreview=function(){n.setState({previewShowing:!1,previewUrl:""})},n.putOnline=function(e){n.props.dispatch({type:"audit/patchStatus",payload:{id:e,status:1}})},n.putOffline=function(e){n.props.dispatch({type:"audit/patchStatus",payload:{id:e,status:0}})},n.onShowSizeChange=function(e,t){n.props.dispatch({type:"audit/changePageSize",payload:{page:e,pageSize:t}}),n.fetchPage(e,t)},n.delete=function(e){var t=e.id;e.status;n.props.dispatch({payload:{id:t},type:"audit/delete"})},n.search=function(e){n.setState({search:e});var t=n.props.pageSize,a=1;n.props.dispatch({type:"audit/updateState",payload:{filter:e}}),n.props.dispatch({payload:Object.assign(Object.assign({},e),{page:a,pageSize:t}),type:"audit/fetch"})},n.batchOnline=function(){var e=n.state.selectedRowKeys;u.default.confirm({title:(0,w.formatMessage)({id:"app.audit.option.pass.batch.confirm"},{selected:e.length}),onOk:function(){n.props.dispatch({type:"audit/batchModify",payload:{id:e.join(","),status:2}}).then(n.onSelectChange.bind((0,m.default)(n),[]))}})},n.batchOffline=function(){var e=n.state.selectedRowKeys;u.default.confirm({title:(0,w.formatMessage)({id:"app.audit.option.reject.batch.confirm"},{selected:e.length}),onOk:function(){n.props.dispatch({type:"audit/batchModify",payload:{id:e.join(","),status:3}}).then(n.onSelectChange.bind((0,m.default)(n),[]))}})},n.onSelectChange=function(e){var t=!(e.length>0);n.setState({batchDisable:t}),n.setState({selectedRowKeys:e})},n.state={adding:!1,editId:null,previewShowing:!1,previewUrl:"",batchDisable:!0},n}return(0,f.default)(a,[{key:"render",value:function(){var e=this,t=this.props,a=t.list,n=t.page,i=t.pageSize,u=t.total,p=(t.statusMap,this),f=[{icon:"desktop",title:(0,w.formatMessage)({id:"menu.operation"})},{icon:"user",title:(0,w.formatMessage)({id:"menu.operation.user"})},{icon:"audit",title:(0,w.formatMessage)({id:"menu.operation.user.audit"})}],m=[{title:(0,w.formatMessage)({id:"app.scene.category.id"}),dataIndex:"id"},{title:"UID",dataIndex:"uid"},{title:"NICK_ID",dataIndex:"nick_id"},{title:(0,w.formatMessage)({id:"app.audit.upload_at"}),dataIndex:"create_at"},{title:(0,w.formatMessage)({id:"app.audit.content"}),dataIndex:"video_url",render:function(t,a){return M.default.createElement("div",{className:R.default["video-box"],"data-url":t,onClick:e.preview},M.default.createElement("img",{src:"".concat(t,"?x-oss-process=video/snapshot,t_1,f_jpg,w_100,h_100,m_fast,ar_auto\n          "),alt:(0,w.formatMessage)({id:"app.audit.content"})}),M.default.createElement(c.default,{type:"play-circle",style:{position:"absolute",left:"50%",top:"50%",transform:"translate3d(-50%,-50%,0)",fontSize:"30px",color:"#fff",opacity:".6"}}))}},{title:(0,w.formatMessage)({id:"app.audit.status"}),dataIndex:"status",render:function(e){var t,a;switch(+e){case 3:t="gray",a=(0,w.formatMessage)({id:"app.audit.status.fail"});break;case 2:t="green",a=(0,w.formatMessage)({id:"app.audit.status.pass"});break;case 1:t="blue",a=(0,w.formatMessage)({id:"app.audit.status.waiting"});break;default:return M.default.createElement(M.default.Fragment,null)}return M.default.createElement(d.default,{color:t},a)}},{title:(0,w.formatMessage)({id:"app.scene.category.handle"}),key:"handle",render:function(e,t){var a;if(0==t.status)!1,a=(0,w.formatMessage)({id:"app.scene.category.online"}),M.default.createElement(l.default,{title:(0,w.formatMessage)({id:"app.scene.category.online_hint"}),okText:(0,w.formatMessage)({id:"app.scene.category.offline_confirm"}),cancelText:(0,w.formatMessage)({id:"app.scene.category.offline_cancel"}),okType:"danger",placement:"topRight",onConfirm:p.putOnline.bind(p,t.id)},M.default.createElement("a",{href:"#",className:R.default.edit},a));else{!0,a=(0,w.formatMessage)({id:"app.scene.category.offline"});var n=(0,w.formatMessage)({id:"app.scene.category.offline_hint"});t.tool_count>0&&(n=(0,w.formatMessage)({id:"app.scene.category.has_tool_offline_hint"})),M.default.createElement(l.default,{title:n,okText:(0,w.formatMessage)({id:"app.scene.category.offline_confirm"}),cancelText:(0,w.formatMessage)({id:"app.scene.category.offline_cancel"}),okType:"danger",placement:"topRight",onConfirm:p.putOffline.bind(p,t.id)},M.default.createElement("a",{href:"#",className:"".concat(R.default.edit," ").concat(R.default.danger)},a))}return M.default.createElement("div",{className:R.default.handle},M.default.createElement("a",{href:"#",className:R.default.edit,onClick:function(e){p.audit(e,t.id,"pass")}},(0,w.formatMessage)({id:"app.audit.option.pass"})),M.default.createElement(s.default,{type:"vertical"}),M.default.createElement(l.default,{title:(0,w.formatMessage)({id:"app.audit.option.reject.confirm"}),okText:(0,w.formatMessage)({id:"app.audit.option.reject.confirm.yes"}),cancelText:(0,w.formatMessage)({id:"app.audit.option.reject.confirm.no"}),okType:"danger",placement:"topRight",onConfirm:function(e){p.audit(e,t.id,"reject")}},M.default.createElement("a",{href:"#",className:"".concat(R.default.edit," ").concat(R.default.danger)},(0,w.formatMessage)({id:"app.audit.option.reject"}))))}}];m=m.map(function(e){return e["align"]="center",e});M.default.createElement("div",{className:R.default.operate},M.default.createElement("div",{className:R.default.title},(0,w.formatMessage)({id:"menu.operation.gift.category"})),M.default.createElement(o.default,{type:"primary",icon:"plus",onClick:this.showAdd},(0,w.formatMessage)({id:"app.scene.category.add"})));var h=this.state,g=h.selectedRowKeys,v=h.batchLoading,y=h.batchDisable,b={selectedRowKeys:g,onChange:this.onSelectChange};return M.default.createElement(M.Fragment,null,M.default.createElement(E.default,{items:f}),M.default.createElement("div",{className:R.default.operate},M.default.createElement(k.default,{statuses:[],search:this.search,batchOnline:this.batchOnline,batchOffline:this.batchOffline,batchLoading:v,batchDisable:y})),M.default.createElement(r.default,{rowSelection:b,bordered:!0,rowKey:"id",columns:m,dataSource:a,pagination:{position:"both",pageSize:i,current:n,showSizeChanger:!0,pageSizeOptions:["20","30","40"],onShowSizeChange:this.onShowSizeChange,total:u,showTotal:function(e){return(0,w.formatMessage)({id:"app.glob.pagetotal"},{total:e})},size:"small",onChange:this.fetchPage}}),M.default.createElement(S.default,{visible:this.state.previewShowing,url:this.state.previewUrl,hide:this.hidePreview}))}}]),a}(M.PureComponent));O=C([(0,b.connect)(function(e){var t=e.audit,a=t.list,n=t.total,i=t.page,r=t.pageSize,o=t.statusMap;return{list:a,total:n,page:i,pageSize:r,statusMap:o}})],O);var x=O;t.default=x},"sYb+":function(e,t,a){e.exports={edit:"antd-pro-pages-operation-audit-audit-list-edit",danger:"antd-pro-pages-operation-audit-audit-list-danger",icon:"antd-pro-pages-operation-audit-audit-list-icon",select:"antd-pro-pages-operation-audit-audit-list-select",operate:"antd-pro-pages-operation-audit-audit-list-operate","video-box":"antd-pro-pages-operation-audit-audit-list-video-box"}}}]);