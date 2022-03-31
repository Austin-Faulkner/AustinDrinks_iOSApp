WRMCB=function(e){var c=console;if(c&&c.log&&c.error){c.log('Error running batched script.');c.error(e);}}
;
try {
/* module-key = 'com.atlassian.confluence.extra.team-calendars:eventtypes-edit', location = 'com/atlassian/confluence/extra/calendar3/components/customeventype/customeventtype-list.js' */
define("tc/customeventtype-list",["jquery","tc-backbone","tc/customeventtype-model","underscore"],function(c,e,d,a){var b=e.Collection.extend({model:d,select:function(g){this.selectedId=g;var f=this.selectedItem();this.trigger("selected",this);return f},selectedItem:function(){if(this.selectedId){return this.findWhere({id:this.selectedId})}return undefined},defaultEventTypes:function(){return this.where({isCustomEvent:false})},customEventTypes:function(){return this.where({isCustomEvent:true})},initialize:function(){this.sortField="name";this.sortDirection="ASC"},setSortField:function(g,f){this.sortField=g;this.sortDirection=f},comparator:function(f){return f.get(this.sortField)},sortBy:function(g,f){var i=this.models,h=this.sortDirection;return a.pluck(a.map(i,function(l,j,k){return{value:l,index:j,criteria:g.call(f,l,j,k)}}).sort(function(m,j){var l=h==="ASC"?m.criteria:j.criteria,k=h==="ASC"?j.criteria:m.criteria;if(l!==k){if(l>k||l===void 0){return 1}if(l<k||k===void 0){return -1}}return m.index<j.index?-1:1}),"value")}});return b});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.extra.team-calendars:eventtypes-edit', location = 'com/atlassian/confluence/extra/calendar3/components/customeventype/customeventtype-model.js' */
define("tc/customeventtype-model",["jquery","tc-backbone"],function(b,c){var a=c.Model.extend({defaults:function(){return{title:"",icon:"",subCalendar:"",disable:false,isCustomEvent:false,id:"",created:"",periodInMins:""}},validate:function(d){if(!d.isCustomEvent){return false}var e=[];if(!d.title){e.push({field:"title",message:"Event name is required"})}d.title=b.trim(d.title);if(d.title.length<=0){e.push({field:"title",message:"Event name is required"})}else{if(d.title.length>256){e.push({field:"title",message:"Event name should be less than or equal to 256 characters"})}}if(!d.icon){e.push({field:"icon",message:"Event icon is required"})}return e.length>0?e:false},toggle:function(){this.set({disable:!this.get("disable")})}});return a});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.extra.team-calendars:eventtypes-edit', location = 'com/atlassian/confluence/extra/calendar3/components/customeventype/customeventtype-view/customeventtype-view.js' */
define("tc/customeventtype-view",["jquery","tc-backbone","tc/dialogs","tc/templates","tc/customeventtype-edit","tc/calendar-util"],function(f,g,b,d,e,c){var a=g.View.extend({tagName:"tr",mediator:null,confirmDialog:null,events:{"click .hidden-link":"_toggle","click .edit-eventtypes-link":"_edit","click .remove-eventtypes-link":"_removeFromCollection"},initialize:function(h){this.mediator=h.mediator;this.listenTo(this.model,"change",this.render);this.listenTo(this.model,"destroy",this.remove);this.listenTo(this.model.collection,"selected",this.selected)},render:function(){if(!this.$el.hasClass("event-type-item")){this.$el.addClass("event-type-item")}if(this.model.get("disable")){this.$el.addClass("event-type-item-hidden")}else{this.$el.removeClass("event-type-item-hidden")}this.$el.find(".eventtypes-icon-link a").each(function(j,k){var l=f(k).data("tipsy");if(l){l.disable();l.hide()}});var h=f.extend({},this.model,{showInforReminder:c.showInforReminder(this.model.attributes.periodInMins)});this.$el.html(Confluence.TeamCalendars.Templates.viewCustomEventType({eventTypeModel:h}));var i=this.$el.find(".eventtypes-icon-link a");if(i.tooltip){i.tooltip({aria:true})}return this},removeEventListener:function(){this.$el.off("click",".hide-eventtypes-link")},remove:function(){this.$el.remove()},selected:function(i){var h=i.selectedItem();if(h.id===this.model.id){this._edit()}},_toggle:function(){this.model.toggle()},_edit:function(){var h=new e({model:this.model,parentCustomEventTypeDiv:this.$el,mediator:this.mediator});h.render();f("#edit-calendar-dialog").find(".eventtypes-edit-dialog-panel").scrollTop(h.$el.position().top)},_removeFromCollection:function(){var h=this;h.mediator.trigger("close-edit-custom-event-dialog");h._showConfirmCustomEventTypeDeleteDialog(h.model)},_getCustomEventTypeData:function(h){return{subCalendarId:h.get("subCalendar").id,customEventTypeId:h.get("id")}},_showConfirmCustomEventTypeDeleteDialog:function(h){var j=this;function i(l){if(l.keyCode===27){j._calltrigerOpenEditCustomEventTypeDialog(i)}}f(document).keyup(i);var k=new AJS.Dialog(450,"auto","confirm-delete-custom-event-type");k.addHeader("Delete Event Type");k.addPanel("",Confluence.TeamCalendars.Templates.confirmCustomEventNameDelete({customEventName:h.get("title")}),"tc-confirm-delete-custom-event-type-dialog");k.addButton("Yes",function(){j._removeCustomEventType(h,k,i)});k.addLink("Cancel",function(){k.hide();j._calltrigerOpenEditCustomEventTypeDialog(i);return false});j.confirmDialog=k;j.confirmDialog.show();j.confirmDialog.updateHeight();return k},_removeCustomEventType:function(i,l,j){var k=this;var h=k._getCustomEventTypeData(i);f.ajax({cache:false,data:h,dataType:"json",error:function(m,o,n){l.hide()},success:function(){i.collection.remove(i);l.hide();k._calltrigerOpenEditCustomEventTypeDialog(j);var m={customEventTypeName:i.get("title")};Confluence.TeamCalendars.fireEventForAnalytics("customeventtype.delete",m)},type:"DELETE",timeout:Confluence.TeamCalendars.ajaxTimeout,url:Confluence.TeamCalendars.getCalendarServiceBaseUrl("/eventtype/custom.json")})},_calltrigerOpenEditCustomEventTypeDialog:function(h){this.mediator.trigger("open-edit-custom-event-dialog");if(this.confirmDialog){this.confirmDialog.hide();this.confirmDialog.remove()}f(document).unbind("keyup",h)}});return a});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.extra.team-calendars:eventtypes-edit', location = 'com/atlassian/confluence/extra/calendar3/components/customeventype/customeventtype-view/customeventtype-view.soy' */
// This file was automatically generated from customeventtype-view.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Confluence.TeamCalendars.Templates.
 */

if (typeof Confluence == 'undefined') { var Confluence = {}; }
if (typeof Confluence.TeamCalendars == 'undefined') { Confluence.TeamCalendars = {}; }
if (typeof Confluence.TeamCalendars.Templates == 'undefined') { Confluence.TeamCalendars.Templates = {}; }


Confluence.TeamCalendars.Templates.viewCustomEventType = function(opt_data, opt_ignored) {
  return '<td class="custom-event-type-title" data-id="' + soy.$$escapeHtml(opt_data.eventTypeModel.attributes.id) + '" data-title="' + soy.$$escapeHtml(opt_data.eventTypeModel.attributes.title) + '"><span class="event-type-link" title="' + soy.$$escapeHtml(opt_data.eventTypeModel.attributes.title) + '"><span class="' + soy.$$escapeHtml(opt_data.eventTypeModel.attributes.icon) + '"></span><span class="event-type-label">' + soy.$$escapeHtml(opt_data.eventTypeModel.attributes.title) + '</span></span></td><td class="event-type-reminder-title"><span class="event-type-reminder-info" title="' + soy.$$escapeHtml(opt_data.eventTypeModel.showInforReminder) + '">' + soy.$$escapeHtml(opt_data.eventTypeModel.showInforReminder) + '</span></td><td class="eventtypes-icon-link">' + ((opt_data.eventTypeModel.attributes.isCustomEvent) ? '<a href="#" class="aui-icon edit-eventtypes-link" title="' + soy.$$escapeHtml('Edit Event') + '"></a><a href="#" class="aui-icon hidden-link ' + ((opt_data.eventTypeModel.attributes.disable) ? ' show-eventtypes-link ' : ' hide-eventtypes-link ') + '" title="' + ((opt_data.eventTypeModel.attributes.disable) ? ' ' + soy.$$escapeHtml('Show Event') + ' ' : ' ' + soy.$$escapeHtml('Hide Event') + ' ') + '"></a><a href="#" class="aui-icon remove-eventtypes-link" title="' + soy.$$escapeHtml('Delete Event') + '"></a>' : '<a href="#" class="aui-icon edit-eventtypes-link" title="' + soy.$$escapeHtml('Edit Event') + '"></a><a href="#" class="aui-icon hidden-link ' + ((opt_data.eventTypeModel.attributes.disable) ? ' show-eventtypes-link ' : ' hide-eventtypes-link ') + '" title="' + ((opt_data.eventTypeModel.attributes.disable) ? ' ' + soy.$$escapeHtml('Show Event') + ' ' : ' ' + soy.$$escapeHtml('Hide Event') + ' ') + '"></a>') + '</td>';
};
if (goog.DEBUG) {
  Confluence.TeamCalendars.Templates.viewCustomEventType.soyTemplateName = 'Confluence.TeamCalendars.Templates.viewCustomEventType';
}

}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.extra.team-calendars:eventtypes-edit', location = 'com/atlassian/confluence/extra/calendar3/components/customeventype/customeventtypes-edit-dialog/customeventtypes-edit-dialog.js' */
define("tc/eventtypes-edit-dialog",["jquery","underscore","tc-backbone","tc/dialogs","tc/templates","tc/customeventtype-view","tc/customeventtype-edit","tc/customeventtype-model","tc/customeventtype-list","tc/event-types"],function(e,i,h,g,k,d,a,f,c,j){var b=h.View.extend({editDialog:null,subCalendar:null,callbackHandler:null,mediator:null,events:{"click .add-custom-event-type-item span":"_showAddEventypeForm"},initialize:function(l){this.options=e.extend({},this.defaults,l);this.mediator=i.extend({},h.Events);this.subCalendar=this.options.subCalendar;this.callbackHandler=this.options.callbackHandler;this.collection=this._buildCustomEventTypeCollection();this.editDialog=this.options.editDialog;this.listenTo(this.collection,"reset add remove",this.render);this.mediator.on("Custom-Event-Type.save",i.bind(this._updateEventType,this,this.callbackHandler));this.mediator.on("close-edit-custom-event-dialog",i.bind(this._closeEditCustomEventTypeDialog,this));this.mediator.on("open-edit-custom-event-dialog",i.bind(this._openEditCustomEventTypeDialog,this));this.$el.html(k.editCalendarEventTypes({subCalendarId:this.subCalendar.id,eventTypes:this.collection}));this.editDialog.addPanel("Event Types",this.$el,"eventtypes-edit-dialog-panel")},render:function(){if(this.collection.customEventTypes().length===0){this.$el.find(".custom-event-type-items-instructional").removeClass("hidden")}else{this.$el.find(".custom-event-type-items-instructional").addClass("hidden")}this.$el.find(".event-type-item").remove();this._renderCustomeEventTypes(this.$el.find(".default-event-type-items"),this.collection.defaultEventTypes());this.collection.setSortField("created","DESC");this.collection.sort();this._renderCustomeEventTypes(this.$el.find(".custom-event-type-items"),this.collection.customEventTypes());this.editDialog.getCurrentPanel().onselect=function(){e("#edit-calendar-dialog").find(".button-panel-button.submit").removeClass("hidden")};return this.editDialog},selectCustomEvent:function(l){this.collection.select(l)},getDisableEventTypes:function(){var l=this.collection.chain().filter(function(m){return m.get("disable")===true}).map(function(m){return m.id}).value();return l},showAddEventypeForm:function(){e(".add-custom-event-type-item span").click()},_renderCustomeEventTypes:function(l,n){var m=this;e(n).each(function(o,q){var p=new d({model:q,mediator:m.mediator});l.after(p.render().el)})},_buildCustomEventTypeCollection:function(){var o=this;var t=o.subCalendar.disableEventTypes;var s=o.subCalendar.customEventTypes;var m=o.subCalendar.sanboxEventTypeReminders;var l=j.DefaultEventType;var n=new c();var q=function(u){for(var v in t){if(u===t[v]){return true}}return false};var r=function(u){for(var v in m){if(u===m[v].eventTypeId){return m[v].periodInMins}}};var p=new Array();e.each(l,function(u,w){if(!w.hiddenFromEventCreation){var v=new f({title:w.name,subCalendar:o.subCalendar,disable:q(w.id),id:w.id,icon:w.id,periodInMins:r(w.id)});p.push(v)}});if(s){e.each(s,function(u,w){var v=new f({title:w.title,subCalendar:o.subCalendar,disable:q(w.customEventTypeId),id:w.customEventTypeId,icon:w.icon,isCustomEvent:true,created:w.created,periodInMins:w.periodInMins});p.push(v)})}n.add(p);return n},_showAddEventypeForm:function(n){var o=e(n.target).closest(".add-custom-event-type-item");var l=new f({id:null,subCalendar:this.subCalendar,isCustomEvent:true});l.collection=this.collection;var m=new a({model:l,parentCustomEventTypeDiv:o,mediator:this.mediator});m.render();this.$el.parent().scrollTop(this.$el.find("#edit-custom-event-type-form form").position().top)},_updateEventType:function(m,l){if(l.get("isCustomEvent")===true){this._updateCustomEventType(m,l)}else{this._updateSanboxEventType(m,l)}},_updateCustomEventType:function(n,p){var o=this;var l=o._getCustomEventTypes(p);var m=this.$el.find("#save-custom-event-type");e(m).val("Saving...").attr("disabled","disabled").addClass("ui-state-disabled");e.ajax({cache:false,data:l,dataType:"json",error:function(q,s,r){n.showAjaxUpdateError(q,s,r)},success:function(r){var t=new f({subCalendar:o.subCalendar,isCustomEvent:true,title:r.title,icon:r.icon,id:r.customEventTypeId,created:r.created,periodInMins:r.periodInMins});var u={customEventTypeName:r.title};var s=true;var q=o.collection.where({id:r.customEventTypeId});if(q&&q.length>0){s=false}if(s){Confluence.TeamCalendars.fireEventForAnalytics("customeventtype.create",u)}else{Confluence.TeamCalendars.fireEventForAnalytics("customeventtype.update",u)}o.collection.add(t);o.$el.parent().scrollTop(o.$el.find(".add-custom-event-type-item").position().top)},type:"PUT",timeout:Confluence.TeamCalendars.ajaxTimeout,url:Confluence.TeamCalendars.getCalendarServiceBaseUrl("/eventtype/custom.json")})},_updateSanboxEventType:function(o,n){var p=this;var l=p._getSanboxEventTypes(n);var m=this.$el.find("#save-custom-event-type");e(m).val("Saving...").attr("disabled","disabled").addClass("ui-state-disabled");e.ajax({cache:false,data:l,dataType:"json",error:function(q,s,r){o.showAjaxUpdateError(q,s,r)},success:function(q){p.collection.add(n);p.$el.parent().scrollTop(p.$el.find(".add-custom-event-type-item").position().top)},type:"PUT",timeout:Confluence.TeamCalendars.ajaxTimeout,url:Confluence.TeamCalendars.getCalendarServiceBaseUrl("/eventtype/sandbox.json")})},_selectIconCustomEventType:function(l){l.preventDefault();e(l.target).siblings(".icon-teamcals").removeClass("selected");e(l.target).addClass("selected")},_getCustomEventTypes:function(l){return{title:l.get("title"),icon:l.get("icon"),subCalendarId:l.get("subCalendar").id,customEventTypeId:l.get("id"),created:l.get("created"),periodInMins:l.get("periodInMins")}},_getSanboxEventTypes:function(l){return{title:l.get("title"),icon:l.get("icon"),subCalendarId:l.get("subCalendar").id,eventTypeId:l.get("id"),created:l.get("created"),periodInMins:l.get("periodInMins")}},_closeEditCustomEventTypeDialog:function(){this.editDialog.hide()},_openEditCustomEventTypeDialog:function(){this.editDialog.show()}});return b});
}catch(e){WRMCB(e)};
;
try {
/* module-key = 'com.atlassian.confluence.extra.team-calendars:eventtypes-edit', location = 'com/atlassian/confluence/extra/calendar3/components/customeventype/customeventtypes-edit-dialog/customeventtypes-edit-dialog.soy' */
// This file was automatically generated from customeventtypes-edit-dialog.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Confluence.TeamCalendars.Templates.
 */

if (typeof Confluence == 'undefined') { var Confluence = {}; }
if (typeof Confluence.TeamCalendars == 'undefined') { Confluence.TeamCalendars = {}; }
if (typeof Confluence.TeamCalendars.Templates == 'undefined') { Confluence.TeamCalendars.Templates = {}; }


Confluence.TeamCalendars.Templates.editCalendarEventTypes = function(opt_data, opt_ignored) {
  return '<form name="editSubCalendarEventTypesForm" class="sub-calendar-edit-event-types-form aui" method="POST" action="#"><input type="hidden" name="subCalendarId" value="' + soy.$$escapeHtml(opt_data.subCalendarId) + '"><div class="form-mode create"><table id="eventtypes-edit-table" class="tc-event-type-item aui"><colgroup><col span="1" class="aui-restfultable-order"><col span="1"><col span="1" class="aui-restfultable-operations"></colgroup><tbody class="ui-sortable"><tr class="default-event-type-items"><td class="event-types-title">' + soy.$$escapeHtml('Default Event Types') + '</td><td class="event-types-title">' + soy.$$escapeHtml('Reminder') + '</td><td class="event-types-title"></td></tr><tr class="custom-event-type-items"><td class="event-types-title">' + soy.$$escapeHtml('Custom Event Types') + '</td><td class="event-types-title">' + soy.$$escapeHtml('Reminder') + '</td><td class="event-types-title"></td></tr><tr class="custom-event-type-items-instructional"><td class="custom-event-types-instructional" colspan="3">' + soy.$$escapeHtml('Plan any type of event, like training, rosters, and campaigns!') + '</td></tr><tr class="add-custom-event-type-item"><td><span class="custom-event-type-link" title="' + soy.$$escapeHtml('Add new event type') + '"><span class="add-event-type-icon"></span><span class="add-event-type-label">' + soy.$$escapeHtml('Add new event type') + '</span></span></td><td class="event-types-title"></td></tr></tbody></table></div></form>';
};
if (goog.DEBUG) {
  Confluence.TeamCalendars.Templates.editCalendarEventTypes.soyTemplateName = 'Confluence.TeamCalendars.Templates.editCalendarEventTypes';
}

}catch(e){WRMCB(e)};