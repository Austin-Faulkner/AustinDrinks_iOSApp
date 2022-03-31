// Sets base path for mxgraph library
if (typeof window.mxBasePath === 'undefined')
{
	window.mxBasePath = '/mxgraph';
}

// Sets absolute path for proxy
window.PROXY_URL = window.PROXY_URL || '/proxy';

// Renamed from ac.js. This is the version used for release 1.4.8-AC onwards
var AC = {};

AC.creationTime = Date.now();
AC.autosaveTimeout = 10000;
AC.draftExtension = '.tmp';
AC.draftPrefix = '~';
AC.timeout = 25000;

//Allow saving multiple times
//Important: Don't change this as it will break real-time collab! TODO Remove it
AC.autoExit = true;

//This flag MUST be true for correct operation TODO Remove it
AC.draftEnabled = true;

AC.customContentEditMode = false;

AC.findMacrosRegEx = new RegExp('\\<ac\\:structured\\-macro[^\\>]+?(?=ac\\:name\\=)ac\\:name\\=\\"drawio\\".*?(?=\\<\\/ac\\:structured\\-macro\\>)', 'g');
AC.findEmbedMacrosRegEx = new RegExp('\\<ac\\:structured\\-macro[^\\>]+?(?=ac\\:name\\=)ac\\:name\\=\\"inc\\-drawio\\".*?(?=\\<\\/ac\\:structured\\-macro\\>)', 'g');
AC.findSketchMacrosRegEx = new RegExp('\\<ac\\:structured\\-macro[^\\>]+?(?=ac\\:name\\=)ac\\:name\\=\\"drawio-sketch\\".*?(?=\\<\\/ac\\:structured\\-macro\\>)', 'g');

AC.VERSION = '1.4.8'; //TODO Get the version
AC.draftsToKeep = 10;

AC.COLLAB_PROP = 'ac:custom-content:collab';
AC.COLLAB_LOCK_PROP = 'ac:custom-content:collabLock';
AC.MACRO_EDITS_PROP = 'pendingDrawioMacroEdits';
AC.LOCK_TS_NAME = '<:LOCK_TS?>';

AC.maxRetries = 5;
AC.coolOff = 1000;

//TODO There are some global variable and also local variables (used as global) in the huge init function. Remove as much as possible then move the remaining to the state  
//Holds the currently edited file info
AC.state = {};

AC.checkConfLicense = function(license, xdm_e, callback)
{
	//Exclude dev domain
	if (location.host == 'test.draw.io')
	{
		callback(true);
		return;
	}
	
	var licenseValid = true;
	
	if (license != null && xdm_e != null && license == 'none')
	{
		var hostParse = document.createElement('a');
		hostParse.href = xdm_e;
		var hostname = hostParse.hostname;
		
		if (hostname != null)
		{
			var xhr = new XMLHttpRequest();
	
			xhr.onreadystatechange = function()
			{
			    if (xhr.readyState == XMLHttpRequest.DONE)
			    {
					if (xhr.status >= 200 && xhr.status <= 299)
					{
				        var resp = xhr.responseText;
		
						if (resp != null && resp.length > 0)
						{
							var lic = JSON.parse(resp);
							
							if (lic.atlasCloudLic == null || lic.atlasCloudLic == 'blocked')
							{
								licenseValid = false;
							}
						}
						else if (resp == null || resp.length == 0)
						{
							// JSON parse fails on empty response
							licenseValid = false;
						}
					}
					
					callback(licenseValid);
			    }
			};
	
			xhr.open('POST', '/license?domain=' + hostname + '&confLicense=' + license, true);
			xhr.send(null);
		}
		else
		{
			callback(licenseValid);
		}
	}
	else
	{
		callback(licenseValid);
	}
};

AC.checkOtherLicense = function(xdm_e)
{
	var checkCount = 0, gLic, lLic;
	
	function logLic()
	{
		checkCount++;
		
		if (checkCount == 2)
		{
			AP.request({
				type: 'PUT',
			    url: '/rest/atlassian-connect/1/addons/com.mxgraph.confluence.plugins.diagramly/properties/lastLicCheck',
			    contentType: 'application/json;charset=UTF-8',
				data: Date.now()
			});
			
			var hostParse = document.createElement('a');
			hostParse.href = xdm_e;
			var hostname = hostParse.hostname;
			
			function getLicInfo(lic)
			{
				return {installed: lic != null, licensed: lic != null && lic.license != null? (lic.license.evaluation? 'eval' : (lic.license.active? 'active' : 'unlicensed')) : 'unlicensed'};
			};
			
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/license?others=1&domain=' + hostname + '&info=' + encodeURIComponent(JSON.stringify({
				gliffy: getLicInfo(gLic),
				lucid: getLicInfo(lLic)
			})), true);
			xhr.send(null);
		}
	};
	
	function checkLicense()
	{
		AP.request({
			type: 'GET',
		    url: '/rest/atlassian-connect/1/addons/com.gliffy.integration.confluence',
		    contentType: 'application/json;charset=UTF-8',
		    success: function (resp) 
		    {
		        gLic = JSON.parse(resp);
				logLic();
		    },
			error : logLic
		});
		
		AP.request({
			type: 'GET',
		    url: '/rest/atlassian-connect/1/addons/com.lucidchart.confluence.plugins.lucid-confluence',
		    contentType: 'application/json;charset=UTF-8',
		    success: function (resp) 
		    {
		        lLic = JSON.parse(resp);
				logLic();
		    },
			error : logLic
		});
	}
	
	AP.request({
		type: 'GET',
	    url: '/rest/atlassian-connect/1/addons/com.mxgraph.confluence.plugins.diagramly/properties/lastLicCheck',
	    contentType: 'application/json;charset=UTF-8',
	    success: function (resp) 
	    {
	        resp = JSON.parse(resp);
			
			if (Date.now() - resp.value > 30 * 24 * 60 * 60 * 1000) //One month
			{
				checkLicense();
			}
	    },
		error : checkLicense
	});	
};

AC.logError = function(message, url, linenumber, colno, err, severity, noStack)
{
	try
	{
		if (message == AC.lastErrorMessage || (message != null && url != null &&
			((message.indexOf('Script error') != -1) || (message.indexOf('extension') != -1))))
		{
			// TODO log external domain script failure "Script error." is
			// reported when the error occurs in a script that is hosted
			// on a domain other than the domain of the current page
		}
		// DocumentClosedError seems to be an FF bug an can be ignored for now
		else if (message != null && message.indexOf('DocumentClosedError') < 0)
		{
			AC.lastErrorMessage = message;
			severity = ((severity != null) ? severity : (message.indexOf('NetworkError') >= 0 ||
				message.indexOf('SecurityError') >= 0 || message.indexOf('NS_ERROR_FAILURE') >= 0 ||
				message.indexOf('out of memory') >= 0) ? 'CONFIG' : 'SEVERE');
			err = (err != null) ? err : new Error(message);
			
			var img = new Image();
			img.src = 'https://log.draw.io/log?severity=' + severity + '&AC-v=' + encodeURIComponent(AC.VERSION) +
				((typeof window.EditorUi !== 'undefined') ? '&v=' + encodeURIComponent(EditorUi.VERSION) : '') +
    			'&msg=clientError:' + encodeURIComponent(message) + ':url:' + encodeURIComponent(window.location.href) +
    			':lnum:' + encodeURIComponent(linenumber) + ((colno != null) ? ':colno:' + encodeURIComponent(colno) : '') +
    			((!noStack && err != null && err.stack != null) ? '&stack=' + encodeURIComponent(err.stack) : '');
		}
	}
	catch (err)
	{
		// do nothing
	}
};

AC.DEBUG = false;

AC.log = function(msg)
{
	if (AC.DEBUG)
	{
		console.log('AC LOG: ' + msg);
	}	
};

AC.ALERT = false;

AC.alert = function(msg)
{
	if (AC.ALERT)
	{
		alert(msg);
	}
};

(function() {
	AC.macroParams = ['diagramName', 'contentId', 'contentVer', 'revision', 'width', 'height', 'tempPreview', 'zoom', 'lbox', 
			'diagramDisplayName', 'tbstyle', 'links', 'simple', 'hiResPreview', 'inComment', 'aspect', 'pageId', 'baseUrl',
			//inc-drawio macro specific params
			'diagramUrl', 'includedDiagram', 'aspectHash', 'imgPageId', 'attVer', 'custContentId',
			'pCenter',
			//Server macro parameters
			'border', 'viewerToolbar', 'simpleViewer', 'diagramWidth',
			//Newly added macro paramters
			//drawio macro
			'templateUrl', 'tmpBuiltIn', 'tempLibs',
			//inc-drawio macro
			'csvFileUrl', 'service', 'sFileId', 'odriveId', 'isTemplate',
			//recently added
			'isUpload', 'GHOwner', 'GHRepository', 'GHBranch'
	];
	AC.findMacroParamRegEx = {};
	
	for (var i = 0; i < AC.macroParams.length; i++)
	{
		AC.findMacroParamRegEx[AC.macroParams[i]] = new RegExp('\\<ac\\:parameter\\s+ac\\:name\\=\\"'+ AC.macroParams[i] +'\\"\\s*\\>([^\\<]+)'); 
	}
	
	AC.macroParams.push('macroId');
	AC.findMacroParamRegEx['macroId'] = new RegExp('ac\\:macro-id\\=\\"([^\\"]+)');
})();

AC.getUrlParam = function(param, escape, url){
    try{
    	var url = url || window.location.search;
        var regex = new RegExp(param + '=([^&]+)'),
        data = regex.exec(url)[1];
        // decode URI with plus sign fix.
        return (escape) ? window.decodeURIComponent(data.replace(/\+/g, '%20')) : data;
    } catch (e){
        return undefined;
    }
};

AC.getSpaceKey = function(url)
{
    try{
        var url = url || window.location.href;
        var regex = new RegExp(/\/(spaces|space)\/([^\/]+)/);
        return decodeURIComponent(regex.exec(url)[2]);
    } catch (e){
        return undefined;
    }
};

AC.getMetaTag = function(name) {
	return document.getElementsByTagName('meta')[name].getAttribute('content');
}

AC.getBaseUrl = function()
{
	var baseUrl = AC.getUrlParam('xdm_e', true) + AC.getUrlParam('cp', true);
	//Ensure baseUrl belongs to attlasian (*.jira.com and *.atlassian.net)
	//Since we add cp to xdm_e, we had to ensure that there is a slash after the domain. Since if xdm_e is ok, cp can corrupt is such as cp = '.fakedomain.com' such that baseUrl is atlassian.net.fakedomain.com
	if (/^https:\/\/([^\.])+\.jira\.com\//.test(baseUrl + '/') || /^https:\/\/([^\.])+\.atlassian\.net\//.test(baseUrl + '/')) 
	{
		return baseUrl;
	}
	throw 'Invalid baseUrl!';
};

AC.getSiteUrl = function()
{
	var siteUrl = AC.getUrlParam('xdm_e', true);
	//Ensure siteUrl belongs to attlasian (*.jira.com and *.atlassian.net)
	if (/^https:\/\/([^\.])+\.jira\.com$/.test(siteUrl) || /^https:\/\/([^\.])+\.atlassian\.net$/.test(siteUrl)) 
	{
		return siteUrl;
	}
	throw 'Invalid siteUrl!';
};

//Code from: https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
AC.b64toBlob = function(b64Data, contentType, sliceSize, isByteCharacters) 
{
	  contentType = contentType || '';
	  sliceSize = sliceSize || 512;

	  var byteCharacters = isByteCharacters? b64Data : atob(b64Data);
	  var byteArrays = [];

	  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
	    var slice = byteCharacters.slice(offset, offset + sliceSize);

	    var byteNumbers = new Array(slice.length);
	    for (var i = 0; i < slice.length; i++) {
	      byteNumbers[i] = slice.charCodeAt(i);
	    }

	    var byteArray = new Uint8Array(byteNumbers);

	    byteArrays.push(byteArray);
	  }

	  var blob = new Blob(byteArrays, {type: contentType});
	  return blob;
};

//We need language translation for error messages mainly which are not needed immediately
//TODO Duplicate with CAC one, Use CAC one instead
AC.initI18nAsync = function(lang, callback, direct, resourcePrefix)
{
	RESOURCE_BASE = (resourcePrefix || '') + '/resources/dia';
	mxLanguage = lang;
	
	var script = document.createElement('script');
	
	function loadResources()
	{
		mxResources.loadDefaultBundle = false;
		var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, lang) ||
			mxResources.getSpecialBundle(RESOURCE_BASE, lang);
		
		mxUtils.getAll([bundle], function(xhr)
		{
			// Adds bundle text to resources
			mxResources.parse(xhr[0].getText());
			
			if (callback) 
			{
				callback();
			}
		});
	};
	
	if (direct)
	{
		loadResources();
	}
	else
	{
		script.onload = loadResources;
		script.src = '/js/viewer-static.min.js';
		document.getElementsByTagName('head')[0].appendChild(script);		
	}
};

//TODO Use this functions in all similar places (admin pages and office add-in)
AC.applyTranslation = function()
{
	//HTML elements localization
	var i18nElems = document.querySelectorAll('*[data-i18n]'); //get all elements having data-i18n attribute, should be fine given a small html file
	
	for (var i = 0; i < i18nElems.length; i++)
	{
		var i18nKey = i18nElems[i].getAttribute('data-i18n');
		i18nElems[i].innerHTML = AC.htmlEntities(mxResources.get(i18nKey, null, i18nElems[i].innerHTML));
	}
	
	//Title
	var i18nTitleElems = document.querySelectorAll('*[data-i18n-title]');
	
	for (var i = 0; i < i18nTitleElems.length; i++)
	{
		var i18nKey = i18nTitleElems[i].getAttribute('data-i18n-title');
		i18nTitleElems[i].setAttribute('title', AC.htmlEntities(mxResources.get(i18nKey, null, i18nTitleElems[i].getAttribute('title'))));
	}
	
	//Placeholders
	var i18nPlaceholderElems = document.querySelectorAll('*[data-i18n-placeholder]');
	
	for (var i = 0; i < i18nPlaceholderElems.length; i++)
	{
		var i18nKey = i18nPlaceholderElems[i].getAttribute('data-i18n-placeholder');
		i18nPlaceholderElems[i].setAttribute('placeholder', AC.htmlEntities(mxResources.get(i18nKey, null, i18nPlaceholderElems[i].getAttribute('placeholder'))));
	}
};

AC.getAndApplyTranslation = function(callback, direct)
{
	AP.user.getLocale(function(locale)
	{
		if (locale != null)
		{
			var dash = locale.indexOf('_');
			
			if (dash >= 0)
			{
				locale = locale.substring(0, dash);
			}
			
			AC.initI18nAsync(locale, function()
			{
				AC.applyTranslation();
				callback(locale);
			}, direct);
		}
		else
		{
			callback(locale);
		}
	});
};

//AP.flag has a bug and stopped working, we'll use alert until it is fixed
//		https://ecosystem.atlassian.net/browse/ACJS-1052
AC.showNotification = function(notifConfig)
{
	AP.flag.create(notifConfig);
	alert(notifConfig.title + ': ' + notifConfig.body);
};

