// Notes by Arjan
// Chat output: https://chat.openai.com/share/d59d3d44-46a4-4a5a-82a9-eddd942d0c88
// The script has outdated query selectors and is only iterating search campaigns

function main() {
    var MONTHLY_SPENDING_LIMIT = 1000; // Change this to your desired monthly limit.

    // Fetch all enabled campaigns.
    var campaignIterator = AdsApp.campaigns()
        .withCondition("Status = ENABLED")
        .get();

    var totalSpentThisMonth = 0;

    // Calculate how much has been spent so far this month.
    while (campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        totalSpentThisMonth += campaign.getStatsFor("THIS_MONTH").getCost();
    }

    // Check how much budget is left.
    var remainingBudget = MONTHLY_SPENDING_LIMIT - totalSpentThisMonth;

    if (remainingBudget <= 0) {
        Logger.log("Monthly budget is already exhausted.");
        return;
    }

    // Calculate days left in the month.
    var today = new Date();
    var endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    var daysLeft = endOfMonth.getDate() - today.getDate();

    // Adjust the daily budget for each campaign.
    var dailyBudget = remainingBudget / daysLeft;

    // Loop through campaigns again to set the new daily budget.
    var campaignIterator = AdsApp.campaigns()
        .withCondition("Status = ENABLED")
        .get();

    while (campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        campaign.setBudget(dailyBudget);
        Logger.log("Updated daily budget for campaign: " + campaign.getName() + " to: " + dailyBudget);
    }
}
