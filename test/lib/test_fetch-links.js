import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import fetchLinksFactory from '../../src/lib/fetch-links';

/* eslint-disable prefer-arrow-callback, func-names */

chai.use(chaiAsPromised);
chai.should();

describe('fetch-links', function () {
  let fetchLinks;
  let requestPromise;
  const url = 'http://gocardless.com/1/2/3.aspx?foo=true';
  const emptyResult = { links: [], assets: [] };

  beforeEach(function () {
    const requestPromiseApi = { get: () => undefined, head: () => undefined };
    requestPromise = sinon.mock(requestPromiseApi);
    fetchLinks = fetchLinksFactory(requestPromiseApi);
  });

  it('returns an empty list for non-HTML URLs', function () {
    requestPromise.expects('head')
      .once()
      .withArgs(url)
      .returns(Promise.resolve({ 'content-type': 'image/jpg' }));

    return fetchLinks(url).should.eventually.eql(emptyResult);
  });

  it('returns an empty list for unparseable HTML', function () {
    requestPromise.expects('head')
      .once()
      .withArgs(url)
      .returns(Promise.resolve({ 'content-type': 'text/html' }));

    requestPromise.expects('get')
      .once()
      .withArgs(url)
      .returns(Promise.resolve('not<htmlatAll!'));

    return fetchLinks(url).should.eventually.eql(emptyResult);
  });

  it('bubbles up errors', function () {
    requestPromise.expects('head')
      .once()
      .withArgs(url)
      .returns(Promise.reject('error'));

    return fetchLinks(url).should.be.rejected;
  });

  it('returns the links and static assets', function () {
    requestPromise.expects('head')
      .once()
      .withArgs(url)
      .returns(Promise.resolve({ 'content-type': 'text/html' }));

    requestPromise.expects('get')
      .once()
      .withArgs(url)
      .returns(Promise.resolve(`
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
  <body>
    <a href="../foo"></a>
    <a href="/bar"></a>
    <div><a href="bar"></a></div>
    <a href="4/foo"></a>
    <img src="img">
    <link rel="link">
    <script src="script">
  </body>
</html>`));

    return fetchLinks(url).should.eventually.eql({
      links: [
        'http://gocardless.com/1/2/4/foo',
        'http://gocardless.com/1/2/bar',
        'http://gocardless.com/1/foo',
        'http://gocardless.com/bar',
      ],
      assets: [
        'http://gocardless.com/1/2/img',
        'http://gocardless.com/1/2/link',
        'http://gocardless.com/1/2/script',
      ],
    });
  });
});
