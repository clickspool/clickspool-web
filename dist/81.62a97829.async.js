(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[81],{NfdN:function(e,t,a){"use strict";var n=a("g09b"),l=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("2qtc");var i=n(a("kLXV"));a("DjyN");var r=n(a("NUBc"));a("g9YV");var d=n(a("wCAj"));a("IzEo");var s=n(a("bx4M"));a("14J3");var u=n(a("BMrR"));a("+L6B");var f=n(a("2/Rp"));a("jCWc");var o=n(a("kPKH"));a("sPJy");var c=n(a("bE4q"));a("Pwec");var p=n(a("CtXQ"));a("P2fV");var m=n(a("NJEC"));a("/zsF");var h=n(a("PArb"));a("+BJd");var g=n(a("mr32")),y=n(a("d6i3")),v=n(a("1l/V")),b=n(a("p0pE")),E=n(a("2Taf")),k=n(a("vZ4D")),w=n(a("rlhR")),M=n(a("MhPg")),q=n(a("l4Ni")),C=n(a("ujKo"));a("y8nQ");var x=n(a("Vl3Y"));a("OaEy");var S=n(a("2fM7"));a("5NDa");var Y=n(a("5rEg"));a("B9cy");var _=n(a("Ol7k"));a("iQDF");var D,R,L,I,N=n(a("+eQT")),j=a("+n12"),z=a("GRak"),P=a("MuoO"),F=n(a("wY1l")),K=n(a("3a4m")),O=n(a("D1Df")),V=n(a("HejF")),B=l(a("q1tI")),H=a("LLXN"),A=n(a("LvDl")),J=n(a("shAx"));function Q(e){return function(){var t,a=(0,C.default)(e);if(T()){var n=(0,C.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,q.default)(this,t)}}function T(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}N.default.RangePicker;var X=a("wd/R"),U=(_.default.Sider,_.default.Content,Y.default.Search,S.default.Option);function G(e){return e?parseInt(e||0):0}var W=/test/.test(V.default)?"http://test-h5.xuansky.cn/faqdetail/index.html?type=help&id=":"https://h5.feishiapp.com/faqdetail/index.html?type=help&id=",Z=(D=(0,P.connect)(function(e){var t=e.customer,a=t.category,n=t.version,l=e.routing.location.pathname,i=e.memberInfo.data.keys,r=e.faq,d=r.data,s=d.list,u=d.page,f=d.total_count,o=r.statusList;return{list:s,page:u,total_count:f,keys:i,pathname:l,category:a,version:n,statusList:o}}),R=x.default.create(),D(L=R((I=function(e){(0,M.default)(a,e);var t=Q(a);function a(e){var n;return(0,E.default)(this,a),n=t.call(this,e),n.goResolve=function(){},n.delFaq=function(e){(0,z.delFaq)({id:e+""}).then(function(e){e&&!e.code&&n.updataConfiList()})},n.batchRejectHandel=function(e,t){var a=n.state.selectedRowKeys1;(a.length||"undefined"!=typeof t)&&(0,z.batchStatusUpdate)({ids:"undefined"==typeof t?a.join(","):t,status:e}).then(function(e){e&&!e.code&&(n.updataConfiList(),n.setState({selectedRowKeys1:[],selectedRowKeys:[]}))})},n.SearchResetBtnHandle=function(){n.state.pagination;n.props.form.resetFields(),n.setState({pagination:{page:1,page_size:20,type:"",status:"",name:"",id:"",version:"",operater_id:"",telephone:"",category:"",create_date_start:"",create_date_end:"",update_date_start:"",update_date_end:""}},function(){n.updataConfiList()})},n.SearchBtnHandle=function(){n.props.form.validateFields(function(e,t){var a=n.state.pagination,l={};t.pushtime&&"array"===(0,j.type)(t.pushtime)&&(l={create_date_start:X(t.pushtime[0]).format("YYYY-MM-DD")+" 00:00:00",create_date_end:X(t.pushtime[1]).format("YYYY-MM-DD")+X(t.pushtime[0]).format("YYYY-MM-DD")==X(t.pushtime[1]).format("YYYY-MM-DD")?" 23:59:59":" 00:00:00"}),t.checktime&&"array"===(0,j.type)(t.checktime)&&(l=Object.assign({},l,{update_date_start:X(t.checktime[0]).format("YYYY-MM-DD")+" 00:00:00",update_date_end:X(t.checktime[0]).format("YYYY-MM-DD")+X(t.pushtime[0]).format("YYYY-MM-DD")==X(t.pushtime[1]).format("YYYY-MM-DD")?" 23:59:59":" 00:00:00"})),delete t["pushtime"],delete t["checktime"],n.setState({pagination:Object.assign({},a,t,(0,b.default)({page:1},l))},function(){n.updataConfiList()})})},n.onShowSizeChange=function(e,t){var a=n.state.pagination;n.setState({pagination:Object.assign({},a,{page:e,page_size:t})},function(){n.updataConfiList()}),console.log(e,t)},n.handleQcode=function(e){n.setState({previewurl:W+e},function(){n.setState({showPreview:!0})})},n.handleAddFaq=function(){K.default.push("/feedback/faq/add")},n.handleCancel=function(){n.setState({showPreview:!1})},n.state={pagination:{page_size:20,page:1,total_count:e.total_count},selectedRowKeys:[],selectedRowKeys1:[],showPreview:!1,previewurl:""},A.default.bindAll((0,w.default)(n),["updataConfiList","handleTableChange"]),n}return(0,k.default)(a,[{key:"componentDidMount",value:function(){var e=this;this.getEnumList().then(function(){e.updataConfiList()})}},{key:"getEnumList",value:function(){var e=(0,v.default)(y.default.mark(function e(){var t;return y.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=this.props.dispatch,e.next=3,function(){t({type:"permission/getRoleList"})}();case 3:return e.next=5,function(){t({type:"permission/getMemberStatusList"}),t({type:"customer/getCategory"})}();case 5:t({type:"customer/getAllVersion"}),t({type:"faq/getFaqCateStatusList"});case 7:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},{key:"updataConfiList",value:function(){var e=this.props.dispatch,t=this.state.pagination;e({type:"faq/getList",payload:t})}},{key:"handleTableChange",value:function(e){var t=this,a=this.state.pagination;this.setState({pagination:Object.assign({},a,{page:e})},function(){t.updataConfiList()})}},{key:"render",value:function(){var e=this,t=this.props,a=t.list,n=(t.page,t.total_count),l=(t.roleList,t.statusList),y=(t.keys,t.pathname,t.category),v=t.version,b=t.form.getFieldDecorator,E=this.state,k=(E.addVisible,E.editVisible,E.editDataSource,E.selectedRowKeys),w=this.onShowSizeChange,M={selectedRowKeys:k,onChange:function(t,a){var n;n=a.map(function(e){return e.id}),e.setState({selectedRowKeys1:n,selectedRowKeys:t})}},q=[{title:"ID",dataIndex:"id",key:"id",width:"30px"},{title:(0,H.formatMessage)({id:"app.faq.id"}),dataIndex:"sort",key:"sort",width:"80px"},{title:(0,H.formatMessage)({id:"app.faq.category"}),dataIndex:"category",key:"category",width:"100px",render:function(e,t){var a=y.filter(function(t){return e==t.id})[0];return a?a.name:""}},{title:(0,H.formatMessage)({id:"app.faq.title"}),dataIndex:"title",key:"title",width:"100px",render:function(t,a){t=t||"";var n=t.length>15?"".concat(t.substring(0,15),"..."):t;return B.default.createElement("div",{style:{cursor:"pointer"},onClick:function(){e.handleQcode(a.id)}},B.default.createElement("div",{title:t},"1"==a.is_hot&&B.default.createElement(g.default,{color:"green"},(0,H.formatMessage)({id:"app.faq.hot"})),"1"==a.is_recommend&&B.default.createElement(g.default,{color:"geekblue"},(0,H.formatMessage)({id:"app.faq.recommend"})),n))}},{title:(0,H.formatMessage)({id:"app.faq.pv"}),dataIndex:"pv",key:"pv",width:"80px"},{title:(0,H.formatMessage)({id:"app.faq.date"}),dataIndex:"create_time",key:"create_time",width:"120px",render:function(e,t){return B.default.createElement("div",null,B.default.createElement("p",null,(0,H.formatMessage)({id:"app.faq.update"}),t.update_time),B.default.createElement("p",null,(0,H.formatMessage)({id:"app.faq.publish"}),t.create_time))}},{title:(0,H.formatMessage)({id:"app.faq.status"}),dataIndex:"status",key:"status",width:"100px",render:function(e,t){return l[e]}},{title:(0,H.formatMessage)({id:"app.feedback.versions"}),dataIndex:"version",key:"version",width:"100px"},{title:(0,H.formatMessage)({id:"app.faq.helpfull"}),dataIndex:"helpful",key:"helpful"},{title:(0,H.formatMessage)({id:"app.faq.unhelpfull"}),dataIndex:"unhelpfull",key:"unhelpfull"},{title:(0,H.formatMessage)({id:"app.feedback.content"}),dataIndex:"content",key:"content",width:"130px",render:function(e,t){e=e||"";var a=e.length>40?"".concat(e.substring(0,40),"..."):e;return B.default.createElement("p",{title:e},a)}},{title:(0,H.formatMessage)({id:"app.feedback.operation"}),dataIndex:"action",key:"action",width:"220px",render:function(t,a){return B.default.createElement("span",null,B.default.createElement(F.default,{to:"/feedback/faq/edit/".concat(a.id)},(0,H.formatMessage)({id:"app.faq.edit"})),"0"==a.status&&B.default.createElement("span",null,B.default.createElement(h.default,{type:"vertical"}),B.default.createElement(m.default,{title:(0,H.formatMessage)({id:"app.faq.confirmup"}),onConfirm:function(){return e.batchRejectHandel(1,a.id)},key:a.id},B.default.createElement("a",{href:"#"},(0,H.formatMessage)({id:"app.faq.up"})))),"1"==a.status&&B.default.createElement("span",null,B.default.createElement(h.default,{type:"vertical"}),B.default.createElement(m.default,{title:(0,H.formatMessage)({id:"app.faq.confirmdown"}),onConfirm:function(){return e.batchRejectHandel(0,a.id)},key:a.id},B.default.createElement("a",{href:"#",className:J.default.dengerColor},(0,H.formatMessage)({id:"app.faq.down"})))),B.default.createElement("span",null,B.default.createElement(h.default,{type:"vertical"}),B.default.createElement(m.default,{title:(0,H.formatMessage)({id:"app.faq.confirmdel"}),onConfirm:function(){return e.delFaq(a.id)},key:a.id+"del"},B.default.createElement("a",{href:"#",className:J.default.dengerColor},(0,H.formatMessage)({id:"app.faq.del"})))))}}];return B.default.createElement("div",null,B.default.createElement("style",null,"\n            .status-badge .ant-badge-status-dot{\n                height:8px;\n                width:8px\n            }\n            .regDate .ant-calendar-picker{\n              width:100%;\n            }\n            .styles-card .ant-card-head-wrapper div:nth-child(1){\n                width:160px;\n                flex: 1 1;\n            }\n            .styles-card .ant-card-head-wrapper div:nth-child(2){\n              width:160px;\n              flex:16 1;\n          }\n          .l-menu-style li:after{\n            content: '';\n            position: absolute;\n            right: 0;\n            top: 0;\n            height:40px;\n            border-right: 3px solid #26A4FF;\n            transform: scaleY(0.0001);\n            opacity: 0;\n            transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);\n          }\n          .l-menu-style.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected{\n             background:#def6ff\n          }\n          .sup-required{\n            color:#f5222d;\n            margin-right:2px;\n        }\n        .web .ant-modal{\n            width:auto !important\n        }\n        .web .ant-modal .ant-modal-body{\n            padding:16px !important;\n        }\n        .public-DraftStyleDefault-block{\n            margin:0;\n        }\n            "),B.default.createElement("div",{className:J.default.breadcrumbBox},B.default.createElement(c.default,null,B.default.createElement(c.default.Item,null,B.default.createElement(p.default,{type:"lock"}),B.default.createElement("span",null,(0,H.formatMessage)({id:"menu.feedback"}))),B.default.createElement(c.default.Item,null,(0,H.formatMessage)({id:"menu.feedback.faq"})))),B.default.createElement("div",{className:J.default.addBtn},B.default.createElement(s.default,{title:(0,H.formatMessage)({id:"menu.feedback.faq"}),className:"styles-card",bordered:!0},B.default.createElement(x.default,{layout:"vertical",hideRequiredMark:!0},B.default.createElement(u.default,{gutter:16},B.default.createElement(o.default,{lg:4,md:12,sm:24},B.default.createElement(x.default.Item,{label:(0,H.formatMessage)({id:"app.faq.title"})},b("title")(B.default.createElement(Y.default,{placeholder:(0,H.formatMessage)({id:"app.faq.pleasetitle"})})))),B.default.createElement(o.default,{lg:4,md:12,sm:24},B.default.createElement(x.default.Item,{label:(0,H.formatMessage)({id:"app.feedback.issueCategory"})},b("category",{initialValue:""})(B.default.createElement(S.default,null,B.default.createElement(U,{value:""},(0,H.formatMessage)({id:"app.feedback.allIssueCategory"})),!(0,j.isEmptyObject)(y)&&y.map(function(e,t){return B.default.createElement(U,{key:t,value:e.id},e.name)}))))),B.default.createElement(o.default,{lg:4,md:12,sm:24},B.default.createElement(x.default.Item,{label:(0,H.formatMessage)({id:"app.feedback.issueStatus"})},b("status",{initialValue:""})(B.default.createElement(S.default,null,B.default.createElement(U,{value:""},(0,H.formatMessage)({id:"app.feedback.allIssueStatus"})),Object.keys(l).map(function(e){return B.default.createElement(U,{key:e,value:e},l[e])}))))),B.default.createElement(o.default,{lg:4,md:12,sm:24},B.default.createElement(x.default.Item,{label:(0,H.formatMessage)({id:"app.feedback.versions"})},b("version",{initialValue:""})(B.default.createElement(S.default,null,B.default.createElement(U,{value:""},(0,H.formatMessage)({id:"app.feedback.allVersions"})),v.list.map(function(e,t){return B.default.createElement(U,{key:t,value:e},e)}))))),B.default.createElement(o.default,{lg:4,md:12,sm:24},B.default.createElement(f.default,{type:"primary",className:J.default.btnSmt,onClick:this.SearchBtnHandle},(0,H.formatMessage)({id:"app.content.search"})),B.default.createElement(f.default,{className:J.default.btnSmt,style:{marginLeft:8},onClick:this.SearchResetBtnHandle},(0,H.formatMessage)({id:"app.content.reset"})))),B.default.createElement(u.default,{gutter:16,className:"regDate"},B.default.createElement(o.default,{lg:6,md:12,sm:24},B.default.createElement(f.default,{type:"primary",className:J.default.btnSmt,style:{marginLeft:8},onClick:this.handleAddFaq},(0,H.formatMessage)({id:"app.faq.add"})),B.default.createElement(f.default,{type:"primary",className:J.default.btnSmt,style:{marginLeft:8},onClick:function(){e.batchRejectHandel(1)}},(0,H.formatMessage)({id:"app.faq.batchup"})),B.default.createElement(f.default,{type:"danger",className:J.default.btnSmt,style:{marginLeft:8},onClick:function(){e.batchRejectHandel(0)}},(0,H.formatMessage)({id:"app.faq.batchdown"}))))))),B.default.createElement(d.default,{rowSelection:M,columns:q,dataSource:a,pagination:!1,bordered:!0,scroll:{x:1300},rowKey:function(e,t){return"".concat(e.id).concat(t)}}),B.default.createElement("div",{className:J.default.rightPagination},B.default.createElement(r.default,{showTotal:function(e){return(0,H.formatMessage)({id:"app.glob.pagetotal"},{total:e})},pageSizeOptions:["20","30","40"],showSizeChanger:!0,onShowSizeChange:w,current:G(this.state.pagination.page),pageSize:this.state.pagination.page_size||20,onChange:this.handleTableChange,total:G(n)})),B.default.createElement(i.default,{title:null,visible:this.state.showPreview,onCancel:this.handleCancel,footer:null,closable:!1,centered:!0,maskClosable:!0,wrapClassName:"web"},B.default.createElement(O.default,{value:this.state.previewurl}),","))}}]),a}(B.PureComponent),L=I))||L)||L),$=Z;t.default=$}}]);