AC.initAsync = function(baseUrl, contentId, initMacroData, config, lang, isSketch)
{
	AC.isSketch = isSketch;
	AC.customContentEditMode = contentId != null;
	var contentVer = initMacroData != null? initMacroData.contentVer : null;
	
	var link = document.createElement('a');
	link.href = location.href;
	link.href = link.href; //to have 'host' populated under IE
	var hostUrl = link.protocol + '//' + link.hostname;
	var site = AC.getSiteUrl();
	var license = AC.getUrlParam('lic', false);
	
	var user = null;
	
	AP.user.getCurrentUser(function(atlUser) 
	{
		user = atlUser.atlassianAccountId;
	});
		
	if (lang != null)
	{
		var dash = lang.indexOf('_');
		
		if (dash >= 0)
		{
			lang = lang.substring(0, dash);
		}
		
		AC.initI18nAsync(lang);
	}
	
	var ui = isSketch? 'sketch' : 'kennedy';
	var plugins = 'ac148;ac148cmnt';
	var lockdown = '';
	var dataGovernance = '';
	var dataGovernanceMap = {
		EU: 'eu',
		US: 'us'
	};
	
	try
	{
		var configObj = (config != null && config != '') ?
			JSON.parse(config) : null;
		
		if (configObj != null)
		{
			// Adds support for ui theme
			if (!isSketch && configObj.ui != null)
			{
				ui = configObj.ui;
			}
			
			// Redirects plugins to p URL parameter
			if (configObj.plugins != null)
			{
				plugins = plugins + ';' + configObj.plugins;
			}
			
			AC.hiResPreview = configObj.hiResPreview || false;
			
			lockdown = configObj.lockdown? '&lockdown=1' : '';
			dataGovernance = '&dataGov=' + (dataGovernanceMap[configObj.dataGovernance] || '');
		}
	}
	catch (e)
	{
		console.log('Configuration error', e);
		AC.logError(e.message, null, null, null, e);
	}
	
	var editor = document.createElement('iframe');
	editor.setAttribute('width', '100%');
	editor.setAttribute('height', '100%');
	editor.style.width = '100%';
	editor.style.height = '100%';
	editor.setAttribute('id', 'editorFrame');
	editor.setAttribute('frameborder', '0');
//	editor.setAttribute('src', hostUrl + '/?dev=1&test=1&rtCursors=1&' +
	editor.setAttribute('src', hostUrl + '/?' +
			'ui=' + ui + '&p=' + plugins + '&atlas=1&embed=1&embedRT=1' +
			lockdown + dataGovernance +
			((AC.autoExit) ? '&noSaveBtn=1&publishClose=1' : '&saveAndExit=1') +
			'&keepmodified=1&spin=1&libraries=1&browser=0&confLib=1&proto=json&noLangIcon=1' +
		((lang != null) ? '&lang=' + lang : '') + ((site != null) ? '&site=' + encodeURIComponent(site) : '') +
		((user != null) ? '&user=' + encodeURIComponent(user) : '') +
		'&atlas-lic=' + license);

	var initReceived = false;
	var draftHandled = false;
	var waitingForAttachments = false;
	var xmlReceived = null;
	var draftXml = null;
	var loadLibs = null;
	var draftName = null;
	var filename = null;
	var theMacroData = null;
	var pageId = null;
	var draftPage = false;
	var theLocation = null;
	var attachments = null;

	var serverName = AC.getSiteUrl();
	var index1 = serverName.indexOf('//');

	if (index1 > 0)
	{
		var index2 = serverName.indexOf('/', index1 + 2);
		
		if (index2 > index1)
		{
			serverName = serverName.substring(index1 + 2, index2);
		}
		else
		{
			serverName = serverName.substring(index1 + 2);
		}
	}
	
	function startEditor()
	{
		if (initReceived && xmlReceived != null && draftHandled && !waitingForAttachments)
		{
			AC.init(baseUrl, theLocation, pageId, editor, filename, xmlReceived, draftName, draftXml, theMacroData, draftPage, loadLibs);
		}
	};
	
	function loadDraft()
	{
		if (waitingForAttachments)
		{
			return;
		}
		
		if (AC.draftEnabled && pageId != null && attachments != null &&
			(draftName != null || xmlReceived == '') && !draftHandled)
		{
			// Searches for pending new drafts from this user
			var prefix = '~drawio~' + user + '~';
			
			// Check if attachments contains draftName
			for (var i = 0; i < attachments.length; i++)
			{
				var fn = attachments[i].title;
				
				if (draftName == null && attachments[i].fileSize > 0 &&
					fn.substring(0, prefix.length) === prefix &&
					fn.substring(fn.length - AC.draftExtension.length) === AC.draftExtension)
				{
					filename = fn.substring(prefix.length, fn.length - AC.draftExtension.length);
					draftName = fn;						
				}
				
				if (fn == draftName)
				{
					//keeping the block of AP.require to minimize the number of changes!
					{
						var acceptResponse = true;
						var timeoutHandler = function()
						{
							acceptResponse = false;
							document.body.style.backgroundSize = 'auto auto';
							document.body.style.backgroundImage = 'url(/images/stop-flat-icon-80.png)';
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
	
							AC.showNotification({
							  title: mxResources.get('confTimeout'),
							  body: mxResources.get('confSrvTakeTooLong', [serverName]),
							  type: 'error',
							  close: 'manual'
							});

							//TODO find how to listen to flag close event, currently just close the editor immediately
//							messages.onClose(message, function()
//							{
				    			AP.dialog.close();
//							});
						};
						
						var timeoutThread = window.setTimeout(timeoutHandler, AC.timeout);
						
						function loadDraftError()
						{
							AC.showNotification({
							  title: mxResources.get('draftReadErr'),
							  body: mxResources.get('draftErrDataLoss'),
							  type: 'error',
							  close: 'manual'
							});
							
							AP.dialog.close();
						};
						
						AC.loadDiagram(pageId, draftName, null, function(loadResp)
						{
							//console.trace('DRAFT: Found', draftName, loadResp);
				    		window.clearTimeout(timeoutThread);
				    		
				    		if (acceptResponse)
						    {
								if (loadResp != null && loadResp.length > 0)
								{
									draftXml = loadResp;
								}
								
								draftHandled = true;
								startEditor();
						    }
						}, function()
						{
							//This error is not tolerable and can cause data loss. So, notify the user and close
					    	window.clearTimeout(timeoutThread);
					    		
					    	if (acceptResponse)
						    {
								loadDraftError();
					    	}
						});
					};
					
					// Terminates function
					return;
				}
			}
		}

		//If draft is not found, continue with actual diagram
		draftHandled = true;
		startEditor();
	};
	
	var initHandler = function(evt)
	{
		if (evt.origin == hostUrl)
		{
			var msg;
			
			try
			{
				msg = JSON.parse(evt.data);
			}
			catch (e)
			{
				AC.logError('BAD CONF CLOUD MSG: ' + evt.data, null, null, null, e, 'SEVER');
				msg = {}; //Ignore this message
			}
			
			if (msg.event == 'configure')
			{
				// Configure must be sent even if JSON invalid
				var configObj = {compressXml: false};
				
				try
				{
					configObj = JSON.parse(config);

					// Overrides default
					if (configObj != null && configObj.compressXml == null)
					{
						configObj.compressXml = false;
					}
				}
				catch (e)
				{
					// ignore
				}
				
				editor.contentWindow.postMessage(JSON.stringify({action: 'configure',
					config: configObj}), '*');
			}
			else if (msg.event == 'disableRT')
			{
				AC.disableRT = true;
			}
			else if (msg.event == 'init')
			{
				window.removeEventListener('message', initHandler);
				document.body.style.backgroundImage = 'none';
				initReceived = true;
				startEditor();
			}
		}
	};

	window.addEventListener('message', initHandler);

	AP.getLocation(function(location) 
	{
		theLocation = location;
		
	    var infoReady = function(data, macroData_p)
	    {
	    	if (pageId == null || isNaN(pageId))
    		{
    			document.body.style.backgroundImage = 'url(/images/stop-flat-icon-80.png)';
    			document.body.style.backgroundSize = 'auto auto';
    			
	    		if (data != null && data.target == 'contentcreate') 
	    		{
	    			AC.showNotification({
						  title: mxResources.get('confCannotInsertNew'),
						  body: mxResources.get('confSaveTry'),
						  type: 'error',
						  close: 'manual'
						});
	    		}
	    		else 
	    		{
	    			AC.showNotification({
						  title: mxResources.get('confCannotGetID'),
						  body: mxResources.get('confContactAdmin'),
						  type: 'error',
						  close: 'manual'
						});
	    		}
	    		
	    		//TODO find how to listen to flag close event, currently just close the editor immediately
//    			messages.onClose(message, function()
//    			{
	    			AP.dialog.close();
//    			});
    		}
	    	else
	    	{
	    		// Workaround for blocked referrer policy in iframe
	    		editor.setAttribute('src', editor.getAttribute('src') + '&base=' +
	    			encodeURIComponent(baseUrl + '/pages/viewpage.action?pageId=' + pageId) +
	    			//adding config here to be the last in the url
	    			(config != null? '&configure=1' : ''));
	    		document.body.appendChild(editor);
	    		
		    	// Not needed if drafts not enabled
		    	if (AC.draftEnabled)
		    	{
		    		waitingForAttachments = true;
		    		var acceptResponse2 = true;
		    		var timeoutHandler2 = function()
		    		{
		    			acceptResponse2 = false;
		    			document.body.style.backgroundSize = 'auto auto';
		    			document.body.style.backgroundImage = 'url(/images/stop-flat-icon-80.png)';
		    			editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');

		    			AC.showNotification({
							  title: mxResources.get('confTimeout'),
							  body: mxResources.get('confSrvTakeTooLong', [serverName]),
							  type: 'error',
							  close: 'manual'
							});
		    		
		    			//TODO find how to listen to flag close event, currently just close the editor immediately
//		    			messages.onClose(message, function()
//		    			{
			    			AP.dialog.close();
//		    			});
		    		};
		    		
		    		var timeoutThread2 = window.setTimeout(timeoutHandler2, AC.timeout);
				
		    		//TODO do a search instead if possible
		    		AC.getPageAttachments(pageId, function(atts) 
    				{
						window.clearTimeout(timeoutThread2);
			    		
			    		if (acceptResponse2)
				    	{
			    			waitingForAttachments = false;
			    			attachments = atts;
			    			loadDraft();
				    	}
    				}, function(res)
					{
			    		window.clearTimeout(timeoutThread2);
			    		
			    		if (acceptResponse2)
				    	{
			    			waitingForAttachments = false;
			    			draftHandled = true;
				    	}
					});
		    	}
	    	
				var acceptResponse = true;	
				var timeoutHandler = function()
				{
					acceptResponse = false;
					document.body.style.backgroundSize = 'auto auto';
					document.body.style.backgroundImage = 'url(/images/stop-flat-icon-80.png)';
					editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');

					AC.showNotification({
						  title: mxResources.get('confTimeout'),
						  body: mxResources.get('confSrvTakeTooLong', [serverName]),
						  type: 'error',
						  close: 'manual'
						});
				
					//TODO find how to listen to flag close event, currently just close the editor immediately
//						messages.onClose(message, function()
//						{
		    			AP.dialog.close();
//						});
				};
				
				var timeoutThread = window.setTimeout(timeoutHandler, AC.timeout);
			
				AP.confluence.getMacroData(function (macroData) 
		    	{
		    		window.clearTimeout(timeoutThread);
		    		
		    		if (acceptResponse)
			    	{
			    		var name = null, revision, owningPageId, templateUrl, isBuiltIn;
	    				
	    				if (AC.customContentEditMode)
    					{
	    					name = macroData_p.diagramName;
	    					revision = macroData_p.revision;
	    					owningPageId = pageId;
	    					
	    					//fill the macro data
	    					theMacroData = macroData_p;
    					}
	    				else if (macroData != null)
    					{
	    					theMacroData = macroData;
	    					name = macroData.diagramName;
	    					revision = parseInt(macroData.revision);
	    					owningPageId  = macroData.pageId;
							templateUrl = macroData.templateUrl;
							isBuiltIn = macroData.tmpBuiltIn == '1';
							loadLibs = macroData.tempLibs;

							//Check if this template is from server
							var serverTempUrlPrefix = '/download/resources/com.mxgraph.confluence.plugins.diagramly:drawio-editor/templates/diagram';

							if (templateUrl && templateUrl.indexOf(serverTempUrlPrefix) == 0)
							{
								templateUrl = templateUrl.substring(serverTempUrlPrefix.length);
								isBuiltIn = true;
							}
    					}
	    				
	    				if ((!AC.inTemplate && templateUrl) || name)
			    		{
				    		draftName = name ? AC.draftPrefix + name + AC.draftExtension : null;
				    		loadDraft();
			    			
			    			if (isNaN(revision))
			    			{
			    				revision = null;
			    			}
			    			
			    			timeoutThread = window.setTimeout(timeoutHandler, AC.timeout);
	
							function loadError(resp)
							{
					    		window.clearTimeout(timeoutThread);
					    		
					    		if (acceptResponse)
						    	{
				    				editor.parentNode.removeChild(editor);
				    				
				    				AC.showNotification({
										  title: mxResources.get('readErr'),
										  body: (resp.status == 404) ?
												  mxResources.get('fileNotFound') : mxResources.get('errorLoadingFile'),
										  type: 'error',
										  close: 'manual'
										});
				    		
				    				//TODO find how to listen to flag close event, currently just close the editor immediately
//				    				messages.onClose(message, function()
//				    				{
						    			AP.dialog.close();
//				    				});
						    	}
			    			};
							
							if (templateUrl)
							{
								AC.curDiagId = false; //No diagram id with templates
								
								function loadTemplate(xml)
								{
									window.clearTimeout(timeoutThread);
									AC.state.isNew = true;
									filename = null;
									xmlReceived = xml;
									startEditor();
								};
								
								if (isBuiltIn)
								{
									var req = new XMLHttpRequest();
									req.open('GET', '/' + templateUrl);
									
									req.onreadystatechange = function()
									{
										if (this.readyState == 4)
										{
											if (this.status >= 200 && this.status <= 299)
											{
												loadTemplate(req.responseText);
											}
											else
											{
												loadError(this);
											}
										}
									};
									
									req.send();
								}
								else
								{
									AP.request({
										url: templateUrl,
										success: loadTemplate,
										error : loadError
									});
								}
							}
							else
							{
				    			AC.loadDiagram(pageId, name, revision, function(loadResp, curPageId, curDiagName)
				    			{
					    			//Get current diagram information which is needed for comments & RT
					    			AC.getAttachmentInfo(curPageId, curDiagName, function(info)
					    			{
							    		window.clearTimeout(timeoutThread);
						    		
							    		if (acceptResponse)
								    	{
						    				filename = curDiagName;
						    				xmlReceived = loadResp;
											//TODO curDiagVer & curDiagId can be added to AC.state
						    				AC.curDiagVer = info.version.number;
						    				AC.curDiagId = info.id;
											startEditor();
										}
					    			}, loadError);
				    			}, loadError, owningPageId, true);
							}
			    		}
			    		else
			    		{
							AC.state.isNew = true;
			    			filename = null;
				    		xmlReceived = '';
				    		loadDraft();
			    		}
			    	}
		    	});
	    	}
	    };
		
	    var extEditingError = function()
	    {
	    	AC.showNotification({
				  title: mxResources.get('editingErr'),
				  body: mxResources.get('confExtEditNotPossible'),
				  type: 'error',
				  close: 'manual'
				});
	
			AP.dialog.close({noBack: true});
	    };
	    
		//keeping the block of AP.require to minimize the number of changes!
		{
		    AP.navigator.getLocation(function (data)
		    {
		    	AC.inComment = (data != null && data.context != null && data.context.contentType == 'comment');
				AC.inTemplate = (data != null && data.context != null && data.context.contentType == 'template');

	    		if (AC.customContentEditMode) //we can also find the contentId in data.target == 'addonmodule' and data.context.context["content.id"][0]
    			{
	    			//load the custom content to get the page info
	    			AP.request({
                        type: 'GET',
                        url: '/rest/api/content/' + contentId + '/?expand=body.storage,version,container' + (contentVer? ('&version=' + contentVer) : ''),
                        contentType: 'application/json;charset=UTF-8',
                        success: function (resp) 
                        {
                            resp = JSON.parse(resp);
                            
                            var info = JSON.parse(decodeURIComponent(resp.body.storage.value));
                            
                            pageId = info.pageId;
                            info.displayName = resp.title;
                            info.contentVer = resp.version.number;
                            
                            //Out of sync custom content. This happen when a page is moved/copied
                        	if (initMacroData != null && 
                        			((initMacroData.pageId != null && (initMacroData.pageId != pageId || resp.container.id != pageId)) 
                					|| (initMacroData.diagramName != null && initMacroData.diagramName != info.diagramName)
                					|| (!initMacroData.isUpload && initMacroData.revision != null && initMacroData.revision != info.version)))
                        	{
                            	pageId = initMacroData.pageId; 
                            	
                            	AC.state.customContentMismatch = true;
                        	}
							else
							{
								AC.state.customContentMismatch = false;
							}
                            
							//Upload embed macro case
							if (initMacroData != null && initMacroData.isUpload)
							{
								AC.isUploadMode = true;
								draftPage = (data && data.target == 'contentcreate');
								initMacroData.contentVer = info.contentVer;
								infoReady(null, initMacroData);
								return;	
							}
							
                            AC.findMacroInPage(pageId, info.diagramName, false, function(macroFound, originalBody, matchingMacros, page)
                    		{
                            	if (macroFound)
                        		{
                           			infoReady(null, matchingMacros[0].macroParams);
                        		}
                            	else //A published page that has a draft content containing the diagram OR the diagram is deleted from the page OR diagram is edited and page is old!
                        		{
                            		var directPageEdit = contentVer != null;
                            		
                            		if (directPageEdit)
                        			{
                            			//We added translation since sometimes resources doesn't load quickly for this error
                            			AC.showNotification({
	        							  title: mxResources.get('confEditedExt', null, 'Diagram/Page edited externally'),
	          							  body: mxResources.get('confEditedExtRefresh', null, 'Diagram/Page is edited externally. Please refresh the page.'),
	          							  type: 'error',
	          							  close: 'manual'
                            			});
                            			AP.dialog.close({noBack: true, noBackOnClose: directPageEdit});                            			
                        			}
                            		else //If this is edit of a custom content, we allow editing since it can be a stranded diagram (only exists as an attachment and custom contents BUT not as a macro)
                        			{
										//TODO Review this is still needed
                            			//We added translation since sometimes resources doesn't load quickly for this error
										if (info.version)
										{
	                            			AC.showNotification({
	                            				title: mxResources.get('macroNotFound', null, 'Macro Not Found'),
		  	          							body: mxResources.get('confEditDraftDelOrExt', null, 'This diagram is in a draft page, is deleted from the page, or is edited externally. ' + 
		  	          										  'It will be saved as a new attachment version and may not be reflected in the page.'),
		  	          							type: 'warning',
		  	          							close: 'manual'
	                            			});
										}
										else
										{
											AC.isUploadMode = true;
										}
										
                            			AC.strandedMode = true;
                            			//Add required info that is usually found in the macro
                            			info.contentId = contentId;
                            			info.custContentId = contentId;
                            			info.revision = info.version;
                            			info.diagramDisplayName = info.displayName;
                            			infoReady(null, info);
                        			}
                        		}
                    		}, function() //On error, it means the page is a newly created draft that is not published
                    		{
                    			AC.showNotification({
    							  title: mxResources.get('diagNotFound'),
    							  body: mxResources.get('confDiagNotPublished'),
    							  type: 'error',
    							  close: 'manual',
      							  actions: {
    							    'actionkey': mxResources.get('retBack')
    							  }
    							});
    	    		
				    			AP.dialog.close({noBack: true});
                    		}, null, null, null, null, AC.isSketch); //TODO Should we search through drafts also?
                        },
                        error: extEditingError //We can create the custom content and fix this case but it adds more complexity to rare situation (e.g., a page is copied then the source page is deleted) 
                    });
    			}
	    		else if (data != null && data.context != null
			    		&& (data.target == 'contentedit' || data.target == 'contentcreate' || AC.inComment))
	    		{
		    		draftPage = (data.target == 'contentcreate');
		    		pageId = data.context.contentId;
		    		infoReady(data);
		    	}
	    		else
    			{
	    			infoReady();
    			}
		    });
		};
	});
};


