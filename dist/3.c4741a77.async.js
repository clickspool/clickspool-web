(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{"9RO2":function(t,e,a){"use strict";var s=a("g09b");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=s(a("p0pE")),n=s(a("d6i3")),u=a("o/YY"),i=(a("+n12"),{namespace:"permission",state:{data:{data:[]},roleList:[],statusList:[]},effects:{getList:n.default.mark(function t(e,a){var s,r,i,d;return n.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return s=e.payload,r=a.call,i=a.put,t.next=4,r(u.getList,s);case 4:return d=t.sent,t.next=7,i({type:"getPermissionStatus",payload:d});case 7:case"end":return t.stop()}},t)}),getRoleList:n.default.mark(function t(e,a){var s,r,i,d;return n.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return s=e.payload,r=a.call,i=a.put,t.next=4,r(u.getRoleList,s);case 4:return d=t.sent,t.next=7,i({type:"getRoleListStatus",payload:d});case 7:case"end":return t.stop()}},t)}),getMemberStatusList:n.default.mark(function t(e,a){var s,r,i,d;return n.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return s=e.payload,r=a.call,i=a.put,t.next=4,r(u.getMemberStatusList,s);case 4:return d=t.sent,t.next=7,i({type:"memberStatusList",payload:d});case 7:case"end":return t.stop()}},t)})},reducers:{getPermissionStatus:function(t,e){var a=e.payload;return a?(0,r.default)({},t,{data:a.data}):(0,r.default)({},t)},getRoleListStatus:function(t,e){var a=e.payload;return a?(0,r.default)({},t,{roleList:a.data.data}):(0,r.default)({},t)},memberStatusList:function(t,e){var a=e.payload;return a?(0,r.default)({},t,{statusList:a.data}):(0,r.default)({},t)}}});e.default=i}}]);