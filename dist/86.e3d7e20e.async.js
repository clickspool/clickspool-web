(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[86],{VKRI:function(e,t,a){"use strict";var n=a("g09b"),r=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("DjyN");var s=n(a("NUBc"));a("g9YV");var l=n(a("wCAj")),i=n(a("p0pE"));a("IzEo");var d=n(a("bx4M"));a("14J3");var o=n(a("BMrR"));a("+L6B");var u=n(a("2/Rp"));a("jCWc");var f=n(a("kPKH")),m=n(a("2Taf")),c=n(a("rlhR")),p=n(a("MhPg")),g=n(a("l4Ni")),h=n(a("ujKo"));a("y8nQ");var y=n(a("Vl3Y"));a("5NDa");var _=n(a("5rEg"));a("OaEy");var k=n(a("2fM7"));a("2qtc");var E=n(a("kLXV"));a("iQDF");var M,v,b,w,I=n(a("+eQT")),C=n(a("ICWT")),T=a("+n12"),L=a("VkhE"),x=a("MuoO"),S=r(a("q1tI")),D=(n(a("LvDl")),n(a("wY1l")),n(a("3a4m"))),R=a("LLXN"),O=n(a("sunZ"));a("OpHJ");function P(e){return function(){var t,a=(0,h.default)(e);if(z()){var n=(0,h.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,g.default)(this,t)}}function z(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}I.default.MonthPicker;var Y=I.default.RangePicker,j=E.default.confirm,V=k.default.Option,F=(_.default.Search,a("wd/R"),M=y.default.create(),v=(0,x.connect)(function(e){var t=e.mess,a=t.data,n=t.type,r=t.status,s=t.sendTypes,l=e.global.GlobalCountryMap;return{data:a,type:n,status:r,sendTypes:s,GlobalCountryMap:l}}),M(b=v((w=function(e){(0,p.default)(a,e);var t=P(a);function a(e){var n;return(0,m.default)(this,a),n=t.call(this,e),n.handleTableChange=function(e,t){n.handleSubmit({page:e})},n.onShowSizeChange=function(e,t){n.handleSubmit({page_size:t,page:e})},n.rmMessInfo=function(){var e=n.props.dispatch;e({type:"mess/rmMessInfo"})},n.handleSubmit=function(e){var t=n.props.form.getFieldsValue,a=t(),r={};a.send_time&&(r.send_time_start=a.send_time[0],r.send_time_end=a.send_time[1],a.send_time=null),a.create_time&&(r.create_time_start=a.create_time[0],r.create_time_end=a.create_time[1],a.create_time=null),n.setState(function(t){var n=t.filters;return Object.assign(n,a,r,Object.keys(e).length?e:{page:1})},function(){n.getList()})},n.handleOnReset=function(){n.props.form.resetFields(),n.setState({filters:{page_size:20,page:1}},function(){n.getList()})},n.skipLink=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0,a=arguments.length>2?arguments[2]:void 0,r=n.props.dispatch;t?D.default.push(t):a?D.default.push("/operation/assistant/messagepush/update/".concat(e.id,"/copy")):e.id?D.default.push("/operation/assistant/messagepush/update/".concat(e.id)):(r({type:"mess/messageEdit",payload:{}}),D.default.push("/operation/assistant/messagepush/update"))},n.showDelConfirm=function(e){var t=(0,c.default)(n);j({title:(0,R.formatMessage)({id:"form.operation.tip"}),content:(0,R.formatMessage)({id:"form.operation.tipDelContent"}),onOk:function(){return new Promise(function(a,n){(0,L.messDel)({id:e}).then(function(){a(),t.getList()})}).catch(function(){return console.log("Oops errors!")})},onCancel:function(){}})},n.FormSearch=function(){var e=n.props,t=e.form.getFieldDecorator,a=e.type,r=e.status,s=e.GlobalCountryMap,l=n.state.filters;l.send_time,l.create_time,l.message_type,l.status;return S.default.createElement("div",{className:O.default.addBtn},S.default.createElement(d.default,{className:O.default.card,bordered:!0},S.default.createElement(y.default,{layout:"vertical",hideRequiredMark:!0},S.default.createElement(o.default,{gutter:10},S.default.createElement(f.default,{lg:8,md:12,sm:24},S.default.createElement(y.default.Item,{label:(0,R.formatMessage)({id:"form.operation.sendTime"})},t("send_time")(S.default.createElement(Y,{showTime:!0,format:"YYYY-MM-DD HH:mm:ss",style:{width:"100%"}})))),S.default.createElement(f.default,{lg:8,md:12,sm:24},S.default.createElement(y.default.Item,{label:(0,R.formatMessage)({id:"form.operation.createTime"})},t("create_time")(S.default.createElement(Y,{showTime:!0,format:"YYYY-MM-DD HH:mm:ss",style:{width:"100%"}})))),S.default.createElement(f.default,{lg:8,md:12,sm:24},S.default.createElement(y.default.Item,{label:(0,R.formatMessage)({id:"form.operation.mediaType"})},t("message_type",{initialValue:""})(S.default.createElement(k.default,null,S.default.createElement(V,{value:""},(0,R.formatMessage)({id:"form.operation.allmediaType"})),Object.keys(a).map(function(e,t){return S.default.createElement(V,{value:e,key:t},a[e])}))))),S.default.createElement(f.default,{lg:8,md:12,sm:24},S.default.createElement(y.default.Item,{label:(0,R.formatMessage)({id:"app.activity.status"})},t("status",{initialValue:""})(S.default.createElement(k.default,null,S.default.createElement(V,{value:""},(0,R.formatMessage)({id:"app.activity.allstatus"})),Object.keys(r).map(function(e,t){return S.default.createElement(V,{value:e,key:t},r[e])}))))),S.default.createElement(f.default,{lg:8,md:12,sm:24},S.default.createElement(y.default.Item,{label:(0,R.formatMessage)({id:"app.activity.sendtype"})},t("send_type",{initialValue:""})(S.default.createElement(k.default,null,S.default.createElement(V,{value:""},(0,R.formatMessage)({id:"app.activity.allsendtype"})),Object.keys(n.props.sendTypes).map(function(e,t){return S.default.createElement(V,{value:e,key:t},n.props.sendTypes[e])}))))),S.default.createElement(f.default,{lg:8,md:12,sm:24},S.default.createElement(y.default.Item,{label:"\u56fd\u5bb6"},t("send_nation")(S.default.createElement(k.default,{placeholder:"\u8bf7\u9009\u62e9\u56fd\u5bb6"},s.map(function(e,t){return S.default.createElement(V,{value:e.id,key:t},e.name)}))))),S.default.createElement(f.default,{lg:8,md:12,sm:24},S.default.createElement(u.default,{type:"primary",onClick:n.handleSubmit.bind((0,c.default)(n),{})},(0,R.formatMessage)({id:"form.operation.search"})),S.default.createElement(u.default,{style:{marginLeft:"8px"},onClick:n.handleOnReset},(0,R.formatMessage)({id:"form.operation.reset"})),S.default.createElement(u.default,{type:"primary",style:{marginLeft:"8px"},onClick:n.skipLink.bind((0,c.default)(n))},(0,R.formatMessage)({id:"operation.messagepush.add"})))))))},n.TableList=function(){var e=n.props,t=e.data.list,a=e.status,r=e.type,s=e.GlobalCountryMap,d=[{title:"ID",dataIndex:"id",key:"id",width:80},{title:(0,R.formatMessage)({id:"form.operation.createTime"}),dataIndex:"create_time",key:"create_time",width:80},{title:(0,R.formatMessage)({id:"form.operation.sendTime"}),dataIndex:"send_timing",key:"send_timing",width:80,render:function(e,t){return e||""}},{title:(0,R.formatMessage)({id:"operation.messagepush.title"}),dataIndex:"title",key:"title",width:80},{title:"\u56fd\u5bb6",dataIndex:"send_nation",key:"send_nation",width:80,render:function(e,t){return 0!=e&&e&&s.find(function(t){return t.id==e})?s.find(function(t){return t.id==e})["name"]:""}},{title:(0,R.formatMessage)({id:"app.activity.sendtype"}),dataIndex:"send_type",key:"send_type",width:120,render:function(e,t){return n.props.sendTypes[e]}},{title:(0,R.formatMessage)({id:"operation.messagepush.pushContent"}),dataIndex:"content",key:"content",width:150},{title:(0,R.formatMessage)({id:"form.operation.mediaType"}),dataIndex:"message_type",key:"message_type",width:80,render:function(e,t){return r[e]}},{title:"URL",dataIndex:"url",key:"url",width:130,render:function(e){return S.default.createElement("div",{style:{wordWrap:"break-word",wordBreak:"break-all"}},e)}},{title:(0,R.formatMessage)({id:"operation.messagepush.client"}),dataIndex:"platform_name",key:"platform_name",width:80,render:function(e){return e}},{title:(0,R.formatMessage)({id:"operation.messagepush.uidtag"}),dataIndex:"send_user_tag_name",key:"send_user_tag_name",width:200,render:function(e,t){var a=parseInt(t.send_user_reg_end)?"".concat(parseInt(t.send_user_reg_start)?t.send_user_reg_start:"").concat((0,R.formatMessage)({id:"operation.messagefaq.to"})).concat(t.send_user_reg_end):"",n=t.send_user_ids?t["send_user_ids"]:"";return S.default.createElement(S.Fragment,null,S.default.createElement("p",null,(0,R.formatMessage)({id:"operation.messagepush.pushClientTag"}),":",e),!!a&&S.default.createElement("p",null,(0,R.formatMessage)({id:"operation.messagepush.pushClientTime"}),":",a),!!n&&S.default.createElement("p",null,(0,R.formatMessage)({id:"operation.messagepush.pushClientRange"}),":",n))}},{title:(0,R.formatMessage)({id:"operation.messagepush.createUser"}),dataIndex:"member_nickname",key:"member_nickname",width:80},{title:(0,R.formatMessage)({id:"form.operation.status"}),dataIndex:"status",key:"status",width:80,render:function(e){var t=1==e?{color:"#52c41a"}:2==e?{color:"#f5222d"}:{};return S.default.createElement("span",{style:t},a[e])}},{title:(0,R.formatMessage)({id:"operation.messagepush.operation"}),width:300,render:function(e,t){return S.default.createElement("div",null,S.default.createElement(u.default,{type:"link",onClick:n.skipLink.bind((0,c.default)(n),(0,i.default)({},t),"","copy")},(0,R.formatMessage)({id:"form.operation.copy"})),S.default.createElement(u.default,{type:"link",style:{marginLeft:"6px"},onClick:n.skipLink.bind((0,c.default)(n),t,"","")},(0,R.formatMessage)({id:"form.operation.edit"})),S.default.createElement(u.default,{type:"link",style:{marginLeft:"6px"},onClick:n.skipLink.bind((0,c.default)(n),t,"/operation/assistant/messagepush/detail/".concat(t.id),"")},(0,R.formatMessage)({id:"form.operation.detail"})),S.default.createElement(u.default,{type:"link",onClick:n.showDelConfirm.bind((0,c.default)(n),t.id),style:{color:"#ff4d4f",marginLeft:"6px"}},(0,R.formatMessage)({id:"form.operation.del"})))}}];return S.default.createElement(l.default,{columns:d,dataSource:t,pagination:!1,bordered:!0,scroll:{x:1300},rowKey:function(e,t){return"".concat(e.id).concat(t)}})},n.componentDidMount=function(){var e=n.props.dispatch;n.rmMessInfo(),Promise.all([e({type:"mess/messTypes"}),e({type:"mess/messStatuses"}),e({type:"mess/sendTypes"})]).then(function(){n.getList()})},n.getList=function(){var e=n.props.dispatch,t=n.state.filters;e({type:"mess/getList",payload:(0,T.momentToString)(t)})},n.render=function(){var e=n.props.data,t=e.total_count,a=(e.total_page,n.state.filters),r=[{icon:"desktop",name:(0,R.formatMessage)({id:"menu.operation"})},{name:(0,R.formatMessage)({id:"menu.operation.xiaomishupush"})}],l=(0,c.default)(n),i=l.FormSearch,d=l.TableList;return S.default.createElement(S.Fragment,null,S.default.createElement(C.default,{src:r}),S.default.createElement(i,null),S.default.createElement(d,null),S.default.createElement("div",{className:O.default.rightPagination},S.default.createElement(s.default,{showTotal:function(e){return(0,R.formatMessage)({id:"app.glob.pagetotal"},{total:e})},pageSizeOptions:["20","30","40"],showSizeChanger:!0,onShowSizeChange:n.onShowSizeChange,current:(0,T.toParseInt)(a.page)||1,pageSize:a.page_size,onChange:n.handleTableChange,total:(0,T.toParseInt)(t)})))},n.state={filters:{page_size:20,page:1}},n}return a}(S.PureComponent),b=w))||b)||b);t.default=F}}]);