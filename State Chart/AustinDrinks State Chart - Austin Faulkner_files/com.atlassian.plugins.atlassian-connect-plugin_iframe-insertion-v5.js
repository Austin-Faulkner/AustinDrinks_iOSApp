WRMCB=function(e){var c=console;if(c&&c.log&&c.error){c.log('Error running batched script.');c.error(e);}}
;
try {
/* module-key = 'com.atlassian.plugins.atlassian-connect-plugin:iframe-insertion-v5', location = 'v5/js/iframe/combined/iframe-insertion.js' */
!function(){var e=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,50)},t=function(e,n,o){try{var i=require(e);n(i)}catch(i){if(o<=0){console.error("Unable to load module: "+e);n(null)}else setTimeout((function(){t(e,n,o-1)}),500)}},n=function(e,t,o,i,a){void 0===i&&(i=20);a=a||500;!e.isModuleDefined||i<=0?o():e.isModuleDefined(t)?o(!0):setTimeout((function(){n(e,t,o,i-1,a)}),a)};function o(e){var t;if("string"==typeof e&&e.length>1)try{t=JSON.parse(e)}catch(t){console.error("ACJS: failed to decode context",e)}"object"!=typeof t&&(t={});return t}window._AP=window._AP||{};window._AP.addonAttemptCounter=window._AP.addonAttemptCounter||{};window._AP._convertConnectOptions=function(e){var t={url:e.url,ns:e.uniqueKey,addon_key:e.addon_key,key:e.key,containerId:"embedded-"+e.uniqueKey,options:{history:{state:""},uniqueKey:e.uniqueKey,origin:e.origin,hostOrigin:e.hostOrigin,moduleType:e.moduleType,moduleLocation:e.moduleLocation,isFullPage:"1"===e.general,autoresize:!0,user:{timeZone:e.timeZone,fullName:e.fullName,uid:e.uid,ukey:e.ukey},productContext:o(e.productCtx),structuredContext:o(e.structuredContext),contextJwt:e.contextJwt,contextPath:e.cp,width:e.w||e.width,height:e.h||e.height,sandbox:e.sandbox,pearApp:e.pearApp,noSub:e.noSub,allowPathTraversal:e.allowPathTraversal,targets:{env:{resize:"both"}}}};"string"==typeof e.contentClassifier&&(t.options.contentClassifier=e.contentClassifier);"number"==typeof e.hostFrameOffset&&(t.options.hostFrameOffset=e.hostFrameOffset+1);window._AP.isSubHost||(t.options.history.state=window.location.hash?window.location.hash.substr(2):"");return t};window._AP._createSub=function(e){var t=document.createElement("iframe"),n=(window.connectHost||window.AP).subCreate(e);n.width=e.options.width||"";n.height=e.options.height||"";n.style="border:0;";n.class="ap-iframe";n["data-addon-key"]=e.addon_key;n["data-key"]=e.key;delete n.src;Object.getOwnPropertyNames(n).forEach((function(e){t.setAttribute(e,n[e])}));return t};function i(e){return void 0!==window[e]}function a(e,t,n){n=n||100;if(i(e))t(window[e]);else var o=setInterval((function(){if(i(e)){clearInterval(o);t(window[e])}}),n)}function d(e){window._AP.isSubHost=function(e,t){if("number"!=typeof e)return window.top;for(var n=t||window,o=0;o<e;o++)n=n.parent;return n}(e.hostFrameOffset)!==window;var t=window._AP._convertConnectOptions(e);window._AP.addonAttemptCounter[t.containerId]=0;if(window._AP.isSubHost){window.AP&&window.AP._data&&window.AP._data.options&&window.AP._data.options.globalOptions&&(t.options.globalOptions=window.AP._data.options.globalOptions);r(window._AP._createSub(t),t)}else a("connectHost",(function(e){var n,o;(n=e,o={addon_key:t.addon_key,key:t.key},n.getExtensions(o).filter((function(e){return Boolean(document.getElementById(e.extension_id))}))).forEach((function(n){if(n.extension.options.uniqueKey===t.options.uniqueKey){var o=document.getElementById(n.extension_id);e.destroy(n.extension_id);o&&AJS.$(o).closest(".ap-iframe-container").remove()}}),this);r(e.create(t),t)}))}function r(t,n){var o=document.getElementById(n.containerId);window._AP.addonAttemptCounter[n.containerId]++;if(o){delete window._AP.addonAttemptCounter[n.containerId];if(window._AP.isSubHost){o.appendChild(t);!function(e,t){var n=e.contentDocument,o={type:"set_inner_iframe_url",iframeData:t,extension_id:JSON.parse(e.name).extension_id},i="(function(){ var w = window; for (var i=0; i<"+t.options.hostFrameOffset+"; i++){w = w.parent; } w.postMessage("+JSON.stringify(o)+', "*");}());';n.open();n.write("<script>"+i+"<\/script>");n.close()}(t,n)}else{var i=o.querySelector(".ap-iframe-container");if(i){i.parentNode.removeChild(i);AJS.log&&AJS.log("AJS: duplicate iframe removed",n,o)}t.appendTo(o);t.data("addon-key",n.addon_key);t.data("key",n.key)}}else window._AP.addonAttemptCounter[n.containerId]<=10&&e((function(){r(t,n)}))}window._AP.appendConnectAddon=function(e){var o=!1;try{window.top.karma&&(o=!0)}catch(e){}if(window===window.top||o){/^com\.atlassian\.(jira|confluence)\.emcee($|\.local|\.staging|\.development\..*)/g.test(e.addon_key)?t("ac/marketplace",(function(t){t&&a("connectHost",(function(e){e.defineModule("marketplace",t)}));d(e)}),20):"com.addonengine.analytics"===e.addon_key?a("connectHost",(function(t){n(t,"analytics",(function(){d(e)}))})):d(e)}else{var i=function(t){if(t.source===window.top&&t.data&&void 0!==t.data.hostFrameOffset){window.removeEventListener("message",i);e.hostFrameOffset=t.data.hostFrameOffset;d(e)}};window.addEventListener("message",i);window.top.postMessage({type:"get_host_offset"},"*")}}}();
}catch(e){WRMCB(e)};