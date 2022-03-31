//Logs uncaught errors
window.onerror = function(message, url, linenumber, colno, err)
{
	message = 'Confluence Cloud Editor: ' + ((message != null) ? message : '');
	
	AC.logError(message, url, linenumber, colno, err);
};

var baseUrl = AC.getBaseUrl();
var connectUrl = baseUrl + '/atlassian-connect';

// Main
function init()
{
	AP.resize('100%', '100%');
	
	var lang = null, config = null;
	var allDone = 0;
	
	var startEditor = function () 
	{
		allDone++;
		
		if (allDone == 2)
		{
			AP.dialog.getCustomData(function (customData) 
			{
				var isCustom = AC.getUrlParam('custom');
				
				if (isCustom == "1") 
				{
					var contentId = AC.getUrlParam('contentId') || AC.getUrlParam('custContentId');
					AC.initAsync(baseUrl, customData.contentId || customData.custContentId || contentId, customData.macroData, config, lang, customData.isSketch);
				}
				else
				{
					AC.initAsync(baseUrl, null, null, config, lang, customData.isSketch);
				}
			});
		}
	}
	
	AP.user.getLocale(function(locale)
	{
		lang = locale;
		startEditor();
	});	
	
	AC.getConfig(function (fileContent) 
    {
    	config = fileContent; 
       	startEditor();
	}, startEditor);  //if there is an error loading the configuration, just load the editor normally. E.g., 404 when the space doesn't exist
	
	AP.request({
	    type: 'GET',
	    url: '/rest/atlassian-connect/1/addons/com.mxgraph.confluence.plugins.diagramly',
	    contentType: 'application/json;charset=UTF-8',
	    success: function (resp) 
	    {
	    	try
	    	{
	            resp = JSON.parse(resp);
	            
	            if (resp != null && resp.license != null)
	            {
	            	var xhr = new XMLHttpRequest();
	            	xhr.open('POST', '/license?licenseDump=' + encodeURIComponent(JSON.stringify(resp)), true);
	    			xhr.send(null);
	            }
	    	}
	    	catch (e)
	    	{
	    		// just throw away if it breaks, not important
	        	}
	        }
		});
};

var head = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.href = connectUrl + '/all.css';
head.appendChild(link);

if (typeof AP === 'undefined')
{
    var script = document.createElement('script');
    script.onload = init;
    script.src = 'https://connect-cdn.atl-paas.net/all.js';
    script.setAttribute('data-options', 'resize:false;margin:false');
    head.appendChild(script);
}
else
{
    init();
}
