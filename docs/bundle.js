var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function r(t){t.forEach(n)}function o(t){return"function"==typeof t}function i(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function u(t,n){t.appendChild(n)}function a(t,n,e){t.insertBefore(n,e||null)}function l(t){t.parentNode.removeChild(t)}function c(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function s(t){return document.createElement(t)}function f(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function h(t){return document.createTextNode(t)}function d(){return h(" ")}function g(t,n,e,r){return t.addEventListener(n,e,r),()=>t.removeEventListener(n,e,r)}function p(t){return function(n){return n.preventDefault(),t.call(this,n)}}function y(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function v(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function x(t,n){t.value=null==n?"":n}let w;function _(t){w=t}const m=[],b=[],$=[],k=[],N=Promise.resolve();let M=!1;function A(t){$.push(t)}const E=new Set;let j=0;function z(){const t=w;do{for(;j<m.length;){const t=m[j];j++,_(t),S(t.$$)}for(_(null),m.length=0,j=0;b.length;)b.pop()();for(let t=0;t<$.length;t+=1){const n=$[t];E.has(n)||(E.add(n),n())}$.length=0}while(m.length);for(;k.length;)k.pop()();M=!1,E.clear(),_(t)}function S(t){if(null!==t.fragment){t.update(),r(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(A)}}const q=new Set;function O(t,n){t&&t.i&&(q.delete(t),t.i(n))}function T(t,e,i,u){const{fragment:a,on_mount:l,on_destroy:c,after_update:s}=t.$$;a&&a.m(e,i),u||A((()=>{const e=l.map(n).filter(o);c?c.push(...e):r(e),t.$$.on_mount=[]})),s.forEach(A)}function C(t,n){const e=t.$$;null!==e.fragment&&(r(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function I(t,n){-1===t.$$.dirty[0]&&(m.push(t),M||(M=!0,N.then(z)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function D(n,o,i,u,a,c,s,f=[-1]){const h=w;_(n);const d=n.$$={fragment:null,ctx:null,props:c,update:t,not_equal:a,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(h?h.$$.context:[])),callbacks:e(),dirty:f,skip_bound:!1,root:o.target||h.$$.root};s&&s(d.root);let g=!1;if(d.ctx=i?i(n,o.props||{},((t,e,...r)=>{const o=r.length?r[0]:e;return d.ctx&&a(d.ctx[t],d.ctx[t]=o)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](o),g&&I(n,t)),e})):[],d.update(),g=!0,r(d.before_update),d.fragment=!!u&&u(d.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);d.fragment&&d.fragment.l(t),t.forEach(l)}else d.fragment&&d.fragment.c();o.intro&&O(n.$$.fragment),T(n,o.target,o.anchor,o.customElement),z()}_(h)}class P{$destroy(){C(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}var L={value:()=>{}};function B(){for(var t,n=0,e=arguments.length,r={};n<e;++n){if(!(t=arguments[n]+"")||t in r||/[\s.]/.test(t))throw new Error("illegal type: "+t);r[t]=[]}return new J(r)}function J(t){this._=t}function R(t,n){return t.trim().split(/^|\s+/).map((function(t){var e="",r=t.indexOf(".");if(r>=0&&(e=t.slice(r+1),t=t.slice(0,r)),t&&!n.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:e}}))}function F(t,n){for(var e,r=0,o=t.length;r<o;++r)if((e=t[r]).name===n)return e.value}function H(t,n,e){for(var r=0,o=t.length;r<o;++r)if(t[r].name===n){t[r]=L,t=t.slice(0,r).concat(t.slice(r+1));break}return null!=e&&t.push({name:n,value:e}),t}J.prototype=B.prototype={constructor:J,on:function(t,n){var e,r=this._,o=R(t+"",r),i=-1,u=o.length;if(!(arguments.length<2)){if(null!=n&&"function"!=typeof n)throw new Error("invalid callback: "+n);for(;++i<u;)if(e=(t=o[i]).type)r[e]=H(r[e],t.name,n);else if(null==n)for(e in r)r[e]=H(r[e],t.name,null);return this}for(;++i<u;)if((e=(t=o[i]).type)&&(e=F(r[e],t.name)))return e},copy:function(){var t={},n=this._;for(var e in n)t[e]=n[e].slice();return new J(t)},call:function(t,n){if((e=arguments.length-2)>0)for(var e,r,o=new Array(e),i=0;i<e;++i)o[i]=arguments[i+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(i=0,e=(r=this._[t]).length;i<e;++i)r[i].value.apply(n,o)},apply:function(t,n,e){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],o=0,i=r.length;o<i;++o)r[o].value.apply(n,e)}};var W,Y,G=0,K=0,Q=0,U=0,V=0,X=0,Z="object"==typeof performance&&performance.now?performance:Date,tt="object"==typeof window&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17)};function nt(){return V||(tt(et),V=Z.now()+X)}function et(){V=0}function rt(){this._call=this._time=this._next=null}function ot(t,n,e){var r=new rt;return r.restart(t,n,e),r}function it(){V=(U=Z.now())+X,G=K=0;try{!function(){nt(),++G;for(var t,n=W;n;)(t=V-n._time)>=0&&n._call.call(void 0,t),n=n._next;--G}()}finally{G=0,function(){var t,n,e=W,r=1/0;for(;e;)e._call?(r>e._time&&(r=e._time),t=e,e=e._next):(n=e._next,e._next=null,e=t?t._next=n:W=n);Y=t,at(r)}(),V=0}}function ut(){var t=Z.now(),n=t-U;n>1e3&&(X-=n,U=t)}function at(t){G||(K&&(K=clearTimeout(K)),t-V>24?(t<1/0&&(K=setTimeout(it,t-Z.now()-X)),Q&&(Q=clearInterval(Q))):(Q||(U=Z.now(),Q=setInterval(ut,1e3)),G=1,tt(it)))}function lt(t){if(!t.ok)throw new Error(t.status+" "+t.statusText);if(204!==t.status&&205!==t.status)return t.json()}function ct(t,n,e,r){if(isNaN(n)||isNaN(e))return t;var o,i,u,a,l,c,s,f,h,d=t._root,g={data:r},p=t._x0,y=t._y0,v=t._x1,x=t._y1;if(!d)return t._root=g,t;for(;d.length;)if((c=n>=(i=(p+v)/2))?p=i:v=i,(s=e>=(u=(y+x)/2))?y=u:x=u,o=d,!(d=d[f=s<<1|c]))return o[f]=g,t;if(a=+t._x.call(null,d.data),l=+t._y.call(null,d.data),n===a&&e===l)return g.next=d,o?o[f]=g:t._root=g,t;do{o=o?o[f]=new Array(4):t._root=new Array(4),(c=n>=(i=(p+v)/2))?p=i:v=i,(s=e>=(u=(y+x)/2))?y=u:x=u}while((f=s<<1|c)==(h=(l>=u)<<1|a>=i));return o[h]=d,o[f]=g,t}function st(t,n,e,r,o){this.node=t,this.x0=n,this.y0=e,this.x1=r,this.y1=o}function ft(t){return t[0]}function ht(t){return t[1]}function dt(t,n,e){var r=new gt(null==n?ft:n,null==e?ht:e,NaN,NaN,NaN,NaN);return null==t?r:r.addAll(t)}function gt(t,n,e,r,o,i){this._x=t,this._y=n,this._x0=e,this._y0=r,this._x1=o,this._y1=i,this._root=void 0}function pt(t){for(var n={data:t.data},e=n;t=t.next;)e=e.next={data:t.data};return n}rt.prototype=ot.prototype={constructor:rt,restart:function(t,n,e){if("function"!=typeof t)throw new TypeError("callback is not a function");e=(null==e?nt():+e)+(null==n?0:+n),this._next||Y===this||(Y?Y._next=this:W=this,Y=this),this._call=t,this._time=e,at()},stop:function(){this._call&&(this._call=null,this._time=1/0,at())}};var yt=dt.prototype=gt.prototype;function vt(t){return function(){return t}}function xt(t){return 1e-6*(t()-.5)}function wt(t){return t.x+t.vx}function _t(t){return t.y+t.vy}function mt(t){return t.index}function bt(t,n){var e=t.get(n);if(!e)throw new Error("node not found: "+n);return e}yt.copy=function(){var t,n,e=new gt(this._x,this._y,this._x0,this._y0,this._x1,this._y1),r=this._root;if(!r)return e;if(!r.length)return e._root=pt(r),e;for(t=[{source:r,target:e._root=new Array(4)}];r=t.pop();)for(var o=0;o<4;++o)(n=r.source[o])&&(n.length?t.push({source:n,target:r.target[o]=new Array(4)}):r.target[o]=pt(n));return e},yt.add=function(t){const n=+this._x.call(null,t),e=+this._y.call(null,t);return ct(this.cover(n,e),n,e,t)},yt.addAll=function(t){var n,e,r,o,i=t.length,u=new Array(i),a=new Array(i),l=1/0,c=1/0,s=-1/0,f=-1/0;for(e=0;e<i;++e)isNaN(r=+this._x.call(null,n=t[e]))||isNaN(o=+this._y.call(null,n))||(u[e]=r,a[e]=o,r<l&&(l=r),r>s&&(s=r),o<c&&(c=o),o>f&&(f=o));if(l>s||c>f)return this;for(this.cover(l,c).cover(s,f),e=0;e<i;++e)ct(this,u[e],a[e],t[e]);return this},yt.cover=function(t,n){if(isNaN(t=+t)||isNaN(n=+n))return this;var e=this._x0,r=this._y0,o=this._x1,i=this._y1;if(isNaN(e))o=(e=Math.floor(t))+1,i=(r=Math.floor(n))+1;else{for(var u,a,l=o-e||1,c=this._root;e>t||t>=o||r>n||n>=i;)switch(a=(n<r)<<1|t<e,(u=new Array(4))[a]=c,c=u,l*=2,a){case 0:o=e+l,i=r+l;break;case 1:e=o-l,i=r+l;break;case 2:o=e+l,r=i-l;break;case 3:e=o-l,r=i-l}this._root&&this._root.length&&(this._root=c)}return this._x0=e,this._y0=r,this._x1=o,this._y1=i,this},yt.data=function(){var t=[];return this.visit((function(n){if(!n.length)do{t.push(n.data)}while(n=n.next)})),t},yt.extent=function(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]},yt.find=function(t,n,e){var r,o,i,u,a,l,c,s=this._x0,f=this._y0,h=this._x1,d=this._y1,g=[],p=this._root;for(p&&g.push(new st(p,s,f,h,d)),null==e?e=1/0:(s=t-e,f=n-e,h=t+e,d=n+e,e*=e);l=g.pop();)if(!(!(p=l.node)||(o=l.x0)>h||(i=l.y0)>d||(u=l.x1)<s||(a=l.y1)<f))if(p.length){var y=(o+u)/2,v=(i+a)/2;g.push(new st(p[3],y,v,u,a),new st(p[2],o,v,y,a),new st(p[1],y,i,u,v),new st(p[0],o,i,y,v)),(c=(n>=v)<<1|t>=y)&&(l=g[g.length-1],g[g.length-1]=g[g.length-1-c],g[g.length-1-c]=l)}else{var x=t-+this._x.call(null,p.data),w=n-+this._y.call(null,p.data),_=x*x+w*w;if(_<e){var m=Math.sqrt(e=_);s=t-m,f=n-m,h=t+m,d=n+m,r=p.data}}return r},yt.remove=function(t){if(isNaN(i=+this._x.call(null,t))||isNaN(u=+this._y.call(null,t)))return this;var n,e,r,o,i,u,a,l,c,s,f,h,d=this._root,g=this._x0,p=this._y0,y=this._x1,v=this._y1;if(!d)return this;if(d.length)for(;;){if((c=i>=(a=(g+y)/2))?g=a:y=a,(s=u>=(l=(p+v)/2))?p=l:v=l,n=d,!(d=d[f=s<<1|c]))return this;if(!d.length)break;(n[f+1&3]||n[f+2&3]||n[f+3&3])&&(e=n,h=f)}for(;d.data!==t;)if(r=d,!(d=d.next))return this;return(o=d.next)&&delete d.next,r?(o?r.next=o:delete r.next,this):n?(o?n[f]=o:delete n[f],(d=n[0]||n[1]||n[2]||n[3])&&d===(n[3]||n[2]||n[1]||n[0])&&!d.length&&(e?e[h]=d:this._root=d),this):(this._root=o,this)},yt.removeAll=function(t){for(var n=0,e=t.length;n<e;++n)this.remove(t[n]);return this},yt.root=function(){return this._root},yt.size=function(){var t=0;return this.visit((function(n){if(!n.length)do{++t}while(n=n.next)})),t},yt.visit=function(t){var n,e,r,o,i,u,a=[],l=this._root;for(l&&a.push(new st(l,this._x0,this._y0,this._x1,this._y1));n=a.pop();)if(!t(l=n.node,r=n.x0,o=n.y0,i=n.x1,u=n.y1)&&l.length){var c=(r+i)/2,s=(o+u)/2;(e=l[3])&&a.push(new st(e,c,s,i,u)),(e=l[2])&&a.push(new st(e,r,s,c,u)),(e=l[1])&&a.push(new st(e,c,o,i,s)),(e=l[0])&&a.push(new st(e,r,o,c,s))}return this},yt.visitAfter=function(t){var n,e=[],r=[];for(this._root&&e.push(new st(this._root,this._x0,this._y0,this._x1,this._y1));n=e.pop();){var o=n.node;if(o.length){var i,u=n.x0,a=n.y0,l=n.x1,c=n.y1,s=(u+l)/2,f=(a+c)/2;(i=o[0])&&e.push(new st(i,u,a,s,f)),(i=o[1])&&e.push(new st(i,s,a,l,f)),(i=o[2])&&e.push(new st(i,u,f,s,c)),(i=o[3])&&e.push(new st(i,s,f,l,c))}r.push(n)}for(;n=r.pop();)t(n.node,n.x0,n.y0,n.x1,n.y1);return this},yt.x=function(t){return arguments.length?(this._x=t,this):this._x},yt.y=function(t){return arguments.length?(this._y=t,this):this._y};const $t=4294967296;function kt(t){return t.x}function Nt(t){return t.y}var Mt=Math.PI*(3-Math.sqrt(5));function At(t){var n,e=1,r=.001,o=1-Math.pow(r,1/300),i=0,u=.6,a=new Map,l=ot(f),c=B("tick","end"),s=function(){let t=1;return()=>(t=(1664525*t+1013904223)%$t)/$t}();function f(){h(),c.call("tick",n),e<r&&(l.stop(),c.call("end",n))}function h(r){var l,c,s=t.length;void 0===r&&(r=1);for(var f=0;f<r;++f)for(e+=(i-e)*o,a.forEach((function(t){t(e)})),l=0;l<s;++l)null==(c=t[l]).fx?c.x+=c.vx*=u:(c.x=c.fx,c.vx=0),null==c.fy?c.y+=c.vy*=u:(c.y=c.fy,c.vy=0);return n}function d(){for(var n,e=0,r=t.length;e<r;++e){if((n=t[e]).index=e,null!=n.fx&&(n.x=n.fx),null!=n.fy&&(n.y=n.fy),isNaN(n.x)||isNaN(n.y)){var o=10*Math.sqrt(.5+e),i=e*Mt;n.x=o*Math.cos(i),n.y=o*Math.sin(i)}(isNaN(n.vx)||isNaN(n.vy))&&(n.vx=n.vy=0)}}function g(n){return n.initialize&&n.initialize(t,s),n}return null==t&&(t=[]),d(),n={tick:h,restart:function(){return l.restart(f),n},stop:function(){return l.stop(),n},nodes:function(e){return arguments.length?(t=e,d(),a.forEach(g),n):t},alpha:function(t){return arguments.length?(e=+t,n):e},alphaMin:function(t){return arguments.length?(r=+t,n):r},alphaDecay:function(t){return arguments.length?(o=+t,n):+o},alphaTarget:function(t){return arguments.length?(i=+t,n):i},velocityDecay:function(t){return arguments.length?(u=1-t,n):1-u},randomSource:function(t){return arguments.length?(s=t,a.forEach(g),n):s},force:function(t,e){return arguments.length>1?(null==e?a.delete(t):a.set(t,g(e)),n):a.get(t)},find:function(n,e,r){var o,i,u,a,l,c=0,s=t.length;for(null==r?r=1/0:r*=r,c=0;c<s;++c)(u=(o=n-(a=t[c]).x)*o+(i=e-a.y)*i)<r&&(l=a,r=u);return l},on:function(t,e){return arguments.length>1?(c.on(t,e),n):c.on(t)}}}function Et(t,n,e){const r=t.slice();return r[22]=n[e],r[23]=n,r[24]=e,r}function jt(t,n,e){const r=t.slice();return r[25]=n[e],r}function zt(t){let n,e,r,o,i;return{c(){n=f("line"),y(n,"x1",e=t[25].source.x),y(n,"y1",r=t[25].source.y),y(n,"x2",o=t[25].target.x),y(n,"y2",i=t[25].target.y),y(n,"class","link svelte-1ppmp6a")},m(t,e){a(t,n,e)},p(t,u){16&u&&e!==(e=t[25].source.x)&&y(n,"x1",e),16&u&&r!==(r=t[25].source.y)&&y(n,"y1",r),16&u&&o!==(o=t[25].target.x)&&y(n,"x2",o),16&u&&i!==(i=t[25].target.y)&&y(n,"y2",i)},d(t){t&&l(n)}}}function St(t){let n,e,r=t[22].word+"";return{c(){n=f("text"),e=h(r),y(n,"x","-8"),y(n,"y","6")},m(t,r){a(t,n,r),u(n,e)},p(t,n){8&n&&r!==(r=t[22].word+"")&&v(e,r)},d(t){t&&l(n)}}}function qt(t){let n,e,o,i,c,h;function v(){t[9].call(o,t[23],t[24])}return{c(){n=f("foreignObject"),e=s("form"),o=s("input"),i=d(),y(n,"x","-8"),y(n,"y","6"),y(n,"width","100"),y(n,"height","150")},m(r,l){a(r,n,l),u(n,e),u(e,o),x(o,t[22].word),u(e,i),c||(h=[g(o,"input",v),g(e,"submit",p(t[10]))],c=!0)},p(n,e){t=n,8&e&&o.value!==t[22].word&&x(o,t[22].word)},d(t){t&&l(n),c=!1,r(h)}}}function Ot(t){let n,e,o,i,c,s,d,x,w=t[22].word+"";function _(t,n){return t[2]&&t[5]==t[22]?qt:St}let m=_(t),b=m(t);function $(...n){return t[11](t[22],...n)}function k(...n){return t[12](t[22],...n)}return{c(){n=f("g"),e=f("circle"),b.c(),i=f("title"),c=h(w),y(e,"r",o=t[22].radius||Ct),y(e,"class","node svelte-1ppmp6a"),y(n,"transform",s="translate("+(t[22].x||0)+", "+(t[22].y||50)+")"),y(n,"class","node svelte-1ppmp6a")},m(t,r){a(t,n,r),u(n,e),b.m(n,null),u(n,i),u(i,c),d||(x=[g(n,"click",p($)),g(n,"mousedown",k)],d=!0)},p(r,u){t=r,8&u&&o!==(o=t[22].radius||Ct)&&y(e,"r",o),m===(m=_(t))&&b?b.p(t,u):(b.d(1),b=m(t),b&&(b.c(),b.m(n,i))),8&u&&w!==(w=t[22].word+"")&&v(c,w),8&u&&s!==(s="translate("+(t[22].x||0)+", "+(t[22].y||50)+")")&&y(n,"transform",s)},d(t){t&&l(n),b.d(),d=!1,r(x)}}}function Tt(n){let e,r,o,i,h,g,p,v,x,w,_,m=n[4],b=[];for(let t=0;t<m.length;t+=1)b[t]=zt(jt(n,m,t));let $=n[3],k=[];for(let t=0;t<$.length;t+=1)k[t]=Ot(Et(n,$,t));return{c(){e=s("div"),r=d(),o=s("div"),i=f("svg"),h=f("rectangle"),g=f("g");for(let t=0;t<b.length;t+=1)b[t].c();p=f("g");for(let t=0;t<k.length;t+=1)k[t].c();x=d(),w=s("div"),y(e,"class","container"),y(g,"id","links"),y(p,"id","nodes"),y(p,"data-toggle","tooltip"),y(p,"title",It),y(i,"id","knowledge-graph-svg"),y(i,"class","svg-content svelte-1ppmp6a"),y(i,"preserveAspectRatio","xMinYMin meet"),y(i,"viewBox",v="0 0 "+n[0]+" "+n[1]),y(w,"id","knowledge-graph"),y(o,"id","knowledge-graph-container"),y(o,"class",_="svg-container graph-bg "+n[6]+" svelte-1ppmp6a")},m(t,n){a(t,e,n),a(t,r,n),a(t,o,n),u(o,i),u(i,h),u(i,g);for(let t=0;t<b.length;t+=1)b[t].m(g,null);u(i,p);for(let t=0;t<k.length;t+=1)k[t].m(p,null);u(o,x),u(o,w)},p(t,[n]){if(16&n){let e;for(m=t[4],e=0;e<m.length;e+=1){const r=jt(t,m,e);b[e]?b[e].p(r,n):(b[e]=zt(r),b[e].c(),b[e].m(g,null))}for(;e<b.length;e+=1)b[e].d(1);b.length=m.length}if(444&n){let e;for($=t[3],e=0;e<$.length;e+=1){const r=Et(t,$,e);k[e]?k[e].p(r,n):(k[e]=Ot(r),k[e].c(),k[e].m(p,null))}for(;e<k.length;e+=1)k[e].d(1);k.length=$.length}3&n&&v!==(v="0 0 "+t[0]+" "+t[1])&&y(i,"viewBox",v),64&n&&_!==(_="svg-container graph-bg "+t[6]+" svelte-1ppmp6a")&&y(o,"class",_)},i:t,o:t,d(t){t&&l(e),t&&l(r),t&&l(o),c(b,t),c(k,t)}}}const Ct=30;var It="blank tooltip";function Dt(t,n){const e=n.map((t=>{let{index:n,source:e,target:r}=t;return{source:e.id,target:r.id}})),r={nodes:t,links:e};console.log("saved to localStorage",r);let o=JSON.stringify(r);localStorage.setItem("wizard",o)}function Pt(t,n,e){let r,{width:o,height:i,editMode:u}=n;var a,l=[],c=[],s=At();function f(){s.nodes(l).force("center",function(t,n){var e,r=1;function o(){var o,i,u=e.length,a=0,l=0;for(o=0;o<u;++o)a+=(i=e[o]).x,l+=i.y;for(a=(a/u-t)*r,l=(l/u-n)*r,o=0;o<u;++o)(i=e[o]).x-=a,i.y-=l}return null==t&&(t=0),null==n&&(n=0),o.initialize=function(t){e=t},o.x=function(n){return arguments.length?(t=+n,o):t},o.y=function(t){return arguments.length?(n=+t,o):n},o.strength=function(t){return arguments.length?(r=+t,o):r},o}().x(o/2).y(i/2)).force("charge",function(){var t,n,e,r,o,i=vt(-30),u=1,a=1/0,l=.81;function c(e){var o,i=t.length,u=dt(t,kt,Nt).visitAfter(f);for(r=e,o=0;o<i;++o)n=t[o],u.visit(h)}function s(){if(t){var n,e,r=t.length;for(o=new Array(r),n=0;n<r;++n)e=t[n],o[e.index]=+i(e,n,t)}}function f(t){var n,e,r,i,u,a=0,l=0;if(t.length){for(r=i=u=0;u<4;++u)(n=t[u])&&(e=Math.abs(n.value))&&(a+=n.value,l+=e,r+=e*n.x,i+=e*n.y);t.x=r/l,t.y=i/l}else{(n=t).x=n.data.x,n.y=n.data.y;do{a+=o[n.data.index]}while(n=n.next)}t.value=a}function h(t,i,c,s){if(!t.value)return!0;var f=t.x-n.x,h=t.y-n.y,d=s-i,g=f*f+h*h;if(d*d/l<g)return g<a&&(0===f&&(g+=(f=xt(e))*f),0===h&&(g+=(h=xt(e))*h),g<u&&(g=Math.sqrt(u*g)),n.vx+=f*t.value*r/g,n.vy+=h*t.value*r/g),!0;if(!(t.length||g>=a)){(t.data!==n||t.next)&&(0===f&&(g+=(f=xt(e))*f),0===h&&(g+=(h=xt(e))*h),g<u&&(g=Math.sqrt(u*g)));do{t.data!==n&&(d=o[t.data.index]*r/g,n.vx+=f*d,n.vy+=h*d)}while(t=t.next)}}return c.initialize=function(n,r){t=n,e=r,s()},c.strength=function(t){return arguments.length?(i="function"==typeof t?t:vt(+t),s(),c):i},c.distanceMin=function(t){return arguments.length?(u=t*t,c):Math.sqrt(u)},c.distanceMax=function(t){return arguments.length?(a=t*t,c):Math.sqrt(a)},c.theta=function(t){return arguments.length?(l=t*t,c):Math.sqrt(l)},c}().strength((t=>-1*t.radius*20||-1*Ct*20))).force("collide",function(t){var n,e,r,o=1,i=1;function u(){for(var t,u,l,c,s,f,h,d=n.length,g=0;g<i;++g)for(u=dt(n,wt,_t).visitAfter(a),t=0;t<d;++t)l=n[t],f=e[l.index],h=f*f,c=l.x+l.vx,s=l.y+l.vy,u.visit(p);function p(t,n,e,i,u){var a=t.data,d=t.r,g=f+d;if(!a)return n>c+g||i<c-g||e>s+g||u<s-g;if(a.index>l.index){var p=c-a.x-a.vx,y=s-a.y-a.vy,v=p*p+y*y;v<g*g&&(0===p&&(v+=(p=xt(r))*p),0===y&&(v+=(y=xt(r))*y),v=(g-(v=Math.sqrt(v)))/v*o,l.vx+=(p*=v)*(g=(d*=d)/(h+d)),l.vy+=(y*=v)*g,a.vx-=p*(g=1-g),a.vy-=y*g)}}}function a(t){if(t.data)return t.r=e[t.data.index];for(var n=t.r=0;n<4;++n)t[n]&&t[n].r>t.r&&(t.r=t[n].r)}function l(){if(n){var r,o,i=n.length;for(e=new Array(i),r=0;r<i;++r)o=n[r],e[o.index]=+t(o,r,n)}}return"function"!=typeof t&&(t=vt(null==t?1:+t)),u.initialize=function(t,e){n=t,r=e,l()},u.iterations=function(t){return arguments.length?(i=+t,u):i},u.strength=function(t){return arguments.length?(o=+t,u):o},u.radius=function(n){return arguments.length?(t="function"==typeof n?n:vt(+n),l(),u):t},u}().strength(1).radius((t=>t.radius)).iterations(8)).force("x",function(t){var n,e,r,o=vt(.1);function i(t){for(var o,i=0,u=n.length;i<u;++i)(o=n[i]).vx+=(r[i]-o.x)*e[i]*t}function u(){if(n){var i,u=n.length;for(e=new Array(u),r=new Array(u),i=0;i<u;++i)e[i]=isNaN(r[i]=+t(n[i],i,n))?0:+o(n[i],i,n)}}return"function"!=typeof t&&(t=vt(null==t?0:+t)),i.initialize=function(t){n=t,u()},i.strength=function(t){return arguments.length?(o="function"==typeof t?t:vt(+t),u(),i):o},i.x=function(n){return arguments.length?(t="function"==typeof n?n:vt(+n),u(),i):t},i}().strength(o<700?.2*i/o:.05)).force("y",function(t){var n,e,r,o=vt(.1);function i(t){for(var o,i=0,u=n.length;i<u;++i)(o=n[i]).vy+=(r[i]-o.y)*e[i]*t}function u(){if(n){var i,u=n.length;for(e=new Array(u),r=new Array(u),i=0;i<u;++i)e[i]=isNaN(r[i]=+t(n[i],i,n))?0:+o(n[i],i,n)}}return"function"!=typeof t&&(t=vt(null==t?0:+t)),i.initialize=function(t){n=t,u()},i.strength=function(t){return arguments.length?(o="function"==typeof t?t:vt(+t),u(),i):o},i.y=function(n){return arguments.length?(t="function"==typeof n?n:vt(+n),u(),i):t},i}().strength(o<700?.16*o/i:.05)).force("link",function(t){var n,e,r,o,i,u,a=mt,l=function(t){return 1/Math.min(o[t.source.index],o[t.target.index])},c=vt(30),s=1;function f(r){for(var o=0,a=t.length;o<s;++o)for(var l,c,f,h,d,g,p,y=0;y<a;++y)c=(l=t[y]).source,h=(f=l.target).x+f.vx-c.x-c.vx||xt(u),d=f.y+f.vy-c.y-c.vy||xt(u),h*=g=((g=Math.sqrt(h*h+d*d))-e[y])/g*r*n[y],d*=g,f.vx-=h*(p=i[y]),f.vy-=d*p,c.vx+=h*(p=1-p),c.vy+=d*p}function h(){if(r){var u,l,c=r.length,s=t.length,f=new Map(r.map(((t,n)=>[a(t,n,r),t])));for(u=0,o=new Array(c);u<s;++u)(l=t[u]).index=u,"object"!=typeof l.source&&(l.source=bt(f,l.source)),"object"!=typeof l.target&&(l.target=bt(f,l.target)),o[l.source.index]=(o[l.source.index]||0)+1,o[l.target.index]=(o[l.target.index]||0)+1;for(u=0,i=new Array(s);u<s;++u)l=t[u],i[u]=o[l.source.index]/(o[l.source.index]+o[l.target.index]);n=new Array(s),d(),e=new Array(s),g()}}function d(){if(r)for(var e=0,o=t.length;e<o;++e)n[e]=+l(t[e],e,t)}function g(){if(r)for(var n=0,o=t.length;n<o;++n)e[n]=+c(t[n],n,t)}return null==t&&(t=[]),f.initialize=function(t,n){r=t,u=n,h()},f.links=function(n){return arguments.length?(t=n,h(),f):t},f.id=function(t){return arguments.length?(a=t,f):a},f.iterations=function(t){return arguments.length?(s=+t,f):s},f.strength=function(t){return arguments.length?(l="function"==typeof t?t:vt(+t),d(),f):l},f.distance=function(t){return arguments.length?(c="function"==typeof t?t:vt(+t),g(),f):c},f}().id((t=>t.id)).links(c)).on("tick",(()=>(e(3,l),void e(4,c)))),s.alpha(.3).alphaTarget(0).restart()}function h(t,n){if(u)return function(t,n){const r=0==t.button||1==t.button&1,o=2==t.button||1==t.button&3;r?e(5,a=n):o?console.log(`Edit mode: Right button clicked "${n.word}"`):console.log(`Edit mode: Some button clicked "${n.word}"`)}(t,n);const r=0==t.button||1==t.button&1,o=2==t.button||1==t.button&3;r?(p({root:n},((t,n)=>{let e=n>3?0:(1-n/3)*Ct;t.radius=e})),f()):o?console.log(`Right button clicked "${n.word}"`):console.log(`Some button clicked "${n.word}"`)}function d(t,n){console.log("Edit mode: Middle button clicked"),function(t){const n=l.length;let e={id:n,word:`newNode #${n}`},r={source:t.id,target:n};l.push({...e}),c.push({...r}),f(),Dt(l,c)}(n)}function g(t,n){if(1==t.button||1==t.button&2){if(t.preventDefault(),u)return d(0,n);console.log("Middle button clicked ")}}function p(t,n){const{root:e}=t,r=t.level||0,o=t.visited||{};if(1==o[e.id])return;n(e,r),o[e.id]=!0;let i=(u=e,c.reduce(((t,n)=>{if(n.source.id==u.id||n.target.id==u.id){let e=n.source.id!=u.id?n.source:n.target;t.push(e)}return t}),[]));var u;for(let t in i){p({root:i[t],level:r+1,visited:o},n)}}new Promise(((t,n)=>{const e="wizard";let r=localStorage.getItem(e);if(!r)throw Error('Blank json in localstorage for key "wizard"');try{t(JSON.parse(r))}catch(t){throw console.error({loadedJson:r}),Error('Invalid json in localstorage for key "wizard"')}})).then((t=>{console.log("Loaded json from localstorage",t),e(3,l=t.nodes),e(4,c=t.links)})).catch((t=>{console.info(t.message),console.log("Loading default data"),function(t,n){return fetch(t,n).then(lt)}("data.json").then((t=>{e(3,l=t.nodes),e(4,c=t.links),f()})).catch(console.error)})).finally((()=>f()));return t.$$set=t=>{"width"in t&&e(0,o=t.width),"height"in t&&e(1,i=t.height),"editMode"in t&&e(2,u=t.editMode)},t.$$.update=()=>{4&t.$$.dirty&&e(6,r=u?"edit-mode":"")},[o,i,u,l,c,a,r,h,g,function(t,n){t[n].word=this.value,e(3,l)},()=>{Dt(l,c),e(5,a=null)},(t,n)=>h(n,t),(t,n)=>g(n,t)]}class Lt extends P{constructor(t){super(),D(this,t,Pt,Tt,i,{width:0,height:1,editMode:2})}}function Bt(t){let n,e,o,i,c,f,p,v,x,w,_,m,$,N,M,A,E,j,z,S,I,D,P;function L(n){t[3](n)}let B={width:window.innerWidth,height:window.innerHeight};return void 0!==t[0]&&(B.editMode=t[0]),z=new Lt({props:B}),b.push((()=>function(t,n,e){const r=t.$$.props[n];void 0!==r&&(t.$$.bound[r]=e,e(t.$$.ctx[r]))}(z,"editMode",L))),{c(){var r;n=s("div"),e=s("button"),e.textContent="Delete localstorage",o=d(),i=s("button"),i.textContent="Show localstorage",c=d(),f=s("h1"),p=h("Here be elements\n  "),v=s("button"),x=h("✏️"),w=d(),_=s("div"),m=s("div"),$=s("label"),$.textContent=`${Jt}`,N=d(),M=s("textarea"),A=d(),E=s("a"),E.textContent="Copy text",j=d(),(r=z.$$.fragment)&&r.c(),y(e,"class","btn btn-primary delete-localstorage"),y(e,"role","button"),y(i,"class","btn btn-primary show-localstorage"),y(i,"type","button"),y(i,"data-toggle","collapse"),y(i,"role","button"),y(i,"aria-expanded","true"),y(i,"aria-controls","lscontent"),y(i,"data-target","#lscontent"),y(v,"class","btn btn-outline-warning"),y(v,"aria-pressed",t[0]),y(v,"data-toggle","button"),y(v,"type","button"),y(v,"role","button"),y($,"for","edit-json"),y(M,"class","edit-json"),M.value=" "+window.localStorage.getItem(Jt)+" ",y(E,"class","copy-json btn btn-primary"),y(m,"class","card cardbody"),y(_,"class","collapse"),y(_,"id","lscontent"),y(n,"class","localstorage container")},m(r,l){a(r,n,l),u(n,e),u(n,o),u(n,i),u(n,c),u(n,f),u(f,p),u(f,v),u(v,x),u(n,w),u(n,_),u(_,m),u(m,$),u(m,N),u(m,M),u(m,A),u(m,E),a(r,j,l),T(z,r,l),I=!0,D||(P=[g(e,"click",Rt),g(v,"click",t[2])],D=!0)},p(t,[n]){(!I||1&n)&&y(v,"aria-pressed",t[0]);const e={};var r;!S&&1&n&&(S=!0,e.editMode=t[0],r=()=>S=!1,k.push(r)),z.$set(e)},i(t){I||(O(z.$$.fragment,t),I=!0)},o(t){!function(t,n,e,r){if(t&&t.o){if(q.has(t))return;q.add(t),(void 0).c.push((()=>{q.delete(t),r&&(e&&t.d(1),r())})),t.o(n)}}(z.$$.fragment,t),I=!1},d(t){t&&l(n),t&&l(j),C(z,t),D=!1,r(P)}}}const Jt="wizard";function Rt(){window.localStorage.clear(),console.log("Localstorage deleted")}function Ft(t,n,e){let{name:r}=n,o=!1;return t.$$set=t=>{"name"in t&&e(1,r=t.name)},[o,r,()=>e(0,o=!o),function(t){o=t,e(0,o)}]}return new class extends P{constructor(t){super(),D(this,t,Ft,Bt,i,{name:1})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
