import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

import crawlFactory from '../../src/lib/crawl';

/* eslint-disable prefer-arrow-callback, func-names */

chai.use(chaiAsPromised);
chai.should();

describe('crawl', function () {
  let crawl;
  let fetchLinksAndAssets;

  beforeEach(function () {
    fetchLinksAndAssets = sinon.stub();
    crawl = crawlFactory(fetchLinksAndAssets);
  });

  it('returns a map from url to link', function () {
    fetchLinksAndAssets.withArgs('url').returns(
      Promise.resolve({ links: ['url2', 'url3'], assets: [] }));
    fetchLinksAndAssets.withArgs('url2').returns(
      Promise.resolve({ links: ['url4'], assets: ['foo', 'baz'] }));
    fetchLinksAndAssets.withArgs('url3').returns(Promise.resolve({ links: [], assets: [] }));
    fetchLinksAndAssets.withArgs('url4').returns(Promise.resolve({ links: [], assets: [] }));
    return crawl('url').then(siteMap => {
      siteMap.should.eql({
        url: { links: ['url2', 'url3'], assets: [] },
        url2: { links: ['url4'], assets: ['foo', 'baz'] },
      });
      fetchLinksAndAssets.callCount.should.eql(4);
    });
  });

  it('doesn\'t crawl the same URL twice', function () {
    fetchLinksAndAssets.withArgs('http://url').returns(
      Promise.resolve({ links: ['http://url'], assets: [] }));
    return crawl('http://url').then(siteMap => {
      siteMap.should.eql({
        ['http://url']: { links: ['http://url'], assets: [] },
      });
      fetchLinksAndAssets.callCount.should.eql(1);
    });
  });

  it('doesn\'t crawl different domains', function () {
    fetchLinksAndAssets.withArgs('http://gocardless.com').returns(
      Promise.resolve({ links: ['http://uselotsofcards.evilbiz/'], assets: [] }));
    return crawl('http://gocardless.com').then(siteMap => {
      siteMap.should.eql({
        ['http://gocardless.com']: { links: ['http://uselotsofcards.evilbiz/'], assets: [] },
      });
      fetchLinksAndAssets.callCount.should.eql(1);
    });
  });
});
