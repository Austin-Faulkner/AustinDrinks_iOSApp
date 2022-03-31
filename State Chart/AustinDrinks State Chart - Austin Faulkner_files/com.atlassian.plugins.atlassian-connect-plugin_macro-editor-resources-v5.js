WRMCB=function(e){var c=console;if(c&&c.log&&c.error){c.log('Error running batched script.');c.error(e);}}
;
try {
/* module-key = 'com.atlassian.plugins.atlassian-connect-plugin:macro-editor-resources-v5', location = 'v5/js/confluence/macro/metadata-cache.js' */
define("ac/confluence/macro/metadata-cache",[],(function(){var a={};return{getMetaData:function(t){if(a.hasOwnProperty(t))return a[t];var e=WRM.data.claim(t);a[t]=e;return e},setMetaData:function(t,e){a[t]=e}}}));
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.plugins.atlassian-connect-plugin:macro-editor-resources-v5', location = 'v5/js/confluence/macro/macro-preview-override-no-transformer.js' */
AJS.bind("init.rte",(function(){require(["ac/confluence/macro/editor","confluence/macro-js-overrides","ac/confluence/macro/metadata-cache"],(function(e,a,r){function n(e){var a=document.createElement("div");a.innerHTML=e;var r=a.getElementsByClassName("ap-container");if(r.length)return r[0].outerHTML}var t=r.getMetaData("com.atlassian.plugins.atlassian-connect-plugin:macro-editor-resources-v5.macroPreviewData"),c=r.getMetaData("com.atlassian.plugins.atlassian-connect-plugin:macro-editor-resources-v5.editorData");for(var i in t)t.hasOwnProperty(i)&&a.assignFunction(i,{updateMacroPreviewIframe:function(e){return function(a,r,t){var i=$(r).parent(),o=n(t);if(o){i.empty();i.html(c.hasOwnProperty(e)?"":o);i.find(".ap-container").addClass("ac-macro-preview-override");AJS.trigger("macro-browser.preview-ready");return!0}return!1}}(i)})}))}));
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.plugins.atlassian-connect-plugin:macro-editor-resources-v5', location = 'v5/js/confluence/macro/property-panel-override-no-transformer.js' */
require(["ac/confluence/macro/property-panel-controls","ac/confluence/macro/property-panel-iframe","ac/confluence/macro/property-panel-event","confluence/macro-js-overrides","ac/confluence/macro/metadata-cache"],(function(n,a,e,c,o){AJS.bind("init.rte",(function(){var r=o.getMetaData("com.atlassian.plugins.atlassian-connect-plugin:macro-editor-resources-v5.propertyPanelData");for(var t in r)if(r.hasOwnProperty(t)){!function(o,r){c.assignFunction(o,a(r));c.assignFunction(o,n(o));c.assignFunction(o,e)}(t,AJS.params.contextPath+r[t].URL)}}))}));
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.plugins.atlassian-connect-plugin:macro-editor-resources-v5', location = 'v5/js/confluence/macro/editor-override-no-transformer.js' */
!function(){function e(e){e=e||{};require(["wrm","ac/confluence/macro/editor","confluence/macro-js-overrides","ac/confluence/macro/metadata-cache"],(function(t,n,r,i){var a="com.atlassian.plugins.atlassian-connect-plugin:macro-editor-resources-v5.editorData";function o(){var t=i.getMetaData(a);for(var o in t)if(t.hasOwnProperty(o)){var c=t[o];!function(e,t){r.assignFunction(e,{opener:function(r){r=$.extend({name:e},r);n.openCustomEditor(r,t)}})}(o,{width:c.WIDTH,height:c.HEIGHT,addonKey:c.ADDON_KEY,editTitle:c.EDIT_TITLE,insertTitle:c.INSERT_TITLE,url:AJS.params.contextPath+c.URL})}e.trigger&&"function"==typeof e.trigger&&e.trigger()}if(e.forceRequire){t.forceRequire("wr!com.atlassian.plugins.atlassian-connect-plugin:macro-editor-resources-v5",{contexts:["editor"]},(function(e){try{var n=JSON.parse(t._unparsedData[a]);i.setMetaData(a,n)}catch(e){console.warn(e)}o()}))}else o()}))}AJS.bind("init.rte",(function(){e()}));AJS.bind("reset.rte",(function(t){e({forceRequire:!0,trigger:function(){AJS.trigger("reset.complete")}})}))}();
}catch(e){WRMCB(e)};