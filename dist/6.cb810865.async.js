(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{HXJ6:function(e,t,a){"use strict";var n=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a("d6i3")),u=a("YwFa"),i={namespace:"market",state:{list:[],total:null,pages:null,page:1,page_size:20,loading:!1,statuses:{},groupTypes:new Map,tags:new Map,types:{},merchantMap:{},promotion_url:""},reducers:{updateState:function(e,t){var a=t.payload;return Object.assign(Object.assign({},e),a)},save:function(e,t){var a=t.payload,n=a.list,r=a.total,u=a.pages;return Object.assign(Object.assign({},e),{list:n,total:r,pages:u})}},effects:{receive:r.default.mark(function e(t,a){var n,i,o,s;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,i=a.call,o=a.put,a.select,e.next=4,i(u.receive,n);case 4:if(s=e.sent,e.t0=s.data.promotion_url,!e.t0){e.next=9;break}return e.next=9,o({type:"updateState",payload:{promotion_url:s.data.promotion_url}});case 9:if(s.code){e.next=12;break}return e.next=12,o({type:"fetch"});case 12:return e.abrupt("return",s);case 13:case"end":return e.stop()}},e)}),fetch:r.default.mark(function e(t,a){var n,i,o,s,c,p,l,d,f,h,v;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,i=a.call,o=a.put,s=a.select,e.next=4,s(function(e){return e.market.page_size});case 4:return c=e.sent,e.next=7,s(function(e){return e.market.page});case 7:return p=e.sent,e.next=10,i(u.fetch,Object.assign({page_size:c,page:p},n));case 10:if(l=e.sent,d=l.data,f=d.list,h=d.total_count,v=d.total_page,e.t0=(n||{}).page||p,!e.t0){e.next=19;break}return e.next=19,o({type:"updateState",payload:{page:(n||{}).page||p}});case 19:return e.next=21,o({type:"save",payload:{list:f,total:h,pages:v}});case 21:case"end":return e.stop()}},e)})},subscriptions:{setup:function(e){var t=e.dispatch,a=e.history;return a.listen(function(e){var a=e.pathname;e.search;a.indexOf("market")>-1&&t({type:"fetch"})})}}};t.default=i},YwFa:function(e,t,a){"use strict";var n=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.fetch=o,t.receive=s,t.materialDetail=c;var r=n(a("d6i3")),u=n(a("t3Un")),i=function(e,t,a,n){function r(e){return e instanceof a?e:new a(function(t){t(e)})}return new(a||(a=Promise))(function(a,u){function i(e){try{s(n.next(e))}catch(e){u(e)}}function o(e){try{s(n["throw"](e))}catch(e){u(e)}}function s(e){e.done?a(e.value):r(e.value).then(i,o)}s((n=n.apply(e,t||[])).next())})};function o(e){return i(this,void 0,void 0,r.default.mark(function t(){return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.default)("/admin/affiliate/promotionMaterialList",{method:"GET",body:e}));case 1:case"end":return t.stop()}},t)}))}function s(e){return i(this,void 0,void 0,r.default.mark(function t(){return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.default)("/admin/affiliate/receive",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:e}));case 1:case"end":return t.stop()}},t)}))}function c(e){return i(this,void 0,void 0,r.default.mark(function t(){return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.default)("/admin/affiliate/materialInfo",{method:"GET",body:e}));case 1:case"end":return t.stop()}},t)}))}}}]);