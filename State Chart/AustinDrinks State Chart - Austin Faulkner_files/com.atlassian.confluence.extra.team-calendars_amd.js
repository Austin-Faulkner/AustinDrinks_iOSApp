WRMCB=function(e){var c=console;if(c&&c.log&&c.error){c.log('Error running batched script.');c.error(e);}}
;
try {
/* module-key = 'com.atlassian.confluence.extra.team-calendars:amd', location = '/com/atlassian/confluence/extra/calendar3/amd/shim/templates-amd.js' */
define("tc/templates",function(){return Confluence.TeamCalendars.Templates});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.extra.team-calendars:amd', location = '/com/atlassian/confluence/extra/calendar3/amd/shim/dialogs-amd.js' */
define("tc/dialogs",function(){return Confluence.TeamCalendars.Dialogs});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.extra.team-calendars:amd', location = '/com/atlassian/confluence/extra/calendar3/lib/amd/shim/backbone-amd.js' */
(function(a,b){if(typeof define==="function"&&define.amd){define(["underscore","jquery","exports"],function(e,f,d){a.Backbone=b(a,d,e,f)})}else{if(typeof exports!=="undefined"){var c=require("underscore");b(a,exports,c)}else{a.Backbone=b(a,{},a._,(a.jQuery||a.Zepto||a.ender||a.$))}}}(this,function(t,c,G,h){var r=t.Backbone;var j=[];var s=j.slice;c.VERSION="1.1.2";c.$=h;c.noConflict=function(){t.Backbone=r;return this};c.emulateHTTP=false;c.emulateJSON=false;var p=c.Events={on:function(J,M,L){if(!I(this,"on",J,[M,L])||!M){return this}this._events||(this._events={});var K=this._events[J]||(this._events[J]=[]);K.push({callback:M,context:L,ctx:L||this});return this},once:function(K,N,L){if(!I(this,"once",K,[N,L])||!N){return this}var J=this;var M=G.once(function(){J.off(K,M);N.apply(this,arguments)});M._callback=N;return this.on(K,M,L)},off:function(K,S,L){if(!this._events||!I(this,"off",K,[S,L])){return this}if(!K&&!S&&!L){this._events=void 0;return this}var R=K?[K]:G.keys(this._events);for(var Q=0,M=R.length;Q<M;Q++){K=R[Q];var T=this._events[K];if(!T){continue}if(!S&&!L){delete this._events[K];continue}var O=[];for(var P=0,N=T.length;P<N;P++){var J=T[P];if(S&&S!==J.callback&&S!==J.callback._callback||L&&L!==J.context){O.push(J)}}if(O.length){this._events[K]=O}else{delete this._events[K]}}return this},trigger:function(L){if(!this._events){return this}var K=s.call(arguments,1);if(!I(this,"trigger",L,K)){return this}var M=this._events[L];var J=this._events.all;if(M){d(M,K)}if(J){d(J,arguments)}return this},stopListening:function(M,K,O){var L=this._listeningTo;if(!L){return this}var J=!K&&!O;if(!O&&typeof K==="object"){O=this}if(M){(L={})[M._listenId]=M}for(var N in L){M=L[N];M.off(K,O,this);if(J||G.isEmpty(M._events)){delete this._listeningTo[N]}}return this}};var a=/\s+/;var I=function(Q,O,J,M){if(!J){return true}if(typeof J==="object"){for(var L in J){Q[O].apply(Q,[L,J[L]].concat(M))}return false}if(a.test(J)){var P=J.split(a);for(var K=0,N=P.length;K<N;K++){Q[O].apply(Q,[P[K]].concat(M))}return false}return true};var d=function(O,M){var P,N=-1,L=O.length,K=M[0],J=M[1],Q=M[2];switch(M.length){case 0:while(++N<L){(P=O[N]).callback.call(P.ctx)}return;case 1:while(++N<L){(P=O[N]).callback.call(P.ctx,K)}return;case 2:while(++N<L){(P=O[N]).callback.call(P.ctx,K,J)}return;case 3:while(++N<L){(P=O[N]).callback.call(P.ctx,K,J,Q)}return;default:while(++N<L){(P=O[N]).callback.apply(P.ctx,M)}return}};var q={listenTo:"on",listenToOnce:"once"};G.each(q,function(J,K){p[K]=function(N,L,P){var M=this._listeningTo||(this._listeningTo={});var O=N._listenId||(N._listenId=G.uniqueId("l"));M[O]=N;if(!P&&typeof L==="object"){P=this}N[J](L,P,this);return this}});p.bind=p.on;p.unbind=p.off;G.extend(c,p);var m=c.Model=function(J,L){var K=J||{};L||(L={});this.cid=G.uniqueId("c");this.attributes={};if(L.collection){this.collection=L.collection}if(L.parse){K=this.parse(K,L)||{}}K=G.defaults({},K,G.result(this,"defaults"));this.set(K,L);this.changed={};this.initialize.apply(this,arguments)};G.extend(m.prototype,p,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(J){return G.clone(this.attributes)},sync:function(){return c.sync.apply(this,arguments)},get:function(J){return this.attributes[J]},escape:function(J){return G.escape(this.get(J))},has:function(J){return this.get(J)!=null},set:function(R,K,V){var P,S,T,Q,O,U,L,N;if(R==null){return this}if(typeof R==="object"){S=R;V=K}else{(S={})[R]=K}V||(V={});if(!this._validate(S,V)){return false}T=V.unset;O=V.silent;Q=[];U=this._changing;this._changing=true;if(!U){this._previousAttributes=G.clone(this.attributes);this.changed={}}N=this.attributes,L=this._previousAttributes;if(this.idAttribute in S){this.id=S[this.idAttribute]}for(P in S){K=S[P];if(!G.isEqual(N[P],K)){Q.push(P)}if(!G.isEqual(L[P],K)){this.changed[P]=K}else{delete this.changed[P]}T?delete N[P]:N[P]=K}if(!O){if(Q.length){this._pending=V}for(var M=0,J=Q.length;M<J;M++){this.trigger("change:"+Q[M],this,N[Q[M]],V)}}if(U){return this}if(!O){while(this._pending){V=this._pending;this._pending=false;this.trigger("change",this,V)}}this._pending=false;this._changing=false;return this},unset:function(J,K){return this.set(J,void 0,G.extend({},K,{unset:true}))},clear:function(K){var J={};for(var L in this.attributes){J[L]=void 0}return this.set(J,G.extend({},K,{unset:true}))},hasChanged:function(J){if(J==null){return !G.isEmpty(this.changed)}return G.has(this.changed,J)},changedAttributes:function(L){if(!L){return this.hasChanged()?G.clone(this.changed):false}var N,M=false;var K=this._changing?this._previousAttributes:this.attributes;for(var J in L){if(G.isEqual(K[J],(N=L[J]))){continue}(M||(M={}))[J]=N}return M},previous:function(J){if(J==null||!this._previousAttributes){return null}return this._previousAttributes[J]},previousAttributes:function(){return G.clone(this._previousAttributes)},fetch:function(K){K=K?G.clone(K):{};if(K.parse===void 0){K.parse=true}var J=this;var L=K.success;K.success=function(M){if(!J.set(J.parse(M,K),K)){return false}if(L){L(J,M,K)}J.trigger("sync",J,M,K)};e(this,K);return this.sync("read",this,K)},save:function(N,K,R){var O,J,Q,L=this.attributes;if(N==null||typeof N==="object"){O=N;R=K}else{(O={})[N]=K}R=G.extend({validate:true},R);if(O&&!R.wait){if(!this.set(O,R)){return false}}else{if(!this._validate(O,R)){return false}}if(O&&R.wait){this.attributes=G.extend({},L,O)}if(R.parse===void 0){R.parse=true}var M=this;var P=R.success;R.success=function(T){M.attributes=L;var S=M.parse(T,R);if(R.wait){S=G.extend(O||{},S)}if(G.isObject(S)&&!M.set(S,R)){return false}if(P){P(M,T,R)}M.trigger("sync",M,T,R)};e(this,R);J=this.isNew()?"create":(R.patch?"patch":"update");if(J==="patch"){R.attrs=O}Q=this.sync(J,this,R);if(O&&R.wait){this.attributes=L}return Q},destroy:function(K){K=K?G.clone(K):{};var J=this;var N=K.success;var L=function(){J.trigger("destroy",J,J.collection,K)};K.success=function(O){if(K.wait||J.isNew()){L()}if(N){N(J,O,K)}if(!J.isNew()){J.trigger("sync",J,O,K)}};if(this.isNew()){K.success();return false}e(this,K);var M=this.sync("delete",this,K);if(!K.wait){L()}return M},url:function(){var J=G.result(this,"urlRoot")||G.result(this.collection,"url")||x();if(this.isNew()){return J}return J.replace(/([^\/])$/,"$1/")+encodeURIComponent(this.id)},parse:function(K,J){return K},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return !this.has(this.idAttribute)},isValid:function(J){return this._validate({},G.extend(J||{},{validate:true}))},_validate:function(L,K){if(!K.validate||!this.validate){return true}L=G.extend({},this.attributes,L);var J=this.validationError=this.validate(L,K)||null;if(!J){return true}this.trigger("invalid",this,J,G.extend(K,{validationError:J}));return false}});var C=["keys","values","pairs","invert","pick","omit","chain"];G.each(C,function(J){if(!G[J]){return}m.prototype[J]=function(){var K=s.call(arguments);K.unshift(this.attributes);return G[J].apply(G,K)}});var H=c.Collection=function(K,J){J||(J={});if(J.model){this.model=J.model}if(J.comparator!==void 0){this.comparator=J.comparator}this._reset();this.initialize.apply(this,arguments);if(K){this.reset(K,G.extend({silent:true},J))}};var z={add:true,remove:true,merge:true};var n={add:true,remove:false};G.extend(H.prototype,p,{model:m,initialize:function(){},toJSON:function(J){return this.map(function(K){return K.toJSON(J)})},sync:function(){return c.sync.apply(this,arguments)},add:function(K,J){return this.set(K,G.extend({merge:false},J,n))},remove:function(Q,L){var N=!G.isArray(Q);Q=N?[Q]:G.clone(Q);L||(L={});for(var M=0,O=Q.length;M<O;M++){var K=Q[M]=this.get(Q[M]);if(!K){continue}var P=this.modelId(K.attributes);if(P!=null){delete this._byId[P]}delete this._byId[K.cid];var J=this.indexOf(K);this.models.splice(J,1);this.length--;if(!L.silent){L.index=J;K.trigger("remove",K,this,L)}this._removeReference(K,L)}return N?Q[0]:Q},set:function(ab,L){L=G.defaults({},L,z);if(L.parse){ab=this.parse(ab,L)}var O=!G.isArray(ab);ab=O?(ab?[ab]:[]):ab.slice();var T,M,V,S,aa;var Q=L.at;var J=this.comparator&&(Q==null)&&L.sort!==false;var Z=G.isString(this.comparator)?this.comparator:null;var ac=[],W=[],U={};var R=L.add,N=L.merge,ad=L.remove;var X=!J&&R&&ad?[]:false;for(var Y=0,K=ab.length;Y<K;Y++){V=ab[Y];if(S=this.get(V)){if(ad){U[S.cid]=true}if(N&&V!==S){V=this._isModel(V)?V.attributes:V;if(L.parse){V=S.parse(V,L)}S.set(V,L);if(J&&!aa&&S.hasChanged(Z)){aa=true}}ab[Y]=S}else{if(R){M=ab[Y]=this._prepareModel(V,L);if(!M){continue}ac.push(M);this._addReference(M,L)}}M=S||M;if(!M){continue}T=this.modelId(M.attributes);if(X&&(M.isNew()||!U[T])){X.push(M)}U[T]=true}if(ad){for(var Y=0,K=this.length;Y<K;Y++){if(!U[(M=this.models[Y]).cid]){W.push(M)}}if(W.length){this.remove(W,L)}}if(ac.length||(X&&X.length)){if(J){aa=true}this.length+=ac.length;if(Q!=null){for(var Y=0,K=ac.length;Y<K;Y++){this.models.splice(Q+Y,0,ac[Y])}}else{if(X){this.models.length=0}var P=X||ac;for(var Y=0,K=P.length;Y<K;Y++){this.models.push(P[Y])}}}if(aa){this.sort({silent:true})}if(!L.silent){for(var Y=0,K=ac.length;Y<K;Y++){(M=ac[Y]).trigger("add",M,this,L)}if(aa||(X&&X.length)){this.trigger("sort",this,L)}}return O?ab[0]:ab},reset:function(M,J){J||(J={});for(var K=0,L=this.models.length;K<L;K++){this._removeReference(this.models[K],J)}J.previousModels=this.models;this._reset();M=this.add(M,G.extend({silent:true},J));if(!J.silent){this.trigger("reset",this,J)}return M},push:function(K,J){return this.add(K,G.extend({at:this.length},J))},pop:function(K){var J=this.at(this.length-1);this.remove(J,K);return J},unshift:function(K,J){return this.add(K,G.extend({at:0},J))},shift:function(K){var J=this.at(0);this.remove(J,K);return J},slice:function(){return s.apply(this.models,arguments)},get:function(J){if(J==null){return void 0}var K=this.modelId(this._isModel(J)?J.attributes:J);return this._byId[J]||this._byId[K]||this._byId[J.cid]},at:function(J){return this.models[J]},where:function(J,K){if(G.isEmpty(J)){return K?void 0:[]}return this[K?"find":"filter"](function(L){for(var M in J){if(J[M]!==L.get(M)){return false}}return true})},findWhere:function(J){return this.where(J,true)},sort:function(J){if(!this.comparator){throw new Error("Cannot sort a set without a comparator")}J||(J={});if(G.isString(this.comparator)||this.comparator.length===1){this.models=this.sortBy(this.comparator,this)}else{this.models.sort(G.bind(this.comparator,this))}if(!J.silent){this.trigger("sort",this,J)}return this},pluck:function(J){return G.invoke(this.models,"get",J)},fetch:function(J){J=J?G.clone(J):{};if(J.parse===void 0){J.parse=true}var L=J.success;var K=this;J.success=function(M){var N=J.reset?"reset":"set";K[N](M,J);if(L){L(K,M,J)}K.trigger("sync",K,M,J)};e(this,J);return this.sync("read",this,J)},create:function(K,J){J=J?G.clone(J):{};if(!(K=this._prepareModel(K,J))){return false}if(!J.wait){this.add(K,J)}var M=this;var L=J.success;J.success=function(N,O){if(J.wait){M.add(N,J)}if(L){L(N,O,J)}};K.save(null,J);return K},parse:function(K,J){return K},clone:function(){return new this.constructor(this.models,{model:this.model,comparator:this.comparator})},modelId:function(J){return J[this.model.prototype.idAttribute||"id"]},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(L,K){if(this._isModel(L)){if(!L.collection){L.collection=this}return L}K=K?G.clone(K):{};K.collection=this;var J=new this.model(L,K);if(!J.validationError){return J}this.trigger("invalid",this,J.validationError,K);return false},_isModel:function(J){return J instanceof m},_addReference:function(K,J){this._byId[K.cid]=K;var L=this.modelId(K.attributes);if(L!=null){this._byId[L]=K}K.on("all",this._onModelEvent,this)},_removeReference:function(K,J){if(this===K.collection){delete K.collection}K.off("all",this._onModelEvent,this)},_onModelEvent:function(L,K,N,J){if((L==="add"||L==="remove")&&N!==this){return}if(L==="destroy"){this.remove(K,J)}if(L==="change"){var M=this.modelId(K.previousAttributes());var O=this.modelId(K.attributes);if(M!==O){if(M!=null){delete this._byId[M]}if(O!=null){this._byId[O]=K}}}this.trigger.apply(this,arguments)}});var D=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain","sample","partition"];G.each(D,function(J){if(!G[J]){return}H.prototype[J]=function(){var K=s.call(arguments);K.unshift(this.models);return G[J].apply(G,K)}});var i=["groupBy","countBy","sortBy","indexBy"];G.each(i,function(J){if(!G[J]){return}H.prototype[J]=function(M,K){var L=G.isFunction(M)?M:function(N){return N.get(M)};return G[J](this.models,L,K)}});var w=c.View=function(J){this.cid=G.uniqueId("view");J||(J={});G.extend(this,G.pick(J,y));this._ensureElement();this.initialize.apply(this,arguments)};var g=/^(\S+)\s*(.*)$/;var y=["model","collection","el","id","attributes","className","tagName","events"];G.extend(w.prototype,p,{tagName:"div",$:function(J){return this.$el.find(J)},initialize:function(){},render:function(){return this},remove:function(){this._removeElement();this.stopListening();return this},_removeElement:function(){this.$el.remove()},setElement:function(J){this.undelegateEvents();this._setElement(J);this.delegateEvents();return this},_setElement:function(J){this.$el=J instanceof c.$?J:c.$(J);this.el=this.$el[0]},delegateEvents:function(L){if(!(L||(L=G.result(this,"events")))){return this}this.undelegateEvents();for(var K in L){var M=L[K];if(!G.isFunction(M)){M=this[L[K]]}if(!M){continue}var J=K.match(g);this.delegate(J[1],J[2],G.bind(M,this))}return this},delegate:function(K,J,L){this.$el.on(K+".delegateEvents"+this.cid,J,L)},undelegateEvents:function(){if(this.$el){this.$el.off(".delegateEvents"+this.cid)}return this},undelegate:function(K,J,L){this.$el.off(K+".delegateEvents"+this.cid,J,L)},_createElement:function(J){return document.createElement(J)},_ensureElement:function(){if(!this.el){var J=G.extend({},G.result(this,"attributes"));if(this.id){J.id=G.result(this,"id")}if(this.className){J["class"]=G.result(this,"className")}this.setElement(this._createElement(G.result(this,"tagName")));this._setAttributes(J)}else{this.setElement(G.result(this,"el"))}},_setAttributes:function(J){this.$el.attr(J)}});c.sync=function(Q,L,K){var N=u[Q];G.defaults(K||(K={}),{emulateHTTP:c.emulateHTTP,emulateJSON:c.emulateJSON});var P={type:N,dataType:"json"};if(!K.url){P.url=G.result(L,"url")||x()}if(K.data==null&&L&&(Q==="create"||Q==="update"||Q==="patch")){P.contentType="application/json";P.data=JSON.stringify(K.attrs||L.toJSON(K))}if(K.emulateJSON){P.contentType="application/x-www-form-urlencoded";P.data=P.data?{model:P.data}:{}}if(K.emulateHTTP&&(N==="PUT"||N==="DELETE"||N==="PATCH")){P.type="POST";if(K.emulateJSON){P.data._method=N}var M=K.beforeSend;K.beforeSend=function(R){R.setRequestHeader("X-HTTP-Method-Override",N);if(M){return M.apply(this,arguments)}}}if(P.type!=="GET"&&!K.emulateJSON){P.processData=false}var J=K.error;K.error=function(S,T,R){K.textStatus=T;K.errorThrown=R;if(J){J.apply(this,arguments)}};var O=K.xhr=c.ajax(G.extend(P,K));L.trigger("request",L,O,K);return O};var u={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};c.ajax=function(){return c.$.ajax.apply(c.$,arguments)};var F=c.Router=function(J){J||(J={});if(J.routes){this.routes=J.routes}this._bindRoutes();this.initialize.apply(this,arguments)};var l=/\((.*?)\)/g;var k=/(\(\?)?:\w+/g;var E=/\*\w+/g;var f=/[\-{}\[\]+?.,\\\^$|#\s]/g;G.extend(F.prototype,p,{initialize:function(){},route:function(K,L,M){if(!G.isRegExp(K)){K=this._routeToRegExp(K)}if(G.isFunction(L)){M=L;L=""}if(!M){M=this[L]}var J=this;c.history.route(K,function(O){var N=J._extractParameters(K,O);if(J.execute(M,N,L)!==false){J.trigger.apply(J,["route:"+L].concat(N));J.trigger("route",L,N);c.history.trigger("route",J,L,N)}});return this},execute:function(L,K,J){if(L){L.apply(this,K)}},navigate:function(K,J){c.history.navigate(K,J);return this},_bindRoutes:function(){if(!this.routes){return}this.routes=G.result(this,"routes");var K,J=G.keys(this.routes);while((K=J.pop())!=null){this.route(K,this.routes[K])}},_routeToRegExp:function(J){J=J.replace(f,"\\$&").replace(l,"(?:$1)?").replace(k,function(L,K){return K?L:"([^/?]+)"}).replace(E,"([^?]*?)");return new RegExp("^"+J+"(?:\\?([\\s\\S]*))?$")},_extractParameters:function(J,K){var L=J.exec(K).slice(1);return G.map(L,function(N,M){if(M===L.length-1){return N||null}return N?decodeURIComponent(N):null})}});var b=c.History=function(){this.handlers=[];G.bindAll(this,"checkUrl");if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var o=/^[#\/]|\s+$/g;var B=/^\/+|\/+$/g;var v=/#.*$/;b.started=false;G.extend(b.prototype,p,{interval:50,atRoot:function(){var J=this.location.pathname.replace(/[^\/]$/,"$&/");return J===this.root&&!this.location.search},getHash:function(K){var J=(K||this).location.href.match(/#(.*)$/);return J?J[1]:""},getPath:function(){var K=decodeURI(this.location.pathname+this.location.search);var J=this.root.slice(0,-1);if(!K.indexOf(J)){K=K.slice(J.length)}return K.slice(1)},getFragment:function(J){if(J==null){if(this._hasPushState||!this._wantsHashChange){J=this.getPath()}else{J=this.getHash()}}return J.replace(o,"")},start:function(K){if(b.started){throw new Error("Backbone.history has already been started")}b.started=true;this.options=G.extend({root:"/"},this.options,K);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._hasHashChange="onhashchange" in window;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);this.fragment=this.getFragment();var M=window.addEventListener||function(N,O){return attachEvent("on"+N,O)};this.root=("/"+this.root+"/").replace(B,"/");if(!this._hasHashChange&&this._wantsHashChange&&(!this._wantsPushState||!this._hasPushState)){var L=document.createElement("iframe");L.src="javascript:0";L.style.display="none";L.tabIndex=-1;var J=document.body;this.iframe=J.insertBefore(L,J.firstChild).contentWindow;this.navigate(this.fragment)}if(this._hasPushState){M("popstate",this.checkUrl,false)}else{if(this._wantsHashChange&&this._hasHashChange&&!this.iframe){M("hashchange",this.checkUrl,false)}else{if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}}}if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot()){this.location.replace(this.root+"#"+this.getPath());return true}else{if(this._hasPushState&&this.atRoot()){this.navigate(this.getHash(),{replace:true})}}}if(!this.options.silent){return this.loadUrl()}},stop:function(){var J=window.removeEventListener||function(K,L){return detachEvent("on"+K,L)};if(this._hasPushState){J("popstate",this.checkUrl,false)}else{if(this._wantsHashChange&&this._hasHashChange&&!this.iframe){J("hashchange",this.checkUrl,false)}}if(this.iframe){document.body.removeChild(this.iframe.frameElement);this.iframe=null}if(this._checkUrlInterval){clearInterval(this._checkUrlInterval)}b.started=false},route:function(J,K){this.handlers.unshift({route:J,callback:K})},checkUrl:function(K){var J=this.getFragment();if(J===this.fragment&&this.iframe){J=this.getHash(this.iframe)}if(J===this.fragment){return false}if(this.iframe){this.navigate(J)}this.loadUrl()},loadUrl:function(J){J=this.fragment=this.getFragment(J);return G.any(this.handlers,function(K){if(K.route.test(J)){K.callback(J);return true}})},navigate:function(L,K){if(!b.started){return false}if(!K||K===true){K={trigger:!!K}}var J=this.root+(L=this.getFragment(L||""));L=decodeURI(L.replace(v,""));if(this.fragment===L){return}this.fragment=L;if(L===""&&J!=="/"){J=J.slice(0,-1)}if(this._hasPushState){this.history[K.replace?"replaceState":"pushState"]({},document.title,J)}else{if(this._wantsHashChange){this._updateHash(this.location,L,K.replace);if(this.iframe&&(L!==this.getHash(this.iframe))){if(!K.replace){this.iframe.document.open().close()}this._updateHash(this.iframe.location,L,K.replace)}}else{return this.location.assign(J)}}if(K.trigger){return this.loadUrl(L)}},_updateHash:function(J,L,M){if(M){var K=J.href.replace(/(javascript:|#).*$/,"");J.replace(K+"#"+L)}else{J.hash="#"+L}}});c.history=new b;var A=function(J,L){var K=this;var N;if(J&&G.has(J,"constructor")){N=J.constructor}else{N=function(){return K.apply(this,arguments)}}G.extend(N,K,L);var M=function(){this.constructor=N};M.prototype=K.prototype;N.prototype=new M;if(J){G.extend(N.prototype,J)}N.__super__=K.prototype;return N};m.extend=H.extend=F.extend=w.extend=b.extend=A;var x=function(){throw new Error('A "url" property or function must be specified')};var e=function(L,K){var J=K.error;K.error=function(M){if(J){J(L,M,K)}L.trigger("error",L,M,K)}};return c}));if(typeof Backbone!=="undefined"){var backboneTCVersion=Backbone.noConflict();define("tc-backbone",["underscore"],function(){return backboneTCVersion})};
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.extra.team-calendars:amd', location = '/com/atlassian/confluence/extra/calendar3/lib/amd/shim/wrm-amd.js' */
define("wrm",function(){return WRM});
}catch(e){WRMCB(e)};