function main() {
    // Define date ranges for comparison
    var lastWeek = AdsApp.report(
        `
        SELECT 
            ad_group.id, 
            ad_group.name, 
            metrics.ctr 
        FROM 
            ad_group
        WHERE 
            campaign.status = "ENABLED" 
            AND ad_group.status = "ENABLED" 
            AND segments.date DURING LAST_7_DAYS
        `
    );

    var today = new Date();
    today.setDate(today.getDate() - 7);
    var daysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
    var dateFrom = Utilities.formatDate(daysAgo, AdWordsApp.currentAccount().getTimeZone(), 'yyyyMMdd');
    var dateTo = Utilities.formatDate(today, AdWordsApp.currentAccount().getTimeZone(), 'yyyyMMdd');

    var previousWeek = AdsApp.report(
        `
        SELECT 
            ad_group.id, 
            ad_group.name, 
            metrics.ctr 
        FROM 
            ad_group 
        WHERE 
            campaign.status = "ENABLED" 
            AND ad_group.status = "ENABLED" 
            AND segments.date BETWEEN '${dateFrom}' AND '${dateTo}'
        `
    );

    var rowsLastWeek = lastWeek.rows();
    var rowsPreviousWeek = previousWeek.rows();

    var decliningAdGroups = [];

    while (rowsLastWeek.hasNext()) {
        var rowLastWeek = rowsLastWeek.next();

        var currentAdGroupId = rowLastWeek['ad_group.id'];
        var currentAdGroupName = rowLastWeek['ad_group.name'];
        var currentCtr = parseFloat(rowLastWeek['metrics.ctr']);

        while (rowsPreviousWeek.hasNext()) {
            var rowPreviousWeek = rowsPreviousWeek.next();
            if (currentAdGroupId === rowPreviousWeek['ad_group.id']) {
                var previousCtr = parseFloat(rowPreviousWeek['metrics.ctr']);

                if (currentCtr < previousCtr) {
                    decliningAdGroups.push({
                        AdGroupId: currentAdGroupId,
                        AdGroupName: currentAdGroupName,
                        LastWeekCtr: currentCtr,
                        PreviousWeekCtr: previousCtr
                    });
                }

                break;
            }
        }
    }

    if (decliningAdGroups.length > 0) {
        Logger.log('Ad Groups with declining CTR:');
        for (var i = 0; i < decliningAdGroups.length; i++) {
            var adGroup = decliningAdGroups[i];
            Logger.log('Ad Group ID: ' + adGroup.AdGroupId + ', Ad Group Name: ' + adGroup.AdGroupName + ', Last Week CTR: ' + adGroup.LastWeekCtr + ', Previous Week CTR: ' + adGroup.PreviousWeekCtr);
        }
    } else {
        Logger.log('No ad groups found with declining CTR.');
    }
}