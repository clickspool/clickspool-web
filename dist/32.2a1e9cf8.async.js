(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[32],{Q6N3:function(e,t,a){"use strict";var n=a("g09b"),r=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("DjyN");var d=n(a("NUBc"));a("g9YV");var l=n(a("wCAj"));a("IzEo");var s=n(a("bx4M"));a("+L6B");var i=n(a("2/Rp"));a("14J3");var o=n(a("BMrR"));a("jCWc");var c=n(a("kPKH"));a("sPJy");var u=n(a("bE4q"));a("Pwec");var f=n(a("CtXQ"));a("P2fV");var p=n(a("NJEC"));a("/zsF");var m=n(a("PArb")),g=n(a("d6i3")),h=n(a("1l/V")),y=n(a("p0pE")),k=n(a("2Taf")),b=n(a("vZ4D")),v=n(a("rlhR")),M=n(a("MhPg")),E=n(a("l4Ni")),w=n(a("ujKo"));a("y8nQ");var x=n(a("Vl3Y"));a("OaEy");var _=n(a("2fM7"));a("5NDa");var C=n(a("5rEg"));a("B9cy");var Y=n(a("Ol7k"));a("iQDF");var D,I,S,L,R=n(a("+eQT")),N=a("+n12"),j=a("tQjW"),z=a("Ljbz"),P=a("34ay"),B=a("MuoO"),K=n(a("wY1l")),T=r(a("q1tI")),H=a("LLXN"),O=n(a("LvDl")),V=(a("fPeI"),n(a("shAx")));function A(e){return function(){var t,a=(0,w.default)(e);if(F()){var n=(0,w.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,E.default)(this,t)}}function F(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var J=R.default.RangePicker,Q=a("wd/R"),q=(Y.default.Sider,Y.default.Content,C.default.Search,_.default.Option);function X(e){return e?parseInt(e||0):0}var W=(D=(0,B.connect)(function(e){var t=e.customer,a=t.data,n=a.list,r=a.page,d=a.total_count,l=t.category,s=t.version,i=t.statusList,o=t.customer.customer_list,c=e.routing.location.pathname,u=e.memberInfo.data.keys;return{list:n,page:r,total_count:d,keys:u,pathname:c,category:l,version:s,statusList:i,customer_list:o}}),I=x.default.create(),D(S=I((L=function(e){(0,M.default)(a,e);var t=A(a);function a(e){var n;return(0,k.default)(this,a),n=t.call(this,e),n.goResolve=function(){},n.rejectHandel=function(e){(0,j.reply)({ids:e+"",status:3}).then(function(e){e&&!e.code&&n.updataConfiList()})},n.batchRejectHandel=function(){var e=n.state,t=e.selectedRowKeys1;e.selectedRowKeys;t.length&&(0,j.reply)({ids:t.join(","),status:3}).then(function(e){e.code||(n.setState({selectedRowKeys:[],selectedRowKeys1:[]}),n.updataConfiList())})},n.SearchResetBtnHandle=function(){n.state.pagination;n.props.form.resetFields(),n.setState({pagination:{page:1,page_size:20,type:"",status:"",name:"",id:"",version:"",operater_id:"",telephone:"",category:"",create_date_start:"",create_date_end:"",update_date_start:"",update_date_end:""}},function(){n.updataConfiList()})},n.SearchBtnHandle=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;n.props.form.validateFields(function(e,a){if(!e){var r=n.state.pagination,d={};a.pushtime&&"array"===(0,N.type)(a.pushtime)&&(d={create_date_start:Q(a.pushtime[0]).format("YYYY-MM-DD")+" 00:00:00",create_date_end:Q(a.pushtime[1]).format("YYYY-MM-DD")+(Q(a.pushtime[0]).format("YYYY-MM-DD")==Q(a.pushtime[1]).format("YYYY-MM-DD")?" 23:59:59":" 00:00:00")}),a.checktime&&"array"===(0,N.type)(a.checktime)&&(d=Object.assign({},d,{update_date_start:Q(a.checktime[0]).format("YYYY-MM-DD")+" 00:00:00",update_date_end:Q(a.checktime[0]).format("YYYY-MM-DD")+(Q(a.pushtime[0]).format("YYYY-MM-DD")==Q(a.pushtime[1]).format("YYYY-MM-DD")?" 23:59:59":" 00:00:00")})),delete a["pushtime"],delete a["checktime"],n.setState({pagination:Object.assign({},r,a,(0,y.default)({export:t,page:1},d))},function(){n.updataConfiList()})}})},n.onShowSizeChange=function(e,t){var a=n.state.pagination;n.setState({pagination:Object.assign({},a,{page:e,page_size:t})},function(){n.updataConfiList()})},n.validateTel=function(e,t,a){n.props.form;var r=/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;t&&!r.test(t)?a((0,H.formatMessage)({id:"app.feedback.pleaseRightPhone"})):a()},n.state={pagination:{page_size:20,page:e.page,total_count:e.total_count},selectedRowKeys:[],selectedRowKeys1:[],languageList:[]},O.default.bindAll((0,v.default)(n),["updataConfiList","handleTableChange"]),n}return(0,b.default)(a,[{key:"componentDidMount",value:function(){var e=this;this.getEnumList().then(function(){e.updataConfiList()}),(0,z.getLanguageList)({token:(0,P.getAuthority)()}).then(function(t){t.code||e.setState({languageList:t.data})})}},{key:"getEnumList",value:function(){var e=(0,h.default)(g.default.mark(function e(){var t;return g.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=this.props.dispatch,e.next=3,function(){t({type:"permission/getRoleList"})}();case 3:return e.next=5,function(){t({type:"permission/getMemberStatusList"}),t({type:"customer/getCategory"})}();case 5:t({type:"customer/getAllVersion"}),t({type:"customer/getFeedbackStatusList"}),t({type:"customer/getCustomer"});case 8:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},{key:"updataConfiList",value:function(){var e=this.props.dispatch,t=this.state.pagination;e({type:"customer/getList",payload:t})}},{key:"handleTableChange",value:function(e){var t=this,a=this.state.pagination;this.setState({pagination:Object.assign({},a,{page:e})},function(){t.updataConfiList()})}},{key:"render",value:function(){var e=this,t=this.props,a=t.list,n=t.page,r=t.total_count,g=(t.roleList,t.statusList,t.keys,t.pathname,t.category),h=(t.version,t.customer_list),y=t.form.getFieldDecorator,k=this.state,b=(k.addVisible,k.editVisible,k.editDataSource,k.selectedRowKeys),v=(k.languageList,this.onShowSizeChange);console.log(g,"categorycategorycategory");var M={onChange:function(t,a){var n;n=a.map(function(e){return e.id}),e.setState({selectedRowKeys1:n,selectedRowKeys:t})},selectedRowKeys:b},E=[{title:(0,H.formatMessage)({id:"app.users.id"}),dataIndex:"id",key:"id",width:"80px"},{title:(0,H.formatMessage)({id:"app.feedback.feedbackID"}),dataIndex:"user_id",key:"user_id",width:"100px"},{title:(0,H.formatMessage)({id:"app.users.phone"}),dataIndex:"tell",key:"tell",width:"100px"},{title:(0,H.formatMessage)({id:"app.feedback.resolveDate"}),dataIndex:"create_at",key:"create_at",width:"120px"},{title:(0,H.formatMessage)({id:"app.users.Name"}),dataIndex:"nickname",key:"nickname",width:"100px",render:function(e,t){e=e||"";var a=e.length>6?"".concat(e.substring(0,6),"..."):e;return T.default.createElement("p",{title:e},a)}},{title:(0,H.formatMessage)({id:"app.feedback.issueCategory"}),dataIndex:"category",key:"category",width:"100px",render:function(e,t){var a=g.filter(function(t){return e==t.id})[0];return a?a.name:""}},{title:(0,H.formatMessage)({id:"app.feedback.allVersions"}),dataIndex:"version",key:"version",width:"100px",render:function(e,t){return e}},{title:(0,H.formatMessage)({id:"app.feedback.osVersion"}),dataIndex:"os_version",key:"os_version",width:"200px"},{title:(0,H.formatMessage)({id:"app.feedback.device"}),dataIndex:"device_brand",key:"device_brand",render:function(e,t){return"".concat(t.device_brand,"  ").concat(t.device_version)}},{title:(0,H.formatMessage)({id:"app.feedback.source"}),dataIndex:"source",key:"source"},{title:(0,H.formatMessage)({id:"app.feedback.network"}),dataIndex:"network",key:"network"},{title:(0,H.formatMessage)({id:"app.withdraw.id"}),dataIndex:"order_id",key:"order_id"},{title:(0,H.formatMessage)({id:"app.feedback.resolveTime"}),dataIndex:"update_at",key:"update_at",width:"100px",render:function(e,t){return 1==t.status?"":e}},{title:(0,H.formatMessage)({id:"app.feedback.resolveCustomer"}),dataIndex:"operater_nickname",key:"operater_nickname",width:"100px"},{title:(0,H.formatMessage)({id:"app.feedback.replyContent"}),dataIndex:"reply_content",key:"reply_content",width:"130px",render:function(e,t){e=e||"";var a=e.length>40?"".concat(e.substring(0,40),"..."):e;return T.default.createElement("p",{title:e},a)}},{title:(0,H.formatMessage)({id:"app.feedback.feedbackContent"}),dataIndex:"content",key:"content",width:"130px",render:function(e,t){e=e||"";var a=e.length>40?"".concat(e.substring(0,40),"..."):e;return T.default.createElement("p",{title:e},a)}},{title:(0,H.formatMessage)({id:"app.feedback.operation"}),dataIndex:"action",key:"action",width:"220px",fixed:"right",render:function(t,a){return T.default.createElement("span",null,1==a.status&&T.default.createElement(K.default,{to:"/feedback/customer/detail/".concat(a.id)}," ",(0,H.formatMessage)({id:"app.feedback.goResolve"})),1!=a.status&&T.default.createElement(K.default,{to:"/feedback/customer/detail/".concat(a.id)}," ",(0,H.formatMessage)({id:"app.feedback.seeDetail"})),1==a.status&&T.default.createElement("span",null,T.default.createElement(m.default,{type:"vertical"}),T.default.createElement(p.default,{title:(0,H.formatMessage)({id:"app.feedback.makesureREJECT"}),onConfirm:function(){return e.rejectHandel(a.id)}},T.default.createElement("a",{href:"#",className:V.default.dengerColor},(0,H.formatMessage)({id:"app.feedback.reject"})))))}}];return T.default.createElement("div",null,T.default.createElement("style",null,"\n            .status-badge .ant-badge-status-dot{\n                height:8px;\n                width:8px\n            }\n            .regDate .ant-calendar-picker{\n              width:100%;\n            }\n            .styles-card .ant-card-head-wrapper div:nth-child(1){\n                width:160px;\n                flex: 1 1;\n            }\n            .styles-card .ant-card-head-wrapper div:nth-child(2){\n              width:160px;\n              flex:16 1;\n          }\n          .l-menu-style li:after{\n            content: '';\n            position: absolute;\n            right: 0;\n            top: 0;\n            height:40px;\n            border-right: 3px solid #26A4FF;\n            transform: scaleY(0.0001);\n            opacity: 0;\n            transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);\n          }\n          .l-menu-style.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected{\n             background:#def6ff\n          }\n            "),T.default.createElement("div",{className:V.default.breadcrumbBox},T.default.createElement(u.default,{style:{borderBottom:" 1px solid #ccc",paddingBottom:" 10px"}},T.default.createElement(u.default.Item,null,T.default.createElement(f.default,{type:"lock"}),T.default.createElement("span",null,(0,H.formatMessage)({id:"menu.feedback"}))),T.default.createElement(u.default.Item,null,(0,H.formatMessage)({id:"menu.feedback.customer"})))),T.default.createElement("div",{className:V.default.addBtn},T.default.createElement(s.default,{title:(0,H.formatMessage)({id:"menu.feedback.customer"}),className:"styles-card",bordered:!0},T.default.createElement(x.default,{layout:"vertical",hideRequiredMark:!0},T.default.createElement(o.default,{gutter:16},T.default.createElement(c.default,{lg:6,md:12,sm:24},T.default.createElement(x.default.Item,{label:(0,H.formatMessage)({id:"app.feedback.feedbackID"})},y("user_id")(T.default.createElement(C.default,{placeholder:(0,H.formatMessage)({id:"app.feedback.pleaseID"})})))),T.default.createElement(c.default,{lg:6,md:12,sm:24},T.default.createElement(x.default.Item,{label:(0,H.formatMessage)({id:"app.users.Name"})},y("nickname")(T.default.createElement(C.default,{placeholder:(0,H.formatMessage)({id:"app.users.pleaseName"})})))),T.default.createElement(c.default,{lg:6,md:12,sm:24},T.default.createElement(x.default.Item,{label:(0,H.formatMessage)({id:"app.feedback.phone"})},y("telephone",{rules:[{validator:this.validateTel}]})(T.default.createElement(C.default,{placeholder:(0,H.formatMessage)({id:"app.feedback.pleasePhone"})})))),T.default.createElement(c.default,{lg:6,md:12,sm:24},T.default.createElement(x.default.Item,{label:(0,H.formatMessage)({id:"app.feedback.customers"})},y("operater_id",{initialValue:""})(T.default.createElement(_.default,null,T.default.createElement(q,{value:""},(0,H.formatMessage)({id:"app.feedback.allCustomers"})),h.map(function(e,t){return T.default.createElement(q,{key:t,value:e.id},e.nickname)})))))),T.default.createElement(o.default,{gutter:16,className:"regDate"},T.default.createElement(c.default,{lg:6,md:12,sm:24},T.default.createElement(x.default.Item,{label:(0,H.formatMessage)({id:"app.feedback.feedbackTime"})},y("pushtime")(T.default.createElement(J,null)))),T.default.createElement(c.default,{lg:6,md:12,sm:24},T.default.createElement(x.default.Item,{label:(0,H.formatMessage)({id:"app.feedback.resolveTime"})},y("checktime")(T.default.createElement(J,null)))),T.default.createElement(c.default,{lg:6,md:12,sm:24},T.default.createElement(x.default.Item,{label:(0,H.formatMessage)({id:"app.feedback.issueCategory"})},y("category")(T.default.createElement(_.default,{placeholder:(0,H.formatMessage)({id:"app.feedback.issueCategory"})},g&&g.length&&g.map(function(e,t){return T.default.createElement(q,{key:t,value:e.id},e.name)})))))),T.default.createElement(o.default,{gutter:16,className:"regDate"},T.default.createElement(c.default,{lg:10,md:12,sm:24},T.default.createElement(i.default,{type:"primary",className:V.default.btnSmt,onClick:this.SearchBtnHandle},(0,H.formatMessage)({id:"app.content.search"})),T.default.createElement(i.default,{type:"primary",style:{marginLeft:8},className:V.default.btnSmt,onClick:function(t){return e.SearchBtnHandle(t,1)}},(0,H.formatMessage)({id:"app.content.export"})),T.default.createElement(i.default,{className:V.default.btnSmt,style:{marginLeft:8},onClick:this.SearchResetBtnHandle},(0,H.formatMessage)({id:"app.content.reset"})),T.default.createElement(i.default,{type:"danger",className:V.default.btnSmt,style:{marginLeft:8},onClick:this.batchRejectHandel},(0,H.formatMessage)({id:"app.feedback.batchreject"}))))))),T.default.createElement(l.default,{rowSelection:M,columns:E,dataSource:a,pagination:!1,bordered:!0,scroll:{x:2e3},rowKey:function(e,t){return"".concat(e.id).concat(t)}}),T.default.createElement("div",{className:V.default.rightPagination},T.default.createElement(d.default,{showTotal:function(e){return(0,H.formatMessage)({id:"app.glob.pagetotal"},{total:e})},pageSizeOptions:["20","30","40"],showSizeChanger:!0,onShowSizeChange:v,current:X(n),pageSize:this.state.pagination.page_size||20,onChange:this.handleTableChange,total:X(r)})))}}]),a}(T.PureComponent),S=L))||S)||S),U=W;t.default=U}}]);