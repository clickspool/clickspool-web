(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[71],{qA4O:function(e,t,n){"use strict";var a=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a(n("d6i3")),u=n("p6cA"),s={namespace:"voiceTag",state:{list:[],filter:{page:1,page_size:20,total:0}},reducers:{update:function(e,t){var n=t.payload;return Object.assign(Object.assign({},e),n)},filter:function(e,t){var n=t.payload,a=n.filter;return Object.assign(Object.assign({},e),{filter:Object.assign(Object.assign({},e.filter),a)})}},effects:{fetch:r.default.mark(function e(t,n){var a,s,c,i,o,p,l,f;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,s=n.call,c=n.put,i=n.select,e.next=4,i(function(e){return e.voiceTag.filter});case 4:return o=e.sent,e.next=7,s(u.fetch,Object.assign(Object.assign({},o),a));case 7:if(p=e.sent,!a||!a.export){e.next=10;break}return e.abrupt("return");case 10:return l=p.code,f=p.data,e.next=13,c({type:"update",payload:{list:l?[]:f.list}});case 13:return e.next=15,c({type:"filter",payload:{filter:{total:f.total_count}}});case 15:case"end":return e.stop()}},e)}),add:r.default.mark(function e(t,n){var a,s,c,i,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,s=n.call,c=n.put,e.next=4,s(u.add,Object.assign({},a));case 4:if(i=e.sent,o=i.code,o){e.next=9;break}return e.next=9,c({type:"fetch"});case 9:return e.abrupt("return",new Promise(function(e){e(i)}));case 10:case"end":return e.stop()}},e)}),del:r.default.mark(function e(t,n){var a,s,c,i,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,s=n.call,c=n.put,e.next=4,s(u.del,Object.assign({},a));case 4:if(i=e.sent,o=i.code,o){e.next=9;break}return e.next=9,c({type:"fetch"});case 9:return e.abrupt("return",new Promise(function(e){e(i)}));case 10:case"end":return e.stop()}},e)}),modify:r.default.mark(function e(t,n){var a,s,c,i,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,s=n.call,c=n.put,e.next=4,s(u.modify,Object.assign({},a));case 4:if(i=e.sent,o=i.code,o){e.next=9;break}return e.next=9,c({type:"fetch"});case 9:return e.abrupt("return",new Promise(function(e){e(i)}));case 10:case"end":return e.stop()}},e)}),SetStatus:r.default.mark(function e(t,n){var a,s,c,i,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,s=n.call,c=n.put,e.next=4,s(u.statusSet,Object.assign({},a));case 4:if(i=e.sent,o=i.code,o){e.next=9;break}return e.next=9,c({type:"fetch"});case 9:return e.abrupt("return",new Promise(function(e){e(i)}));case 10:case"end":return e.stop()}},e)}),uploadMedia:r.default.mark(function e(t,n){var a,s,c,i;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,s=n.call,n.put,c=new FormData,c.append("multiMedia",a.multiMedia),e.next=6,s(u.uploadMultiMedia,c);case 6:return i=e.sent,e.abrupt("return",new Promise(function(e){e(i)}));case 8:case"end":return e.stop()}},e)}),getEnum:r.default.mark(function e(t,n){var a,s,c;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n.call,a=n.put,function(e){e[e["statusMap"]=0]="statusMap"}(s||(s={})),e.next=5,Promise.all([(0,u.statusMap)()]).then(function(e){var t={turnoverFromTypes:{}};return e.map(function(e,n){0===+e.code&&(t[s[n]]=e.data)}),new Promise(function(e,n){e(t)})});case 5:return c=e.sent,e.next=8,a({type:"update",payload:c});case 8:case"end":return e.stop()}},e)})},subscriptions:{setup:function(e){var t=e.history,n=e.dispatch;return t.listen(function(e){e.pathname.indexOf("/voiceTag")>-1&&(n({type:"fetch"}),n({type:"getEnum"}))})}}};t.default=s}}]);