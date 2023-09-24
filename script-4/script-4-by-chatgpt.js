// Notes by Arjan
// Chat output: https://chat.openai.com/share/e315a4c2-1fe5-440f-af51-d01448a885e3
// The script has outdated query selectors

function main() {
    // Thresholds for performance criteria
    var HIGH_CPC_THRESHOLD = 5; // Example: $5
    var LOW_CONVERSION_THRESHOLD = 2; // Example: 2 conversions

    // Get the keywords that meet our criteria
    var keywordIterator = AdsApp.keywords()
        .withCondition("Cpc > " + HIGH_CPC_THRESHOLD)
        .withCondition("Conversions < " + LOW_CONVERSION_THRESHOLD)
        .get();

    // Iterate over the keywords and label them
    while (keywordIterator.hasNext()) {
        var keyword = keywordIterator.next();
        keyword.applyLabel("Review");
    }

    Logger.log("Keywords labeled for review based on performance criteria.");
}
