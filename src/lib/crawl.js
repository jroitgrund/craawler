import urlLib from 'url';

const sameDomain = (link1, link2) => urlLib.parse(link1).host === urlLib.parse(link2).host;

export default fetchLinksAndAssetsAndAssets => rootUrl => {
  const urlMap = {};
  const recursiveFetch = url => fetchLinksAndAssetsAndAssets(url)
    .then(linksAndAssets => {
      if (linksAndAssets.links.length > 0 || linksAndAssets.assets.length > 0) {
        urlMap[url] = linksAndAssets;
      }

      return Promise.all(
        linksAndAssets.links
          .filter(link => urlMap[link] === undefined && sameDomain(rootUrl, link))
          .map(recursiveFetch));
    }); // No need to catch, we can just silently stop crawling for that URL.

  // The return value is just a bunch of nested empty arrays, what we want to return is the map.
  return recursiveFetch(rootUrl).then(() => urlMap);
};
