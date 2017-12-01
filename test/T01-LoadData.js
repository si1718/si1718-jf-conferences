var fs = require('fs');

function writeScreenShot(data, filename) {
	var stream = fs.createWriteStream(filename);
	stream.write(new Buffer(data, 'base64'));
	stream.end();
}

describe('Data is loaded', function() {
	it('should show a bunch of conference', function() {
		browser.get('https://si1718-jf-conferences-sos161706jf.c9users.io/#!/conferences');
		var conferences = element.all(by.repeater('conference in conferences'));
		browser.driver.sleep(2000);

		browser.takeScreenshot().then(function(png) {
			writeScreenShot(png, 'ng-test.png');
		});
		expect(conferences.count()).toBeGreaterThan(2);
	});
});
