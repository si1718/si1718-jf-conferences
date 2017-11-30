describe('Data is loaded', function () {
	it('should show a bunch of conference', function (){
		browser.get('https://si1718-jf-conferences-sos161706jf.c9users.io/#!/conferences');
		var conferences = element.all(by.repeater('conference in conferences'));
		expect(conferences.count()).toBeGreaterThan(2);
	});
});