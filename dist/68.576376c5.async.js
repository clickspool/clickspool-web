(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[68],{IyT7:function(e,t,a){"use strict";var n=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a("d6i3")),s=a("ukBx"),c=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(n=Object.getOwnPropertySymbols(e);r<n.length;r++)t.indexOf(n[r])<0&&Object.prototype.propertyIsEnumerable.call(e,n[r])&&(a[n[r]]=e[n[r]])}return a},u={state:{list:[],total:null,pages:null,page:null,pageSize:20,loading:!1,statuses:{1:"\u5f85\u5ba1\u6838",2:"\u5ba1\u6838\u6210\u529f",3:"\u5ba1\u6838\u5931\u8d25"},groupTypes:new Map,tags:[],sendTypes:null,ruleTypes:new Map([["0","\u666e\u901a\u6d88\u606f"],["1","\u97f3\u89c6\u9891\u901a\u8bdd"]])},reducers:{updateState:function(e,t){var a=t.payload;return Object.assign(Object.assign({},e),a)},save:function(e,t){var a=t.payload,n=a.list,r=a.total,s=a.pages;return Object.assign(Object.assign({},e),{list:n,total:r,pages:s})},saveSingle:function(e,t){var a=t.payload.item,n=Object.assign({},e),r=n.list,s=void 0===r?[]:r;return s=s.map(function(e){return e.id===a.id?a:e}),Object.assign(Object.assign({},e),{list:s})},deleteUpdate:function(e,t){var a=t.payload.deletedId,n=e.list;return n=n.filter(function(e){return e.id!=a}),Object.assign(Object.assign({},e),{list:n})},changePageSize:function(e,t){var a=t.payload,n=a.page,r=a.pageSize;return Object.assign(Object.assign({},e),{page:n,pageSize:r})},saveGroupTypes:function(e,t){var a=t.payload.types,n=new Map,r=Object.keys(a);return Array.isArray(r)&&r.map(function(e){n.set(e,a[e])}),Object.assign(Object.assign({},e),{groupTypes:n})},saveTags:function(e,t){var a=t.payload.tags,n=new Map,r=Object.keys(a);return Array.isArray(r)&&r.map(function(e){n.set(e,a[e])}),Object.assign(Object.assign({},e),{tags:n})},saveRuleTypes:function(e,t){var a=t.payload.ruleTypes,n=new Map;return Object.keys(a).map(function(e){n.set(e,a[e])}),Object.assign(Object.assign({},e),{ruleTypes:n})},saveSendTypes:function(e,t){var a=t.payload.sendTypes,n=new Map;return Object.keys(a).map(function(e){1===+e&&(n.set("text",e),n.set("media",e)),2===+e&&n.set("makefriend",e)}),Object.assign(Object.assign({},e),{sendTypes:n})}},effects:{fetch:r.default.mark(function e(t,a){var n,u,p,i,l,o,d,f,y;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=a.call,u=a.put,p=c(t.payload,[]),i=p.page,e.next=5,n(s.fetch,p);case 5:if(l=e.sent,o=l.data,d=o.list,f=o.total_count,y=o.total_page,e.t0=i,!e.t0){e.next=14;break}return e.next=14,u({type:"updateState",payload:{page:i}});case 14:return e.next=16,u({type:"save",payload:{list:d,total:f,pages:y}});case 16:case"end":return e.stop()}},e)}),fetchSingle:r.default.mark(function e(t,a){var n,c,u,p,i;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload.id,c=a.call,u=a.put,e.next=4,c(s.fetch,{id:n});case 4:if(p=e.sent,!p||0!==p.code){e.next=9;break}return i=p.data.list.filter(function(e){return e.id==n})[0],e.next=9,u({type:"saveSingle",payload:{item:i}});case 9:case"end":return e.stop()}},e)}),patchStatus:r.default.mark(function e(t,a){var n,c,u,p,i,l,o,d;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,c=n.id,u=n.status,p=n.recommend_score,i=n.reason,l=a.call,o=a.put,e.next=4,l(s.patchStatus,{status:u,id:c,recommend_score:p,reason:i});case 4:if(d=e.sent,!d||0!==d.code){e.next=9;break}return e.next=8,o({type:"fetchSingle",payload:{id:c}});case 8:return e.abrupt("return",d);case 9:case"end":return e.stop()}},e)}),compressVideo:r.default.mark(function e(t,a){var n,c,u,p,i,l;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,c=n.id,u=n.crf,p=a.call,i=a.put,e.next=4,p(s.compressVideo,{id:c,crf:u});case 4:if(l=e.sent,!l||0!==l.code){e.next=9;break}return e.next=8,i({type:"fetchSingle",payload:{id:c}});case 8:return e.abrupt("return",l);case 9:case"end":return e.stop()}},e)}),deWatermarkVideo:r.default.mark(function e(t,a){var n,c,u,p;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload.id,c=a.call,u=a.put,e.next=4,c(s.deWatermarkVideo,{id:n});case 4:if(p=e.sent,!p||0!==p.code){e.next=9;break}return e.next=8,u({type:"fetchSingle",payload:{id:n}});case 8:return e.abrupt("return",p);case 9:case"end":return e.stop()}},e)}),setUserCallAlert:r.default.mark(function e(t,a){var n,c,u,p,i,l,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,c=n.user_id,u=n.is_alert,p=n.id,i=a.call,l=a.put,e.next=4,i(s.setUserCallAlert,{user_id:c,is_alert:u});case 4:if(o=e.sent,!o||0!==o.code){e.next=9;break}return e.next=8,l({type:"fetchSingle",payload:{id:p}});case 8:return e.abrupt("return",o);case 9:case"end":return e.stop()}},e)}),fetchTagMap:r.default.mark(function e(t,a){var n,c,u;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.payload,n=a.call,c=a.put,e.next=4,n(s.fetchTagMap);case 4:if(u=e.sent,!u||0!==u.code){e.next=9;break}return e.next=8,c({type:"updateState",payload:{tags:u.data}});case 8:return e.abrupt("return",u);case 9:case"end":return e.stop()}},e)}),fetchUserTypeMap:r.default.mark(function e(t,a){var n,c,u;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.payload,n=a.call,c=a.put,e.next=4,n(s.userTypeMap);case 4:if(u=e.sent,!u||0!==u.code){e.next=9;break}return e.next=8,c({type:"updateState",payload:{userTypeMap:u.data}});case 8:return e.abrupt("return",u);case 9:case"end":return e.stop()}},e)}),fetchAudioTagMap:r.default.mark(function e(t,a){var n,c,u;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.payload,n=a.call,c=a.put,e.next=4,n(s.chatTagsMap);case 4:if(u=e.sent,!u||0!==u.code){e.next=9;break}return e.next=8,c({type:"updateState",payload:{chatTagsMap:u.data}});case 8:return e.abrupt("return",u);case 9:case"end":return e.stop()}},e)}),reload:r.default.mark(function e(t,a){var n;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=a.put,a.select,e.next=3,n({type:"fetch"});case 3:case"end":return e.stop()}},e)}),cancelRecommend:r.default.mark(function e(t,a){var n,c;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=a.call,a.put,e.next=3,n(s.cancelRecommend,{id:t.payload.id});case 3:return c=e.sent,e.abrupt("return",c);case 5:case"end":return e.stop()}},e)})},subscriptions:{setup:function(e){var t=e.dispatch,a=e.history;return a.listen(function(e){var a=e.pathname;e.search;"/operation/user/apply"===a&&(t({type:"fetch"}),t({type:"fetchTagMap"}),t({type:"fetchAudioTagMap"}),t({type:"fetchUserTypeMap"}))})}}};t.default=u}}]);