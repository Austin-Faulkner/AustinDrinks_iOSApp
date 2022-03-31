WRMCB=function(e){var c=console;if(c&&c.log&&c.error){c.log('Error running batched script.');c.error(e);}}
;
try {
/* module-key = 'confluence.web.resources:legacy-editor-global-AVOID-IF-POSSIBLE', location = 'includes/js/amd/shim/confluence-editor-amd.js' */
define("confluence/legacy-editor-global-AVOID-IF-POSSIBLE",[],function(){"undefined"===typeof Confluence&&(Confluence={});"undefined"===typeof Confluence.Editor&&(Confluence.Editor={});return Confluence.Editor});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.plugins.shortcuts.atlassian-shortcuts-plugin:shortcuts', location = '/js/keycommands.js' */
AJS.bind("initialize.keyboardshortcuts",function(){var D=AJS.$,B=function(F){return(AJS.Data&&AJS.Data.get(F))||AJS.params[F]},A=B("build-number"),E=B("keyboardshortcut-hash");if(!A||!E){throw new Error("build-number and keyboardshortcut-hash must both exist in AJS.Data or AJS.params.")}var C=AJS.contextPath()+"/rest/shortcuts/latest/shortcuts/"+encodeURIComponent(A)+"/"+encodeURIComponent(E);D.getJSON(C,function(H){var F=H.shortcuts;if(!F){throw new Error("Server returned no shortcuts.")}AJS.trigger("shortcuts-loaded.keyboardshortcuts",{shortcuts:F});var I=[];var K={enableContext:function(M){var L=D.grep(F,function(N){return N.context===M});I=I.concat(AJS.whenIType.fromJSON(L,true))}};var G=function(){AJS.trigger("register-contexts.keyboardshortcuts",{shortcutRegistry:K})};G();AJS.bind("add-bindings.keyboardshortcuts",G);var J=function(){D.each(I,function(){this.unbind()});I=[]};AJS.bind("remove-bindings.keyboardshortcuts",J)})});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.keyboardshortcuts:confluence-keyboard-shortcuts-soy', location = 'templates/confluence-keyboard-shortcuts.soy' */
// This file was automatically generated from confluence-keyboard-shortcuts.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace __KeyboardShortcutsDialog.
 */

if (typeof __KeyboardShortcutsDialog == 'undefined') { var __KeyboardShortcutsDialog = {}; }


__KeyboardShortcutsDialog.keyboardShortcutModule = function(opt_data, opt_ignored) {
  return '<div class="module"><div class="mod-header"><h3>' + soy.$$escapeHtml(opt_data.title) + '</h3></div><div class="mod-content"><ul class="mod-item"></ul></div></div>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialog.keyboardShortcutModule.soyTemplateName = '__KeyboardShortcutsDialog.keyboardShortcutModule';
}


__KeyboardShortcutsDialog.keyboardShortcutHelpLink = function(opt_data, opt_ignored) {
  return '' + Confluence.Templates.Dialog.customHelpLink({href: '' + ((true == true) ? soy.$$escapeHtml("https://confluence.atlassian.com/display/ConfCloud/Keyboard+Shortcuts%2C+Markdown%2C+and+Autocomplete") : soy.$$escapeHtml("https://confluence.atlassian.com/display/ConfCloud/Keyboard+Shortcuts")), text: '' + soy.$$escapeHtml('View All Shortcuts')});
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialog.keyboardShortcutHelpLink.soyTemplateName = '__KeyboardShortcutsDialog.keyboardShortcutHelpLink';
}


__KeyboardShortcutsDialog.keyboardShortcutEnabledCheckbox = function(opt_data, opt_ignored) {
  return '<form name="shortcut-settings" id="shortcut-settings-form"><input type="checkbox" name="enabled" id="keyboard-shortcut-enabled-checkbox"><label for="keyboard-shortcut-enabled-checkbox">' + soy.$$escapeHtml('Enable General Shortcuts') + '</label></form>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialog.keyboardShortcutEnabledCheckbox.soyTemplateName = '__KeyboardShortcutsDialog.keyboardShortcutEnabledCheckbox';
}


__KeyboardShortcutsDialog.keyboardShortcutPanel = function(opt_data, opt_ignored) {
  return '<div id=' + soy.$$escapeHtml(opt_data.panelId) + '><div class="keyboard-shortcut-dialog-panel-header"></div><div class="shortcutsmenu"></div><div class="keyboard-shortcut-dialog-panel-footer"></div></div>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialog.keyboardShortcutPanel.soyTemplateName = '__KeyboardShortcutsDialog.keyboardShortcutPanel';
}

}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.keyboardshortcuts:confluence-keyboard-shortcuts-soy', location = 'js/confluence-keyboard-shortcuts-soy.js' */
define("confluence-keyboard-shortcuts/confluence-keyboard-shortcuts-soy",function(){return __KeyboardShortcutsDialog});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.keyboardshortcuts:confluence-keyboard-shortcuts-autoformat-tab-soy', location = 'templates/shortcut-dialog-tab-autoformat.soy' */
// This file was automatically generated from shortcut-dialog-tab-autoformat.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace __KeyboardShortcutsDialogAutoformat.
 */

