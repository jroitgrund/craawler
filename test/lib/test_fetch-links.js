import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cheerio from 'cheerio';
import sinon from 'sinon';

import fetchLinksFactory from '../../src/lib/fetch-links';

/* eslint-disable prefer-arrow-callback, func-names */

chai.use(chaiAsPromised);
chai.should();

describe('fetch-links', function () {
  let fetchLinks;
  let requestPromise;
  const url = 'url';

  beforeEach(function () {
    const requestPromiseApi = { get: () => undefined, head: () => undefined };
    requestPromise = sinon.mock(requestPromiseApi);
    fetchLinks = fetchLinksFactory(cheerio, requestPromiseApi);
  });

  it('returns an empty list for non-HTML URLs', function () {
    requestPromise.expects('head')
      .once()
      .withArgs(url)
      .returns(Promise.resolve({ 'content-type': 'image/jpg' }));

    return fetchLinks(url).should.eventually.eql([]);
  });

  it('bubbles up errors', function () {
    requestPromise.expects('head')
      .once()
      .withArgs(url)
      .returns(Promise.reject('error'));

    return fetchLinks(url).should.be.rejected;
  });

  it('returns a list of found links for HTML URLs', function () {
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
    <a href="foo"></a>
    <div><a href="bar"></a></div>
  </body>
</html>`));

    return fetchLinks(url).then(urls => urls.sort()).should.eventually.eql(['bar', 'foo']);
  });
});
