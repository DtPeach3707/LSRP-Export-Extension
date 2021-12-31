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
    csv_lis.push(['Customer Name', 'Customer ID', 'Description', 'Item Price', 'Quantity', 'Total'])
    for (arr of priceList)
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

    let csvContent = "data:text/csv;charset=utf-8,";

    csv_lis.forEach(function(rowArray) {
        let row = rowArray.join("\t");
        csvContent += row + "\n";
    });

    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        console.log(tabs);
        chrome.scripting.executeScript({target: {tabId: tabs[0].id, allFrames: true}, func: addCSVLink, args: [csvContent]});
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
