import urlLib from 'url';

const sameDomain = (link1, link2) => urlLib.parse(link1).host === urlLib.parse(link2).host;

const removeProtocol = url => {
  const parsedUrl = urlLib.parse(url);
  parsedUrl.protocol = '';
  return parsedUrl.format();
};

export default fetchLinksAndAssetsAndAssets => rootUrl => {
  const urlMap = {};
  const seenUrls = { [removeProtocol(rootUrl)]: true };
  const recursiveFetch = url => fetchLinksAndAssetsAndAssets(url)
    .then(linksAndAssets => {
      if (linksAndAssets.links.length > 0 || linksAndAssets.assets.length > 0) {
        urlMap[url] = linksAndAssets;
      }

      return Promise.all(
        linksAndAssets.links
          .filter(link => !seenUrls[removeProtocol(link)] && sameDomain(rootUrl, link))
          .map(link => {
            seenUrls[removeProtocol(link)] = true;
            return link;
          })
          .map(recursiveFetch));
    }); // No need to catch, we can just silently stop crawling for that URL.

  // The return value is just a bunch of nested empty arrays, what we want to return is the map.
  return recursiveFetch(rootUrl).then(() => urlMap);
};
