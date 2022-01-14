chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    if(request)
    {
        makeCSV(request.msg);
    }
});


async function makeCSV(priceList)
{
    var csv_lis = [];
    for (arr of priceList[0])
    {
        CiD = arr[1];
        IpUrl = arr[3];
        CIResp = await fetch('https://us.merchantos.com/?name=customer.views.customer&form_name=view&id=' + CiD + '&tab=details');
        CIPage = await CIResp.text();
        var CI = CIPage.split(`<input type='text'  autocomplete="off" value="`)[21].split('\"')[0];
        IPResp = await fetch('https://us.merchantos.com/?name=customer.views.customer&form_name=view&id=' + IpUrl);
        IPPage = await IPResp.text();
        var ItemP = '$' + IPPage.split('<input')[21].split('value="')[1].split('\"')[0];
        csv_lis.push([arr[0], CI, arr[2], ItemP, arr[4], arr[5]]);
    }

    var csvContent = '';
    
    csv_lis.forEach(function(rowArray) {
        let row = rowArray.join("\t");
        csvContent += row + "\n";
    });

    chrome.storage.local.get(['totalCSV'], (totCSV)=>{
        if(totCSV.totalCSV)
        {
            var newCSV = totCSV.totalCSV + csvContent;
        }
        else
        {
            var newCSV = csvContent;
        }
        console.log(newCSV);
        let csvcontent = "data:text/csv;charset=utf-8,"; // Initializes in here so background doesn't screw up
        var csvArray = ['Customer Name', 'Customer ID', 'Description', 'Item Price', 'Quantity', 'Total'];
        let row = csvArray.join("\t");
        csvcontent += row + "\n";
        console.log(csvcontent + newCSV);
        var encodedUri = encodeURI(csvcontent + newCSV);
        chrome.storage.local.set({totalCSV: newCSV});
        console.log('About to tell content script to do stuff again');
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            chrome.scripting.executeScript({target: {tabId: tabs[0].id, allFrames: true}, func: addCSVLink, args: [encodedUri]});
            chrome.tabs.sendMessage(tabs[0].id, {msg: priceList[1]});
        });
    });
}

function addCSVLink(CSV)
{
    var encodedUri = encodeURI(CSV);
    document.getElementById('exportButton_top').setAttribute('href', encodedUri);
    document.getElementById('exportButton_top').setAttribute('download', 'sales_report.csv');
    document.getElementById('exportButton_bottom').setAttribute('href', encodedUri);
    document.getElementById('exportButton_bottom').setAttribute('download', 'sales_report.csv');
}
