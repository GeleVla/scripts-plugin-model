// Notes by Arjan
// Chat output: https://chat.openai.com/share/4375ef54-717e-4ef0-b425-ab7a478f10fd
// The script has outdated query selectors

function main() {
    // Define date ranges for comparison
    var lastWeek = AdsApp.report(
        "SELECT AdGroupId, AdGroupName, Ctr " +
        "FROM ADGROUP_PERFORMANCE_REPORT " +
        "WHERE CampaignStatus = 'ENABLED' AND AdGroupStatus = 'ENABLED' " +
        "DURING LAST_7_DAYS"
    );

    var previousWeek = AdsApp.report(
        "SELECT AdGroupId, AdGroupName, Ctr " +
        "FROM ADGROUP_PERFORMANCE_REPORT " +
        "WHERE CampaignStatus = 'ENABLED' AND AdGroupStatus = 'ENABLED' " +
        "DURING DATE_RANGE('LAST_14_DAYS', 'LAST_8_DAYS')"
    );

    var rowsLastWeek = lastWeek.rows();
    var rowsPreviousWeek = previousWeek.rows();

    var decliningAdGroups = [];

    while (rowsLastWeek.hasNext()) {
        var rowLastWeek = rowsLastWeek.next();

        var currentAdGroupId = rowLastWeek['AdGroupId'];
        var currentAdGroupName = rowLastWeek['AdGroupName'];
        var currentCtr = parseFloat(rowLastWeek['Ctr']);

        while (rowsPreviousWeek.hasNext()) {
            var rowPreviousWeek = rowsPreviousWeek.next();
            if (currentAdGroupId === rowPreviousWeek['AdGroupId']) {
                var previousCtr = parseFloat(rowPreviousWeek['Ctr']);

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