AC.getPageAttachments = function(pageId, success, error)
{
	var attachments = [];

	function getAttsChunk(url)
	{
		AP.request({
			url: url,
			type: 'GET',
			contentType: 'application/json;charset=UTF-8',
			success: function(resp) 
			{
				resp = JSON.parse(resp);				
				Array.prototype.push.apply(attachments, resp.results);
				
				//Support paging
				if (resp._links && resp._links.next) 
				{
					getAttsChunk(resp._links.next.replace(/\&\_r\=\d+/g, '')); //Remove repeated _r paramter from the URL
				}
				else
				{
					success(attachments);
				}
			},
			error : error
		});
	};
	
	getAttsChunk('/rest/api/content/' + pageId + '/child/attachment?limit=100');	
};

AC.getCurPageAttachments = function(success, error)
{
	AC.getPageAttachments(AC.state.pageId, success, error);
};

AC.searchDiagrams = function(searchStr, username, success, error)
{
	//Note: we manually filter trashed diagrams as we couldn't make cqlcontext={"contentStatuses":["current"]} work
	AP.request({
		//cannot use * as a first character https://jira.atlassian.com/browse/JRASERVER-6218 (also * doesn't work with some Asian language')
		url: '/rest/api/content/search?cql=' + encodeURIComponent('type="ac:com.mxgraph.confluence.plugins.diagramly:drawio-diagram" and (title ~ "' + searchStr + '*" or title ~ "' + searchStr + '")' +
				(username? ' and creator = currentUser()' : '')) + '&limit=50&expand=body.storage,version',  
		success: function(resp) 
		{
			resp = JSON.parse(resp);
			var retList = [];
			var gliffyList = [];
			var list = resp.results; 
			var customContentMap = {};
			if (list)
			{
				//Add items in the list and convert the list to map so we can search by name efficiently
				for (var i = 0; i < list.length; i++)
				{
					if (list[i].status == 'trashed') continue;
					
					try 
					{
						var attInfo = JSON.parse(decodeURIComponent(list[i]["body"]["storage"]["value"]));
						
						if (attInfo.custom) continue; //Exclude embedded diagrams
						
						customContentMap[attInfo.pageId + '|' + attInfo.diagramName] = true;
						
						retList.push({
							isExt: true,
							title: list[i].title,
							url: "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName),
							info: {
								id: list[i].id,
								contentId: list[i].id,
								custContentId: list[i].id,
								contentVer: list[i].version.number,
								pageId: attInfo.pageId,
								version: attInfo.version,
								name: attInfo.diagramName,
								displayName: list[i].title
							},
							changedBy: list[i].version.by.displayName,
							lastModifiedOn: list[i].version.when,
							imgUrl: baseUrl + "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName)
								+ ".png?api=v2"
						});
					}
					catch(e)
					{
						//ignore, this should not happen!
						console.log(e);
					}
				}
			}
			
			//No Gliffy results in Templates
			if (AC.inTemplate)
			{
				success(retList);
				return;
			}
			
			//This request search for Gliffy files as well as to support old draw.io diagrams that have no associated draw.io custom contents
			AP.request({
				//cannot use * as a first character https://jira.atlassian.com/browse/JRASERVER-6218
				url: '/rest/api/content/search?cql=' + encodeURIComponent('type=attachment and (title ~ "' + searchStr + '*" or title ~ "' + searchStr + '*.png")' + 
						(username? ' and creator = currentUser()' : '')) + '&limit=200&expand=metadata,version', //limit is 200 to get as much results as possible
				success: function(resp) 
				{
					resp = JSON.parse(resp);
					var list = resp.results; 
					if (list)
					{
						var attMap = {};
						//convert the list to map so we can search by name efficiently
						for (var i = 0; i < list.length; i++)
						{
							if (list[i].status == 'trashed') continue;
							
							//key is pageId + | + att name
							var pageId = list[i]["_links"]["webui"].match(/pages\/(\d+)/);
							
							if (pageId != null)
							{
								var key = pageId[1] + '|' + list[i].title;
								
								//exclude contents already found in the custom contents
								if (!customContentMap[key])
								{
									attMap[key] = {att: list[i], pageId: pageId[1]};
								}
							}
						}

						function getAttObj(att, isImport, noImg)
						{
							var obj = {
								isExt: true,
								title: att.att.title,
								url: "/download/attachments/" + att.pageId + "/"
									+ encodeURIComponent(att.att.title),
								info: {
									id: att.att.id, 
									pageId: att.pageId,
									name: att.att.title,
									isImport: isImport
								},
								changedBy: att.att.version.by.displayName,
								lastModifiedOn: att.att.version.when
							};
							
							if (noImg)
							{
								obj.noImg = true;
							}
							else
							{
								obj.imgUrl = baseUrl + '/download/attachments/' + att.pageId + '/'
											+ encodeURIComponent(att.att.title)
											+ '.png?api=v2';
							}
							
							return obj;
						};
						
						for (var key in attMap) 
						{
							var att = attMap[key];
							var mimeType = att.att.metadata.mediaType;
							
							if (mimeType == 'application/gliffy+json')
							{
								gliffyList.push(getAttObj(att, true));
							}
							else if (mimeType == 'text/plain' && attMap[key+'.png']) //each draw.io attachment should have an associated png preview and mimeType is text/plain
							{
								//We cannot get the latest version info, it can be searched when a diagram is selected
								retList.push(getAttObj(att));
							}
						}
					}

					success(retList, null, {"Gliffy": gliffyList});
				},
				error : error
			});
		},
		error : error
	});
};

AC.getRecentDiagrams = function(username, success, error)
{
	//I think it is safe now to base the recent documents on draw.io custom contents only since it is in production for long time now
	AP.request({
		url: '/rest/api/content/search?cql=type%3D%22ac%3Acom.mxgraph.confluence.plugins.diagramly%3Adrawio-diagram%22%20and%20lastmodified%20%3E%20startOfDay(%22-7d%22)' + 
					(username? '%20and%20creator%20=%20currentUser()' : '') + '&limit=50&expand=body.storage,version', // type="ac:com.mxgraph.confluence.plugins.diagramly:drawio-diagram" and lastmodified > startOfDay("-7d") [and creator = currentUser()] //modified in the last 7 days
		success: function(resp) 
		{
			resp = JSON.parse(resp);
			var retList = [];
			var list = resp.results; 
			if (list)
			{
				//Add items in the list
				for (var i = 0; i < list.length; i++)
				{
					if (list[i].status == 'trashed') continue;
					
					try 
					{
						var attInfo = JSON.parse(decodeURIComponent(list[i]["body"]["storage"]["value"]));
						
						if (attInfo.custom) continue; //Exclude embedded diagrams
						
						retList.push({
							isExt: true,
							title: list[i].title,
							url: "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName),
							info: {
								id: list[i].id,
								contentId: list[i].id,
								custContentId: list[i].id,
								contentVer: list[i].version.number,
								pageId: attInfo.pageId,
								version: attInfo.version,
								name: attInfo.diagramName,
								displayName: list[i].title
							},
							changedBy: list[i].version.by.displayName,
							lastModifiedOn: list[i].version.when,
							imgUrl: baseUrl + "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName)
								+ ".png?api=v2"
						});
					}
					catch(e)
					{
						//ignore, this should not happen!
						console.log(e);
					}
				}
			}
			
			success(retList);
		},
		error : error
	});
};

AC.getPageDrawioDiagrams = function(pageId, success, error)
{
	AP.request({
        type: 'GET',
        url: '/rest/api/content/' + pageId + '/child/ac:com.mxgraph.confluence.plugins.diagramly:drawio-diagram?limit=100&expand=body.storage,version',
        contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
        	resp = JSON.parse(resp);
			var retList = [];
			var list = resp.results; 
			
			if (list)
			{
				//Add items in the list
				for (var i = 0; i < list.length; i++)
				{
					if (list[i].status == 'trashed') continue;
					
					try 
					{
						var attInfo = JSON.parse(decodeURIComponent(list[i]["body"]["storage"]["value"]));
						
						if (attInfo.custom) continue; //Exclude embedded diagrams
						
						var diagramName = list[i].title.replace('.drawio', '');
						
						retList.push({
							isExt: true,
							title: diagramName,
							url: "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName),
							info: {
								id: list[i].id,
								contentId: list[i].id,
								custContentId: list[i].id,
								contentVer: list[i].version.number,
								pageId: attInfo.pageId,
								version: attInfo.version,
								name: attInfo.diagramName,
								displayName: diagramName
							},
							obj: list[i],
							imgUrl: baseUrl + "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName)
								+ ".png?api=v2"
						});
					}
					catch(e)
					{
						//ignore, this should not happen!
						console.log(e);
					}
				}
			}
			
			success(retList);
        },
        error: error
	});
};

AC.getCustomTemplates = function(success, error)
{
	var customCats = {};
	var customCatsCount = 0;
	var customCatsDone = 0;
	
	function checkDone()
	{
		customCatsDone++;
		
		if (customCatsCount == customCatsDone)
		{
			success(customCats, customCatsDone);
		}
	}
	
	AP.request({
        type: 'GET',
        url: '/rest/api/content/search?cql=type%3Dpage%20and%20space%3DDRAWIOCONFIG%20and%20title%3DTemplates', //type=page and space=DRAWIOCONFIG and title=Templates.
        contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
            resp = JSON.parse(resp);
			var tempPageId = null;      

			for (var i = 0; i < resp.size; i++)
			{
				if (resp.results[i].title == 'Templates')
				{
					tempPageId = resp.results[i].id;
					break;
				}				
			}
			
            if (tempPageId)
           	{
            	//load the configuration file
        		AP.request({
                    type: 'GET',
        			url: '/rest/api/content/search?limit=200&cql=type%3Dpage%20and%20space%3DDRAWIOCONFIG%20and%20ancestor%3D' + tempPageId, //type=page and space=DRAWIOCONFIG and ancestor={tempPageId}. Limit 200 which is most probably more than enough
                    contentType: 'application/json;charset=UTF-8',
                    success: function (resp) 
                    {
                    	resp = JSON.parse(resp);
                    	
                    	if (resp.size > 0)
                       	{
                    		for (var i = 0; i < resp.results.length; i++)
                    		{
                    			var cat = resp.results[i];
                    			customCats[cat.title] = [];
                    			customCatsCount++;
                    			
                    			(function(cat2){
                    				AC.getPageDrawioDiagrams(cat2.id, function(catList)
                        			{
                        				customCats[cat2.title] = catList;
                        				checkDone();
                        			}, checkDone); //On error, just ignore this page
                    			})(cat);
                    		}
                       	}
                    	else 
                       	{
                        	success({}, 0);
                       	}
        			},
        			error: error
        		});
           	}
            else 
           	{
            	success({}, 0);
           	}
		},
		error: error
	});	
};

