// Notes by Arjan
// Chat output: https://chat.openai.com/share/2abd7195-de30-4bf4-9679-5a7d0e66f3ca
// The script's starting row of the range is too small.

function main() {
    var SPREADSHEET_URL = 'YOUR_SPREADSHEET_URL_HERE';  // Replace with your spreadsheet's URL
    var sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL).getActiveSheet();

    var date = new Date();
    var dateStr = [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('-');

    // Retrieve account statistics
    var stats = AdWordsApp.currentAccount().getStatsFor("LAST_7_DAYS");
    var currentCTR = stats.getCtr();
    var currentCPC = stats.getAverageCpc();
    var currentConversions = stats.getConversions();

    // Assuming the previous data is stored in the last row of the spreadsheet
    var lastRow = sheet.getLastRow();
    var previousCTR = sheet.getRange(lastRow, 2).getValue();
    var previousCPC = sheet.getRange(lastRow, 3).getValue();
    var previousConversions = sheet.getRange(lastRow, 4).getValue();

    var CTR_CHANGE_THRESHOLD = 0.05;  // Change as per your requirements
    var CPC_CHANGE_THRESHOLD = 2;     // Change as per your requirements (e.g., 2 USD)
    var CONVERSION_CHANGE_THRESHOLD = 5;  // Change as per your requirements

    if (Math.abs(currentCTR - previousCTR) > CTR_CHANGE_THRESHOLD ||
        Math.abs(currentCPC - previousCPC) > CPC_CHANGE_THRESHOLD ||
        Math.abs(currentConversions - previousConversions) > CONVERSION_CHANGE_THRESHOLD) {
        var emailBody = 'Alert! There are significant changes in your account metrics:\n\n';
        emailBody += 'CTR: ' + currentCTR + '\n';
        emailBody += 'Average CPC: ' + currentCPC + '\n';
        emailBody += 'Conversions: ' + currentConversions + '\n';

        MailApp.sendEmail({
            to: "YOUR_EMAIL_HERE",  // Replace with your email
            subject: "Google Ads Account Anomaly Detected for " + dateStr,
            body: emailBody
        });
    }

    // Store current metrics to the spreadsheet for future comparison
    sheet.appendRow([dateStr, currentCTR, currentCPC, currentConversions]);
}
