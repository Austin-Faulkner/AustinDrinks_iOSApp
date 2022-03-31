WRMCB=function(e){var c=console;if(c&&c.log&&c.error){c.log('Error running batched script.');c.error(e);}}
;
try {
/* module-key = 'confluence.extra.jira:jim-validator-page', location = '/templates/validator/templates.soy' */
// This file was automatically generated from templates.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Confluence.Templates.Jim.Validator.
 */

if (typeof Confluence == 'undefined') { var Confluence = {}; }
if (typeof Confluence.Templates == 'undefined') { Confluence.Templates = {}; }
if (typeof Confluence.Templates.Jim == 'undefined') { Confluence.Templates.Jim = {}; }
if (typeof Confluence.Templates.Jim.Validator == 'undefined') { Confluence.Templates.Jim.Validator = {}; }


Confluence.Templates.Jim.Validator.configDialog = function(opt_data, opt_ignored) {
  var param6 = '<p>' + soy.$$escapeHtml('Please let us know which new instances correspond to your old instances so we can update the JIRA links.') + '</p>';
  var param11 = '<table class="aui"><thead><tr><th id="old">' + soy.$$escapeHtml('Existing JIRA instance link') + '</th><th id="arrow"></th><th id="new">' + soy.$$escapeHtml('New JIRA instance link') + '</th></tr></thead><tbody>';
  var baList17 = opt_data.brokenAppLinks;
  var baListLen17 = baList17.length;
  for (var baIndex17 = 0; baIndex17 < baListLen17; baIndex17++) {
    var baData17 = baList17[baIndex17];
    param11 += '<tr><td headers="old">' + soy.$$escapeHtml(baData17.server) + '</td><td headers="arrow"><span class="aui-icon aui-icon-small aui-iconfont-devtools-arrow-right"></span></td><td headers="new"><select name="' + soy.$$escapeHtml(baData17.serverId) + '" id="' + soy.$$escapeHtml(baData17.serverId) + '" class="select select-applink-config" data-placeholder="' + soy.$$escapeHtml('Select an Application Link') + '" required><option value="">' + soy.$$escapeHtml('Select an Application Link') + '</option>';
    var eaList29 = opt_data.existingApplinks;
    var eaListLen29 = eaList29.length;
    for (var eaIndex29 = 0; eaIndex29 < eaListLen29; eaIndex29++) {
      var eaData29 = eaList29[eaIndex29];
      param11 += '<option value="' + soy.$$escapeHtml(eaData29.serverId) + '">' + soy.$$escapeHtml(eaData29.server) + '</option>';
    }
    param11 += '</select></td></tr>';
  }
  param11 += '</tbody></table>';
  param6 += aui.form.form({action: '#', content: param11});
  param6 += '<br><p>' + soy.$$filterNoAutoescape('\x3cstrong\x3ePlease note:\x3c/strong\x3e The broken macros won\x27t work until you complete this step.') + '</p>';
  var output = '' + aui.dialog.dialog2({id: opt_data.dialogId, modal: true, titleText: 'Choose JIRA instance links', content: param6, footerActionContent: '<div class="button-spinner"></div>' + aui.form.submit({id: 'validator-done', type: 'primary', text: 'Finish'}) + aui.buttons.button({id: 'validator-cancel', type: 'link', text: 'Cancel'})});
  return output;
};
if (goog.DEBUG) {
  Confluence.Templates.Jim.Validator.configDialog.soyTemplateName = 'Confluence.Templates.Jim.Validator.configDialog';
}


Confluence.Templates.Jim.Validator.warningFlagContent = function(opt_data, opt_ignored) {
  return '<div>' + soy.$$escapeHtml('We\x27ve found some broken JIRA issue macros on your instance.') + '</div><div><button class="aui-button aui-button-link show-prompt-dialog">' + soy.$$escapeHtml('Click here to fix.') + '</button></div>';
};
if (goog.DEBUG) {
  Confluence.Templates.Jim.Validator.warningFlagContent.soyTemplateName = 'Confluence.Templates.Jim.Validator.warningFlagContent';
}


Confluence.Templates.Jim.Validator.error = function(opt_data, opt_ignored) {
  return '<div>' + soy.$$escapeHtml(opt_data.message) + '</div><ul class="aui-nav-actions-list"><li><button class="aui-button aui-button-link dismissed-applink">' + soy.$$escapeHtml('Dismiss') + '</button></li></ul>';
};
if (goog.DEBUG) {
  Confluence.Templates.Jim.Validator.error.soyTemplateName = 'Confluence.Templates.Jim.Validator.error';
}


Confluence.Templates.Jim.Validator.warningNoApplink = function(opt_data, opt_ignored) {
  return '<div>' + soy.$$escapeHtml('Your Confluence instance has JIRA macros in it but isn\x27t linked to a JIRA instance. Please link an instance so these macros can work.') + '</div><ul class="aui-nav-actions-list"><li><button class="aui-button aui-button-link add-new-applink">' + soy.$$escapeHtml('Link a JIRA instance') + '</button></li><li><button class="aui-button aui-button-link dismissed-applink">' + soy.$$escapeHtml('Dismiss') + '</button></li></ul>';
};
if (goog.DEBUG) {
  Confluence.Templates.Jim.Validator.warningNoApplink.soyTemplateName = 'Confluence.Templates.Jim.Validator.warningNoApplink';
}

}catch(e){WRMCB(e)};
;
try {
/* module-key = 'confluence.extra.jira:jim-validator-page', location = '/validator/js/resource.js' */
define("confluence/jim/validator/js/resource",["jquery","underscore","ajs","confluence/jim/validator/js/notify"],function(e,d,b,c){var a=function(){};a.prototype.getValidationStatus=function(){var f=b.contextPath()+"/rest/jiraanywhere/1.0/jim-validator/get-scanning-status";return e.getJSON(f,{}).fail(this.onError)};a.prototype.start=function(){var f=b.contextPath()+"/rest/jiraanywhere/1.0/jim-validator/scan-broken-applink-in-background";return e.ajax({type:"POST",url:f,contentType:"application/json"}).fail(this.onError)};a.prototype.resetStatus=function(){var f=b.contextPath()+"/rest/jiraanywhere/1.0/jim-validator/reset-status";return e.ajax({type:"POST",url:f,contentType:"application/json"}).fail(this.onError)};a.prototype.onError=function(h){var g=new c();try{if(h.status===401){g.showError("Client must be authenticated to access this resource.")}else{var f=JSON.parse(h.responseText);g.showError(f.message)}}catch(i){g.showError("Unhandler exception: "+i)}};a.prototype.fixApplink=function(h,f){b.trigger("analyticsEvent",{name:"jim.validator.start.fixing",data:{numberOfMapping:h.length}});var g=b.contextPath()+"/rest/jiraanywhere/1.0/jim-validator/fix-applink";return e.ajax({type:"POST",url:g,data:JSON.stringify({appLinkMappingList:h,contentIds:f}),contentType:"application/json"}).fail(this.onError)};return a});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'confluence.extra.jira:jim-validator-page', location = '/validator/js/progress-bar.js' */
define("confluence/jim/validator/js/progress-bar",["jquery","ajs"],function(b,a){var c=function(){this.$el=b(".progress-bar-section");this.$label=this.$el.find(".progress-bar-label")};c.prototype.show=function(){this.$el.show()};c.prototype.hide=function(){this.$el.hide()};c.prototype.update=function(d,e){this.$label.text(d);a.progressBars.update("#validator-progress-bar",e);this.show()};return c});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'confluence.extra.jira:jim-validator-page', location = '/validator/js/prompt-dialog.js' */
define("confluence/jim/validator/js/prompt-dialog",["jquery","underscore","ajs","confluence/jim/validator/js/resource"],function(d,c,b,e){var a=function(f){this.promptDialogId="jim-validator-config-dialog";this.data=f;this.brokenAppLinks=f.problems.brokenAppLinks;this.existingAppLinks=f.problems.existingAppLinks;this.resource=new e();this.deferred=d.Deferred();this.$dialog=d(Confluence.Templates.Jim.Validator.configDialog({dialogId:this.promptDialogId,brokenAppLinks:this.brokenAppLinks,existingApplinks:this.existingAppLinks}))};a.prototype.show=function(){this.$dialog.appendTo("body");this.$dialog.find(".select-applink-config").auiSelect2({minimumResultsForSearch:-1,placeholder:"Select an Application Link"});b.dialog2("#"+this.promptDialogId).show();this.addEvent();return this.deferred.promise()};a.prototype.addEvent=function(){this.$dialog.find("#validator-done").on("click",c.bind(this.onDoneClick,this));this.$dialog.find("#validator-cancel").on("click",c.bind(this.onCancelButtonClick,this))};a.prototype.onDoneClick=function(){if(!this.isFormValid()){return}var f=[];c.each(this.brokenAppLinks,function(g){var h=d("select#"+g.serverId).auiSelect2("data");f.push({oldAppLink:g,newAppLink:{serverId:h.id,server:h.text}})});this.resource.fixApplink(f,this.data.problems.contentIds).done(c.bind(function(){b.dialog2("#"+this.promptDialogId).remove();this.deferred.resolve()},this)).fail(c.bind(function(){this.deferred.fail(arguments)},this))};a.prototype.onCancelButtonClick=function(f){b.dialog2("#"+this.promptDialogId).remove();this.deferred.reject()};a.prototype.isFormValid=function(){var f=true;d(".select-applink-config").each(function(){var g=d(this).auiSelect2("val");d(this).toggleClass("invalid",!!!g);if(!g){f=false;return false}});return f};return a});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'confluence.extra.jira:jim-validator-page', location = '/validator/js/notify.js' */
define("confluence/jim/validator/js/notify",["jquery","ajs"],function(d,a){function c(e,f){return a.flag({type:e,body:f})}var b=function(){};b.prototype.showWarning=function(f,g){var h=Confluence.Templates.Jim.Validator.warningFlagContent();var e=c("warning",h);d(e).find(".show-prompt-dialog").on("click",function(i){a.trigger("analyticsEvent",{name:"jim.validator.space.import.show.prompt.dialog"});g&&g();e.close()});return e};b.prototype.showError=function(g,e){var h=Confluence.Templates.Jim.Validator.error({message:g});var f=c("error",h);d(f).find(".dismissed-applink").on("click",function(){a.trigger("analyticsEvent",{name:"jim.validator.space.import.error.dismissed"});e&&e();f.close()});return f};b.prototype.showNoAppLink=function(g,e){var h=Confluence.Templates.Jim.Validator.warningNoApplink();var f=c("warning",h);d(f).find(".add-new-applink").on("click",function(){a.trigger("analyticsEvent",{name:"jim.validator.space.import.add.new.applink"});g&&g();f.close()});d(f).find(".dismissed-applink").on("click",function(){a.trigger("analyticsEvent",{name:"jim.validator.space.import.no.applink.dismissed"});e&&e();f.close()});return f};return b});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'confluence.extra.jira:jim-validator-page', location = '/validator/js/validator.js' */
define("confluence/jim/validator/js/validator",["jquery","underscore","ajs","confluence/jim/validator/js/resource","confluence/jim/validator/js/notify","confluence/jim/validator/js/progress-bar","confluence/jim/validator/js/prompt-dialog"],function(g,e,c,h,d,b,a){var f=function(){this.STATUS={NOT_STARTED:"NOT_STARTED",IN_PROGRESS:"IN_PROGRESS",WAIT_FOR_CONFIG:"WAIT_FOR_CONFIG",FIXING:"FIXING",NO_APPLINK:"NO_APPLINK",DONE:"DONE",ERROR:"ERROR"};this.INTERVAL=2000;this.resource=new h();this.notify=new d();this.getProgressBar=function(){if(!this.progressBar){this.progressBar=new b()}return this.progressBar};this.timeout=null;this.startRequested=false};f.prototype.init=function(){this.getProgressBar().hide();if(this.isForceStart()){this.start()}else{this.startCheckingStatus()}};f.prototype.start=function(){this.startRequested=true;this.getProgressBar().show();this.resource.start().done(e.bind(this.startCheckingStatus,this))};f.prototype.isForceStart=function(){var i=window.location.href;return i.indexOf("/admin/jim-validator/view.action?forcestart=true")>0};f.prototype.startCheckingStatus=function(){this.resource.getValidationStatus().done(e.bind(this.processStatusCallback,this))};f.prototype.processStatusCallback=function(j){if(this.timeout!==null){clearTimeout(this.timeout);this.timeout=null}switch(j.status){case this.STATUS.IN_PROGRESS:case this.STATUS.FIXING:this.getProgressBar().show();setTimeout(e.bind(this.startCheckingStatus,this),this.INTERVAL);break;case this.STATUS.DONE:c.trigger("analyticsEvent",{name:"jim.validator.space.import.status.done"});this.getProgressBar().update("All done!",1);var k=!!g(".section.applink-validator-main").length;if(k){this.resetStatus()}break;case this.STATUS.ERROR:c.trigger("analyticsEvent",{name:"jim.validator.space.import.status.error",data:{msg:j.additionalMessage}});this.notify.showError(j.additionalMessage,e.bind(this.resetStatus,this));this.getProgressBar().hide();g("#jira-macro-repair-start-button").enable();g("#jira-macro-repair-skip-button").enable();break;case this.STATUS.NO_APPLINK:c.trigger("analyticsEvent",{name:"jim.validator.space.import.status.no.applink"});this.notify.showNoAppLink(e.bind(function(){this.resetStatus().done(this.onGoToAppLinkClick)},this),e.bind(function(){this.resetStatus();this.getProgressBar().hide()},this));break;case this.STATUS.WAIT_FOR_CONFIG:c.trigger("analyticsEvent",{name:"jim.validator.space.import.status.config"});this.notify.showWarning(j,e.bind(this.onWarningClick,this,j));break;case this.STATUS.NOT_STARTED:if(this.startRequested){var i=this;this.timeout=setTimeout(function(){i.start()},1000)}else{this.getProgressBar().hide()}break}};f.prototype.onWarningClick=function(j){var i=new a(j);i.show().done(e.bind(function(){this.getProgressBar().show();setTimeout(e.bind(this.startCheckingStatus,this),this.INTERVAL)},this))};f.prototype.onGoToAppLinkClick=function(){window.location=c.contextPath()+"/plugins/servlet/applinks/listApplicationLinks"};f.prototype.resetStatus=function(){this.startRequested=false;if(this.timeout!==null){clearTimeout(this.timeout);this.timeout=null}return this.resource.resetStatus()};return f});require("confluence/jim/amd/module-exporter").safeRequire("confluence/jim/validator/js/validator",function(c){var a=require("ajs");var b=require("jquery");a.toInit(function(){(new c).init();var e=b("#jira-macro-repair-start-button");var d=b("#jira-macro-repair-skip-button");e.on("click",function(){e.disable();d.disable();(new c).start()});d.on("click",function(){a.trigger("analyticsEvent",{name:"jim.validator.skip"});window.location.href=a.contextPath()+"/admin/importspace/importconfluencespace.action"})})});
}catch(e){WRMCB(e)};