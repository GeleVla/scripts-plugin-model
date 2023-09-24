function main() {
    var campaignIterator = AdsApp.campaigns().get();
    while (campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        var negativeKeywords = [];
        var campaignNegativeKeywordIterator = campaign.negativeKeywords().get();

        while (campaignNegativeKeywordIterator.hasNext()) {
            var negativeKeyword = campaignNegativeKeywordIterator.next().getText();
            negativeKeywords.push(negativeKeyword);
        }

        var keywordIterator = campaign.keywords().get();
        while (keywordIterator.hasNext()) {
            var keyword = keywordIterator.next();
            for (var i = 0; i < negativeKeywords.length; i++) {
                if (negativeKeywords[i] === keyword.getText()) {
                    Logger.log('Conflict found in Campaign: ' + campaign.getName() + '. Keyword: ' + keyword.getText() + ' is also a negative keyword.');
                }
            }
        }
    }
}