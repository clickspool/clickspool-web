(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[30],{TQD0:function(e,t,a){"use strict";var l=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("14J3");var n=l(a("BMrR"));a("+L6B");var r=l(a("2/Rp"));a("jCWc");var u=l(a("kPKH")),f=l(a("jehZ"));a("5NDa");var s=l(a("5rEg"));a("sPJy");var i=l(a("bE4q"));a("Pwec");var o=l(a("CtXQ")),d=l(a("p0pE")),c=l(a("2Taf")),m=l(a("vZ4D")),p=l(a("MhPg")),v=l(a("l4Ni")),h=l(a("ujKo"));a("OaEy");var E=l(a("2fM7"));a("y8nQ");var b,g,y,k,M=l(a("Vl3Y")),P=(a("o/YY"),a("MuoO")),w=l(a("q1tI")),I=a("LLXN"),N=l(a("ZagU"));function _(e){return function(){var t,a=(0,h.default)(e);if(C()){var l=(0,h.default)(this).constructor;t=Reflect.construct(a,arguments,l)}else t=a.apply(this,arguments);return(0,v.default)(this,t)}}function C(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var D=M.default.Item,R=(E.default.Option,b=M.default.create(),g=(0,P.connect)(function(e){var t=e.permission.publisherInfo;return{publisherInfo:t}}),b(y=g((k=function(e){(0,p.default)(a,e);var t=_(a);function a(){var e;(0,c.default)(this,a);for(var l=arguments.length,n=new Array(l),r=0;r<l;r++)n[r]=arguments[r];return e=t.call.apply(t,[this].concat(n)),e.onOk=function(){var t=e.props.publisherInfo;e.props.form.validateFields(function(e,a){e||modifyPublisher((0,d.default)({},t,a))})},e.onCancel=function(){e.props.onCallback()},e.uploadImage=function(){},e}return(0,m.default)(a,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e={labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:18}}},t=this.props,a=t.form.getFieldDecorator,l=(t.visible,t.publisherInfo);return w.default.createElement(w.default.Fragment,null,w.default.createElement("div",{className:N.default.breadcrumbBox},w.default.createElement(i.default,null,w.default.createElement(i.default.Item,null,w.default.createElement(o.default,{type:"lock"}),w.default.createElement("span",null,(0,I.formatMessage)({id:"menu.operation"}))),w.default.createElement(i.default.Item,null,(0,I.formatMessage)({id:"menu.profile"})))),w.default.createElement(n.default,null,w.default.createElement(u.default,{span:12},w.default.createElement(M.default,null,w.default.createElement(D,(0,f.default)({},e,{label:(0,I.formatMessage)({id:"app.permission.table.name"})}),a("nickname",{initialValue:l.nickname,rules:[{required:!0,message:(0,I.formatMessage)({id:"app.global.form.pleaseName"})}]})(w.default.createElement(s.default,{placeholder:(0,I.formatMessage)({id:"app.permission.table.name"})}))),w.default.createElement(D,(0,f.default)({},e,{label:"First Name"}),a("first_name",{initialValue:l.first_name,rules:[{required:!0,message:"Please input first name"}]})(w.default.createElement(s.default,{placeholder:"First Name"}))),w.default.createElement(D,(0,f.default)({},e,{label:"Last Name"}),a("last_name",{initialValue:l.last_name,rules:[{required:!0,message:"Please input last_name"}]})(w.default.createElement(s.default,{placeholder:"Last Name"}))),w.default.createElement(D,(0,f.default)({},e,{label:"Telephone"}),a("phone_number",{initialValue:l.last_name,rules:[{required:!0,message:"Please input telephone"}]})(w.default.createElement(s.default,{placeholder:"Telephone"})))),w.default.createElement(n.default,null,w.default.createElement(u.default,{span:6}),w.default.createElement(u.default,{span:18},w.default.createElement(r.default,{type:"primary",onClick:this.onOk},(0,I.formatMessage)({id:"app.permission.save"})))))))}}]),a}(w.default.Component),y=k))||y)||y),q=R;t.default=q}}]);