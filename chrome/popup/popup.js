//popup.js

var off = false;

function toggle() // For turning the extension on and off
{
	if(!(off))
	{
		document.getElementById('info').innerHTML = 'Extension is currently turned off';
		off = true;
	}
	else
	{
		document.getElementById('info').innerHTML = 'Extension is currently turned on';
		off = false;
	}
	chrome.storage.sync.set({isOff: off}, function() {
        if(off)
        {
            console.log('Extension has been toggled off');
        } 
        else
        {
            console.log('Extension has been toggled on');
        }
        });
}


function resetCSV() // Reset CSV collection
{
	chrome.storage.local.set({totalCSV: null});
}


document.getElementById('toggle').addEventListener('click', toggle);
document.getElementById('reset').addEventListener('click', resetCSV);


chrome.storage.sync.get(['isOff'], function(toggl)
{
	if(toggl.isOff)
	{
		toggle();
	}
});
