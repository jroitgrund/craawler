import fs from 'fs';
import requestPromise from 'request-promise';

import crawlFactory from './lib/crawl';
import fetchLinksAndAssetsFactory from './lib/fetch-links-and-assets';
import format from './lib/format';

const crawl = crawlFactory(fetchLinksAndAssetsFactory(requestPromise));
const url = process.argv[2];

crawl(url).then(urlMap => {
  fs.writeFile(
    'sitemap.html',
    format(url, urlMap));
});
