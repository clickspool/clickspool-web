(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{UToR:function(t,a,e){"use strict";var s=e("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var u=s(e("p0pE")),n=s(e("d6i3")),r=e("GRak"),d={namespace:"faq",state:{data:{list:[],page:1,total_count:0},statusList:{}},effects:{getList:n.default.mark(function t(a,e){var s,u,d,i;return n.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return s=a.payload,u=e.call,d=e.put,t.next=4,u(r.getFaqList,s);case 4:return i=t.sent,t.next=7,d({type:"getFaqListStatus",payload:i});case 7:case"end":return t.stop()}},t)}),getFaqCateStatusList:n.default.mark(function t(a,e){var s,u,d,i;return n.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return s=a.payload,u=e.call,d=e.put,t.next=4,u(r.getFaqStatusList,s);case 4:return i=t.sent,t.next=7,d({type:"getFaqCateStatusListStatus",payload:i});case 7:case"end":return t.stop()}},t)})},reducers:{getFaqListStatus:function(t,a){var e=a.payload;return e?(0,u.default)({},t,{data:e.data}):(0,u.default)({},t)},getFaqCateStatusListStatus:function(t,a){var e=a.payload;return e?(0,u.default)({},t,{statusList:e.data}):(0,u.default)({},t)}}};a.default=d}}]);