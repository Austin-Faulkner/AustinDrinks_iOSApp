// Main
function init()
{
	// TODO: Try avoid this by using workaround in EditorUi.fileLoaded on line 2200
	//Firefox has a problem with focusing the can be fixed with a chrome dialog
	if(navigator.userAgent.indexOf('Firefox/') >= 0)
	{
		AP.dialog.create(
        {
    		key: 'splashEditor',
    		customData: {
				isSketch: AC.getUrlParam('sketch') == '1'
			},
    		header: 'draw.io',
            chrome: true,
            width: "50%",
            height: "50%",
        });

		AP.events.on('dialog.close', function(flags)
    	{
        	AP.dialog.close();
        	AP.confluence.closeMacroEditor();
		});
		AP.dialog.getButton('submit').hide();
		//Confluence refuse to hide cancel button!!!
		AP.dialog.getButton('cancel').hide();
	}
	else
	{
		AP.dialog.create(
        {
    		key: 'macroEditor',
    		customData: {
				isSketch: AC.getUrlParam('sketch') == '1'
			},
            chrome: false,
            width: "100%",
            height: "100%",
        });
		
		AP.events.on('dialog.close', function(flags)
    	{
        	AP.confluence.closeMacroEditor();
		});
	}
};

if (typeof AP === 'undefined')
{
    var script = document.createElement('script');
    script.onload = init;
    script.src = 'https://connect-cdn.atl-paas.net/all.js';
    script.setAttribute('data-options', 'resize:false;margin:false');
    document.getElementsByTagName('head')[0].appendChild(script);
}
else
{
    init();
}