if (typeof __KeyboardShortcutsDialogAutoformat == 'undefined') { var __KeyboardShortcutsDialogAutoformat = {}; }


__KeyboardShortcutsDialogAutoformat.configureAutocomplete = function(opt_data, opt_ignored) {
  return '<div id="keyboard-shortcut-autocomplete-message">' + soy.$$escapeHtml('To configure Autocomplete,') + ' <a target="_blank" href=' + soy.$$escapeHtml(opt_data.href) + '>' + soy.$$escapeHtml('go to your editor settings') + '</a></div>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.configureAutocomplete.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.configureAutocomplete';
}


__KeyboardShortcutsDialogAutoformat.helpItem = function(opt_data, opt_ignored) {
  return '<li class="item-details"><span class="item-description wiki-content">' + opt_data.output + '</span><span class="' + opt_data.actionClass + ' item-action">' + opt_data.type + '</span></li>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.helpItem.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.helpItem';
}


__KeyboardShortcutsDialogAutoformat.simpleHelpItem = function(opt_data, opt_ignored) {
  return '' + __KeyboardShortcutsDialogAutoformat.helpItem({output: opt_data.output, type: '<code>' + opt_data.type + '</code>', actionClass: ''});
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.simpleHelpItem.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.simpleHelpItem';
}


__KeyboardShortcutsDialogAutoformat.tableHelpItem = function(opt_data, opt_ignored) {
  return '' + __KeyboardShortcutsDialogAutoformat.helpItem({output: opt_data.output, type: '<code>' + opt_data.type + '</code>', actionClass: 'table-action'});
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.tableHelpItem.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.tableHelpItem';
}


__KeyboardShortcutsDialogAutoformat.styleHelpItem = function(opt_data, opt_ignored) {
  return '' + __KeyboardShortcutsDialogAutoformat.helpItem({output: opt_data.output, type: '<code>' + opt_data.type + '</code>', actionClass: 'style-action'});
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.styleHelpItem.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.styleHelpItem';
}


__KeyboardShortcutsDialogAutoformat.keyboardShortcutItem = function(opt_data, opt_ignored) {
  return '' + __KeyboardShortcutsDialogAutoformat.helpItem({output: '' + soy.$$escapeHtml(opt_data.output), type: '<kbd class="regular-key">' + soy.$$escapeHtml(opt_data.type) + '</kbd>', actionClass: ''});
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.keyboardShortcutItem.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.keyboardShortcutItem';
}


__KeyboardShortcutsDialogAutoformat.emoticonHelpItem = function(opt_data, opt_ignored) {
  return '' + __KeyboardShortcutsDialogAutoformat.simpleHelpItem({output: '<img src=' + soy.$$escapeHtml(opt_data.src) + '></img>', type: opt_data.type});
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.emoticonHelpItem.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.emoticonHelpItem';
}


__KeyboardShortcutsDialogAutoformat.boldDescription = function(opt_data, opt_ignored) {
  return '<b>' + soy.$$escapeHtml('Bold') + '</b> ' + soy.$$escapeHtml('text');
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.boldDescription.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.boldDescription';
}


