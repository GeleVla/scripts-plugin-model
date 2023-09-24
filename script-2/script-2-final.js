function main() {
    var SPREADSHEET_URL = 'YOUR_SPREADSHEET_URL_HERE';
    var sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL).getActiveSheet();

    var date = new Date();
    var dateStr = [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('-');

    // Retrieve account statistics
    var stats = AdWordsApp.currentAccount().getStatsFor("LAST_7_DAYS");
    var currentCTR = stats.getCtr();
    var currentCPC = stats.getAverageCpc();
    var currentConversions = stats.getConversions();

    var lastRow = sheet.getLastRow();

    // Check if the sheet is not empty
    if (lastRow > 0) {
        var previousCTR = sheet.getRange(lastRow, 2).getValue();
        var previousCPC = sheet.getRange(lastRow, 3).getValue();
        var previousConversions = sheet.getRange(lastRow, 4).getValue();

        var CTR_CHANGE_THRESHOLD = 0.05;
        var CPC_CHANGE_THRESHOLD = 2;
        var CONVERSION_CHANGE_THRESHOLD = 5;

        if (Math.abs(currentCTR - previousCTR) > CTR_CHANGE_THRESHOLD ||
            Math.abs(currentCPC - previousCPC) > CPC_CHANGE_THRESHOLD ||
            Math.abs(currentConversions - previousConversions) > CONVERSION_CHANGE_THRESHOLD) {

            var emailBody = 'Alert! There are significant changes in your account metrics:\n\n';
            emailBody += 'CTR: ' + currentCTR + '\n';
            emailBody += 'Average CPC: ' + currentCPC + '\n';
            emailBody += 'Conversions: ' + currentConversions + '\n';

            MailApp.sendEmail({
                to: "YOUR_EMAIL_HERE",
                subject: "Google Ads Account Anomaly Detected for " + dateStr,
                body: emailBody
            });
        }
    } else {
        // If the sheet is empty, add a header row
        sheet.appendRow(["Date", "CTR", "CPC", "Conversions"]);
        sheet.appendRow([dateStr, currentCTR, currentCPC, currentConversions]);
    }
}
