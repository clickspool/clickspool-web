(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[82],{mfVx:function(e,t,a){"use strict";var n=a("g09b"),l=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("+L6B");var r=n(a("2/Rp"));a("IzEo");var o=n(a("bx4M"));a("14J3");var i=n(a("BMrR"));a("jCWc");var d=n(a("kPKH"));a("BoS7");var u=n(a("Sdc0")),s=n(a("jehZ"));a("5NDa");var c=n(a("5rEg"));a("sPJy");var f=n(a("bE4q"));a("Pwec");var m=n(a("CtXQ")),p=n(a("d6i3")),g=n(a("1l/V"));a("miYZ");var h=n(a("tsqr")),v=n(a("2Taf")),y=n(a("vZ4D")),E=n(a("MhPg")),b=n(a("l4Ni")),C=n(a("ujKo"));a("y8nQ");var w=n(a("Vl3Y"));a("OaEy");var q=n(a("2fM7")),S=l(a("q1tI")),k=a("GRak"),M=a("LLXN"),L=n(a("wY1l")),x=(n(a("LvDl")),a("MuoO")),P=a("v83y"),D=a("owPO"),F=n(a("bQ8i")),N=n(a("dt66"));a("19BS");var O,j,I,B,R=n(a("shAx")),A=n(a("3a4m")),T=n(a("HejF")),V=a("34ay");n(a("D1Df"));function _(e){return function(){var t,a=(0,C.default)(e);if(J()){var n=(0,C.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,b.default)(this,t)}}function J(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var X={labelCol:{span:2},wrapperCol:{span:10}},z=q.default.Option,H=(O=(0,x.connect)(function(e){var t=e.customer,a=t.category,n=t.version,l=e.routing.location.pathname,r=e.memberInfo.data.keys,o=e.faq,i=o.data,d=i.list,u=i.page,s=i.total_count,c=o.statusList;return{list:d,page:u,total_count:s,keys:r,pathname:l,category:a,version:n,statusList:c}}),j=w.default.create(),O(I=j((B=function(e){(0,E.default)(a,e);var t=_(a);function a(e){var n;(0,v.default)(this,a),n=t.call(this,e),n.onEditorChange=function(e){n.setState({editorContent:e})},n.clearContent=function(){n.setState({contentState:""})},n.onContentStateChange=function(e){console.log("contentState",e)},n.onEditorStateChange=function(e){n.setState({editorState:e})},n.imageUploadCallBack=function(e){return new Promise(function(t,a){var n=new XMLHttpRequest;n.open("POST","".concat(T.default,"/admin/upload/uploadImage"));var l=new FormData;l.append("uploadImage",e),l.append("token",(0,V.getAuthority)()),n.send(l),n.addEventListener("load",function(){var e=JSON.parse(n.responseText);t(e)}),n.addEventListener("error",function(){var e=JSON.parse(n.responseText);a(e)})})},n.updataConfiList=function(){},n.handleAddFaq=function(e){var t=n.state,a=t.filter,l=(t.editorState,t.editorContent),r=t.id;n.props.form.validateFields(function(t,o){var i;t?h.default.warn(Object.values(t)[0].errors[0].message):(i=Object.assign({},a,o),i.content=(0,F.default)(l)+"",""!=r&&(i.id=r),0!=e||""!=r?0!=e||""==r?1!=e||""!=r?1!=e||""==r?2!=e||""!=r?2!=e||""==r||(0,k.modifyFaq)(Object.assign({},i,{status:1})).then(function(e){e&&!e.code&&n.setState({previewurl:"".concat(n.state.previewurl)},function(){setTimeout(function(){n.handleCancelPage()},2e3)})}):(0,k.addFaq)(Object.assign({},i,{status:1})).then(function(e){e&&!e.code&&n.setState({id:e.data.id,previewurl:"".concat(n.state.previewurl).concat(e.data.id)},function(){setTimeout(function(){n.handleCancelPage()},2e3)})}):(0,k.modifyFaq)(Object.assign({},i,{status:0})).then(function(e){e&&!e.code&&n.setState({previewurl:"".concat(n.state.previewurl)},function(){setTimeout(function(){n.handleCancelPage()},2e3)})}):(0,k.addFaq)(Object.assign({},i,{status:0})).then(function(e){e&&!e.code&&n.setState({id:e.data.id,previewurl:"".concat(n.state.previewurl).concat(e.data.id)},function(){setTimeout(function(){n.handleCancelPage()},2e3)})}):(0,k.modifyFaq)(Object.assign({},i,{status:0})).then(function(e){e&&!e.code&&n.setState({previewurl:"".concat(n.state.previewurl)},function(){n.setState({showPreview:!0})})}):(0,k.addFaq)(Object.assign({},i,{status:0})).then(function(e){e&&!e.code&&n.setState({id:e.data.id,previewurl:"".concat(n.state.previewurl).concat(e.data.id)},function(){n.setState({showPreview:!0})})}))})},n.handleCancel=function(){n.setState({showPreview:!1})},n.handleCancelPage=function(){A.default.push("/feedback/faq")};var l="",r=(0,N.default)(l),o=null;if(r){var i=P.ContentState.createFromBlockArray(r.contentBlocks);o=P.EditorState.createWithContent(i)}return n.state={editorState:o,editorContent:void 0,defaultChecked:!1,previewurl:/test/.test(T.default)?"http://test-h5.xuansky.cn/faqdetail/index.html?type=help&id=":"https://h5.feishiapp.com/faqdetail/index.html?type=help&id=",showPreview:!1,id:"",filter:{title:"",content:"",category:"",status:0,is_recommend:!1,sort:""}},n}return(0,y.default)(a,[{key:"getEnumList",value:function(){var e=(0,g.default)(p.default.mark(function e(){var t;return p.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=this.props.dispatch,e.next=3,function(){t({type:"permission/getRoleList"})}();case 3:return e.next=5,function(){t({type:"permission/getMemberStatusList"}),t({type:"customer/getCategory"})}();case 5:t({type:"faq/getFaqCateStatusList"}),t({type:"customer/getAllVersion"});case 7:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},{key:"componentDidMount",value:function(){var e=this;this.getEnumList().then(function(){e.updataConfiList()})}},{key:"render",value:function(){var e=this,t=this.state,a=(t.editorContent,t.editorState),n=this.props,l=n.category,p=(n.statusList,n.version),g=this.props.form.getFieldDecorator;return S.default.createElement("div",null,S.default.createElement("style",null,"\n                      .sup-required{\n                          color:#f5222d;\n                          margin-right:2px;\n                      }\n                      .web .ant-modal{\n                          width:auto !important\n                      }\n                      .web .ant-modal .ant-modal-body{\n                          padding:16px !important;\n                      }\n                      .public-DraftStyleDefault-block{\n                        margin:0;\n                    }\n                      "),S.default.createElement("div",{className:R.default.breadcrumbBox},S.default.createElement(f.default,null,S.default.createElement(f.default.Item,null,S.default.createElement(m.default,{type:"lock"}),S.default.createElement("span",null,(0,M.formatMessage)({id:"menu.feedback"}))),S.default.createElement(f.default.Item,null,S.default.createElement(L.default,{to:"/feedback/faq"},(0,M.formatMessage)({id:"menu.feedback.faq"}))),S.default.createElement(f.default.Item,null,(0,M.formatMessage)({id:"app.faq.add"})))),S.default.createElement("div",{className:"gutter-example button-demo"},S.default.createElement(i.default,{gutter:16},S.default.createElement(d.default,{className:"gutter-row",md:24},S.default.createElement("div",{className:"gutter-box"},S.default.createElement(o.default,{title:(0,M.formatMessage)({id:"menu.feedback.faq"}),bordered:!0},S.default.createElement(w.default,{layout:"vertical"},S.default.createElement(w.default.Item,(0,s.default)({},X,{label:(0,M.formatMessage)({id:"app.faq.title"})+"\uff1a"}),g("title",{rules:[{required:!0,message:(0,M.formatMessage)({id:"app.faq.pleasetitle"})}]})(S.default.createElement(c.default,{placeholder:(0,M.formatMessage)({id:"app.faq.pleasetitle"})}))),S.default.createElement(w.default.Item,(0,s.default)({},X,{label:(0,M.formatMessage)({id:"app.faq.id"})+"\uff1a"}),g("sort")(S.default.createElement(c.default,{placeholder:(0,M.formatMessage)({id:"app.faq.pleasesort"})}))),S.default.createElement(w.default.Item,(0,s.default)({},X,{label:(0,M.formatMessage)({id:"app.faq.isrecommend"})+"\uff1a"}),g("is_recommend",{initialValue:!1})(S.default.createElement(u.default,{checkedChildren:(0,M.formatMessage)({id:"app.faq.yes"}),unCheckedChildren:(0,M.formatMessage)({id:"app.faq.no"}),defaultChecked:this.state.filter.is_recommend}))),S.default.createElement(w.default.Item,(0,s.default)({},X,{label:(0,M.formatMessage)({id:"app.feedback.issueCategory"})+"\uff1a"}),g("category",{initialValue:l[0].id})(S.default.createElement(q.default,{placeholder:(0,M.formatMessage)({id:"app.faq.pleaseCategory"})},l.map(function(e,t){return S.default.createElement(z,{key:t,value:e.id},e.name)})))),S.default.createElement(w.default.Item,(0,s.default)({},X,{label:(0,M.formatMessage)({id:"app.feedback.versions"})}),g("version",{initialValue:p.list[0]})(S.default.createElement(q.default,null,p.list.map(function(e,t){return S.default.createElement(z,{key:t,value:e},e)}))))),S.default.createElement(i.default,{gutter:16},S.default.createElement(d.default,{lg:2,md:6,sm:24},S.default.createElement("span",{style:{color:"rgba(0, 0, 0, 0.85)"}},S.default.createElement("span",{className:"sup-required"},"*"),(0,M.formatMessage)({id:"app.faq.content"}),"\uff1a")),S.default.createElement(d.default,{lg:22,md:18,sm:24},S.default.createElement(D.Editor,{editorState:a,toolbarClassName:"home-toolbar",wrapperClassName:"home-wrapper",editorClassName:"home-editor",onEditorStateChange:this.onEditorStateChange,toolbar:{history:{inDropdown:!0},inline:{inDropdown:!1},list:{inDropdown:!0},textAlign:{inDropdown:!0},image:{uploadCallback:this.imageUploadCallBack}},onContentStateChange:this.onEditorChange,placeholder:"\u8bf7\u8f93\u5165\u5185\u5bb9",spellCheck:!0,onFocus:function(){console.log("focus")},onBlur:function(){console.log("blur")},onTab:function(){return console.log("tab"),!0},localization:{locale:"zh",translations:{"generic.add":"\u6dfb\u52a0\u94fe\u63a5"}}}))),S.default.createElement("style",null,"\n                                    .home-editor {\n                                        min-height: 300px;\n                                    }\n                                ")),S.default.createElement("div",null,S.default.createElement(r.default,{type:"primary",style:{marginLeft:8},className:R.default.btnSmt,onClick:function(){e.handleAddFaq(1)}},(0,M.formatMessage)({id:"app.faq.submit"})),S.default.createElement(r.default,{type:"danger",style:{marginLeft:8},className:R.default.btnSmt,onClick:function(){e.handleAddFaq(2)}},(0,M.formatMessage)({id:"app.faq.submitissue"})),S.default.createElement(r.default,{style:{marginLeft:8},className:R.default.btnSmt,onClick:this.handleCancelPage},(0,M.formatMessage)({id:"app.faq.cancel"}))))))))}}]),a}(S.Component),I=B))||I)||I),Q=H;t.default=Q}}]);