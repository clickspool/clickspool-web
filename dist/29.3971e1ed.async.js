(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[29],{TQD0:function(e,a,t){"use strict";var l=t("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0,t("14J3");var n=l(t("BMrR"));t("+L6B");var r=l(t("2/Rp"));t("jCWc");var u=l(t("kPKH")),f=l(t("jehZ"));t("5NDa");var s=l(t("5rEg"));t("sPJy");var i=l(t("bE4q"));t("Pwec");var o=l(t("CtXQ")),d=l(t("p0pE")),c=l(t("2Taf")),p=l(t("vZ4D")),m=l(t("MhPg")),h=l(t("l4Ni")),E=l(t("ujKo"));t("OaEy");var b=l(t("2fM7"));t("y8nQ");var v,g,y,M,P=l(t("Vl3Y")),k=(t("o/YY"),t("MuoO")),_=l(t("q1tI")),w=t("LLXN"),I=l(t("ZagU"));function N(e){return function(){var a,t=(0,E.default)(e);if(q()){var l=(0,E.default)(this).constructor;a=Reflect.construct(t,arguments,l)}else a=t.apply(this,arguments);return(0,h.default)(this,a)}}function q(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}var C=P.default.Item,D=(b.default.Option,v=P.default.create(),g=(0,k.connect)(function(e){var a=e.permission.publisherInfo;return{publisherInfo:a}}),v(y=g((M=function(e){(0,m.default)(t,e);var a=N(t);function t(){var e;(0,c.default)(this,t);for(var l=arguments.length,n=new Array(l),r=0;r<l;r++)n[r]=arguments[r];return e=a.call.apply(a,[this].concat(n)),e.onOk=function(){var a=e.props.publisherInfo;e.props.form.validateFields(function(e,t){e||modifyPublisher((0,d.default)({},a,t))})},e.onCancel=function(){e.props.onCallback()},e.uploadImage=function(){},e}return(0,p.default)(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e={labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:18}}},a=this.props,t=a.form.getFieldDecorator,l=(a.visible,a.publisherInfo);return _.default.createElement(_.default.Fragment,null,_.default.createElement("div",{className:I.default.breadcrumbBox},_.default.createElement(i.default,null,_.default.createElement(i.default.Item,null,_.default.createElement(o.default,{type:"lock"}),_.default.createElement("span",null,(0,w.formatMessage)({id:"menu.operation"}))),_.default.createElement(i.default.Item,null,(0,w.formatMessage)({id:"menu.profile"})))),_.default.createElement(n.default,null,_.default.createElement(u.default,{span:12},_.default.createElement(P.default,null,_.default.createElement(C,(0,f.default)({},e,{label:(0,w.formatMessage)({id:"app.permission.table.name"})}),t("nickname",{initialValue:l.nickname,rules:[{required:!0,message:(0,w.formatMessage)({id:"app.global.form.pleaseName"})}]})(_.default.createElement(s.default,{placeholder:(0,w.formatMessage)({id:"app.permission.table.name"})}))),_.default.createElement(C,(0,f.default)({},e,{label:(0,w.formatMessage)({id:"app.permission.table.phone"})}),t("email",{initialValue:l.email,rules:[{required:!0,message:(0,w.formatMessage)({id:"app.permission.pleasePhone"})}]})(_.default.createElement(s.default,{disabled:!0,placeholder:(0,w.formatMessage)({id:"app.permission.table.phone"})}))),_.default.createElement(C,(0,f.default)({},e,{label:"First Name"}),t("first_name",{initialValue:l.first_name,rules:[{required:!0,message:"Please input first name"}]})(_.default.createElement(s.default,{placeholder:"First Name"}))),_.default.createElement(C,(0,f.default)({},e,{label:"Last Name"}),t("last_name",{initialValue:l.last_name,rules:[{required:!0,message:"Please input last_name"}]})(_.default.createElement(s.default,{placeholder:"Last Name"}))),_.default.createElement(C,(0,f.default)({},e,{label:"Telephone"}),t("phone_number",{initialValue:l.last_name,rules:[{required:!0,message:"Please input telephone"}]})(_.default.createElement(s.default,{placeholder:"Telephone"}))),_.default.createElement(C,(0,f.default)({},e,{label:"Paypal account"}),t("paypal_account",{initialValue:l.paypal_account,rules:[{required:!0,message:"Please input paypal account"}]})(_.default.createElement(s.default,{placeholder:"Paypal account"})))),_.default.createElement(n.default,null,_.default.createElement(u.default,{span:6}),_.default.createElement(u.default,{span:18},_.default.createElement(r.default,{type:"primary",onClick:this.onOk},(0,w.formatMessage)({id:"app.permission.save"})))))))}}]),t}(_.default.Component),y=M))||y)||y),R=D;a.default=R}}]);