
describe('Gumshoe Sessions', function() {

  this.timeout(5000);

  var sessionId,
    lastSessionId;

  function sessionFn (timestamp, difference, query) {
    if (difference > (100)) {
      return true;
    }

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

});