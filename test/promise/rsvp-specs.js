
describe('Gumshoe Promise - rsvp.js', function() {

  this.timeout(5000);

  var ready = false;

  it('should find RSVP', function () {
    expect(RSVP).to.exist();
  });

  it('should not find Gumshoe', function () {
    expect(window.gumshoe).to.not.exist();
  });

  it('should setup the Promise for Gumshoe', function () {

    window.gumshoe = {
      ready: RSVP.defer()
    };

    expect(window.gumshoe.ready).to.be.a('object');
    expect(window.gumshoe.ready.promise).to.be.a('object');
    expect(window.gumshoe.ready.promise.then).to.be.a('function');
  });

  it('should wait for Gumshoe, execute when Gumshoe resolves.', function (done) {

    window.gumshoe.ready.promise.then(function () {
      done();
    });
  });

});