AC.init = function(baseUrl, location, pageId, editor, diagramName, initialXml, draftName, draftXml, macroData, draftPage, loadLibs)
{
	// Hides the logo
	document.body.style.backgroundImage = 'none';
	var user = null;
	
	AP.user.getCurrentUser(function(atlUser) 
	{
		user = atlUser.atlassianAccountId;
	});
	
	var draftExists = false;

	var diagramDisplayName = diagramName, contentId = null, contentVer = null, lastMacroVer = null, revision = null;

	if (macroData != null)
	{
		diagramDisplayName = macroData.diagramDisplayName || diagramName;
		contentId = macroData.contentId || macroData.custContentId;
		contentVer = macroData.contentVer;
		lastMacroVer = macroData.revision;
		AC.aspect = macroData.aspect;
		AC.hiResPreview = macroData.hiResPreview != null? macroData.hiResPreview == '1' : AC.hiResPreview;
	}

	AC.state.pageId = pageId;
	AC.state.diagramName = diagramName;
	AC.state.revision = lastMacroVer; //TODO Confirm
	AC.state.contentId = contentId;
	AC.state.contentVer = contentVer;
	AC.state.draftName = draftName;
	
	//Check custom content is in sync
	if (AC.state.customContentMismatch == null && contentId != null)
	{
		AP.request({
            type: 'GET',
            url: '/rest/api/content/' + contentId + '/?expand=body.storage,version,container' + (contentVer? ('&version=' + contentVer) : ''),
            contentType: 'application/json;charset=UTF-8',
            success: function (resp) 
            {
                resp = JSON.parse(resp);
                var info = JSON.parse(decodeURIComponent(resp.body.storage.value));
                
                //Out of sync custom content. This happen when a page is moved/copied
            	if ((info.pageId != pageId || resp.container.id != pageId) 
    					|| diagramName != info.diagramName)
            	{
                	AC.state.customContentMismatch = true;
            	}
			},
			error: function(err)
			{
				//TODO Should we consider other errors?
				if (err.status == 404)
				{
					AC.state.customContentMismatch = true;
				}
			}
		});
	}
	
	//keeping the block of AP.require to minimize the number of changes!
	{
		var newPage = location.indexOf('createpage.action') > -1 ? true : false;
		var diagramXml = null;
		var link = document.createElement('a');
		link.href = location.href;
		link.href = link.href; //to have 'host' populated under IE
		var hostUrl = link.protocol + '//' + link.hostname;
		
	   	function removeDraft(fn, force)
	   	{
			if (draftExists || force)
			{
				AC.removeDraft(pageId, draftName, user, fn);
			}
			else if (fn != null)
			{
				fn();
			}
	   	};
		
	   	function saveDraft(xml, success, error)
	   	{
			if (draftName == null)
			{
				if (success)
				{
					success({}); //Without a name, just return successfully
				}
				return;
			}
			
	   		//console.trace('DRAFT: Save', draftName, xml);
			AC.saveDiagram(pageId, draftName,
				xml,
				function(res)
				{
					draftExists = true;
					success(res);
				}, error, false, 'application/vnd.jgraph.mxfile', 
				mxResources.get('createdByDraw'), false, draftPage, true);
	   	};
	   	
		AC.saveDraft = saveDraft;
		
		function showTemplateDialog()
		{
			if (AC.draftEnabled)
			{
				editor.contentWindow.postMessage(JSON.stringify({action: 'template', callback: true, enableRecent: true, enableSearch: true, enableCustomTemp: true, templatesOnly: AC.inTemplate, withoutType: 1}), '*');
			}
			else
			{
				editor.contentWindow.postMessage(JSON.stringify({action: 'template', enableRecent: true, enableSearch: true, enableCustomTemp: true, templatesOnly: AC.inTemplate, withoutType: 1}), '*');
			}
		};
		
		function promptName(name, err, errKey)
		{
			editor.contentWindow.postMessage(JSON.stringify({action: 'prompt',
				titleKey: 'filename', okKey: 'save', defaultValue: name || '' }), '*');
			
			if (err != null || errKey != null)
			{
				editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
					titleKey: 'error', message: err, messageKey: errKey,
					buttonKey: 'ok'}), '*');
			}
		};
		
		function checkName(name, fn, err)
		{
			if (name == null || name.length == 0)
			{
				err(name, mxResources.get('filenameShort'));
			}
			else if (/[&\*+=\\;/{}|\":<>\?~]/g.test(name))
			{
				err(name, mxResources.get('invalidChars') + ' \\ / | : { } < > & + ? = ; * " ~');
			}
			else
			{
				name = name.trim();
	    		//TODO do a search instead if possible
	    		AC.getPageAttachments(pageId, function(attachments) 
				{
	    			var draftPattern = new RegExp('^~drawio~.*~' + name.
							replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '.tmp$', 'i');
					var lc = name.toLowerCase();
					var dn = AC.draftPrefix + lc + AC.draftExtension
					var fileExists = false;

					// Checks if any files will be overwritten
					for (var i = 0; i < attachments.length && !fileExists; i++)
					{
						// To avoid name clash with new diagrams of other users,
						// we need to check for ~drawio~.*~filename.tmp
						var an = attachments[i].title.toLowerCase();

						if (an == lc || an == lc + '.png' || (AC.draftEnabled &&
							(an == dn || draftPattern.test(an))))
						{
							fileExists = true;
						}
					}
					
					if (fileExists)
					{
						err(name, mxResources.get('alreadyExst', [name]));
					}
					else
					{
						fn(name);
					}

				}, function(res)
				{
					try
					{
						res = JSON.parse(res.responseText);
					}
					catch(e){}
					
					err(name, res.message || mxResources.get('unknownError'));	
				});
			}
		};

	   	var autosaveThread = null;
	   	var autosaveCounter = 0;
	   	var currentXml = null;
	   	
	   	//Note: We don't use embed mode auto saving, instead, we save with the embed file (which sends the autosave message)
	   	//Always load draft files as it contains the latest unpublished version
		if (!AC.disableRT && draftXml != null)
		{
			editor.contentWindow.postMessage(JSON.stringify({action: 'load',
				autosave: 0, xml: draftXml, title: diagramDisplayName,
				macroData: macroData}), '*');
		}
		//Load actual diagram in case the draft is not found
		else if (initialXml != '')
		{
			editor.contentWindow.postMessage(JSON.stringify({action: 'load',
				autosave: AC.disableRT || AC.state.isNew? 1 : 0, xml: initialXml, title: diagramDisplayName,
				libs: loadLibs, macroData: macroData}), '*');
		}
		// New sketch diagrams open empty
		else if (AC.isSketch && !AC.inTemplate) //If in template editor, show templates also
		{
			editor.contentWindow.postMessage(JSON.stringify({action: 'load',
				autosave: 1, xml: '', toSketch: 1}), '*');
		}		
		// Shows template dialog for new diagrams with no draft state
		else
		{
			showTemplateDialog();
		}
		
		var messageListener = function(evt)
		{
			if (typeof window.AC !== 'undefined' && evt.origin == hostUrl)
			{
				var drawMsg;
				
				try
				{
					drawMsg = JSON.parse(evt.data);
				}
				catch (e)
				{
					AC.logError('BAD CONF CLOUD MSG: ' + evt.data, null, null, null, e, 'SEVER');
					drawMsg = {}; //Ignore this message
				}
	
				if (drawMsg.event == 'template')
				{
					AC.curDiagId = false; //New diagram, so no diagram id
					editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
						show: true, messageKey: 'inserting'}), '*');

					if (AC.inTemplate)
					{
						var templateUrl = (drawMsg.builtIn? drawMsg.tempUrl : drawMsg.docUrl) || drawMsg.tempUrl;
						
						if (templateUrl)
						{
							AP.confluence.saveMacro({
								baseUrl: baseUrl,
								templateUrl: templateUrl,
								tmpBuiltIn: drawMsg.builtIn? '1' : '0',
								tempLibs: drawMsg.libs
							});
						}
						
						AP.dialog.close();
					}
					else if (drawMsg.docUrl)
					{
						checkName(drawMsg.name, function(name)
						{
							diagramName = name;
							AC.state.diagramName = name;
							diagramDisplayName = name;
							
							//keeping the block of AP.require to minimize the number of changes!
							{
								var loadTemplate = function(version)
								{
									AP.request({
										url: drawMsg.docUrl + (version? "?version=" + version : ""),
										success: function(xml) 
										{
											editor.contentWindow.postMessage(JSON.stringify({action: 'load',
												autosave: AC.disableRT || AC.state.isNew? 1 : 0, xml: xml, title: diagramDisplayName, toSketch: AC.isSketch}), '*');
											editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
												show: false}), '*');
										},
										error : function(resp) 
										{
											editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
												show: false}), '*');
											editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
												titleKey: 'error', message: mxResources.get('diagCantLoad'), messageKey: null,
												buttonKey: 'ok'}), '*');
										}
									});
								}
								
								AP.request({
									url: '/rest/api/content/' + drawMsg.info.id,
									success: function(resp) 
									{
										resp = JSON.parse(resp);
										
										try
										{
											loadTemplate(resp.version.number);
										}
										catch(e)
										{
											loadTemplate();
										}
									},
									error : function(resp) 
									{
										loadTemplate();
									}
								});
							};
						},
						function(name, err, errKey)
						{
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
								show: false}), '*');
							editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
								titleKey: 'error', message: err, messageKey: errKey,
								buttonKey: 'ok'}), '*');
						});
					}
					else
					{
						checkName(drawMsg.name, function(name)
						{
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
								show: false}), '*');
							diagramName = name;
							AC.state.diagramName = name;
							diagramDisplayName = name;
	
							if (AC.draftEnabled)
							{
								draftName = '~drawio~' + user + '~' + diagramName + AC.draftExtension;
								editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
									show: true, messageKey: 'inserting'}), '*');
								
								saveDraft(drawMsg.xml, function()
								{
									editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
									editor.contentWindow.postMessage(JSON.stringify({action: 'load',
										autosave: AC.disableRT || AC.state.isNew? 1 : 0, xml: drawMsg.xml, title: diagramDisplayName, toSketch: AC.isSketch}), '*');
								},
								function(err)
								{
									editor.parentNode.removeChild(editor);

									AC.showNotification({
										  title: mxResources.get('draftWriteErr'),
										  body: err.status == 413? mxResources.get('confDraftTooBigErr') : 
													(err.status == 403? mxResources.get('confDraftPermissionErr') : 
														mxResources.get('draftCantCreate')),
										  type: 'error',
										  close: 'manual'
										});
				    		
									//TODO find how to listen to flag close event, currently just close the editor immediately
//				    				messages.onClose(message, function()
//				    				{
						    			AP.dialog.close();
//				    				});
								});
							}
							else
							{
								editor.contentWindow.postMessage(JSON.stringify({action: 'load',
									autosave: AC.disableRT || AC.state.isNew? 1 : 0, xml: drawMsg.xml, title: diagramDisplayName, toSketch: AC.isSketch}), '*');
							}
						},
						function(name, err, errKey)
						{
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
								show: false}), '*');
							editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
								titleKey: 'error', message: err, messageKey: errKey,
								buttonKey: 'ok'}), '*');
						});
					}
				}
				else if (drawMsg.event == 'autosave')
				{
					// Saves all changes to draft attachment
					currentXml = drawMsg.xml;
					
					if (autosaveThread == null && AC.draftEnabled)
					{
						autosaveThread = window.setTimeout(function()
						{
							autosaveThread = null
							saveDraft(currentXml, AC.noop, AC.noop);
							autosaveCounter++;
						}, (autosaveCounter == 0) ? 0 : AC.autosaveTimeout);
					}
				}
				else if (drawMsg.event == 'exit') 
				{
					removeDraft(function()
					{
			    		//revision is non-null if the diagram is saved
		    			AP.dialog.close(revision? {newRev: revision, newContentVer: contentVer, newContentId: contentId, newAspect: AC.aspect} : null);
					});
				}
				else if (drawMsg.event == 'save')
				{
					//Ignore all save events with no exist as they are handled by saving the draft file (similar to auto save)	
					if (!drawMsg.exit)
					{
						return;
					}
					
					diagramXml = drawMsg.xml;
					
					if (diagramName == null)
					{
						promptName('');
					}
					else
					{
						var aspectObj = AC.getAspectObj();
						
						//Copy & Paste causes multiple diagrams in a page to have the same attachment name. Rename doesn't help as it only changes the display name (not the attachment name)
						//So, prompt the use for a new attachment name
						AP.request({
							url: '/rest/api/content/' + pageId + '/?expand=body.storage,version&status=draft', //always request draft content which will match published content if no draft is found
					        contentType: 'application/json;charset=UTF-8',
					        success: function (resp) 
					        {
					        	var page = JSON.parse(resp);
					    		
								//find all macros and check if diagram name (attachment) is used more than once
					    		var foundMacros = page.body.storage.value.match(AC.findMacrosRegEx);
					    		matchingCount = 0;
					    		
					    		for (var i = 0; foundMacros != null && i < foundMacros.length; i++)
								{
					    			var macroDiagName = foundMacros[i].match(AC.findMacroParamRegEx["diagramName"]);
					    			
					    			if (macroDiagName != null && AC.decodeHtml(macroDiagName[1]) == diagramName)
									{
					    				matchingCount++;
									}
								}
								
					    		if (matchingCount > 1)
					    		{
					    			promptName(diagramName, mxResources.get('confDuplName'));
				    			}
					    		else
				    			{
									editor.contentWindow.postMessage(JSON.stringify({action: 'export',
										format: 'png', spinKey: 'saving', scale: AC.hiResPreview? 2 : 1, 
										pageId: aspectObj.pageId, layerIds: aspectObj.layerIds, message: drawMsg}), '*');

				    			}
							},
							error : function(resp) 
							{
								//We can safely ignore errors to avoid complicating loading diagram process
								editor.contentWindow.postMessage(JSON.stringify({action: 'export',
									format: 'png', spinKey: 'saving', scale: AC.hiResPreview? 2 : 1, 
									pageId: aspectPageId, layerIds: aspectLayerIds, message: drawMsg}), '*');
							}
						});
					}
				}
				else if (drawMsg.event == 'prompt')
				{
					editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
						show: true, messageKey: 'inserting'}), '*');

					checkName(drawMsg.value, function(name)
					{
						var aspectObj = AC.getAspectObj();
						
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
							show: false}), '*');
						diagramName = name;
						diagramDisplayName = name;
						contentId = null;
						contentVer = null;
						AC.state.contentId = contentId;
						AC.state.contentVer = contentVer;
						AC.state.diagramName = name;
						editor.contentWindow.postMessage(JSON.stringify({action: 'export',
							format: 'png', spinKey: 'saving', scale: AC.hiResPreview? 2 : 1,
							pageId: aspectObj.pageId, layerIds: aspectObj.layerIds}), '*');
					},
					function(name, err, errKey)
					{
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
							show: false}), '*');
						promptName(name, err, errKey);
					});
				}
				else if (drawMsg.event == 'rename')
				{
					//If diagram name is not set yet, use the new name for both file and diagram
					//TODO should we disable renaming if diagramName is null?
					if (diagramName == null) 
					{
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
							show: true}), '*');

						checkName(drawMsg.name, function(name)
						{
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
								show: false}), '*');
							diagramName = name;
							AC.state.diagramName = name;
							diagramDisplayName = name;
						},
						function(name, err, errKey)
						{
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
								show: false}), '*');
							editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
								titleKey: 'error', message: err, messageKey: errKey,
								buttonKey: 'ok'}), '*');
						});	
					}
					else
					{
						diagramDisplayName = drawMsg.name;
					}
				}
				else if (drawMsg.event == 'export')
				{
					// Proceeds from sending the export message by saving the exported files
					var imageData = drawMsg.data.substring(drawMsg.data.indexOf(',') + 1);
					var diaWidth = drawMsg.bounds.width / drawMsg.scale;
					var diaHeight = drawMsg.bounds.height / drawMsg.scale;
					diagramDisplayName = (drawMsg.macroData != null && drawMsg.macroData.diagramDisplayName) ? drawMsg.macroData.diagramDisplayName : diagramDisplayName;

					function saveError(err) 
					{
						var key = null;
						var message = null;
						
						if (err.status == 409) 
						{
							diagramName = null;
							key = 'fileExists';
						}
						else if (err.status == 401)
						{
							// Session expired
							message = mxResources.get('confSessionExpired') +
								' <a href="' + baseUrl + '/pages/dashboard.action" target="_blank">' + mxResources.get('login') + '</a>';
						}
						else if (err.status == 400)
						{
							try
							{
								var errObj = JSON.parse(err.responseText);
								
								if (errObj.message.indexOf('Content body cannot be converted to new editor') > 0)
								{
									message = 'A Confluence Bug (CONFCLOUD-69902) prevented saving the page. Please edit the diagram from "Confluence Page Editor" where you can restore you changes from "File -> Revision history".';
								}	
							}
							catch(e){} //Ignore
						}
						else if (err.status == 403)
				        {
				        	key = 'errorSavingFileForbidden';
				        }
						else
						{
							message = err.status;
						}
						
						var msg = {action: 'dialog', titleKey: 'error', modified: true, buttonKey: 'close'};
						
						if (message != null)
						{
							msg.message = message;
						}
						else
						{
							msg.messageKey = key || 'errorSavingFile';
						}
						
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
						editor.contentWindow.postMessage(JSON.stringify(msg), '*');
					};
					
					function successXml(responseText) 
					{
						var resp = null;
						revision = '1';
						
						//TODO Why this code (Is it expected to have incorrect responseText?)
						try
						{
							resp = JSON.parse(responseText);
						}
						catch (e)
						{
							// Ignores and use default value for revision
						}

						// LATER: Get revision from metadata of attachment and check
						// what condition makes the response not contain an URL
						//TODO Is prev comment still needed with REST API?
						if (resp != null && resp.results != null && resp.results[0])
						{
							var attObj = resp.results[0];
							revision = attObj.version.number;
							AC.curDiagId = attObj.id;
							//Save/update the custom content
							var spaceKey = AC.getSpaceKey(attObj._expandable.space);
							var pageType = attObj.container.type;

							AC.saveCustomContent(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, 
									(AC.state.customContentMismatch? null : contentId), contentVer,
									function(responseText) 
									{
										var content = JSON.parse(responseText);
										
										contentId = content.id;
										contentVer = content.version? content.version.number : 1;
										AC.state.contentId = contentId;
										AC.state.contentVer = contentVer;

										AC.saveDiagram(pageId, diagramName + '.png', AC.b64toBlob(imageData, 'image/png'),
												successPng, saveError, false, 'image/png', mxResources.get('drawPrev'), false, draftPage);
									}, saveError, drawMsg.comments);
						}
						else
						{
							// Logs special case where save response has no URL
							try
							{
								var img = new Image();
								var message = 'Invalid Confluence Cloud response';
						    		img.src = '/images/2x2.png?msg=' + encodeURIComponent(message) +
					    				((responseText != null) ? '&resp=' + encodeURIComponent(responseText) : '&resp=[null]');
						    			'&url=' + encodeURIComponent(window.location.href);
							}
							catch (err)
							{
								// do nothing
							}
							
							//TODO Save png here in case responseText is incorrect (But why it can be incorrect?)
							AC.saveDiagram(pageId, diagramName + '.png', AC.b64toBlob(imageData, 'image/png'),
									successPng, saveError, false, 'image/png', mxResources.get('drawPrev'), false, draftPage);
						}

						function successPng(pngResponseText) 
						{
							try
							{
								// IMPORTANT: New macro parameters must be added to AC.macroParams to for adjustMacroParametersDirect to parse existing parameters correctly.
								var newMacroData = {
									diagramName: diagramName,
									diagramDisplayName: diagramDisplayName,
									revision: revision,
									pageId: newPage ? null : pageId,
									custContentId: contentId,
									contentVer: contentVer,
									baseUrl: baseUrl,
									width: diaWidth,
									height: diaHeight,
									tbstyle: (drawMsg.macroData != null && drawMsg.macroData.tbstyle) ? drawMsg.macroData.tbstyle : '',
									links: (drawMsg.macroData != null && drawMsg.macroData.links) ? drawMsg.macroData.links : '',
									simple: (drawMsg.macroData != null && drawMsg.macroData.simple != null) ? drawMsg.macroData.simple : '0',
									lbox: (drawMsg.macroData != null && drawMsg.macroData.lbox != null) ? drawMsg.macroData.lbox : '1',
									zoom: (drawMsg.macroData != null && drawMsg.macroData.zoom != null) ? drawMsg.macroData.zoom : '1',
									pCenter: (drawMsg.macroData != null && drawMsg.macroData.pCenter != null) ? drawMsg.macroData.pCenter : '0',
									inComment: AC.inComment? '1' : '0'
								};

								if (AC.aspect != null && AC.aspect !== 'undefined' && AC.aspect.length > 0)
								{
									newMacroData.aspect = AC.aspect;
								}
								
								//Set the hiResPreview only if the user set it in the UI which overrides the global settings
								if (drawMsg.macroData != null && drawMsg.macroData.hiResPreview != null)
								{
									newMacroData.hiResPreview = drawMsg.macroData.hiResPreview;									
								}
									
								var finalizeSaving = function()
								{
									//We need to save macro in order for the live viewer in editor gets updated
									if (!AC.customContentEditMode)
									{
										AP.confluence.saveMacro(newMacroData);	
									}
									
									if (AC.autoExit || drawMsg.message == null || drawMsg.message.message == null || drawMsg.message.message.exit)
									{
										var savingCallback = function()
										{
											removeDraft(function()
											{
								    			AP.dialog.close({newRev: revision, newContentVer: contentVer, newContentId: contentId, newAspect: AC.aspect, newMacroData: newMacroData});
											});
										};
										
										//Save indexing text
										//Exit is done when the response is received!
										//This is needed for advanced search by draw.io diagrams type
										AC.remoteInvoke('getDiagramTextContent', null, null, function(textContent)
										{
											AC.saveContentSearchBody(contentId, diagramDisplayName + ' ' + textContent,
													savingCallback, savingCallback);	//ignore error and just exit
										}, savingCallback);
									}
									else
									{
										editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
										editor.contentWindow.postMessage(JSON.stringify({action: 'status', message: '', modified: false}), '*');
									}
								};

								
								
								if (AC.state.isNew) //New diagrams are saved with saveMacro since there is no macro in the page yet
								{
									AC.setFileDescriptor(drawMsg.desc, finalizeSaving, saveError);
								}
								else
								{
									AC.saveMacroToProp(AC.state.pageId, AC.state.diagramName, newMacroData, finalizeSaving, saveError);
								}
							}
							catch (e)
							{
								editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
								editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
									titleKey: 'errorSavingFile', message: e.message, buttonKey: 'ok'}), '*');
								
								console.log(e);
								AC.logError(e.message, null, null, null, e);
							}
						};
					};

					if (diagramName != null) 
					{
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
							show: true, messageKey: 'saving'}), '*');
						
						AC.saveDiagram(pageId, diagramName, diagramXml,
							successXml, saveError, false, 'application/vnd.jgraph.mxfile', mxResources.get('drawDiag'), false, draftPage);
					}
				}
				else if (drawMsg.event == 'remoteInvoke')
				{
					AC.handleRemoteInvoke(drawMsg);
				}
				else if (drawMsg.event == 'remoteInvokeResponse')
				{
					AC.handleRemoteInvokeResponse(drawMsg);
				}
			}
		};

		window.addEventListener('message', messageListener);
		editor.contentWindow.postMessage(JSON.stringify({action: 'remoteInvokeReady'}), '*');
		AC.remoteWin = editor.contentWindow;
	};
	
	AC.checkOtherLicense(AC.getUrlParam('xdm_e'));
};

