(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{D769:function(e,t,n){"use strict";var a=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a(n("d6i3")),s=n("pq6W"),c={namespace:"upper",state:{filter:{page:1,page_size:20,total:0},list:[],sex:{}},reducers:{update:function(e,t){var n=t.payload;return Object.assign(Object.assign({},e),n)},filter:function(e,t){var n=t.payload,a=n.filter;return Object.assign(Object.assign({},e),{filter:Object.assign(Object.assign({},e.filter),a)})},saveSingle:function(e,t){var n=t.payload.item,a=Object.assign({},e),r=a.list,s=void 0===r?[]:r;return s=s.map(function(e){return e.id===n.id?n:e}),Object.assign(Object.assign({},e),{list:s})}},effects:{fetch:r.default.mark(function e(t,n){var a,c,i,u,o,l,p;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.payload,a=n.call,c=n.put,i=n.select,e.next=4,i(function(e){return e.upper.filter});case 4:return u=e.sent,e.next=7,a(s.fetch,u);case 7:return o=e.sent,l=o.code,p=o.data,e.next=11,c({type:"update",payload:{list:l?[]:p.list}});case 11:return e.next=13,c({type:"filter",payload:{filter:{total:p.total_count}}});case 13:case"end":return e.stop()}},e)}),batchSetIdentity:r.default.mark(function e(t,n){var a,c,i,u,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,c=n.call,i=n.put,e.next=4,c(s.batchSetIdentity,Object.assign({},a));case 4:if(u=e.sent,o=u.code,o){e.next=9;break}return e.next=9,i({type:"fetch"});case 9:return e.abrupt("return",new Promise(function(e){e(u)}));case 10:case"end":return e.stop()}},e)}),modify:r.default.mark(function e(t,n){var a,c,i,u,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,c=n.call,i=n.put,e.next=4,c(s.setCreateRoomAuth,Object.assign({},a));case 4:if(u=e.sent,o=u.code,o){e.next=9;break}return e.next=9,i({type:"fetch"});case 9:return e.abrupt("return",new Promise(function(e){e(u)}));case 10:case"end":return e.stop()}},e)}),setUserOrganization:r.default.mark(function e(t,n){var a,c,i,u,o,l;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,c=n.call,i=n.put,console.info("payload__setUserOrganization",a),e.next=5,c(s.setUserOrganization,Object.assign({},a));case 5:if(u=e.sent,o=a.user_id,l=u.code,l){e.next=11;break}return e.next=11,i({type:"fetchSingle",payload:{creator_id:o}});case 11:return e.abrupt("return",u);case 12:case"end":return e.stop()}},e)}),getEnum:r.default.mark(function e(t,n){var a,c,i;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n.call,a=n.put,function(e){e[e["sex"]=0]="sex"}(c||(c={})),e.next=5,Promise.all([(0,s.getUserSexList)()]).then(function(e){var t={sex:{}};return e.map(function(e,n){0===+e.code&&(t[c[n]]=e.data)}),new Promise(function(e,n){e(t)})});case 5:return i=e.sent,e.next=8,a({type:"update",payload:i});case 8:case"end":return e.stop()}},e)}),fetchSingle:r.default.mark(function e(t,n){var a,c,i,u,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload.creator_id,c=n.call,i=n.put,e.next=4,c(s.fetch,{creator_id:a});case 4:if(u=e.sent,!u||0!==u.code){e.next=9;break}return o=u.data.list.filter(function(e){return e.creator_id==a})[0],e.next=9,i({type:"saveSingle",payload:{item:o}});case 9:case"end":return e.stop()}},e)}),setUserOfficialRec:r.default.mark(function e(t,n){var a,c,i,u,o,l;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,c=a.user_id,i=a.is_recommend,u=n.call,o=n.put,e.next=4,u(s.setUserOfficialRec,{user_id:c,is_recommend:i});case 4:if(l=e.sent,!l||0!==l.code){e.next=9;break}return e.next=8,o({type:"fetchSingle",payload:{creator_id:c}});case 8:return e.abrupt("return",l);case 9:case"end":return e.stop()}},e)})},subscriptions:{setup:function(e){var t=e.history,n=e.dispatch;t.listen(function(e){var t=e.pathname;t.indexOf("/operation/host/manage")>-1&&n({type:"getEnum"})})}}};t.default=c}}]);