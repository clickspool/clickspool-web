(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{"7qyX":function(e,t,a){"use strict";var n=a("tAuX"),l=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("g9YV");var o=l(a("wCAj"));a("/zsF");var r=l(a("PArb"));a("+BJd");var i=l(a("mr32")),u=l(a("eHn4")),c=l(a("2Taf")),d=l(a("vZ4D")),s=l(a("MhPg")),f=l(a("l4Ni")),p=l(a("ujKo")),m=a("MuoO"),h=n(a("q1tI")),g=a("LLXN"),b=l(a("71zH")),y=l(a("X9PF")),v=l(a("Ki7k")),_=l(a("PRbn")),E=l(a("jtP3")),k=l(a("UbMB")),w=l(a("nHo0"));function C(e){return function(){var t,a=(0,p.default)(e);if(x()){var n=(0,p.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,f.default)(this,t)}}function x(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var O=function(e,t,a,n){var l,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)r=Reflect.decorate(e,t,a,n);else for(var i=e.length-1;i>=0;i--)(l=e[i])&&(r=(o<3?l(r):o>3?l(t,a,r):l(t,a))||r);return o>3&&r&&Object.defineProperty(t,a,r),r},j=k.default.bind(w.default),R=function(e){(0,s.default)(a,e);var t=C(a);function a(e){var n;return(0,c.default)(this,a),n=t.call(this,e),n.search=function(e){n.setState({search:e}),n.props.dispatch({payload:Object.assign({},e),type:"book_info/fetch"})},n.onShowSizeChange=function(e,t){n.fetchPage(e,t)},n.fetchPage=function(e,t){var a=n.state.search,l=void 0===a?{}:a;n.props.dispatch({type:"book_info/fetch",payload:Object.assign({page:e,page_size:t},l)})},n.showAdd=function(){var e=n.props.dispatch;e({type:"book_info/updateState",payload:{book_info:{}}}),setTimeout(function(){n.setState({showBookInfo:!0})})},n.hideAdd=function(e){e&&n.fetchPage(),n.setState({showBookInfo:!1})},n.showModalHandle=function(e,t){var a=e.id,l=n.props.dispatch;l({type:"book_info/fetchBookInfo",payload:{book_id:a}}).then(function(){n.setState((0,u.default)({},t,!0))})},n.state={showBookInfo:!1,showChapterList:!1,showCopyRight:!1},n}return(0,d.default)(a,[{key:"render",value:function(){var e=this,t=[{icon:"monitor",title:"Book management"}],a=this.props,n=a.list,l=a.total,u=a.page,c=a.page_size,d=a.statuses,s=(a.dispatch,this.state),f=s.showBookInfo,p=s.showChapterList,m=s.showCopyRight,k=(this.showEdit,this.hideEdit,this.deleteRecord,this.hideAdd),C=this.showAdd,x=this.search,O=(this.putOnline,this.putOffline,[{title:"Book Cover",dataIndex:"book_cover",align:"center",width:140,render:function(e){return h.default.createElement(h.default.Fragment,null,h.default.createElement("style",null,".cover_book{\n                width:120px;\n                height:300px;\n                overflow:hidden;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n              }\n              .cover_book img{\n                width:120px;\n                height: auto;\n              }\n            "),h.default.createElement("div",{className:j("cover_book")},e?h.default.createElement("img",{src:e}):null))}},{title:"Book Title",dataIndex:"title_name",align:"center"},{title:"Price",dataIndex:"price",align:"center"},{title:"Full Price",dataIndex:"full_price",align:"center"},{title:"Author Name",dataIndex:"author_name",align:"center"},{title:"Author Pen Name",dataIndex:"author_pen_name",align:"center"},{title:"Book Status",dataIndex:"title_status",align:"center",render:function(e){var t={1:"processing",2:"complete"};return h.default.createElement(i.default,{color:"1"==e?"#2db7f5":"#87d068"},t["".concat(e)])}},{title:"Book Num",dataIndex:"title_id",align:"center"},{title:"Total Chapters",dataIndex:"total_chapter_count",align:"center"},{title:"Word Count",dataIndex:"total_word_count",align:"center"},{title:(0,g.formatMessage)({id:"app.material.operation"}),dataIndex:"operation",align:"center",fixed:"right",width:150,render:function(t,a){return h.default.createElement("div",{className:w.default.handle},h.default.createElement("style",null,"\n                  .blue{\n                    color:#1890ff;\n                    cursor: pointer;\n                    margin-bottom:0;\n                  }\n                  .blue:hover{\n                    color:#0458a5\n                  }\n                "),h.default.createElement("p",{className:"blue",onClick:function(){e.showModalHandle(a,"showBookInfo")}},"Manage Book"),h.default.createElement(r.default,{style:{margin:"5px auto"}}),h.default.createElement("p",{className:"blue",onClick:function(){e.showModalHandle(a,"showChapterList")}},"Manage Chapter"),h.default.createElement(r.default,{style:{margin:"5px auto"}}),h.default.createElement("p",{className:"blue",onClick:function(){e.showModalHandle(a,"showCopyRight")}},"Manage Copyright"))}}]);return h.default.createElement(h.Fragment,null,h.default.createElement(b.default,{items:t}),h.default.createElement("div",{className:j("operate")},h.default.createElement(y.default,{statuses:d,search:x,addTitle:"New Book",add:C})),h.default.createElement(o.default,{className:j("list"),bordered:!0,rowKey:"id",columns:O,dataSource:n||[],scroll:{x:2e3},pagination:{position:"both",pageSize:c,showSizeChanger:!0,page_sizeOptions:["20","30","40"],onShowSizeChange:this.onShowSizeChange,total:l,current:u,showTotal:function(e){return(0,g.formatMessage)({id:"app.glob.pagetotal"},{total:e})},size:"small",onChange:this.fetchPage}}),f&&h.default.createElement(v.default,{close:k}),p&&h.default.createElement(_.default,{close:function(){e.setState({showChapterList:!1})}}),m&&h.default.createElement(E.default,{close:function(){e.setState({showCopyRight:!1})}}))}}]),a}(h.PureComponent);R=O([(0,m.connect)(function(e){var t=e.book_info,a=t.list,n=t.total,l=t.page,o=t.page_size,r=t.types,i=t.statuses,u=void 0===i?{}:i,c=t.merchantMap;return{list:a,total:n,page:l,page_size:o,types:r,statuses:u,merchantMap:c}})],R);var P=R;t.default=P},Ki7k:function(e,t,a){"use strict";var n=a("tAuX"),l=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("2qtc");var o=l(a("kLXV"));a("5NDa");var r=l(a("5rEg"));a("jCWc");var i=l(a("kPKH"));a("14J3");var u=l(a("BMrR")),c=l(a("2Taf")),d=l(a("vZ4D")),s=l(a("MhPg")),f=l(a("l4Ni")),p=l(a("ujKo"));a("DZo9");var m=l(a("8z0m")),h=l(a("qIgq"));a("Pwec");var g=l(a("CtXQ"));a("OaEy");var b=l(a("2fM7"));a("y8nQ");var y=l(a("Vl3Y")),v=a("MuoO"),_=n(a("q1tI")),E=a("LLXN"),k=a("UYf5"),w=l(a("mwIZ")),C=l(a("Z0cm"));function x(e){return function(){var t,a=(0,p.default)(e);if(O()){var n=(0,p.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,f.default)(this,t)}}function O(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var j=function(e,t,a,n){var l,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)r=Reflect.decorate(e,t,a,n);else for(var i=e.length-1;i>=0;i--)(l=e[i])&&(r=(o<3?l(r):o>3?l(t,a,r):l(t,a))||r);return o>3&&r&&Object.defineProperty(t,a,r),r},R=y.default.Item,P=(b.default.Option,_.default.createElement("div",null,_.default.createElement(g.default,{type:"plus"}))),N=_.default.forwardRef(function(e,t){var a=(0,w.default)(e["data-__meta"],"initialValue")||[],n=(0,C.default)(a)?a:[];n=!!n.length&&n.map(function(e,t){return{uid:e,name:e,status:"done",url:"".concat(e,"?x-oss-process=image/resize,w_80,h_80")}});var l=(0,_.useState)(n),o=(0,h.default)(l,2),r=o[0],i=o[1];console.log(n,"file_list");var u=function(t){e.onChange(t)};return _.default.createElement(m.default,{accept:"image/*",listType:"picture-card",fileList:r,showUploadList:{showPreviewIcon:!0,showDownloadIcon:!0,showRemoveIcon:!0},onPreview:function(e){window.open(e.name)},onDownload:function(e){window.open(e.name)},customRequest:function(t){e.handleChange(t,function(e){var t={uid:e,name:e,status:"done",url:"".concat(e,"?x-oss-process=image/resize,w_80,h_80")};i([t]),u(e)})},onRemove:function(e){i([]),u("")}},r.length>=1?null:P)}),M=_.default.forwardRef(function(e,t){var a=function(t){e.onChange(t)};return _.default.createElement(k.Editor,{apiKey:"t2n9jf71r9b2l5ufml0eyinqlhb3ci161wcqsao3n6zkwgyy",initialValue:(0,w.default)(e["data-__meta"],"initialValue")||"",init:{height:500,menubar:!1,automatic_uploads:!0,elementpath:!1,plugins:["advlist autolink lists link image charmap print preview anchor","searchreplace visualblocks code fullscreen","insertdatetime media table paste code help wordcount","image"],images_upload_handler:function(t,a,n,l){console.log(t.blob()),e.uploadHandle(t,a,n,l)},toolbar:"undo redo | formatselect | bold italic forecolor backcolor |       alignleft aligncenter alignright alignjustify |       bullist numlist outdent indent lineheight_formats | removeformat | image code"},onEditorChange:a})}),I=function(e){(0,s.default)(a,e);var t=x(a);function a(e){var n;return(0,c.default)(this,a),n=t.call(this,e),n.handleOk=function(e,t){var a=n.props,l=a.form,o=l.validateFields,r=(l.getFieldsValue,a.dispatch),i=a.book_info,u=void 0===i?{}:i,c=n.state,d=c.imgList;c.videoList;e.preventDefault(),console.log(d),o({force:!0},function(e,t){e||r({type:"book_info/patchBookInfo",payload:Object.assign(Object.assign({},u),t)}).then(function(e){e.code||n.handleCancel(1)})})},n.handleCancel=function(e){1!==e?n.props.close():n.props.close(1)},n.FromRender=function(){var e=n.state,t=(e.imgList,e.videoList,n.props),a=t.form.getFieldDecorator,l=t.book_info,o=t.dispatch,c={labelCol:{xs:{span:24},sm:{span:4}},wrapperCol:{xs:{span:24},sm:{span:20}}},d={labelCol:{xs:{span:24},sm:{span:8}},wrapperCol:{xs:{span:24},sm:{span:16}}},s=(0,w.default)(l,"book_cover"),f=(0,C.default)(s)?s:s?[s]:[];return _.default.createElement(_.default.Fragment,null,_.default.createElement("style",null,"\n        .ant-form-item-label > label{\n          font-size:12px;\n          font-weight:bold;\n        }\n      "),_.default.createElement(R,Object.assign({},c,{label:"Book Cover"}),a("book_cover",{rules:[{required:!0,message:"Book Cover"}],initialValue:f,trigger:"onChange"})(_.default.createElement(N,{handleChange:function(e,t){e.file&&o({type:"book_info/uploadMultiMediaHandle",payload:{multiMedia:e.file}}).then(function(e){var a=e.code,n=e.data;0!=a?t():t(n.url)})}}))),_.default.createElement(u.default,null,_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Title Name"}),a("title_name",{rules:[{required:!0,message:"Title Name"}],initialValue:(0,w.default)(l,"title_name")})(_.default.createElement(r.default,{type:"text",placeholder:"Title Name"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"External ID"}),a("title_id",{initialValue:(0,w.default)(l,"title_id")})(_.default.createElement(r.default,{type:"text",placeholder:"External ID"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Book Status"}),a("title_status",{initialValue:(0,w.default)(l,"title_status")})(_.default.createElement(r.default,{type:"text",placeholder:"Book Status"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Author Name"}),a("author_name",{rules:[{required:!0,message:"Title Name"}],initialValue:(0,w.default)(l,"author_name")})(_.default.createElement(r.default,{type:"text",placeholder:"Author Name"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Author Pen Name"}),a("author_pen_name",{initialValue:(0,w.default)(l,"author_pen_name")})(_.default.createElement(r.default,{type:"text",placeholder:"Author Pen Name"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Multiple languages"}),a("multiple_languages",{initialValue:(0,w.default)(l,"multiple_languages")})(_.default.createElement(r.default,{type:"text",placeholder:"Multiple languages"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Tags"}),a("tags",{rules:[{required:!0,message:"Tags"}],initialValue:(0,w.default)(l,"tags")})(_.default.createElement(r.default,{type:"text",placeholder:"Tags"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Series Name"}),a("series",{rules:[{required:!0,message:"Series Name"}],initialValue:(0,w.default)(l,"series")})(_.default.createElement(r.default,{type:"text",placeholder:"Series Name"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Catchwords"}),a("catchword",{rules:[{required:!0,message:"Catchwords"}],initialValue:(0,w.default)(l,"catchword")})(_.default.createElement(r.default,{type:"text",placeholder:"Catchwords"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Total Chapter Count"}),a("total_chapter_count",{rules:[{required:!0,message:"Total Chapter Count"}],initialValue:(0,w.default)(l,"total_chapter_count")})(_.default.createElement(r.default,{type:"text",placeholder:"Total Chapter Count"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Total Word Count"}),a("total_word_count",{rules:[{required:!0,message:"Total Word Count"}],initialValue:(0,w.default)(l,"total_word_count")})(_.default.createElement(r.default,{type:"text",placeholder:"Total Word Count"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Full price"}),a("full_price",{rules:[{required:!0,message:"Total Word Count"}],initialValue:(0,w.default)(l,"full_price")})(_.default.createElement(r.default,{type:"text",placeholder:"Full price"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Price"}),a("price",{rules:[{required:!0,message:"Total Word Count"}],initialValue:(0,w.default)(l,"price")})(_.default.createElement(r.default,{type:"text",placeholder:"Price"}))))),_.default.createElement(R,Object.assign({},c,{label:"Synopsis"}),a("synopsis",{rules:[{required:!0,message:"Synopsis"}],initialValue:(0,w.default)(l,"synopsis"),trigger:"onChange"})(_.default.createElement(M,{uploadHandle:function(e,t,a,n){o({type:"book_info/uploadMultiMediaHandle",payload:{multiMedia:e.blob()}}).then(function(e){console.log(e,"res==");var a=e.code,n=e.data;0==a&&t(n.url)})}}))),_.default.createElement("div",{className:"ant-modal-footer"},_.default.createElement("div",null,_.default.createElement("button",{type:"button",className:"ant-btn ant-btn-danger",onClick:n.handleCancel},_.default.createElement("span",null,(0,E.formatMessage)({id:"app.material.cancel"}))),_.default.createElement("button",{type:"button",className:"ant-btn ant-btn-primary",onClick:function(e){n.handleOk(e,1)}},_.default.createElement("span",null,"Save")))))},n.state={imgList:[],videoList:[]},n}return(0,d.default)(a,[{key:"render",value:function(){var e=this.props.book_info,t=void 0===e?{}:e,a=(this.handleOk,this.handleCancel,this.FromRender);return _.default.createElement(_.default.Fragment,null,_.default.createElement("style",null,"\n         .___warp .ant-modal-body {\n           padding: 24px 20px 0;\n         }\n         .ant-form-item{\n           margin-bottom:0;\n         }\n        "),_.default.createElement(o.default,{className:"___warp",title:Object.keys(t).length?"Add new book":"Edit book",visible:!0,width:1100,footer:null},_.default.createElement(y.default,{autoComplete:"off"},_.default.createElement(a,null))))}}]),a}(_.PureComponent);I=j([(0,v.connect)(function(e){var t=e.book_info,a=t.list,n=t.book_info;return{list:a,book_info:n}}),y.default.create()],I);var D=I;t.default=D},PRbn:function(e,t,a){"use strict";var n=a("tAuX"),l=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("g9YV");var o=l(a("wCAj"));a("2qtc");var r=l(a("kLXV"));a("+L6B");var i=l(a("2/Rp")),u=l(a("2Taf")),c=l(a("vZ4D")),d=l(a("MhPg")),s=l(a("l4Ni")),f=l(a("ujKo"));a("Pwec");var p=l(a("CtXQ"));a("OaEy");var m=l(a("2fM7"));a("y8nQ");var h=l(a("Vl3Y")),g=a("MuoO"),b=n(a("q1tI")),y=l(a("znlb")),v=l(a("UbMB")),_=l(a("nHo0"));function E(e){return function(){var t,a=(0,f.default)(e);if(k()){var n=(0,f.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,s.default)(this,t)}}function k(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var w=function(e,t,a,n){var l,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)r=Reflect.decorate(e,t,a,n);else for(var i=e.length-1;i>=0;i--)(l=e[i])&&(r=(o<3?l(r):o>3?l(t,a,r):l(t,a))||r);return o>3&&r&&Object.defineProperty(t,a,r),r},C=(h.default.Item,m.default.Option,v.default.bind(_.default)),x=(b.default.createElement("div",null,b.default.createElement(p.default,{type:"plus"})),function(e){(0,d.default)(a,e);var t=E(a);function a(e){var n;return(0,u.default)(this,a),n=t.call(this,e),n.handleCancel=function(){n.props.close()},n.showAdd=function(){var e=n.props.dispatch;e({type:"book_info/updateState",payload:{chapter_info:{}}}),n.setState({showChapter:!0})},n.state={showChapter:!1},n}return(0,c.default)(a,[{key:"render",value:function(){var e=this,t=this.props,a=t.chapter_list,n=t.dispatch,l=this.handleCancel,u=(this.showAdd,[{title:"id",dataIndex:"id",align:"center"},{title:"Book Id",dataIndex:"book_id",align:"center"},{title:"Chapter name",dataIndex:"chapter_name",align:"center"},{title:"Word count",dataIndex:"word_count",align:"center"},{title:"Price",dataIndex:"price",align:"center"},{title:"Operation",dataIndex:"\u2014\u2014",align:"center",render:function(t,a){return b.default.createElement(i.default,{type:"link",onClick:function(){n({type:"book_info/fetchChapterInfo",payload:{chapter_id:a.id}}).then(function(){e.setState({showChapter:!0})})}},"Edit")}}]);return b.default.createElement(b.default.Fragment,null,b.default.createElement("style",null,"\n         .___warp .ant-modal-body {\n           padding: 24px 20px 0;\n         }\n         .ant-form-item{\n           margin-bottom:0;\n         }\n        "),b.default.createElement(r.default,{className:"___warp",title:"Chapter List",visible:!0,onOk:l,okText:"Ok",cancelText:"Cancel",onCancel:l,width:800,zIndex:1e3},b.default.createElement(i.default,{type:"primary",onClick:this.showAdd},"New Chapter"),b.default.createElement(o.default,{className:C("list"),style:{marginBottom:"14px"},bordered:!0,rowKey:"id",columns:u,scroll:{x:600,y:300},dataSource:a||[],pagination:{position:"none"}})),this.state.showChapter&&b.default.createElement(y.default,{close:function(t){t&&n({type:"book_info/fetchBookInfo",payload:{book_id:a[0].book_id}}),e.setState({showChapter:!1})}}))}}]),a}(b.PureComponent));x=w([(0,g.connect)(function(e){var t=e.book_info,a=t.chapter_list,n=t.book_info;return{chapter_list:a,book_info:n}}),h.default.create()],x);var O=x;t.default=O},X9PF:function(e,t,a){"use strict";var n=a("tAuX"),l=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("+L6B");var o=l(a("2/Rp"));a("5NDa");var r=l(a("5rEg"));a("jCWc");var i=l(a("kPKH"));a("14J3");var u=l(a("BMrR"));a("y8nQ");var c=l(a("Vl3Y"));a("OaEy");var d=l(a("2fM7")),s=l(a("2Taf")),f=l(a("vZ4D")),p=l(a("MhPg")),m=l(a("l4Ni")),h=l(a("ujKo")),g=n(a("q1tI")),b=a("LLXN"),y=l(a("k/1N"));function v(e){return function(){var t,a=(0,h.default)(e);if(_()){var n=(0,h.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,m.default)(this,t)}}function _(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var E=function(e,t,a,n){var l,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)r=Reflect.decorate(e,t,a,n);else for(var i=e.length-1;i>=0;i--)(l=e[i])&&(r=(o<3?l(r):o>3?l(t,a,r):l(t,a))||r);return o>3&&r&&Object.defineProperty(t,a,r),r},k=function(e){(0,p.default)(a,e);var t=v(a);function a(){var e;return(0,s.default)(this,a),e=t.apply(this,arguments),e.handleValues=function(){e.props.form.validateFields(function(t,a){e.props.search(a)})},e.reset=function(){e.props.form.resetFields(),e.props.search()},e}return(0,f.default)(a,[{key:"render",value:function(){var e=this.props,t=e.form.getFieldDecorator,a=e.statuses,n=d.default.Option;Object.keys(a).map(function(e){return g.default.createElement(n,{key:e,value:e},a[e])});return g.default.createElement(c.default,{autoComplete:"off",className:y.default["search-wraper"]},g.default.createElement(u.default,{className:"operation-bar ".concat(y.default.operations),gutter:10,type:"flex"},g.default.createElement(i.default,{span:6},g.default.createElement(c.default.Item,{style:{display:"inline-block",marginBottom:0}},t("book_title")(g.default.createElement(r.default,{placeholder:"Book Title"})))),g.default.createElement(i.default,{span:6},g.default.createElement("div",{className:y.default["operation-btn"]},g.default.createElement(o.default,{type:"primary",icon:"search",onClick:this.handleValues},(0,b.formatMessage)({id:"app.material.search"}))),g.default.createElement("div",{className:y.default["operation-btn"]},g.default.createElement(o.default,{onClick:this.reset},(0,b.formatMessage)({id:"app.material.reset"})))),g.default.createElement(i.default,{span:2},g.default.createElement("div",{className:y.default["operation-btn"]},g.default.createElement(o.default,{type:"primary",onClick:this.props.add},this.props.addTitle)))))}}]),a}(g.PureComponent);k=E([c.default.create()],k);var w=k;t.default=w},jtP3:function(e,t,a){"use strict";var n=a("tAuX"),l=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("2qtc");var o=l(a("kLXV"));a("5NDa");var r=l(a("5rEg"));a("jCWc");var i=l(a("kPKH"));a("14J3");var u=l(a("BMrR")),c=l(a("2Taf")),d=l(a("vZ4D")),s=l(a("MhPg")),f=l(a("l4Ni")),p=l(a("ujKo"));a("iQDF");var m=l(a("+eQT"));a("OaEy");var h=l(a("2fM7"));a("y8nQ");var g=l(a("Vl3Y")),b=a("MuoO"),y=n(a("q1tI")),v=a("LLXN"),_=l(a("mwIZ")),E=l(a("wd/R"));function k(e){return function(){var t,a=(0,p.default)(e);if(w()){var n=(0,p.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,f.default)(this,t)}}function w(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var C=function(e,t,a,n){var l,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)r=Reflect.decorate(e,t,a,n);else for(var i=e.length-1;i>=0;i--)(l=e[i])&&(r=(o<3?l(r):o>3?l(t,a,r):l(t,a))||r);return o>3&&r&&Object.defineProperty(t,a,r),r},x=g.default.Item,O=(h.default.Option,m.default.RangePicker),j=(m.default.MonthPicker,function(e){(0,s.default)(a,e);var t=k(a);function a(e){var n;return(0,c.default)(this,a),n=t.call(this,e),n.handleOk=function(e,t){var a=n.props,l=a.form,o=l.validateFields,r=(l.getFieldsValue,a.dispatch),i=a.copyright_info,u=void 0===i?{}:i,c=n.state,d=c.imgList;c.videoList;e.preventDefault(),console.log(d),o({force:!0},function(e,t){if(!e){var a=(0,E.default)(t["time"][0]).format("YYYY-MM-DD HH:mm:ss"),l=(0,E.default)(t["time"][1]).format("YYYY-MM-DD HH:mm:ss");delete t.time,r({type:"book_info/patchCopyrightInfo",payload:Object.assign(Object.assign(Object.assign({},u),t),{contract_validity_period_start:a,contract_validity_period_end:l})}).then(function(e){e.code||n.handleCancel()})}})},n.handleCancel=function(){n.props.close()},n.rangePickerChange=function(e){console.log(e)},n.FromRender=function(){var e=n.props,t=e.form.getFieldDecorator,a=e.copyright_info,l=(e.dispatch,{labelCol:{xs:{span:24},sm:{span:8}},wrapperCol:{xs:{span:24},sm:{span:16}}});return y.default.createElement(y.default.Fragment,null,y.default.createElement("style",null,"\n        .ant-form-item-label > label{\n          font-size:12px;\n          font-weight:bold;\n        }\n      "),y.default.createElement(u.default,null,y.default.createElement(i.default,{span:12},y.default.createElement(x,Object.assign({},l,{label:"Contract Validity Period"}),t("time",{rules:[{required:!0,message:"Contract Validity Period"}],initialValue:[(0,E.default)((0,_.default)(a,"contract_validity_period_start")),(0,E.default)((0,_.default)(a,"contract_validity_period_end"))]})(y.default.createElement(O,{renderExtraFooter:function(){return"extra footer"},showTime:!0,onChange:function(e){n.rangePickerChange(e)}})))),y.default.createElement(i.default,{span:12},y.default.createElement(x,Object.assign({},l,{label:"Contract Type"}),t("contract_type",{initialValue:(0,_.default)(a,"contract_type")})(y.default.createElement(r.default,{type:"text",placeholder:"Contract Type"})))),y.default.createElement(i.default,{span:12},y.default.createElement(x,Object.assign({},l,{label:"Title Cost(USD)"}),t("rights_cost",{initialValue:(0,_.default)(a,"rights_cost")})(y.default.createElement(r.default,{type:"text",placeholder:"Title Cost(USD)"})))),y.default.createElement(i.default,{span:12},y.default.createElement(x,Object.assign({},l,{label:"ISBN"}),t("isbn",{initialValue:(0,_.default)(a,"isbn")})(y.default.createElement(r.default,{type:"text",placeholder:"ISBN"})))),y.default.createElement(i.default,{span:12},y.default.createElement(x,Object.assign({},l,{label:"Content provider"}),t("content_providcontent_provider",{initialValue:(0,_.default)(a,"content_providcontent_provider")})(y.default.createElement(r.default,{type:"text",placeholder:"Content provider"}))))),y.default.createElement("div",{className:"ant-modal-footer"},y.default.createElement("div",null,y.default.createElement("button",{type:"button",className:"ant-btn ant-btn-danger",onClick:n.handleCancel},y.default.createElement("span",null,(0,v.formatMessage)({id:"app.material.cancel"}))),y.default.createElement("button",{type:"button",className:"ant-btn ant-btn-primary",onClick:function(e){n.handleOk(e,1)}},y.default.createElement("span",null,"Save")))))},n.state={},n}return(0,d.default)(a,[{key:"render",value:function(){this.props.copyright_info,this.handleOk,this.handleCancel;var e=this.FromRender;return y.default.createElement(y.default.Fragment,null,y.default.createElement("style",null,"\n         .___warp .ant-modal-body {\n           padding: 24px 20px 0;\n         }\n         .ant-form-item{\n           margin-bottom:0;\n         }\n        "),y.default.createElement(o.default,{className:"___warp",title:"Edit Copyright",visible:!0,width:1100,footer:null},y.default.createElement(g.default,{autoComplete:"off"},y.default.createElement(e,null))))}}]),a}(y.PureComponent));j=C([(0,b.connect)(function(e){var t=e.book_info,a=t.list,n=t.copyright_info;return{list:a,copyright_info:n}}),g.default.create()],j);var R=j;t.default=R},"k/1N":function(e,t,a){e.exports={operation:"antd-pro-pages-books-components-operation-bar-style.m-operation","operation-btn":"antd-pro-pages-books-components-operation-bar-style.m-operation-btn","search-wraper":"antd-pro-pages-books-components-operation-bar-style.m-search-wraper","search-btn":"antd-pro-pages-books-components-operation-bar-style.m-search-btn",all:"antd-pro-pages-books-components-operation-bar-style.m-all",offline:"antd-pro-pages-books-components-operation-bar-style.m-offline",row:"antd-pro-pages-books-components-operation-bar-style.m-row",pullright:"antd-pro-pages-books-components-operation-bar-style.m-pullright"}},nHo0:function(e,t,a){e.exports={operate:"antd-pro-pages-books-style-operate",icon:"antd-pro-pages-books-style-icon",handle:"antd-pro-pages-books-style-handle","operations-wraper":"antd-pro-pages-books-style-operations-wraper",edit:"antd-pro-pages-books-style-edit",danger:"antd-pro-pages-books-style-danger",delete:"antd-pro-pages-books-style-delete antd-pro-pages-books-style-danger",mrm:"antd-pro-pages-books-style-mrm",search:"antd-pro-pages-books-style-search",list:"antd-pro-pages-books-style-list",avatar:"antd-pro-pages-books-style-avatar",time:"antd-pro-pages-books-style-time",divide:"antd-pro-pages-books-style-divide",date:"antd-pro-pages-books-style-date",loading:"antd-pro-pages-books-style-loading",hide:"antd-pro-pages-books-style-hide"}},znlb:function(e,t,a){"use strict";var n=a("tAuX"),l=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("2qtc");var o=l(a("kLXV"));a("5NDa");var r=l(a("5rEg"));a("jCWc");var i=l(a("kPKH"));a("14J3");var u=l(a("BMrR")),c=l(a("2Taf")),d=l(a("vZ4D")),s=l(a("MhPg")),f=l(a("l4Ni")),p=l(a("ujKo"));a("DZo9");var m=l(a("8z0m")),h=l(a("qIgq"));a("Pwec");var g=l(a("CtXQ"));a("OaEy");var b=l(a("2fM7"));a("y8nQ");var y=l(a("Vl3Y")),v=a("MuoO"),_=n(a("q1tI")),E=a("LLXN"),k=a("UYf5"),w=l(a("mwIZ")),C=l(a("Z0cm"));function x(e){return function(){var t,a=(0,p.default)(e);if(O()){var n=(0,p.default)(this).constructor;t=Reflect.construct(a,arguments,n)}else t=a.apply(this,arguments);return(0,f.default)(this,t)}}function O(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var j=function(e,t,a,n){var l,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)r=Reflect.decorate(e,t,a,n);else for(var i=e.length-1;i>=0;i--)(l=e[i])&&(r=(o<3?l(r):o>3?l(t,a,r):l(t,a))||r);return o>3&&r&&Object.defineProperty(t,a,r),r},R=y.default.Item,P=(b.default.Option,_.default.createElement("div",null,_.default.createElement(g.default,{type:"plus"}))),N=(_.default.forwardRef(function(e,t){var a=(0,w.default)(e["data-__meta"],"initialValue")||[],n=(0,C.default)(a)?a:[];n=!!n.length&&n.map(function(e,t){return{uid:e,name:e,status:"done",url:"".concat(e,"?x-oss-process=image/resize,w_80,h_80")}});var l=(0,_.useState)(n),o=(0,h.default)(l,2),r=o[0],i=o[1];console.log(n,"file_list");var u=function(t){e.onChange(t)};return _.default.createElement(m.default,{accept:"image/*",listType:"picture-card",fileList:r,showUploadList:{showPreviewIcon:!0,showDownloadIcon:!0,showRemoveIcon:!0},onPreview:function(e){window.open(e.name)},onDownload:function(e){window.open(e.name)},customRequest:function(t){e.handleChange(t,function(e){var t={uid:e,name:e,status:"done",url:"".concat(e,"?x-oss-process=image/resize,w_80,h_80")};i([t]),u(e)})},onRemove:function(e){i([]),u("")}},r.length>=1?null:P)}),_.default.forwardRef(function(e,t){var a=function(t){e.onChange(t)};return _.default.createElement(k.Editor,{apiKey:"t2n9jf71r9b2l5ufml0eyinqlhb3ci161wcqsao3n6zkwgyy",initialValue:(0,w.default)(e["data-__meta"],"initialValue")||"",init:{height:500,menubar:!1,automatic_uploads:!0,elementpath:!1,plugins:["advlist autolink lists link image charmap print preview anchor","searchreplace visualblocks code fullscreen","insertdatetime media table paste code help wordcount","image"],images_upload_handler:function(t,a,n,l){console.log(t.blob()),e.uploadHandle(t,a,n,l)},toolbar:"undo redo | formatselect | bold italic forecolor backcolor |       alignleft aligncenter alignright alignjustify |       bullist numlist outdent indent lineheight_formats | removeformat | image code"},onEditorChange:a})})),M=function(e){(0,s.default)(a,e);var t=x(a);function a(e){var n;return(0,c.default)(this,a),n=t.call(this,e),n.handleOk=function(e,t){var a=n.props,l=a.form.validateFields,o=a.dispatch,r=a.chapter_info,i=void 0===r?{}:r,u=a.chapter_list;e.preventDefault(),l({force:!0},function(e,t){e||o({type:"book_info/patchChapterInfo",payload:Object.assign(Object.assign(Object.assign({},i),t),{book_id:u[0].book_id})}).then(function(e){e.code||n.handleCancel(1)})})},n.handleCancel=function(e){n.props.close(e)},n.FromRender=function(){var e=n.state,t=(e.imgList,e.videoList,n.props),a=t.form.getFieldDecorator,l=(t.book_info,t.dispatch),o=t.chapter_info,c={labelCol:{xs:{span:24},sm:{span:4}},wrapperCol:{xs:{span:24},sm:{span:20}}},d={labelCol:{xs:{span:24},sm:{span:8}},wrapperCol:{xs:{span:24},sm:{span:16}}};return _.default.createElement(_.default.Fragment,null,_.default.createElement("style",null,"\n        .ant-form-item-label > label{\n          font-size:12px;\n          font-weight:bold;\n        }\n      "),_.default.createElement(u.default,null,_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Chapter name"}),a("chapter_name",{rules:[{required:!0,message:"Title Name"}],initialValue:(0,w.default)(o,"chapter_name")})(_.default.createElement(r.default,{type:"text",placeholder:"Title Name"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"External ID"}),a("external_id",{initialValue:(0,w.default)(o,"external_id")})(_.default.createElement(r.default,{type:"text",placeholder:"External ID"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Inner chapter id"}),a("inner_chapter_id",{initialValue:(0,w.default)(o,"inner_chapter_id")})(_.default.createElement(r.default,{type:"text",placeholder:"Inner chapter id"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Price"}),a("price",{rules:[{required:!0,message:"Price"}],initialValue:(0,w.default)(o,"price")})(_.default.createElement(r.default,{type:"text",placeholder:"Price"})))),_.default.createElement(i.default,{span:12},_.default.createElement(R,Object.assign({},d,{label:"Total Word Count"}),a("total_word_count",{rules:[{required:!0,message:"Total Word Count"}],initialValue:(0,w.default)(o,"total_word_count")})(_.default.createElement(r.default,{type:"text",placeholder:"Total Word Count"}))))),_.default.createElement(R,Object.assign({},c,{label:"Synopsis"}),a("chapter_content_text",{rules:[{required:!0,message:"chapter_content_text"}],initialValue:(0,w.default)(o,"chapter_content_text"),trigger:"onChange"})(_.default.createElement(N,{uploadHandle:function(e,t,a,n){l({type:"book_info/uploadMultiMediaHandle",payload:{multiMedia:e.blob()}}).then(function(e){console.log(e,"res==");var a=e.code,n=e.data;0==a&&t(n.url)})}}))),_.default.createElement("div",{className:"ant-modal-footer"},_.default.createElement("div",null,_.default.createElement("button",{type:"button",className:"ant-btn ant-btn-danger",onClick:n.handleCancel},_.default.createElement("span",null,(0,E.formatMessage)({id:"app.material.cancel"}))),_.default.createElement("button",{type:"button",className:"ant-btn ant-btn-primary",onClick:function(e){n.handleOk(e,1)}},_.default.createElement("span",null,"Save")))))},n.state={imgList:[],videoList:[]},n}return(0,d.default)(a,[{key:"render",value:function(){var e=this.props,t=(e.book_info,e.chapter_info),a=this.handleOk,n=this.handleCancel,l=this.FromRender;return _.default.createElement(_.default.Fragment,null,_.default.createElement("style",null,"\n         .___warp .ant-modal-body {\n           padding: 24px 20px 0;\n         }\n         .ant-form-item{\n           margin-bottom:0;\n         }\n        "),_.default.createElement(o.default,{className:"___warp",title:Object.keys(t).length?"Add new book":"Edit book",visible:!0,onOk:a,okText:(0,E.formatMessage)({id:"app.material.publish"}),cancelText:(0,E.formatMessage)({id:"app.material.saveasdraft"}),onCancel:n,width:1100,footer:null,zIndex:1001},_.default.createElement(y.default,{autoComplete:"off"},_.default.createElement(l,null))))}}]),a}(_.PureComponent);M=j([(0,v.connect)(function(e){var t=e.book_info,a=t.list,n=t.book_info,l=t.chapter_info,o=t.chapter_list;return{list:a,book_info:n,chapter_info:l,chapter_list:o}}),y.default.create()],M);var I=M;t.default=I}}]);