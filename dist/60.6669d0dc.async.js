(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[60],{Dbf3:function(e,t,n){"use strict";var a=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.refund=s,t.modify=o,t.statusSet=d,t.getList=i,t.productMap=p,t.statusMap=f,t.payTypes=l;var r=a(n("d6i3")),u=a(n("t3Un")),c=function(e,t,n,a){function r(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,u){function c(e){try{o(a.next(e))}catch(e){u(e)}}function s(e){try{o(a["throw"](e))}catch(e){u(e)}}function o(e){e.done?n(e.value):r(e.value).then(c,s)}o((a=a.apply(e,t||[])).next())})};function s(e){return c(this,void 0,void 0,r.default.mark(function t(){return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.default)("/xchat/order/refund",{method:"POST",body:e,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}));case 1:case"end":return t.stop()}},t)}))}function o(e){return c(this,void 0,void 0,r.default.mark(function t(){return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.default)("/xchat/order/modify",{method:"POST",body:e,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}));case 1:case"end":return t.stop()}},t)}))}function d(e){return c(this,void 0,void 0,r.default.mark(function t(){return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.default)("/xchat/order/statusSet",{method:"POST",body:e,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}));case 1:case"end":return t.stop()}},t)}))}function i(e){return c(this,void 0,void 0,r.default.mark(function t(){return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.default)("/order/vip/getList",{method:"GET",body:e}));case 1:case"end":return t.stop()}},t)}))}function p(e){return c(this,void 0,void 0,r.default.mark(function t(){return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.default)("/order/vip/productMap",{method:"GET",body:e}));case 1:case"end":return t.stop()}},t)}))}function f(e){return c(this,void 0,void 0,r.default.mark(function t(){return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.default)("/order/vip/statusMap",{method:"GET",body:e}));case 1:case"end":return t.stop()}},t)}))}function l(e){return c(this,void 0,void 0,r.default.mark(function t(){return r.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.default)("/order/diamond/payTypes",{method:"GET",body:e}));case 1:case"end":return t.stop()}},t)}))}},dRvS:function(e,t,n){"use strict";var a=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a(n("d6i3")),u=n("Dbf3"),c={namespace:"member",state:{data:{page:1,total_count:1,list:[]},productMap:[],statusMap:{}},reducers:{userListReducer:function(e,t){var n=t.payload;if(!n)return Object.assign({},e);var a=n.data.list.map(function(e,t){return Object.assign(Object.assign({},e),{original:(e.feed_info.content||"").length>30?"".concat(e.feed_info.content,"~~\u6536\u8d77"):e.feed_info.content,oimt:(e.feed_info.content||"").length>30?"".concat(e.feed_info.content.substring(0,30),"...\u5c55\u5f00"):e.feed_info.content})});return Object.assign(Object.assign({},e),{data:Object.assign(Object.assign({},n.data),{list:a})})},productMapReducer:function(e,t){var n=t.payload;return Object.assign(Object.assign({},e),{productMap:n.data})},statusMapReducer:function(e,t){var n=t.payload;return Object.assign(Object.assign({},e),{statusMap:n.data})},payTypesReducer:function(e,t){var n=t.payload;return Object.assign(Object.assign({},e),{payTypes:n.data})}},effects:{fetch:r.default.mark(function e(t,n){var a,c,s,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,c=n.call,s=n.put,e.next=4,c(u.getList,a);case 4:if(o=e.sent,!o||!o.data){e.next=8;break}return e.next=8,s({type:"userListReducer",payload:o});case 8:case"end":return e.stop()}},e)}),productMap:r.default.mark(function e(t,n){var a,c,s,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,c=n.call,s=n.put,e.next=4,c(u.productMap,a);case 4:return o=e.sent,e.next=7,s({type:"productMapReducer",payload:o});case 7:case"end":return e.stop()}},e)}),statusMap:r.default.mark(function e(t,n){var a,c,s,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,c=n.call,s=n.put,e.next=4,c(u.statusMap,a);case 4:return o=e.sent,e.next=7,s({type:"statusMapReducer",payload:o});case 7:case"end":return e.stop()}},e)}),payTypes:r.default.mark(function e(t,n){var a,c,s,o;return r.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,c=n.call,s=n.put,e.next=4,c(u.payTypes,a);case 4:return o=e.sent,e.next=7,s({type:"payTypesReducer",payload:o});case 7:case"end":return e.stop()}},e)})}};t.default=c}}]);