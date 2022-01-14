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

chrome.storage.sync.get(['isOff'], function(toggl)
{
    if(toggl.isOff){}
    else
    {
        if(document.getElementById('nextPage_top'))
        {
            var exported = true;
            var info = Export();
            if(document.getElementById('nextPage_top').classList[1] == null)
            {
                var isDone = false;
            }
            else
            {
                var isDone = true;
            }
            if(exported )
            {
                chrome.runtime.sendMessage({msg: [info, isDone]});
                exported = false;
            }
        }
        else
        {
            chrome.storage.local.set({totalCSV: null});
        }
    }
});


//Keep going until done using message listeners
chrome.runtime.onMessage.addListener((msg)=>{
    if(msg.msg == false)
    {   
        var exported = true;
        document.getElementById('nextPage_top').click();
        setTimeout(()=>{console.log('Page loaded')}, 2000);
        var info = Export();
        if(document.getElementById('nextPage_top').classList[1] == null)
        {
            var isDone = false;
        }
        else
        {
            var isDone = true;
        }
        if(exported)
        {
            chrome.runtime.sendMessage({msg: [info, isDone]});
            exported = false;
        }
    }
    else
    {
        console.log('Be done yes');
    }
});
