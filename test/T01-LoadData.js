describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('https://si1718-jf-conferences-sos161706jf.c9users.io/#!/conferences');
		var gdpPerCapitaDataList = element.all(by.repeater('dataUnit in data'));
		expect(gdpPerCapitaDataList.count()).toEqual(1);
	});
});