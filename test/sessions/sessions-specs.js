
describe('Gumshoe Sessions', function() {

  this.timeout(5000);

  var sessionId,
    lastSessionId,
    sessionTimeout = 100,
    utmMedium = '';

  function sessionFn (timestamp, difference, query) {
    if (difference > (sessionTimeout)) {
      // console.log('sessionFn: true', difference, sessionTimeout);
      return true;
    }

    // console.log('sessionFn: false', difference, sessionTimeout);
    return false;
  }

  it('should live in the global namespace', function () {
    expect(window.gumshoe).to.exist();

    gumshoe({
      transport: 'spec-transport',
      sessionFn: sessionFn
    });

    sessionId = lastSessionId = gumshoe._.storage('uuid');
  });

  it('should have a uuid in session storage', function (done) {

    setTimeout(function () {
      gumshoe.send('page.view');
    }, 200);

    setTimeout(function () {
      lastSessionId = gumshoe._.storage('uuid');

      expect(sessionId).to.not.equal(lastSessionId);

      sessionId = lastSessionId;

      done();
    }, 300);

  });

  it('should timeout the session and create a new uuid', function (done) {

    setTimeout(function () {
      gumshoe.send('page.view');
    }, 200);

    setTimeout(function () {
      lastSessionId = gumshoe._.storage('uuid');

      expect(sessionId).to.not.equal(lastSessionId);

      done();
    }, 300);

  });

  it('should create a new uuid with utm change', function (done) {

    sessionTimeout = 1000;

    var oldParse = gumshoe._.queryString.parse;

    gumshoe._.queryString.parse = function (query) {
      var result = oldParse.call(this, query);

      result.utm_medium = 'changed';

      return result;
    }

    // sanity check our values before hand
    expect(gumshoe._.storage('utm')).to.exist();
    expect(gumshoe._.storage('utm').medium).to.exist();
    expect(gumshoe._.storage('utm').medium).to.equal('');

    setTimeout(function () {
      gumshoe.send('page.view');
    }, 200);

    setTimeout(function () {
      lastSessionId = gumshoe._.storage('uuid');

      expect(gumshoe._.storage('utm').medium).to.equal('changed');
      expect(sessionId).to.not.equal(lastSessionId);

      done();
    }, 300);

  });

});