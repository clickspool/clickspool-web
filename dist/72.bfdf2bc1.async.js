(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[72],{UG3s:function(t,e,a){"use strict";var n=a("g09b");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=n(a("d6i3")),s=a("3wjR"),u={namespace:"giftOrder",state:{list:[],filter:{page:1,page_size:20,total:0}},reducers:{update:function(t,e){var a=e.payload;return Object.assign(Object.assign({},t),a)},filter:function(t,e){var a=e.payload,n=a.filter;return Object.assign(Object.assign({},t),{filter:Object.assign(Object.assign({},t.filter),n)})}},effects:{fetch:r.default.mark(function t(e,a){var n,u,p,c,i,o,l,f;return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return n=e.payload,u=a.call,p=a.put,c=a.select,t.next=4,c(function(t){return t.giftOrder.filter});case 4:return i=t.sent,t.next=7,u(s.fetch,Object.assign(Object.assign({},i),n));case 7:if(o=t.sent,!n||!n.export){t.next=10;break}return t.abrupt("return");case 10:return l=o.code,f=o.data,t.next=13,p({type:"update",payload:{list:l?[]:f.list}});case 13:return t.next=15,p({type:"filter",payload:{filter:{total:f.total_count}}});case 15:case"end":return t.stop()}},t)}),getEnum:r.default.mark(function t(e,a){var n,u,p;return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return a.call,n=a.put,function(t){t[t["payTypes"]=0]="payTypes",t[t["statusMap"]=1]="statusMap",t[t["productMap"]=2]="productMap",t[t["GlobalCountryMap"]=3]="GlobalCountryMap"}(u||(u={})),t.next=5,Promise.all([(0,s.payTypes)(),(0,s.statusMap)(),(0,s.productMap)(),(0,s.getGlobalCountryMap)()]).then(function(t){var e={turnoverFromTypes:{}};return t.map(function(t,a){0===+t.code&&(e[u[a]]=t.data)}),new Promise(function(t,a){t(e)})});case 5:return p=t.sent,t.next=8,n({type:"update",payload:p});case 8:case"end":return t.stop()}},t)})},subscriptions:{setup:function(t){var e=t.history,a=t.dispatch;return e.listen(function(t){t.pathname.indexOf("/order/giftOrder")>-1&&(a({type:"fetch"}),a({type:"getEnum"}))})}}};e.default=u}}]);