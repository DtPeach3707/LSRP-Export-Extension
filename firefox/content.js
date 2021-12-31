function Export()
{
    info = []
    for (row of document.getElementsByClassName('container')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr'))
    {
        var customer = row.getElementsByTagName('td')[0].getElementsByTagName('a')[0].getElementsByTagName('span')[0].innerHTML;
        var CIDURL = row.getElementsByTagName('td')[0].getElementsByTagName('a')[0].getAttribute('href');
        var description = row.getElementsByTagName('td')[1].getElementsByTagName('a')[0].getElementsByTagName('span')[0].innerHTML;
        var IPURL = row.getElementsByTagName('td')[1].getElementsByTagName('a')[0].getAttribute('href');
        var quantity = row.getElementsByTagName('td')[2].innerHTML.split('\t')[14];
        var total = row.getElementsByTagName('td')[5].innerHTML.split('\t')[14];
        info.push([customer, CIDURL, description, IPURL, quantity, total]);
    }
    chrome.runtime.sendMessage({msg: info});
}

chrome.storage.sync.get(['isOn'], function(toggl)
{
	if(toggl.isOff){}
    else
    {
        if(document.getElementsByClassName('container'))
        {
            Export();
        }
    }
});