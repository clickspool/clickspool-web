(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[69],{c1vQ:function(e,t,n){"use strict";var r=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=r(n("d6i3")),s=n("DjT0"),u={namespace:"log",state:{list:[],filter:{page:1,page_size:20,total:0}},reducers:{update:function(e,t){var n=t.payload;return Object.assign(Object.assign({},e),n)},filter:function(e,t){var n=t.payload,r=n.filter;return Object.assign(Object.assign({},e),{filter:Object.assign(Object.assign({},e.filter),r)})}},effects:{fetch:a.default.mark(function e(t,n){var r,u,c,i,o,p,l,f;return a.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,u=n.call,c=n.put,i=n.select,e.next=4,i(function(e){return e.log.filter});case 4:return o=e.sent,e.next=7,u(s.fetch,Object.assign(Object.assign({},o),r));case 7:if(p=e.sent,!r||!r.export){e.next=10;break}return e.abrupt("return");case 10:return l=p.code,f=p.data,e.next=13,c({type:"update",payload:{list:l?[]:f.list}});case 13:return e.next=15,c({type:"filter",payload:{filter:{total:f.total_count}}});case 15:case"end":return e.stop()}},e)}),getEnum:a.default.mark(function e(t,n){var r,u,c;return a.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n.call,r=n.put,function(e){e[e["turnoverFromTypes"]=0]="turnoverFromTypes"}(u||(u={})),e.next=5,Promise.all([(0,s.turnoverFromTypes)()]).then(function(e){var t={turnoverFromTypes:{}};return e.map(function(e,n){0===+e.code&&(t[u[n]]=e.data)}),new Promise(function(e,n){e(t)})});case 5:return c=e.sent,e.next=8,r({type:"update",payload:c});case 8:case"end":return e.stop()}},e)})},subscriptions:{setup:function(e){var t=e.history,n=e.dispatch;return t.listen(function(e){e.pathname.indexOf("/order/log")>-1&&(n({type:"fetch"}),n({type:"getEnum"}))})}}};t.default=u}}]);