AC.saveMacroToProp = function (pageId, diagramName, macroData, onSuccess, onError)
{
	function saveMacroProp(content, ver)
	{
		AC.setContentProperty(pageId, AC.MACRO_EDITS_PROP, 
				encodeURIComponent(JSON.stringify(content)), ver, onSuccess, function(err)
				{
					if (err.status == 409) //On conflict, try again to catch concurrent changes
					{
						AC.saveMacroToProp(pageId, diagramName, macroData, onSuccess, onError);
					}
					else
					{
						onError();
					}
				});
	};
	
	var propContent = {};
	
	AC.getContentProperty(pageId, AC.MACRO_EDITS_PROP, function(resp)
    {
		resp = JSON.parse(resp);
		var propVer = resp.version.number;

		try
		{
			propContent = JSON.parse(decodeURIComponent(resp.value));
		}
		catch(e) //Ignore errors, incorrect format, so just create a new one
		{
			console.log(e);
			AC.logError(e.message, null, null, null, e);
		}
		
		if (macroData.revision && propContent[diagramName] && macroData.revision < propContent[diagramName].revision)
		{
			onError({msg: 'version downgraded', downgrade: true});
			return;
		}
		
		propContent[diagramName] = macroData;
		saveMacroProp(propContent, propVer);
    }, function(err)
	{
		//Property not found, add it. Any other error -> save failed
		if (err.status == 404)
		{
			propContent[diagramName] = macroData;
			saveMacroProp(propContent);
		}
		else
		{
			onError();
		}
	});
};

AC.loadDiagram = function (pageId, diagramName, revision, success, error, owningPageId, tryRev1, dontCheckVer) 
{
	//Remove spaces in the diagram name
	diagramName = diagramName.trim();
	var curDiagName = diagramName;
	var curPageId = pageId;
	// TODO: Get binary
	
	//keeping the block of AP.require to minimize the number of changes!
	{
		var localSuccess = function(resp)
		{
			success(resp, curPageId, curDiagName);
		}
		
		AP.request({
			//TODO find out the ID of the page that actually holds the attachments because historical revisions do not have attachments
			url: '/download/attachments/' + pageId + '/' + encodeURIComponent(diagramName) +
				(revision? '?version=' + revision : ''),
			success: localSuccess,
			error : function(resp) 
			{
				//When a page is copied, attachments are reset to version 1 while the revision parameter remains the same
				if (tryRev1 && ((revision > 1 && resp.status == 404) || (revision >= 1 && resp.status == 403)))
				{
					AP.request({
						url: '/download/attachments/' + pageId + '/' + encodeURIComponent(diagramName),
						success: localSuccess,
						error : function(resp) { //If revesion 1 failed, then try the owningPageId
							if (owningPageId && resp.status == 404)
							{
								curPageId = owningPageId;
								AP.request({
									url: '/download/attachments/' + owningPageId + '/' + encodeURIComponent(diagramName)
										+'?version=' + revision, //this version should exists in the original owning page
									success: localSuccess,
									error : error
								});
							}
							else
							{
								error(resp);
							}
						}
					});
				}
				else if (owningPageId && (resp.status == 404 || resp.status == 403)) //We are at revesion 1, so try the owningPageId directly
				{
					curPageId = owningPageId;
					AP.request({
						url: '/download/attachments/' + owningPageId + '/' + encodeURIComponent(diagramName),
						success: localSuccess,
						error : error
					});
				}
				else
				{
					error(resp);
				}
			}
		});
	};
};

AC.decodeHtml = function(html)
{
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

AC.findMacroInPageObj = function(page, diagramName, lastMacroVer, success, getAll, embedMacro, contentId, sketchMacro)
{
	var originalBody = page.body.storage.value;
    		
	var foundMacros = originalBody.match(sketchMacro? AC.findSketchMacrosRegEx : (embedMacro? AC.findEmbedMacrosRegEx : AC.findMacrosRegEx));

	var macroFound = false;
	var matchingMacros = [];
	
	for (var i = 0; foundMacros != null && i < foundMacros.length; i++)
	{
		if (!getAll)
		{
			var macroDiagName = foundMacros[i].match(AC.findMacroParamRegEx["diagramName"]);
			var macroRevision = foundMacros[i].match(AC.findMacroParamRegEx["revision"]);
			var macroContentId = foundMacros[i].match(AC.findMacroParamRegEx["custContentId"]);
		}

		if (getAll || 
			  (embedMacro && macroContentId != null && macroContentId[1] == contentId) ||
			  (macroDiagName != null && macroRevision != null && AC.decodeHtml(macroDiagName[1]) == diagramName && (macroRevision[1] == lastMacroVer || lastMacroVer == false)))
		{
			var macroParams = {};
			
			for (var j = 0; j < AC.macroParams.length; j++)
			{
				var param = AC.macroParams[j];
				var val = foundMacros[i].match(AC.findMacroParamRegEx[param]);
				
				if (val != null)
					macroParams[param] = AC.decodeHtml(val[1]);
			}
			
			matchingMacros.push({macro: foundMacros[i], macroParams: macroParams});
			macroFound = true;
		}
	}
	
	success(macroFound, originalBody, matchingMacros, page);
};

AC.findMacroInPage = function(pageId, diagramName, lastMacroVer, success, error, draftPage, getAll, embedMacro, contentId, sketchMacro)
{
	//load the page to edit the macro
	AP.request({
        type: 'GET',
        url: '/rest/api/content/' + pageId + '/?expand=body.storage,version' + (draftPage ? "&status=draft" : ""),
        contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
        	var page = JSON.parse(resp);
    		AC.findMacroInPageObj(page, diagramName, lastMacroVer, success, getAll, embedMacro, contentId, sketchMacro);
        },
        error: error
    });
};

//From https://www.edutechional.com/2018/09/28/how-to-check-if-two-javascript-objects-have-the-same-values/
AC.isEqual = function (obj1, obj2)
{
  var obj1Keys = Object.keys(obj1);
  var obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) 
  {
    return false;
  }

  for (var i = 0; i < obj1Keys.length; i++) 
  {
	var objKey = obj1Keys[i];
	
    if (obj1[objKey] != obj2[objKey]) //Weak compare since sometimes the macro params are number or string 
    {
      return false;
    }
  }

  return true;
};

//FIXME Confluence adjust macros in draft such that there is no way to adjust the content of drafts currently! So, drafts code is removed
AC.adjustMacroParametersDirect = function(pageId, macrosData, originalBody, matchingMacros, page, success, error, macroId)
{
	var changed = false, partialError = false, modDiagName = null;
	
	for (var i = 0; i < matchingMacros.length; i++)
	{
		//If macro id is provided and doesn't match, skip this one
		if (macroId != null && macroId != matchingMacros[i].macroParams.macroId) continue;
		
		var macroData = macrosData[AC.decodeHtml(matchingMacros[i].macroParams['diagramName'])];
		delete matchingMacros[i].macroParams.macroId;
		
		if (macroData != null && !AC.isEqual(macroData, matchingMacros[i].macroParams))
		{
			//Prevent macro version downgrading
			if (macroData.revision && macroData.revision < matchingMacros[i].macroParams.revision)
			{
				if (partialError)
				{
					partialError.count++;
				}
				else
				{
					partialError = {msg: 'version downgraded', downgrade: true, count: 1};
				}
				
				continue;
			}
			
			AC.log('Macro is updated ' + matchingMacros[i].macroParams['diagramName']);
			modDiagName = AC.decodeHtml(matchingMacros[i].macroParams['diagramDisplayName']);
			var modMacro = matchingMacros[i].macro;

			for (var param in macroData) 
			{
				var pRegEx = AC.findMacroParamRegEx[param];
				
				//This to avoid errors if a new parameter/key is added to the macro and is not in the macro regexps
				if (pRegEx == null) continue;
				
				var newParamVal = '<ac:parameter ac:name="'+ param +'">' + macroData[param];
				
				//If parameter exists, change it. Otherwise, add it
				if (modMacro.match(pRegEx))
				{
					modMacro = modMacro.replace(pRegEx, newParamVal);
				}
				else
				{
					modMacro += newParamVal + "</ac:parameter>";
				}
			}
			
			originalBody = originalBody.replace(matchingMacros[i].macro, modMacro);
			changed = true;
		}
	}
	
	if (changed)
	{
		AC.alert('before updating the page');
		AC.log('Page is updating in adjust page');
		page.body.storage.value = originalBody;
	    page.version.number++;
		page.version.message = modDiagName? mxResources.get('diagramEdited', ['draw.io', modDiagName]) : '';
	
		AP.request({
           type: 'PUT',
           data: JSON.stringify(page),
           url:  "/rest/api/content/" + pageId,
           contentType: "application/json",
           success: function(resp)
		   {
				if (partialError)
				{
					error(partialError);
				}
				else
				{
					success(resp);
				}
		   },
           error: error
       });
	}
	else if (partialError)
	{
		error(partialError);
	}
	else
	{
		AC.log('No Changes found for asjusting page');
		success(false);
	}
};

AC.updatePageEmbedMacros = function(pageId, updatedMacros, success, error, macroId)
{
	AC.findMacroInPage(pageId, null, null, function(macroFound, originalBody, matchingMacros, page)
	{
    	if (macroFound)
		{
			AC.adjustMacroParametersDirect(pageId, updatedMacros,
					originalBody, matchingMacros, page, success, error, macroId);
		}
		else
		{
			error();
		}
	}, error, false, true, true);
};

AC.refreshUrlWithNewParams = function(newSettings, addedParams)
{
	addedParams = addedParams || {};
	var paramsMapping = {
		displayName: 'diagramDisplayName',
		hiRes: 'hiResPreview'
	};
	
	//Build the new url with new macro settings
	var params = location.search.substr(1).split('&');
	var newParams = [];
	
	for (var k = 0; k < params.length; k++)
	{
		var parts = params[k].split('=');
		var key = paramsMapping[parts[0]]? paramsMapping[parts[0]] : parts[0];
		
		if (newSettings[key] != null)
		{
			newParams.push(parts[0] + '=' + encodeURIComponent(newSettings[key]));
		}
		else
		{
			newParams.push(params[k]);
		}
	}
	
	for (var p in addedParams)
	{
		newParams.push(p + '=' + encodeURIComponent(addedParams[p]));
	}
	
	location.href = location.origin + location.pathname + '?' + newParams.join('&');	
};

