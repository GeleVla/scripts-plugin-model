// Notes by Arjan
// Chat output: https://chat.openai.com/share/25348907-6a41-440a-be98-9cbcce38a059
// I have not made changes to this script in the final version. The final version is an existing script.

function main() {
    // User configuration
    var SPREADSHEET_URL = 'YOUR_SPREADSHEET_URL_HERE';  // Replace with your Spreadsheet URL
    var FILTER_FOR_PERFORMANCE_MAX = false;  // Change to true if you want to filter by 'PERFORMANCE_MAX' campaigns
    var USE_CAMPAIGN_NAMES_FOR_TABS = true;  // Change to false if you want to use campaign IDs
    
    var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var allCampaigns = AdsApp.campaigns().withCondition("Status != REMOVED").withCondition("Impressions > 0").get();
  
    while (allCampaigns.hasNext()) {
        var campaign = allCampaigns.next();
      
        if (FILTER_FOR_PERFORMANCE_MAX && campaign.getAdvertisingChannelType() !== 'PERFORMANCE_MAX') {
            continue;
        }
      
        var tabName = USE_CAMPAIGN_NAMES_FOR_TABS ? campaign.getName() : campaign.getId().toString();
        var sheet = spreadsheet.getSheetByName(tabName) || spreadsheet.insertSheet(tabName);
      
        // Extracting campaign data
        var campaignData = [
            ['Campaign ID', 'Campaign Name', 'Status', 'Impressions', 'Clicks', 'Cost'],
            [campaign.getId(), campaign.getName(), campaign.getStatus(), campaign.getStats().getImpressions(), campaign.getStats().getClicks(), campaign.getStats().getCost()]
        ];
      
        // Writing campaign data to spreadsheet
        sheet.getRange(1, 1, campaignData.length, campaignData[0].length).setValues(campaignData);
      
        // Fetching search term insights
        var searchTerms = campaign.searchTermsReport().withCondition("Impressions > 0").get();
        var searchTermData = [['Query', 'Impressions', 'Clicks', 'Cost']];
      
        while (searchTerms.hasNext()) {
            var searchTerm = searchTerms.next();
            searchTermData.push([searchTerm.getQuery(), searchTerm.getImpressions(), searchTerm.getClicks(), searchTerm.getCost()]);
        }
      
        // Writing search term data to spreadsheet
        sheet.getRange(4, 1, searchTermData.length, searchTermData[0].length).setValues(searchTermData);
    }
}
