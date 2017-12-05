describe('Add conference', function() {
    it('should add a new conference', function() {
        browser.get('https://si1718-jf-conferences-sos161706jf.c9users.io/#!/conferences');

        element.all(by.repeater('conference in conferences')).then(function(initialConferences) {
            browser.driver.sleep(2000);

            element(by.model('newConference.idConference')).sendKeys('caise-2017');
            element(by.model('newConference.conference')).sendKeys('Conference on Advanced Information Systems Engineering');
            element(by.model('newConference.acronym')).sendKeys('CAISE');
            element(by.model('newConference.edition')).sendKeys('2017');
            element(by.model('newConference.city')).sendKeys('Essen');
            element(by.model('newConference.country')).sendKeys('Alemania');

            element(by.buttonText('Add')).click().then(function() {

                element.all(by.repeater('conference in conferences')).then(function(conferences) {
                    expect(conferences.length).toEqual(initialConferences.length+1);
                });

            });

        });
    });
});