AC.updatePageMacros = function(pageId, pendingUpdates, pendingUpdatesVer, myLock, callback)
{
	callback = callback != null? callback : AC.noop;
	
	function retry()
	{
		AC.alert('Pause before retrying');
		AC.log('Retrying updating page');
		AC.getContentProperty(pageId, AC.MACRO_EDITS_PROP, function(resp)
	    {
			try
			{
				resp = JSON.parse(resp);
				AC.updatePageMacros(pageId, JSON.parse(decodeURIComponent(resp.value)), resp.version.number, myLock, callback);
			}
			catch(e) //Ignore errors, incorrect format, so just create a new one
			{
				console.log(e);
				AC.logError(e.message, null, null, null, e);
				callback();
			}
		}, callback);
	};
	
	//We reset the property if no macros found in the page or some matched and fixed (TODO Is that correct or we should verify no change is needed)
	function resetProp(pendingUpdatesVer)
	{
		AC.log('Resetting property');
		//Clean property and remove lock
		AC.setContentProperty(pageId, AC.MACRO_EDITS_PROP, encodeURIComponent(JSON.stringify({})), 
				pendingUpdatesVer, callback, callback);
	};
	
	//Go over all macros in the page, if pending updates have changes, add it
	//We use 409 error to confirm no other concurrent write occurred 
	//Property is locked (with timeout such that lock is released after a certain time [5 min])
	var lockTS = pendingUpdates[AC.LOCK_TS_NAME];
	AC.alert('Pause before lock check');
	if (lockTS && (myLock != lockTS && Date.now() - lockTS < 300000))
	{
		AC.log('Prop is Locked, aborting update');
		callback();
		return;
	}
	
	//Acquire the lock
	myLock = Date.now();
	pendingUpdates[AC.LOCK_TS_NAME] = myLock;
	
	AC.setContentProperty(pageId, AC.MACRO_EDITS_PROP, 
		encodeURIComponent(JSON.stringify(pendingUpdates)), pendingUpdatesVer, function()
		{
			AC.alert('Pause after lock & before changing page');
			pendingUpdatesVer++;
			AC.log('Prop locked successfully');
			
			AC.findMacroInPage(pageId, null, null, function(sketchMacroFound, originalBody, matchingSkwtchMacros, page)
    		{
				AC.findMacroInPageObj(page, null, null, function(macroFound, originalBody, matchingMacros, page)
	    		{
					matchingMacros = matchingMacros.concat(matchingSkwtchMacros);
					
	            	if (macroFound || sketchMacroFound)
	        		{
						AC.log('Found macros - ' + matchingMacros.length);
						AC.adjustMacroParametersDirect(pageId, pendingUpdates,
								originalBody, matchingMacros, page, function()
						{
							resetProp(pendingUpdatesVer);
						}, function(err) //On error, it means the page is a newly created draft that is not published
			    		{
							AC.log('Updating page error ' + err.status);
			    			if (err.status == 409) //On conflict, try again to catch concurrent changes
							{
								retry();
							}
							else if (err.downgrade)
							{
								//If a downgrade happen, remove the property
								//TODO should we report this error?
								resetProp(pendingUpdatesVer);
							}
			    		});
	        		}
					else
					{
						resetProp(pendingUpdatesVer);
					}
	    		}, true);
    		}, callback, false, true, null, null, true);
		}, 
		function(err)
		{
			AC.log('Updating prop error (cannot lock) ' + err.status);
			if (err.status == 409) //On conflict, try again to catch concurrent changes
			{
				retry();
			}
			else
			{
				callback();
			}
		});
};

AC.saveCustomContent = function(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, contentId, contentVer, success, error, comments, reportAllErr, extraInfo)
{
	//Make sure comments are not lost
	if (comments == null)
	{
		AC.getOldComments(contentId, function(comments)
		{
			AC.saveCustomContent(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, contentId, contentVer, success, error, comments, reportAllErr, extraInfo);
		}, 
		//On error, whether the custom content is deleted or corrupted. It is better to proceed with saving and losing the comments than losing the diagram
		function()
		{
			AC.saveCustomContent(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, contentId, contentVer, success, error, [], reportAllErr, extraInfo);
		});
		
		return;
	}
	
	var info = {
	    "pageId": pageId,
	    "diagramName": diagramName,
	    "version": AC.isUploadMode? null : revision,
	    "inComment": AC.inComment,
	    "comments": comments || [],
		"isSketch": AC.isSketch? 1 : 0 
	};

	if (extraInfo)
	{
		for (var key in extraInfo)
		{
			info[key] = extraInfo[key];
		}
		
		info.custom = true;
	}
	
    var customObj = {
        "type": "ac:com.mxgraph.confluence.plugins.diagramly:drawio-diagram",
        "space": {
           "key": spaceKey
         },
         "container": {
               "type": pageType,
               "id": pageId
            },
         "title": diagramDisplayName,
         "body": {
           "storage": {
             "value": encodeURIComponent(JSON.stringify(info)),
             "representation": "storage"
           }
         },
         "status": "current"
    };
    
    if (contentId)
    {
        customObj.version = {
            "number": ++contentVer
        };
    }
    
	//keeping the block of AP.require to minimize the number of changes!
    {
       AP.request({
           type: contentId? 'PUT' : 'POST',
           data: JSON.stringify(customObj),
           url:  "/rest/api/content/" + (contentId? contentId : ""),
           contentType: "application/json",
           success: success,
           error: function(resp) 
           {
        	   if (reportAllErr)
    		   {
        		   error(resp);
        		   return;
    		   }
        	   
               //User can delete a custom content externally and we will get error 403 and message will contain the given id
               //Then save a new one
               var err = JSON.parse(resp.responseText);
               
               //Sometimes the macro is not updated such that the version is not correct. The same happens when a page version is restored
               if (err.statusCode == 409 && err.message.indexOf("Current version is:") > 0)
        	   {
            	   //We will use the error message to detect the correct version instead of doing another request. 
            	   //It should be safe as long as error messages are not translated or changed
            	   var curContentVer = err.message.match(/\d+/);
            	   
            	   if (curContentVer != null)
        		   {
            		   AC.saveCustomContent(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, contentId, curContentVer[0], success, error, comments, false, extraInfo);
        		   }
        	   }
               //Sometimes, when a page is copied or site is cloned, custom contents are lost, so create a new one
               //For example, error 400: When a page is moved to another space, an error occur since the original  custom content belong to another space/page
               else if (contentId != null)
               {
                   AC.saveCustomContent(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, null, null, success, error, comments, false, extraInfo);
               }
               else
               {
                   error(resp);
               }
           }
       });
    };
};

AC.saveContentSearchBody = function(contentId, searchBody, success, error)
{
	var doSaveSearchBody = function(version)
	{
		AC.setContentProperty(contentId, 'ac:custom-content:search-body', searchBody, version, success, error);
	};
	
	
	AC.getContentProperty(contentId, 'ac:custom-content:search-body', function(resp)
    {
		resp = JSON.parse(resp);
      
		if (searchBody == resp.value) //Nothing changed, so just return
		{
			success();
		}
		else
		{
			doSaveSearchBody(resp.version.number);
		}
    },
    function(resp)
    {
    	var err = JSON.parse(resp.responseText);
	  
    	//if not found, create one
		if (err.statusCode == 404)
		{
			doSaveSearchBody();
		}
		else
			error();
    });
};

//TODO We can upload both the diagram and its png in one call if needed?
AC.saveDiagram = function(pageId, diagramName, xml, success, error, newSave, mime, comment, sendNotif, draftPage, delOldDraft) 
{
	function loadSucess(resp) 
	{
		error({status: 409, message: mxResources.get('fileExists')});
	};
	
	function loadError(resp)
	{
		if (resp.status == 404) // file under given name does not exist means we can proceed with saving 
		{
			doSave();
		}
		else 
		{
			error({status: resp.status, message : resp.statusText });
		}
	};
	
	var sessionCheck = function(responseText)
	{
		if (responseText != null)
		{
			var obj = JSON.parse(responseText);
			
			if (obj != null) 
			{
				if (obj.code == -32600) //TODO is the codes the same with new REST APIs)
				{
					error({status: 401});
					
					return;	
				}
				
				if (delOldDraft && obj.results && obj.results[0])
				{
					obj = obj.results[0];
					var curVer = obj.version.number;
					
					if (curVer > AC.draftsToKeep)
					{
						AP.request({
							type: 'DELETE',
							url:  '/rest/api/content/' + obj.id + '/version/' + (curVer - AC.draftsToKeep)
						 });
					}
				}
			}
		}
		
		success(responseText);
	}
	
	doSave = function() 
	{
		//keeping the block of AP.require to minimize the number of changes!
		{
			 var attFile = (xml instanceof Blob)? xml : new Blob([xml], {type: mime});
			 attFile.name = diagramName;
			 
			 var reqData = {file: attFile, minorEdit: !sendNotif};
			 var draft = draftPage ? "?status=draft" : "";

			 if (comment != null)
			 {
				 reqData.comment = comment;
			 }
			 
			 AP.request({
				type: 'PUT',
				data: reqData,
				url:  "/rest/api/content/"+ pageId +"/child/attachment" + draft,
				contentType: "multipart/form-data",
				success: sessionCheck,
				error: error
			 });
		};
	};
	
	if(newSave && mime == 'application/vnd.jgraph.mxfile')
	{
		this.loadDiagram(pageId, diagramName, 0, loadSucess, loadError);
	}
	else 
	{
		doSave();
	}
};

AC.removeDraft = function(pageId, filename, user, callback)
{
	if (pageId != null && filename != null)
	{
		//If new draft, delete it physically
		if (filename.indexOf('~drawio~' + user + '~') == 0)
		{
			AC.getAttachmentInfo(pageId, filename, function(info)
			{
				AP.request({
			        url : '/rest/api/content/' + info.id,
			        type : 'DELETE',
			        success : callback,
			        error : callback
			    });
			}, 
			callback);
		}
		else //Currently, we don't remove draft as it is used in collab. We can use this for detecting user exited 
		{
			if (callback) 
			{
				callback();
			}
		}
	}
	else if (callback != null)
	{
		callback();
	}
};

AC.getMacroData = function(fn) 
{
	AP.confluence.getMacroData(fn);
}

//From mxUtils
AC.htmlEntities = function(s, newline)
{
	s = String(s || '');
	
	s = s.replace(/&/g,'&amp;'); // 38 26
	s = s.replace(/"/g,'&quot;'); // 34 22
	s = s.replace(/\'/g,'&#39;'); // 39 27
	s = s.replace(/</g,'&lt;'); // 60 3C
	s = s.replace(/>/g,'&gt;'); // 62 3E

	if (newline == null || newline)
	{
		s = s.replace(/\n/g, '&#xa;');
	}
	
	return s;
};

AC.fromHtmlEntities = function(str)
{
    var doc = new DOMParser().parseFromString(str || '', "text/html");
    return doc.documentElement.textContent;
};

AC.getCustomLibraries = function(callback, error)
{
    var ret = [];

    function getChunk(url)
    {
    	AP.request({
            type: 'GET',
			url: url,
            contentType: 'application/json;charset=UTF-8',
            success: function (resp) 
            {
            	resp = JSON.parse(resp);
            	
               	for (var i = 0; i < resp.results.length; i++)
           		{
               		var obj = resp.results[i];
               		ret.push({
               			id: obj.id, 
               			title: obj.title, 
               			downloadUrl: obj._links? obj._links.download : null
               		});
           		}
               	
               	//Support pageing
				if (resp._links && resp._links.next) 
				{
					getChunk(resp._links.next.replace(/\&\_r\=\d+/g, '')); //Remove repeated _r paramter from the URL
				}
				else
				{
					callback(ret);
				}
			},
			error: error
		});
    };
    
	AP.request({
        type: 'GET',
        url: '/rest/api/content/search?cql=type%3Dpage%20and%20space%3DDRAWIOCONFIG%20and%20title%3DLibraries', //type=page and space=DRAWIOCONFIG and title=Libraries. Search doesn't return 404 if not found
        contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
            resp = JSON.parse(resp);
			var libsPageId = null;      

			for (var i = 0; i < resp.size; i++)
			{
				if (resp.results[i].title == 'Libraries')
				{
					libsPageId = resp.results[i].id;
					break;
				}				
			}
			
            if (libsPageId)
           	{
            	getChunk('/rest/api/content/' + libsPageId + '/child/attachment?limit=100');
           	}
            else
            {
            	callback(ret);            	
            }
		},
		error: error
	});	
};

AC.getFileContent = function(url, callback, error)
{
	AP.request({
        type: 'GET',
		url: url,
        contentType: 'text/xml;charset=UTF-8',
        success: function (fileContent) 
        {
        	callback(fileContent); 
		},
		error: error
	});
};

AC.getCurrentUser = function(callback, error)
{
	var baseUrl = AC.getBaseUrl();
	
	AP.request({
        type: 'GET',
		url: '/rest/api/user/current',
		contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
        	resp = JSON.parse(resp);
        	
        	callback({
        		id: resp.accountId,
        		username: resp.username,
        		email: resp.email,
        		displayName: resp.displayName,
        		pictureUrl: resp.profilePicture? baseUrl.substr(0, baseUrl.lastIndexOf('/')) + resp.profilePicture.path : null
        	}); 
		},
		error: error
	});
};

AC.RESOLVED_MARKER = '$$RES$$ ';
AC.REPLY_MARKER = '$$REP$$';
AC.REPLY_MARKER_END = '$$ ';
AC.DELETED_MARKER = '$$DELETED$$';
AC.COMMENTS_INDEX_PROP = 'commentsAttVerIndex';

//TODO This is not needed now as we wait until we get the attachment id. REMOVE
//TODO Use of globals is risky and error-prone. Find another way to get attachment id and version? 
AC.commentsFnWrapper = function(fn, noErrCheck)
{
	//Wait for attId and ver to be ready
	function wrappedFn()
	{
		if (AC.curDiagId == false && !noErrCheck)
		{
			//Call error (last argument)
			arguments[arguments.length - 1]();
		}
		else if (AC.curDiagId != null)
		{
			fn.apply(this, arguments);
		}
		else
		{
			var fnArgs = arguments;
			//Wait
			setTimeout(function()
			{
				wrappedFn.apply(this, fnArgs);
			}, 300);
		}
	}
	
	return wrappedFn;
};