__KeyboardShortcutsDialogAutoformat.underlineDescription = function(opt_data, opt_ignored) {
  return '<span style="text-decoration: underline;">' + soy.$$escapeHtml('Underline') + '</span> ' + soy.$$escapeHtml('text');
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.underlineDescription.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.underlineDescription';
}


__KeyboardShortcutsDialogAutoformat.strikethroughDescription = function(opt_data, opt_ignored) {
  return '<span style="text-decoration: line-through;">' + soy.$$escapeHtml('Strikethrough') + '</span> ' + soy.$$escapeHtml('text');
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.strikethroughDescription.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.strikethroughDescription';
}


__KeyboardShortcutsDialogAutoformat.italicDescription = function(opt_data, opt_ignored) {
  return '<em>' + soy.$$escapeHtml('Italic') + '</em> ' + soy.$$escapeHtml('text');
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.italicDescription.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.italicDescription';
}


__KeyboardShortcutsDialogAutoformat.monospaceDescription = function(opt_data, opt_ignored) {
  return '<code>' + soy.$$escapeHtml('Monospace') + '</code> ' + soy.$$escapeHtml('text');
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.monospaceDescription.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.monospaceDescription';
}


__KeyboardShortcutsDialogAutoformat.tableDescription = function(opt_data, opt_ignored) {
  return '<table class="confluenceTable"><tbody><tr><td class="confluenceTd">' + soy.$$escapeHtml('first cell') + '</td><td class="confluenceTd">&nbsp;</td><td class="confluenceTd">&nbsp;</td><td class="confluenceTd">&nbsp;</td></tr></tbody></table>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.tableDescription.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.tableDescription';
}


__KeyboardShortcutsDialogAutoformat.tableWithHeadingsDiscriptions = function(opt_data, opt_ignored) {
  return '<table class="confluenceTable"><tbody><tr><th class="confluenceTh">' + soy.$$escapeHtml('heading') + '</th><th class="confluenceTh">' + soy.$$escapeHtml('heading') + '</th></tr><tr><td class="confluenceTd">&#8203;</td><td class="confluenceTd">&#8203;</td></tr></tbody></table>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.tableWithHeadingsDiscriptions.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.tableWithHeadingsDiscriptions';
}


__KeyboardShortcutsDialogAutoformat.h1Description = function(opt_data, opt_ignored) {
  return '<h1>' + soy.$$escapeHtml('Heading') + '</h1>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.h1Description.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.h1Description';
}


__KeyboardShortcutsDialogAutoformat.h3Description = function(opt_data, opt_ignored) {
  return '<h3>' + soy.$$escapeHtml('Heading') + '</h3>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.h3Description.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.h3Description';
}


__KeyboardShortcutsDialogAutoformat.bqDescription = function(opt_data, opt_ignored) {
  return '<blockquote>' + soy.$$escapeHtml('Quote') + '</blockquote>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.bqDescription.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.bqDescription';
}


__KeyboardShortcutsDialogAutoformat.numberedListDescription = function(opt_data, opt_ignored) {
  return '<ol><li>' + soy.$$escapeHtml('list') + '</li></ol>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.numberedListDescription.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.numberedListDescription';
}


__KeyboardShortcutsDialogAutoformat.bulletedListDescription = function(opt_data, opt_ignored) {
  return '<ul><li>' + soy.$$escapeHtml('bullets') + '</li></ul>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.bulletedListDescription.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.bulletedListDescription';
}


