import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import crawlFactory from '../../src/lib/crawl';

/* eslint-disable prefer-arrow-callback, func-names */

chai.use(chaiAsPromised);
chai.should();

describe('crawl', function () {
  let crawl;
  let fetchLinks;

  beforeEach(function () {
    fetchLinks = sinon.stub();
    crawl = crawlFactory(fetchLinks);
  });

  it('returns a map from url to link', function () {
    fetchLinks.withArgs('url').returns(Promise.resolve(['url2', 'url3']));
    fetchLinks.withArgs('url2').returns(Promise.resolve(['url4']));
    fetchLinks.withArgs('url3').returns(Promise.resolve([]));
    fetchLinks.withArgs('url4').returns(Promise.resolve([]));
    crawl('url').should.eventually.eql({
      url: ['url2', 'url3'],
      url2: ['url4'],
    });
  });

  it('is error resilient, ignoring URLs it can\'t crawl', function () {
    fetchLinks.withArgs('url').returns(Promise.resolve(['url2', 'url3']));
    fetchLinks.withArgs('url2').returns(Promise.resolve(['url4']));
    fetchLinks.withArgs('url3').returns(Promise.reject());
    fetchLinks.withArgs('url4').returns(Promise.resolve([]));
    crawl('url').should.eventually.eql({
      url: ['url2', 'url3'],
      url2: ['url4'],
    });
  });
});
