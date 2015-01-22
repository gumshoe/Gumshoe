
describe('Gumshoe', function() {

  this.timeout(5000);

  var data;

  it('should live in the global namespace', function () {
    expect(window.gumshoe).to.exist();
  });

  it('should expose properties', function () {
    expect(gumshoe.version).to.exist();

    gumshoe({ transport: 'spec-transport', queueTimeout: 1000 });
  });

  it('should expose internal properties', function () {
    expect(gumshoe.__internal__).to.exist();
    expect(gumshoe.__internal__.config).to.exist();
    expect(gumshoe.__internal__.storage).to.exist();
    expect(gumshoe.__internal__.transports).to.exist();
  });

  it('should set configuration', function () {
    expect(gumshoe.__internal__.config.queueTimeout).to.equal(1000);
    expect(gumshoe.__internal__.config.transport).to.include('spec-transport');
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
    expect(data.screenAvailHeight).to.be.above(0);
    expect(data.screenAvailWidth).to.be.above(0);
    expect(data.screenHeight).to.be.above(0);
    expect(data.screenOrientationAngle).to.exist();
    expect(data.screenOrientationType).to.exist();
    expect(data.screenPixelDepth).to.equal('32');
    expect(data.screenResolution).to.have.length.above(0);
    expect(data.screenWidth).to.be.above(0);
  });

  it('should collect utm data', function () {
    expect(data.utmCampaign).to.exist();
    expect(data.utmContent).to.exist();
    expect(data.utmMedium).to.exist();
    expect(data.utmSource).to.exist();
    expect(data.utmTerm).to.exist();
  });

  it('should collect viewport data', function () {
    expect(data.viewportHeight).to.be.above(0);
    expect(data.viewportResolution).to.have.length.above(0);
    expect(data.viewportWidth).to.be.above(0);
  });

  it('should fetch data from the transport.map method', function () {
    data = gumshoe.__internal__.transports['spec-transport'].map(data);

    expect(data.newProp).to.equal(1);
    expect(data.ipAddress).to.equal('192.168.1.1');
  });

  it('should have a uuid in session storage', function () {
    expect(gumshoe.__internal__.storage('uuid')).to.exist();
    expect(gumshoe.__internal__.storage('uuid')).to.have.length.above(0);
  });

  it('should queue events', function (done) {
    gumshoe.send('page.view', { foo: 'bar'});

    expect(gumshoe.__internal__.queue).to.have.length(1);

    var nevent = gumshoe.__internal__.queue[0];

    expect(nevent).to.exist();
    expect(nevent.eventName).to.equal('page.view');
    expect(nevent.transportName).to.equal('spec-transport');
    expect(nevent.data).to.exist();
    expect(nevent.data.eventData).to.exist();
    expect(nevent.data.pageData).to.exist();
    expect(nevent.data.timestamp).to.be.above(0);
    expect(nevent.data.timezoneOffset).to.exist();
    expect(nevent.data.uuid).to.have.length.above(0);

    expect(nevent.data.eventName).to.equal('page.view');
    expect(JSON.parse(nevent.data.eventData).foo).to.equal('bar');
    expect(nevent.data.newProp).to.equal(1);
    expect(nevent.data.ipAddress).to.equal('192.168.1.1');

    setTimeout(function () {
      // queue should be empty after our test event has been 'sent'
      expect(gumshoe.__internal__.queue).to.have.length(0);
      done();
    }, 1100);
  });

});