
describe('Gumshoe', function() {

  var data;

  it('should live in the global namespace', function () {
    expect(window.gumshoe).to.exist();
  });

  it('should expose properties', function () {
    expect(gumshoe.version).to.exist();

    gumshoe({ transport: 'gilt-svc-event' });
  });

  it('should expose internal properties', function () {
    expect(gumshoe.__internal__).to.exist();
    expect(gumshoe.__internal__.config).to.exist();
    expect(gumshoe.__internal__.transports).to.exist();
  });

  it('should expose methods', function () {
    expect(gumshoe.send).to.exist();
    expect(gumshoe.transport).to.exist();
    expect(gumshoe.uuid).to.exist();
    expect(gumshoe.__internal__.collect).to.exist();
  });

  it('should collect data', function () {
    data = gumshoe.__internal__.collect();
    expect(data).to.exist();
  });

  it('should collect basic data', function () {
    expect(data.characterSet).to.equal('UTF-8');
    expect(data.colorDepth).to.equal('32');
    expect(data.cookie).to.exist();
    expect(data.googleClickId).to.exist();
    expect(data.hash).to.exist();
    expect(data.host).to.exist();
    expect(data.hostName).to.exist();
    expect(data.ipAddress).to.exist();
    expect(data.javaEnabled).to.be.false();
    expect(data.language).to.exist();
    expect(data.loginKey).to.exist();
    expect(data.origin).to.equal('file://');
    expect(data.path).to.exist();

    expect(data.platform).to.exist();
    expect(data.port).to.equal(80);
    expect(data.promotionKey).to.exist();
    expect(data.protocol).to.equal('file:');
    expect(data.queryString).to.exist();
    expect(data.referer).to.exist();
    expect(data.title).to.equal('Test: Gumshoe');

    expect(data.url).to.have.length.above(0);
    expect(data.url).to.have.string('test/runner.html');

    expect(data.userAgent).to.have.length.above(0);
    expect(data.userAgent).to.have.string('PhantomJS');
  });

  it('should collect screen data', function () {
    expect(data.screenAvailHeight).to.equal(940);
    expect(data.screenAvailWidth).to.equal(1680);
    expect(data.screenHeight).to.equal(1050);
    expect(data.screenOrientationAngle).to.exist();
    expect(data.screenOrientationType).to.exist();
    expect(data.screenPixelDepth).to.equal('32');
    expect(data.screenResolution).to.equal('1680x1050');
    expect(data.screenWidth).to.equal(1680);
  });

  it('should collect utm data', function () {
    expect(data.utmCampaign).to.exist();
    expect(data.utmContent).to.exist();
    expect(data.utmMedium).to.exist();
    expect(data.utmSource).to.exist();
    expect(data.utmTerm).to.exist();
  });

  it('should collect viewport data', function () {
    expect(data.viewportHeight).to.equal(300);
    expect(data.viewportResolution).to.equal('400x300');
    expect(data.viewportWidth).to.equal(400);
  });

});