AC.getComments = AC.commentsFnWrapper(function(attVer, checkUnresolvedOnly, success, error)
{
	function isResolvedComment(atlasComment)
	{
		if (atlasComment.children != null)
		{
			var lastReply = atlasComment.children.comment.results.pop();
			
			if (lastReply != null && decodeURIComponent(lastReply.body.storage.value).indexOf(AC.RESOLVED_MARKER) == 0)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	};
	
	var attId = AC.curDiagId;
	attVer = attVer || AC.curDiagVer;
	
	var confComments = [], remaining;
	
	if (attId)
	{
		AC.getCommentsAttVersIndex(attId, function()
		{
			remaining = AC.curCommentIndex.length;
			doNextChunk();
			indexIntegrityCheck();
		}, function()
		{
			//No index found, means no comments hence no unresolved comments
			if (checkUnresolvedOnly)
			{
				success(false);
				return;
			}
			
			indexIntegrityCheck(function()
			{
				remaining = AC.curCommentIndex.length;
				doNextChunk();
			}, error);
		});
		
		function indexIntegrityCheck(callback, error)
		{
			if (checkUnresolvedOnly && callback == null) return;
				
			AC.getAttVersWithComments(attId, attVer, function(vers, versMap)
			{
				var matches = 0;
				
				for (var i = 0; i < AC.curCommentIndex.length; i++)
				{
					if (versMap[AC.curCommentIndex[i]])
					{
						matches++;
					}
				}
    			
				if (matches != vers.length || AC.curCommentIndex.length != vers.length)
				{
					AC.curCommentIndex = vers;
					AC.setCommentsAttVersIndex(attId, vers);
				}
				
				if (callback)
				{
					callback();
				}
    		}, 
    		function()
    		{
    			console.log('Error while checking integrity of comments index for ' + attVer); //TODO What to do when integrity call fails?
    			
    			if (error)
    			{
    				error();
    			}
    		});
		};
		
		function doGetComments(ver, callback, error)
		{
			AP.request({
		        url : '/rest/api/content/' + attId + 
		        		'/child/comment?limit=200&expand=body.storage,version,history,children.comment.body.storage,children.comment.version,children.comment.history' + 
		        		'&parentVersion=' + ver,
		        type : 'GET',
		        success : function(comments) 
		        {
		        	//TODO handle paging or 200 comments + 25 replies are enough?
		        	comments = JSON.parse(comments).results;
	
		        	for (var i = 0; i < comments.length; i++)
	        		{
		        		if (checkUnresolvedOnly)
	        			{
		        			if (!isResolvedComment(comments[i]))
		        			{
		            			success(true);
		            			return;
		        			}
	        			}
		        		else
		        		{
			        		comments[i].attVer = ver;
			        		confComments.push(comments[i]);
		        		}
	        		}
		        	
		        	callback();
		        },
		        error : error
		    }); 
		};
		
		function doNextChunk()
		{
			remaining--;
			
			if (remaining < 0)
			{
				success(checkUnresolvedOnly? false : confComments, AC.getSiteUrl());
				return;
			}
			
			doGetComments(AC.curCommentIndex[remaining], doNextChunk, error);
		}
	}
	else
	{
		error({message: mxResources.get('saveDiagramFirst', null, 'Save diagram first!')});
	}
}, true);

AC.hasUnresolvedComments = function(pageId, contentId, diagramName, callback, error) 
{
	AC.getOldComments(contentId, function(comments)
	{
		var hasOldComments = false;
		
		for (var i = 0; i < comments.length; i++)
		{
			if (comments[i].isDeleted) continue;
			
			hasOldComments = true;
			
			if (!comments[i].isResolved)
			{
				callback(true);
				break;
			}
		}
		
		if (!hasOldComments)
		{
			//Get current diagram information which is needed for comments
			//This call is needed since we allow calling this from viewer without using AC.loadDiagram
			//TODO viewer needs to use AC for interaction with Confluence
			AC.getAttachmentInfo(pageId, diagramName, function(info)
			{
				AC.curDiagVer = info.version.number;
				AC.curDiagId = info.id;
				
				AC.getComments(null, true, callback, error);
			}, 
			error);
		}
	}, 
	error);
};

AC.setCommentsAttVersIndex = function(attId, vers) 
{
	AC.setContentProperty(attId, AC.COMMENTS_INDEX_PROP, JSON.stringify(vers), AC.curCommentIndexVer, 
	function(resp)
	{
		resp = JSON.parse(resp);
		AC.curCommentIndexVer = resp.version.number;
	}, 
	AC.noop); //Ignore errors	
};

AC.getCommentsAttVersIndex = function(attId, success, error)
{
	AC.getContentProperty(attId, AC.COMMENTS_INDEX_PROP, function(resp)
	{
		resp = JSON.parse(resp);
		AC.curCommentIndexVer = resp.version.number;
		
		try
		{
			AC.curCommentIndex = JSON.parse(resp.value);
			
			if (AC.curCommentIndex.length > AC.curDiagVer)
			{
				AC.curCommentIndex = []; //The length of the index cannot exceed the number of the versions, so, index is corrupt
			}
		}
		catch(e)
		{
			AC.curCommentIndex = [];
		}
		
		success(AC.curCommentIndex);
	}, function()
	{
		AC.curCommentIndex = [];
		error();
	});	
};

AC.getAttVersWithComments = function(attId, attVer, callback, error)
{
	var start = 1;
	var vers = [], versMap = {};
	
	function checkChunk(start, end, callback, error)
	{
		var doneCount = 0, total = end - start + 1;
		
		function checkDone()
		{
			doneCount++;
			
			if (doneCount == total)
			{
				callback();	
			}
		}
		
		function checkVer(ver)
		{
			AP.request({
		        url : '/rest/api/content/' + attId + 
		        		'/child/comment?limit=200&parentVersion=' + ver,
		        type : 'GET',
		        success : function(comments) 
		        {
		        	//TODO handle paging or 200 comments + 25 replies are enough?
		        	if (JSON.parse(comments).results.length > 0)
		        	{
		        		vers.push(ver);
		        		versMap[ver] = true;
		        	}
		        	
	        		checkDone();
		        },
		        error : error
			});
		};
		
		for (var i = start; i <= end; i++)
		{
			checkVer(i);
		}
	};
	
	function doNextChunk()
	{
		if (start > attVer)
		{
			callback(vers, versMap);
			return;
		}
		
		//Check all versions 5 at a time
		checkChunk(start, Math.min(start + 4, attVer), doNextChunk, error);
		start += 5;
	}
	
	doNextChunk();
};

AC.addComment = AC.commentsFnWrapper(function(commentContent, success, error)
{
	var attId = AC.curDiagId;
	
	if (attId)
	{
		AP.request({
	        url : '/rest/api/content',
	        type : 'POST',
	        data: JSON.stringify({
            	type: 'comment',
            	container: {
                    "type": 'attachment',
                    "id": attId
                 },
                 "body": {
  		           "storage": {
  		             "value": encodeURIComponent(commentContent),
  		             "representation": "storage"
  		           }
  		         }
	        }),
	        success : function(addedComment) 
	        {
	        	addedComment = JSON.parse(addedComment);
	        	success(addedComment.id, addedComment.version.number, AC.curDiagVer);
	        	
	        	//Add cur ver to list of versions
	        	if (AC.curCommentIndex.indexOf(AC.curDiagVer) == -1)
        		{
	        		AC.curCommentIndex.push(AC.curDiagVer);
	        		AC.setCommentsAttVersIndex(attId, AC.curCommentIndex);
        		}
	        },
	        error : error,
	        contentType: 'application/json'
	    });
	}
	else
	{
		error({message: mxResources.get('saveDiagramFirst', null, 'Save diagram first!')});
	}
}, true);

AC.addCommentReply = AC.commentsFnWrapper(function(parentId, parentAttVer, replyContent, doResolve, callback, error)
{
	var attId = AC.curDiagId;
	
	//We cannot add replies to comments that belong to old versions of the attachment, so, as a workaround we add a special regular comment
	if (parentAttVer != AC.curDiagVer)
	{
		AC.addComment(AC.REPLY_MARKER + parentId + AC.REPLY_MARKER_END + (doResolve? AC.RESOLVED_MARKER : '') + replyContent, callback, error);
	}
	else
	{
		AP.request({
	        url : '/rest/api/content',
	        type : 'POST',
	        data: JSON.stringify({
	        	"type": 'comment',
	        	"ancestors": [
	        	    {
	        	      "id": parentId
	        	    }
	        	],
	        	"container": {
	                "type": 'attachment',
	                "id": attId
	             },
	             "body": {
			           "storage": {
			             "value": encodeURIComponent((doResolve? AC.RESOLVED_MARKER : '') + replyContent),
			             "representation": "storage"
			           }
			         }
	        }),
	        success : function(addedReply) 
	        {
	        	addedReply = JSON.parse(addedReply);
	        	callback(addedReply.id, addedReply.version.number);
	        },
	        error : function(xhr) 
	        {
	        	if (xhr.responseText.indexOf('messageKey=parent.comment.does.not.exist') > 0)
	    		{
	        		error({message: mxResources.get('parentCommentDel', null, 'Parent comment has been deleted. A reply cannot be added.')});
	    		}
	        	else 
	        	{
	        		error(xhr)
	        	}
	        },
	        contentType: 'application/json'
		});
	}
});

AC.editComment = AC.commentsFnWrapper(function(id, version, newContent, success, error)
{
	var attId = AC.curDiagId;
	
	AP.request({
        url : '/rest/api/content/' + id,
        type : 'PUT',
        data: JSON.stringify({
        	"type": 'comment',
        	"body": {
		           "storage": {
		             "value": encodeURIComponent(newContent),
		             "representation": "storage"
		           }
		         },
		         "container": {
               "type": 'attachment',
               "id": attId
             },
             "version": {
 	            "number": version + 1
 	         }
        }),
        success : function(editedComment) 
        {
        	editedComment = JSON.parse(editedComment);
        	success(editedComment.version.number);
        },
        error : error,
        contentType: 'application/json'
    });
});

AC.deleteComment = function(id, version, hasReplies, success, error)
{
	function doDel()
	{
		AP.request({
	        url : '/rest/api/content/' + id,
	        type : 'DELETE',
	        success : success,
	        error : error
	    });
	};
	
	if (hasReplies)
	{
		//Mark as deleted if there is replies
		AC.editComment(id, version, AC.DELETED_MARKER, function()
		{
			success(true);
		}, error);
	}
	else
	{
		doDel();
	}
};

AC.getOldComments = function(contentId, callback, error)
{
	if (contentId)
	{
		AP.request({
			type: 'GET',
			url: '/rest/api/content/' + contentId + '/?expand=body.storage,version,container',
			contentType: 'application/json;charset=UTF-8',
			success: function(resp)
			{
				try 
				{
					resp = JSON.parse(resp);
					var infoObj = JSON.parse(decodeURIComponent(resp.body.storage.value));
					var spaceKey = AC.getSpaceKey(resp._expandable.space);
					var pageId = resp.container.id;
                    var pageType = resp.container.type;
                    var contentVer = resp.version.number;
                    
					callback(infoObj.comments || [], spaceKey, pageId, pageType, contentVer);
				}
				catch(e)
				{
					error(e);
				}
			},
			error: error
		});
	}
	else
	{
		callback([]);
	}
};

//Check if user can edit content (page or another content)
//Confluence doesn't provide an easy way to check for permissions. 
//		E.g., https://draw-test.atlassian.net/wiki/rest/api/content/{contentId}/restriction/byOperation/update/user?accountId={userAccountId}
//		It returns 404 even if the user has permission. It only returns 200 (OK) if the user is explicitly in restrictions list (doesn't check groups also)
AC.userCanEdit = function(contentId, callback, error)
{
	var userFound = false;
	var accountId, groupsCount, parsedGroups = 0;
	
	function checkGroupMembers(resp)
	{
		//If the user belong to multiple groups, callback will be called more than once
		if (userFound) return;
		
		resp = JSON.parse(resp);
		
		var list = resp.results;
		
		for (var i = 0; i < list.length; i++)
		{
			if (list[i].accountId == accountId)
			{
				callback(true);
				userFound = true;
				return;
			}
		}
		
		parsedGroups++;
		
		//All groups parsed
		if (groupsCount == parsedGroups)
		{
			callback(false);
		}
	};
	
	AP.user.getCurrentUser(function(user) {
		accountId = user.atlassianAccountId;
		
		AP.request({
			type: 'GET',
			url: '/rest/api/content/' + contentId + '/restriction/byOperation/update', //This API doesn't work well with paging, BUT 100 as a default limit looks enough
			contentType: 'application/json;charset=UTF-8',
			success: function(resp)
			{
				resp = JSON.parse(resp);
				
				if (resp.restrictions.user.size == 0) //When restrictions are empty, it means all are allowed
				{
					callback(true);
				}
				else
				{
					//Search users
					var list = resp.restrictions.user.results;
					
					for (var i = 0; i < list.length; i++)
					{
						if (list[i].accountId == accountId)
						{
							callback(true);
							userFound = true;
							break;
						}
					}
					
					//Check groups
					if (!userFound)
					{
						if (resp.restrictions.group.size == 0) //The owner must be in the list of editors, so, a group cannot exist without a user in the list
						{
							callback(false); //User cannot edit
						}
						else //For each group check its members!
						{
							var groups = resp.restrictions.group.results;
							groupsCount = groups.length;
							
							for (var i = 0; i < groups.length; i++)
							{
								AP.request({
									type: 'GET',
									url: '/rest/api/group/' + encodeURIComponent(groups[i].name) + '/member',
									contentType: 'application/json;charset=UTF-8',
									success: checkGroupMembers,
									error: error
								});
							}
						}
					}
				}
			},
			error: error
		});		
	});
};

AC.getPageInfo = function(urlOnly, success, error)
{
	AP.getLocation(function(url)
	{
		if (urlOnly) 
		{
			success({url: url});	
		}
		else
		{
			AP.navigator.getLocation(function (location) 
			{
				AP.request({
					type: 'GET',
					url: '/rest/api/content/' + location.context.contentId,
					contentType: 'application/json;charset=UTF-8',
					success: function(resp)
					{
						resp = JSON.parse(resp);
						resp.url = url;
						success(resp);
					},
					error: error
				});
			});
			
		}
	});
};

AC.getContentProperty = function(contentId, propName, success, error)
{
	//List all properties to prevent 404 errors
	AP.request({
		type: 'GET',
		url: '/rest/api/content/' + contentId + '/property?limit=200&expand=version', //Most probably paging is not needed as 200 is more than enough
		contentType: 'application/json;charset=UTF-8',
		success: function(resp)
		{
			resp = JSON.parse(resp);
			
			var prop = resp.results.filter(function(p)
			{
				return p.key == propName;
			});
			
			if (prop.length > 0)
			{
				success(JSON.stringify(prop[0])); //Stringify since old version of this function expected a string 
			}
			else
			{
				//Mimic the 404 error
				error({status: 404, responseText: '{"statusCode":404,"message":"com.atlassian.confluence.api.service.exceptions.NotFoundException"}'});
			}
		},
		error: error
	});
};

AC.setContentProperty = function(contentId, propName, propVal, propVersion, success, error)
{
	var obj = {
		    'value': propVal
		};
		
		if (propVersion) 
		{
			obj['version'] = {
				    'number': propVersion + 1,
				    'minorEdit': true
				  };
		}
		else
		{
			obj['key'] = propName;
		}
		
		AP.request({
			  url: '/rest/api/content/' + contentId + '/property' + (propVersion? '/' + encodeURIComponent(propName) + '?expand=version' : ''),
			  type: propVersion? 'PUT' : 'POST',
			  contentType: 'application/json',
			  data: JSON.stringify(obj),
			  success: success,
			  error: function(err)
			  {
				 //This is to fix a bug in confluence when a page is moved, the content property cannot be edited, so delete and ccreate a new one
				 if (err.status == 500 && err.responseText.indexOf('Can\'t add an owner from another space') > 0)
				 {
					AP.request({
			  			url: '/rest/api/content/' + contentId + '/property/' + encodeURIComponent(propName),
			  			type: 'DELETE',
					 	success: function()
						{
							AC.setContentProperty(contentId, propName, propVal, null, success, error);
						},
			  			error: error
					});
				 }
				 else if (error)
				 {
					error(err);	
				 }	
			  }
		});
};

AC.getConfPageEditorVer = function(pageId, callback)
{
	AC.getContentProperty(pageId, 'editor', function(resp)
	{
		resp = JSON.parse(resp);
		callback(resp.value == 'v2'? 2 : 1);
	}, function()
	{
		callback(1);// On error, assume the old editor
	})
};

AC.gotoAnchor = function(anchor)
{
	AC.getPageInfo(false, function(info)
	{
		var url = info.url;
		
		if (url != null)
		{
			//remove any hash
			var hash = url.indexOf('#');
			
			if (hash > -1)
			{
				url = url.substring(0, hash);
			}
			
			AC.getConfPageEditorVer(info.id, function(ver)
			{
				if (ver == 1)
				{
					//When page title has a [ at the beginning, conf adds id- to anchor name
					url = url + '#' + (info.title.indexOf('[') == 0? 'id-' : '') + 
											encodeURI(info.title.replace(/\s/g, '') + '-' + anchor.replace(/\s/g, ''));
				}
				else
				{
					url = url + '#' + encodeURIComponent(anchor.replace(/\s/g, '-'));
				}
				
				top.window.location = url;
			});
			
		}
	}, function()
	{
		//ignore as we cannot get the page info
	});
};

AC.getDiagramRevisions = function(diagramName, pageId, success, error)
{
	AP.request({
		type: 'GET',
		url: '/rest/api/content/' + pageId + '/child/attachment',
		contentType: 'application/json;charset=UTF-8',
		success: function(resp)
		{
			resp = JSON.parse(resp);
			var attObj = null;
			
			for (var i = 0; i < resp.results.length; i++)
			{
				if (resp.results[i].title == diagramName)
				{
					attObj = resp.results[i];
				}
			}

			if (attObj != null)
			{
				AP.request({
					type: 'GET',
					url: '/rest/api/content/' + attObj.id + '/version',
					contentType: 'application/json;charset=UTF-8',
					success: function(resp)
					{
						resp = JSON.parse(resp);
						var revs = [];
						
						for (var i = 0; i < resp.results.length; i++)
						{
							var rev =  resp.results[i];

							revs.unshift({
								modifiedDate: rev.when,
								lastModifyingUserName: rev.by? rev.by.displayName : '', 
								downloadUrl: '/download/attachments/' + pageId + '/' + encodeURIComponent(diagramName) + '?version=' + rev.number,
								obj: rev
							});
						}
						
						success(revs);
					},
					error: error
				});
			}
			else
			{
				error();
			}
		},
		error: error
	});
};

AC.setHiResPreview = function(hiResPreview, success, error)
{
	AC.hiResPreview = hiResPreview;
};

AC.setAspect = function(aspect, success, error)
{
	AC.aspect = aspect;
};

AC.getAspectObj = function()
{
	if (AC.aspect != null && AC.aspect !== 'undefined' && AC.aspect.length > 0)
	{
		var aspectArray = AC.aspect.split(' ');
		
		if (aspectArray.length > 0)
		{
			return {pageId: aspectArray[0], layerIds: aspectArray.slice(1)};
		}
	}
	
	return {};
};

AC.getAttachmentInfo = function(pageId, attName, sucess, error)
{
	AP.request({
        type: 'GET',
        url: '/rest/api/content/' + pageId + '/child/attachment?expand=version&filename=' + 
        		encodeURIComponent(attName),
        contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
        	var tmp = JSON.parse(resp);
            
        	if (tmp.results && tmp.results.length == 1)
        	{
        		sucess(tmp.results[0]);
        	}
        	else
    		{
        		error({status: 404});
    		}
        },
        error: error
    });	
};