__KeyboardShortcutsDialogAutoformat.inlineTaskListDescription = function(opt_data, opt_ignored) {
  return '<ul class="inline-task-list"><li>task</li></ul>';
};
if (goog.DEBUG) {
  __KeyboardShortcutsDialogAutoformat.inlineTaskListDescription.soyTemplateName = '__KeyboardShortcutsDialogAutoformat.inlineTaskListDescription';
}

}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.keyboardshortcuts:confluence-keyboard-shortcuts-autoformat-tab-soy', location = 'js/shortcut-dialog-tab-autoformat-soy.js' */
define("confluence-keyboard-shortcuts/shortcut-dialog-tab-autoformat-soy",function(){return __KeyboardShortcutsDialogAutoformat});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.keyboardshortcuts:confluence-keyboard-shortcuts-autoformat-tab', location = 'js/shortcut-dialog-tab-autoformat.js' */
define("confluence-keyboard-shortcuts/shortcut-dialog-tab-autoformat",["ajs","confluence-keyboard-shortcuts/confluence-keyboard-shortcuts-soy","confluence-keyboard-shortcuts/shortcut-dialog-tab-autoformat-soy","jquery","confluence/dark-features"],function(a,h,b,g,c){c=c.isEnabled("editor.spa.uxenhancements");var l={context:"autoformat.font_formatting",description:b.strikethroughDescription(),action:"~~Strikethrough~~"},m={context:"autoformat.font_formatting",
description:b.boldDescription(),action:"**Bold** or __Bold__"},n={context:"autoformat.font_formatting",description:b.italicDescription(),action:"*Italic* or _Italic_"},p={context:"autoformat.font_formatting",description:b.monospaceDescription(),action:"`Monospace`"},q={context:"autoformat.styles",description:b.h1Description(),action:"# Heading 1"},
r={context:"autoformat.styles",description:b.h3Description(),action:"### Heading 3"},t={context:"autoformat.styles",description:b.bqDescription(),action:"\u003e Quote"},u={context:"autoformat.lists",description:b.numberedListDescription(),action:"1. list"},v=[c?m:{context:"autoformat.font_formatting",description:b.boldDescription(),action:"*Bold*"},
c?l:{context:"autoformat.font_formatting",description:b.underlineDescription(),action:"+Underline+"},c?n:{context:"autoformat.font_formatting",description:b.italicDescription(),action:"_Italic_"},c?p:{context:"autoformat.font_formatting",description:b.monospaceDescription(),action:"{{Monospace}}"},{context:"autoformat.tables",description:b.tableDescription(),
action:"||||| + enter"},{context:"autoformat.tables",description:b.tableWithHeadingsDiscriptions(),action:"||heading||heading||"},c?q:{context:"autoformat.styles",description:b.h1Description(),action:"h1. Heading"},c?r:{context:"autoformat.styles",description:b.h3Description(),action:"h3. Heading"},c?t:{context:"autoformat.styles",
description:b.bqDescription(),action:"bq. Quote"},{context:"autoformat.emoticons",img:"check.png",action:"(/)"},{context:"autoformat.emoticons",img:"smile.png",action:":)"},c?u:{context:"autoformat.lists",description:b.numberedListDescription(),action:"# list"},
{context:"autoformat.lists",description:b.bulletedListDescription(),action:"* bullets"},{context:"autoformat.lists",description:b.inlineTaskListDescription(),action:"[] task"},{context:"autoformat.autocomplete",description:"Image/Media",action:"!"},{context:"autoformat.autocomplete",description:"Link",
action:"["},{context:"autoformat.autocomplete",description:"Macro",action:"{"}],k=function(a,b,c){a=g(h.keyboardShortcutModule({title:a}));var d=a.find("ul");b=w(b);for(var f=0,e=b.length;f<e;f++)d.append(c(b[f]));return a},e=function(a,b,c){return k(a,b,function(a){return c({output:a.description,type:a.action})})},x=function(c,
d){var f=a.params.staticResourceUrlPrefix+"/images/icons/emoticons/";return k(c,d,function(a){return b.emoticonHelpItem({src:f+a.img,type:a.action})})},w=function(a){return g.grep(v,function(b){return b.context===a})};return function(){var c=g(h.keyboardShortcutPanel({panelId:"autoformat-shortcuts-panel"})),d=c.children(".shortcutsmenu");d.append(e("Font Formatting","autoformat.font_formatting",b.simpleHelpItem));d.append(e("Autocomplete",
"autoformat.autocomplete",b.keyboardShortcutItem));d.append(e("Tables","autoformat.tables",b.tableHelpItem));d.append(e("Styles","autoformat.styles",b.styleHelpItem).addClass("styles-module"));d.append(x("Emoticons","autoformat.emoticons"));d.append(e("Lists","autoformat.lists",b.simpleHelpItem));
a.Meta.get("remote-user")&&c.find(".keyboard-shortcut-dialog-panel-header").append(b.configureAutocomplete({href:a.contextPath()+"/users/viewmyeditorsettings.action"}));return c}});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.keyboardshortcuts:confluence-keyboard-shortcuts', location = 'js/confluence-keyboard-shortcuts.js' */
define("confluence-keyboard-shortcuts/confluence-keyboard-shortcuts","ajs jquery confluence-keyboard-shortcuts/confluence-keyboard-shortcuts-soy window confluence/dialog confluence-keyboard-shortcuts/shortcut-dialog-tab-autoformat confluence/dark-features".split(" "),function(a,f,l,d,x,y,v){var c,k={Autoformat:[],Editor:[],enabled:!1,ready:!1,dialog:null,closeDialog:function(){u().then(function(a){a.hide()});return!1},openDialog:function(){f(this).removeClass("interactive");u().then(function(a){a.show()});
return!1}},u=function(){function g(){d.Confluence&&d.Confluence.Editor&&d.Confluence.Editor.isVisible&&d.Confluence.Editor.isVisible()?(c.overrideLastTab(),c.gotoPanel(1)):c.gotoPanel(0)}var h=f.Deferred();if(c)return g(),h.resolve(c);var q=k.shortcuts,m=-1!==d.navigator.platform.indexOf("Mac"),z=function(e){var b=a("span").addClass("item-action");e=e.keys[0];for(var f=0;f<e.length;f++){0<f&&b.append(w("then"));for(var c=b,n=e[f].split("+"),d=0;d<n.length;d++){0<
d&&c.append(w("+"));for(var h=c,p=n[d].split(".."),g=0;g<p.length;g++)0<g&&h.append(w("to")),h.append(u(p[g]))}}return b},u=function(e){var b=a("kbd");switch(e){case "Shift":case "Sh":b.text("Shift");b.addClass("modifier-key");break;case "Ctrl":e=m?"⌘":"Ctrl";b.text(e);b.addClass("modifier-key");break;case "Tab":b.text("Tab");b.addClass("modifier-key");break;case "Alt":b.text("Alt");
b.addClass("modifier-key");break;case "LeftAlt":e=m?"Option":"Left Alt";b.text(e);b.addClass("modifier-key");break;case "Control":b.text("Control");b.addClass("modifier-key");break;case "Option":b.text("Option");b.addClass("modifier-key");break;case "UpArrow":b.text("\u2191");b.addClass("regular-key");break;case "DownArrow":b.text("\u2193");
b.addClass("regular-key");break;case "LeftArrow":b.text("\u2190");b.addClass("regular-key");break;case "RightArrow":b.text("\u2192");b.addClass("regular-key");break;default:b.text(e),b.addClass("regular-key")}return b},w=function(e){var b=a("span");b.text(e);b.addClass("key-separator");return b},r=function(e,b,c){e=f(l.keyboardShortcutModule({title:e}));for(var d=e.find("ul"),n=0;n<c.length;n++){var g=c[n];if(!g.hidden&&
-1!==f.inArray(g.context,b)){var h=a("li").addClass("item-details"),p=g.description,p=a("strong").addClass("item-description").append(p);h.append(p);h.append(z(g));d.append(h)}}return e};c=x.component({width:950,height:660,id:"keyboard-shortcuts-dialog"});c.addHeader("Keyboard Shortcuts");c.addPanel("General",function(){var e=f(l.keyboardShortcutPanel({panelId:"general-shortcuts-panel"})),b=f(e).children(".shortcutsmenu");
a.Meta.get("atlassian-account-id")&&e.find(".keyboard-shortcut-dialog-panel-header").append(l.keyboardShortcutEnabledCheckbox());b.append(r("Global Shortcuts",["global"],q));b.append(r("Page / Blog Post Actions",["viewcontent","viewinfo"],q));return e}());c.addPanel("Editor",function(){var e=f(l.keyboardShortcutPanel({panelId:"editor-shortcuts-panel"})),b=f(e).children(".shortcutsmenu"),
c=["tinymce.block"],g=["tinymce.rich"],d=["tinymce.actions"];v.isEnabled("editor.spa.uxenhancements")&&(e.addClass("foxy-ux-enhancement"),c=["adg3.tinymce.block"],g=["adg3.tinymce.rich"],g.push(m?"adg3.tinymce.rich.mac":"adg3.tinymce.rich.win"),d=["adg3.tinymce.actions"],d.push(m?"adg3.tinymce.actions.mac":"adg3.tinymce.actions.win"));b.append(r("Block Formatting",c,q));b.append(r("Rich Formatting",g,q));b.append(r("Editing Actions",
d,q));return e}());c.addPanel("Editor Autoformatting",y());c.addCancel("Close",function(){a.debug("Hiding Shortcuts help");c.hide();return!1});c.popup.element.find(".dialog-title").prepend(l.keyboardShortcutHelpLink());a.trigger("keyboard-shortcut-dialog-ready",c);g();h.resolve(c);f("#keyboard-shortcut-enabled-checkbox").prop("checked",t.keyboardShortcuts.enabled).click(function(e){var b=f(this).prop("checked");f.ajax({type:"POST",url:a.contextPath()+
"/rest/confluenceshortcuts/latest/enabled",data:f.toJSON({enabled:b}),dataType:"json",contentType:"application/json"}).done(function(){t.keyboardShortcuts.enabled=b;t.keyboardShortcuts.ready=!1;b?a.trigger("add-bindings.keyboardshortcuts"):a.trigger("remove-bindings.keyboardshortcuts")})});return h},t={init:function(){a.debug("confluence-keyboard-shortcuts initialising");a.PageGadget||d.parent.AJS&&d.parent.AJS.PageGadget?a.debug("Inside the Page Gadget. Skipping keyboard shortcuts"):(k.enabled=a.Meta.getBoolean("use-keyboard-shortcuts"),
a.bind("shortcuts-loaded.keyboardshortcuts",function(a,c){k.shortcuts=c.shortcuts;f("#keyboard-shortcuts-link").click(k.openDialog)}),a.bind("register-contexts.keyboardshortcuts",function(c,h){if(k.enabled){c=h.shortcutRegistry;h=d.Confluence&&d.Confluence.Editor&&d.Confluence.Editor.isVisible&&d.Confluence.Editor.isVisible();f("#action-menu-link").length&&!h&&c.enableContext("viewcontent");f("#viewPageLink").length&&c.enableContext("viewinfo");if(h){v.isEnabled("editor.spa.uxenhancements")?c.enableContext("adg3.tinymce.actions"):
c.enableContext("editor");var g=require("tinymce"),m=g.activeEditor,l=f("#rte").closest("form");f.each(k.shortcuts,function(c,d){if(0===d.context.indexOf("tinymce")){var h=d.op,e=d.param;f.each(d.keys,function(){var b=this,c;"click"==h?c=function(){f(e).click()}:"execute"==h&&(c=e);if(c){f.isArray(b)&&(b=b.join(","));var k=b.toLowerCase(),k=4<=parseInt(g.majorVersion,10)&&g.isMac?k.replace("ctrl","meta"):k;a.debug("Adding shortcut for "+k);m.addShortcut(k,"",c);v.isEnabled("editor.spa.uxenhancements")||
"tinymce.actions"!=d.context||-1===b.indexOf("+")||(a.debug("Binding shortcut on inputs too for "+b),l.delegate(":input","keydown",function(a){var e=a.keyCode?a.keyCode:a.which,d=b.split("+"),d=f.map(d,function(b){return"Ctrl"==b&&a.metaKey||"Shift"==b&&a.shiftKey||e==b.charCodeAt(0)?null:b});d.length||(c(),a.preventDefault())}))}else a.logError("ERROR: unkown editor shortcut key operation "+h+" for shortcut "+b)})}})}k.ready=!0}}),"undefined"!==typeof a.contextPath()&&k.enabled&&(f("#rte").length?
a.bind("init.rte",function(){a.trigger("initialize.keyboardshortcuts")}):a.trigger("initialize.keyboardshortcuts")))}};t.keyboardShortcuts=k;return t});require("confluence/module-exporter").safeRequire("confluence-keyboard-shortcuts/confluence-keyboard-shortcuts",function(a){var f=require("ajs");Confluence.KeyboardShortcuts=a.keyboardShortcuts;f.toInit(a.init)});
}catch(e){WRMCB(e)};