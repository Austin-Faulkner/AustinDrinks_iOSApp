WRMCB=function(e){var c=console;if(c&&c.log&&c.error){c.log('Error running batched script.');c.error(e);}}
;
try {
/* module-key = 'com.atlassian.plugins.atlassian-connect-plugin:confluence-macro-v5', location = 'v5/js/confluence/macro/bookmark.js' */
!function(o,e){e("ac/confluence/macro/bookmark",["ajs"],(function(o){var e;return{createBookmark:function(){return e=o.Rte.getEditor().selection.getBookmark()},destroyBookmark:function(){if(e){e.keep=!1;o.Rte.getEditor().selection.moveToBookmark(e);e=null}}}}))}(AJS.$,define);
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.plugins.atlassian-connect-plugin:confluence-macro-v5', location = 'v5/js/confluence/macro/editor.js' */
!function(e,t){t("ac/confluence/macro/editor",["ac/confluence/macro","ac/confluence/macro/bookmark","ajs","ac/confluence/utils"],(function(e,t,o,r){var a;return{close:function(){connectHost.dialog.close()},getMacroData:function(t){if(o.DarkFeatures.isEnabled("fabric.editor.fix-get-macro-methods")){const o=e.getCurrentMacroParameters();if(o)return t(o);var r=t._context.extension.options.productContext["macro.id"];return t(e.getMacroData(r))}return t(e.getCurrentMacroParameters())},getMacroBody:function(e){return e(a)},openCustomEditor:function(n,c){var i;if(!r.isFabricEditor()){o.Rte.getEditor().focus();var d=o.Rte.getEditor().selection.getNode();i=t.createBookmark();e.setLastSelectedConnectMacroNode(d)}e.setUnsavedMacroData(n.name,n.body?n.body:"",n.params,i);a=n.body;var s={addon_key:c.addonKey,key:n.name},u=c.width||null,m=c.height||null,l={header:n.params?c.editTitle:c.insertTitle,submitText:n.params?"Save":"Insert",width:u,height:m,onHide:t.destroyBookmark};"100%"!==u&&"100%"!==m&&(l.chrome=!0);connectHost.dialog.create(s,l)}}}))}(AJS.$,define);
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.plugins.atlassian-connect-plugin:confluence-macro-v5', location = 'v5/js/confluence/macro/property-panel-iframe.js' */
!function(e,n){n("ac/confluence/macro/property-panel-iframe",["ac/confluence/macro","ajs"],(function(n,a){return function(o){return{propertyPanelIFrameInjector:function(t){var c=a.Rte.getEditor().selection;n.setLastSelectedConnectMacroNode(c.getNode());e.ajax(o,{data:{classifier:"property-panel"}}).done((function(n){var a=e(n);a.css("display","none");t.panel.append(a)}))}}}}))}(AJS.$,define);
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.plugins.atlassian-connect-plugin:confluence-macro-v5', location = 'v5/js/confluence/macro/property-panel-controls.js' */
!function(n,t){t("ac/confluence/macro/property-panel-controls",["underscore"],(function(n){return function(t){var c;return{getControls:function(r){r(c=c||function(c){try{return n.first(n.filter(n.pluck(c,t),n.isObject))}catch(n){return null}}(WRM.data.claim("com.atlassian.plugins.atlassian-connect-plugin:confluence-macro.property-panel-controls")))}}}}))}(AJS.$,define);
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.plugins.atlassian-connect-plugin:confluence-macro-v5', location = 'v5/js/confluence/macro/property-panel-event.js' */
!function(n,e){e("ac/confluence/macro/property-panel-event",[],(function(){var e,t=[],r=function(n,e,t){connectHost.broadcastEvent(n,(function(n){return-1!==n.extension_id.indexOf(e)}));t()};return{waitForPropertyPanelEventBindings:function(){e=!1;t=[]},propertyPanelEventsBound:function(){e=!0;for(;t.length>0;){var n=t.shift();r(n.eventKey,n.macroName,n.doneCallback)}},handlePropertyPanelEvent:function(o,c,a){var i=n.Deferred();if("click"===o){var u=function(n,e){return"click."+n+"."+e+".macro.property-panel"}(c,a);e?r(u,a,i.resolve):function(n,e,r){t.length<10&&t.push({eventKey:n,macroName:e,doneCallback:r})}(u,a,i.resolve)}return i},_getQueueLength:function(){return t.length}}}))}(AJS.$,define);
}catch(e){WRMCB(e)};