AC.setFileDescriptor = function(desc, success, error)
{
	if (!AC.curDiagId)
	{
		if (error != null)
		{
			error({});
		}
		
		return;
	}
	
	desc.id = AC.curDiagId;
	
	AC.setContentProperty(AC.curDiagId, AC.COLLAB_PROP, 
		  encodeURIComponent(JSON.stringify(desc)), desc.headRevisionId, function(resp)
		  {
			if (success != null)
			{
			  resp = JSON.parse(resp); 
			  desc.headRevisionId = resp.version.number;
			  desc.modifiedDate = resp.version.when;
			  desc.etag = desc.etagP + '-' + desc.headRevisionId;
			  success(desc);
			}
		  }, error);
};

AC.getFileDescriptor = function(success, error)
{
	var desc = {
		id: AC.curDiagId? AC.curDiagId: null
	};
	
	function done()
	{
		success(desc);
	};
	
	if (AC.curDiagId)
	{
		AC.getContentProperty(AC.curDiagId, AC.COLLAB_PROP, function(resp)
		{
		  try
		  {
			  resp = JSON.parse(resp);
			  desc = JSON.parse(decodeURIComponent(resp.value));
			  desc.headRevisionId = resp.version.number;
			  desc.modifiedDate = resp.version.when;
			  desc.etag = desc.etagP + '-' + desc.headRevisionId;
			  desc.id = AC.curDiagId;
		  } catch(e){} //Ignore
		  
		  done();
		}, done);
	}
	else
	{
		done();
	}
};

AC.saveDraftWithFileDesc = function(data, desc, success, error)
{
	if (!AC.curDiagId)
	{
		error({});
		return;
	}
	
	var retryCount = 0;
	var lockVersion = null;
	
	function onError(err)
	{
		unlock();
		
		if ((err == null || err.status != 409) && retryCount < AC.maxRetries)
		{
			retryCount++;
			var jitter = 1 + 0.1 * (Math.random() - 0.5);
			window.setTimeout(startSave,
						Math.round(2 * retryCount * jitter * AC.coolOff));
		}
		else
		{
			error(err);
		}
	};
	
	function unlock(callback)
	{
		if (lockVersion != null)
		{
			AC.setContentProperty(AC.curDiagId, AC.COLLAB_LOCK_PROP, 0, lockVersion, callback, callback);
		}
	};
	
	function getLockSuccess(lockVal)
	{
		//Property is locked (with timeout such that lock is released after a certain time [30 sec])
		//If version is changed then these is a conflic, the same if the property is locked
		if (lockVal && AC.myDescLock != lockVal && Date.now() - lockVal < 30000)
		{
			AC.log('CONFLICT: ' + JSON.stringify(desc));
			onError({status: 409, isLocked: true}); //Conflict
		}
		else //Now acquire lock and start saving
		{
			AC.myDescLock = Date.now();
			
			AC.setContentProperty(AC.curDiagId, AC.COLLAB_LOCK_PROP, AC.myDescLock, lockVersion, function(resp)
			{
				resp = JSON.parse(resp);
				lockVersion = resp.version.number;
				
				//TODO Review this, saving draft before descriptor is incorrect (if desc failed, the draft overwrite others changes). 
				//					Opposite can lead to inconsistent desc or state (old draft with the new desc)?
				AC.setFileDescriptor(desc, function(resp)
				{
					function doSave()
					{
						AC.saveDraft(data, function()
						{
							//Unlock and finish
							unlock();
							success(resp);
						},
						function(err) //Retry within 20 sec of our lock timeout 
						{
							//No write permission or payload is too large!
							if (err.status == 403 || err.status == 413)
							{
								unlock(function()
								{
									AC.showNotification({
									  title: mxResources.get('draftWriteErr'),
									  body: err.status == 413? mxResources.get('confDraftTooBigErr') : 
													mxResources.get('confDraftPermissionErr'),
									  type: 'error',
									  close: 'manual'
									});
					    		
					    			AP.dialog.close();
								});
							}
							else if (Date.now() - AC.myDescLock < 20000)
							{
								doSave();
							}
							else //No time to retry, unlock and send error
							{
								onError({status: 409}); //Conflict
							}
						});
					};
			
					doSave();
				}, onError);
			}, onError);
		}
	};
	
	function startSave()
	{
		AC.getContentProperty(AC.curDiagId, AC.COLLAB_LOCK_PROP, function(resp)
	    {
			resp = JSON.parse(resp);
			lockVersion = resp.version.number;
			getLockSuccess(parseInt(resp.value));
		}, function(err)
		{
			//Property not found, unlocked
			if (err.status == 404)
			{
				getLockSuccess();
			}
			else
			{
				onError(err);
			}	
		});
	};
	
	startSave();
};

AC.getDraftFileContent = function(success, error)
{
	AC.getFileDescriptor(function(desc)
	{
		AP.request({
	        type: 'GET',
			url: '/download/attachments/' + AC.state.pageId + '/' + encodeURIComponent(AC.state.draftName),
	        contentType: 'text/xml;charset=UTF-8',
	        success: function(data)
	        {
	        	success(data, desc);
	        },
			error: error
		});
	}, error);
};

AC.getCurPageAnchors = function(success, error)
{
	AP.request({
		type: 'GET',
		url: '/rest/api/content/' + AC.state.pageId + '?expand=body.storage,version' + (AC.customContentEditMode? '' : '&status=draft'), //Use published content with direct edit
		contentType: 'application/json;charset=UTF-8',
		success: function(page) 
		{
			page = JSON.parse(page);
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(page.body.storage.value, 'text/html');
			AC.getConfPageEditorVer(page.id, function(ver)
			{
				var anchors = [];

				//Anchor macros are now supported by the new editor
				var anchorElems = xmlDoc.querySelectorAll('ac\\:structured-macro[ac\\:name="anchor"] > ac\\:parameter');

				for (var i = 0; i < anchorElems.length; i++)
				{
					anchors.push(AC.htmlEntities(anchorElems[i].innerText));
				}
					
				if (ver != 1)
				{
					var headingElems = xmlDoc.querySelectorAll('h1, h2, h3, h4, h5, h6');

					for (var i = 0; i < headingElems.length; i++)
					{
						var headingNodes = headingElems[i].childNodes, anchorTxt = '';

						try
						{
							for (var j = 0; j < headingNodes.length; j++)
							{
								if (headingNodes[j].nodeType == 3)
								{
									anchorTxt += headingNodes[j].nodeValue;
								}
								else
								{
									anchorTxt += '[inlineExtension]';
								}
							}
						}
						catch (e)
						{
							anchorTxt = headingElems[i].innerText;
						}

						anchors.push(AC.htmlEntities(anchorTxt));
					}
				}
			
				success(anchors);
			}, error);
		},
		error: error
	});
};

AC.getAvailableSpaces = function(success, error)
{
	var spaces = [];

	function getSpacesChunk(url)
	{
		AP.request({
			url: url,
			type: 'GET',
			contentType: 'application/json;charset=UTF-8',
			success: function(resp) 
			{
				resp = JSON.parse(resp);				
				Array.prototype.push.apply(spaces, resp.results);
				
				//Support paging
				if (resp._links && resp._links.next) 
				{
					getSpacesChunk(resp._links.next.replace(/\&\_r\=\d+/g, '')); //Remove repeated _r paramter from the URL
				}
				else
				{
					success(spaces.sort(function(a, b)
					{
						return a.title.localeCompare(b.title);
					}));
				}
			},
			error : error
		});
	};
	
	getSpacesChunk('/rest/api/search?cql=type%3Dspace&limit=100');	
};

AC.contentSearch = function(searchStr, spaces, success, error)
{
	AP.request({
		//cannot use * as a first character https://jira.atlassian.com/browse/JRASERVER-6218 (also * doesn't work with some Asian language')
		url: '/rest/api/content/search?expand=metadata,space,version&limit=100&cql=' + encodeURIComponent('(title ~ "' + searchStr + '*" or title ~ "' + searchStr + '")' +
							(spaces && spaces.length > 0? ' and space in ("' + spaces.join('","') + '")' : '')),
		type: 'GET',
		contentType: 'application/json;charset=UTF-8',
		success: function(resp) 
		{
			success(JSON.parse(resp).results);				
		},
		error : error
	});
};

AC.getContentInfo = function(id, success, error)
{
	AP.request({
		url: '/rest/api/content/' + id,
		type: 'GET',
		contentType: 'application/json;charset=UTF-8',
		success: function(resp) 
		{
			success(JSON.parse(resp));				
		},
		error : error
	});
};

AC.getConfig = function(callback, onError)
{
	AP.request({
	    type: 'GET',
	    url: '/rest/api/content/search?cql=type%3Dpage%20and%20space%3DDRAWIOCONFIG%20and%20title%3DConfiguration', //type=page and space=DRAWIOCONFIG and title=Configuration. Search doesn't return 404 if not found
	    contentType: 'application/json;charset=UTF-8',
	    success: function (resp) 
	    {
	        resp = JSON.parse(resp);
			var confPage = null;
				
			//Search can return more than one page
			for (var i = 0; i < resp.results.length; i++)
			{
				if (resp.results[i].title == 'Configuration')
				{
					confPage = resp.results[i];
					break;
				}
			}
			
	        if (confPage != null)
	       	{
	        	//load the configuration file
	    		AP.request({
	                type: 'GET',
	    			url: '/download/attachments/' + confPage.id + '/configuration.json',
	                contentType: 'application/json;charset=UTF-8',
	                success: callback,
	    			error: onError //if there is an error loading the configuration, just load the editor normally. E.g., 404 when the space doesn't exist
	    		});
	        	
	       	}
	        else 
	       	{
	        	callback(null);
	       	}
		},
		error: onError //if there is an error loading the configuration, just load the editor normally. E.g., 404 when the space doesn't exist
	});	
};

AC.buildGitHubUrl = function(githubOwner, githubRepository, githubBranch, githubFilename)
{
	return 'https://raw.githubusercontent.com/' +
				encodeURIComponent(githubOwner) + '/' +
				encodeURIComponent(githubRepository) + '/' +
				encodeURIComponent(githubBranch) + '/' +
				encodeURIComponent(githubFilename);	
};

//White-listed functions and some info about it
AC.remoteInvokableFns = {
	getRecentDiagrams: {isAsync: true},
	searchDiagrams: {isAsync: true},
	getCustomLibraries: {isAsync: true},
	getFileContent: {isAsync: true},
	getCurrentUser: {isAsync: true},
	getOldComments: {isAsync: true},
	getComments: {isAsync: true},
	addComment: {isAsync: true},
	addCommentReply: {isAsync: true},
	editComment: {isAsync: true},
	deleteComment: {isAsync: true},
	userCanEdit: {isAsync: true},
	getCustomTemplates: {isAsync: true},
	getPageInfo: {isAsync: true},
	getDiagramRevisions: {isAsync: true},
	setHiResPreview: {isAsync: false},
	setAspect: {isAsync: false},
	getFileDescriptor: {isAsync: true},
	setFileDescriptor: {isAsync: true},
	getDraftFileContent: {isAsync: true},
	saveDraftWithFileDesc: {isAsync: true},
	checkConfLicense: {isAsync: true},
	getCurPageAnchors: {isAsync: true},
	getCurPageAttachments: {isAsync: true},
	getPageDrawioDiagrams: {isAsync: true},
	getAvailableSpaces: {isAsync: true},
	contentSearch: {isAsync: true},
	getBaseUrl: {isAsync: false},
	getSpaceKey: {isAsync: false},
	getContentInfo: {isAsync: true}
};

AC.remoteInvokeCallbacks = [];

AC.handleRemoteInvokeResponse = function(msg)
{
	var msgMarkers = msg.msgMarkers;
	var callback = AC.remoteInvokeCallbacks[msgMarkers.callbackId];
	
	if (msg.error)
	{
		if (callback.error) callback.error(msg.error.errResp);
	}
	else if (callback.callback)
	{
		callback.callback.apply(this, msg.resp);
	}
	
	AC.remoteInvokeCallbacks[msgMarkers.callbackId] = null; //set it to null only to keep the index
};

//Here, the editor is ready before sending init even which starts everything, so no need for waiting for ready message. Init is enough
AC.remoteInvoke = function(remoteFn, remoteFnArgs, msgMarkers, callback, error)
{
	msgMarkers = msgMarkers || {};
	msgMarkers.callbackId = AC.remoteInvokeCallbacks.length;
	AC.remoteInvokeCallbacks.push({callback: callback, error: error});
	AC.remoteWin.postMessage(JSON.stringify({action: 'remoteInvoke', funtionName: remoteFn, functionArgs: remoteFnArgs, msgMarkers: msgMarkers}), '*');
};

AC.handleRemoteInvoke = function(msg)
{
	function sendResponse(resp, error)
	{
		var respMsg = {action: 'remoteInvokeResponse', msgMarkers: msg.msgMarkers};
		
		if (error != null)
		{
			respMsg.error = {errResp: error};
		}
		else if (resp != null) 
		{
			respMsg.resp = resp;
		}
		
		AC.remoteWin.postMessage(JSON.stringify(respMsg), '*');
	}
	
	try
	{
		//Remote invoke are allowed to call functions in AC
		var funtionName = msg.funtionName;
		var functionInfo = AC.remoteInvokableFns[funtionName];
		
		if (functionInfo != null && typeof AC[funtionName] === 'function')
		{
			var functionArgs = msg.functionArgs;
			
			//Confirm functionArgs are not null and is array, otherwise, discard it
			if (!Array.isArray(functionArgs))
			{
				functionArgs = [];
			}
			
			//for functions with callbacks (async) we assume last two arguments are success, error
			if (functionInfo.isAsync)
			{
				//success
				functionArgs.push(function() 
				{
					sendResponse(Array.prototype.slice.apply(arguments));
				});
				
				//error
				functionArgs.push(function(err) 
				{
					sendResponse(null, err || mxResources.get('unknownError'));
				});
				
				AC[funtionName].apply(this, functionArgs);
			}
			else
			{
				var resp = AC[funtionName].apply(this, functionArgs);
				
				sendResponse([resp]);
			}
		}
		else
		{
			sendResponse(null, mxResources.get('invalidCallFnNotFound', [funtionName]));
		}
	}
	catch(e)
	{
		sendResponse(null, mxResources.get('invalidCallErrOccured', [e.message]));
		console.log(e);
		AC.logError(e.message, null, null, null, e);
	}
};

//Allow loading of plugins (we need it for comments) 
AC.plugins = [];

window.Draw = new Object();
window.Draw.loadPlugin = function(callback)
{
	AC.plugins.push(callback);
};

AC.loadPlugins = function(ui)
{
	for (var i = 0; i < AC.plugins.length; i++)
	{
		AC.plugins[i](ui);
	}
};

AC.noop = function(){};

//Safe guard in case mxResources is not loaded
if (typeof window.mxResources === 'undefined')
{
	//define mxResources such that it is available and no errors are thrown
	window.mxResources = {
		get: function(key, params, def)
		{
			return (def || '').replace('{1}', params? (params[0] || '') : ''); //Simple replacement which covers most cases 
		}
	};
}