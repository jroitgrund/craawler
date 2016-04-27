export default fetchLinks => rootUrl => {
  const urlMap = {};
  const recursiveFetch = url => fetchLinks(url)
    .then(links => {
      if (links.length > 0) {
        urlMap[url] = links;
      }

      return Promise.all(
        links.filter(link => urlMap[link] === undefined).map(recursiveFetch));
    }); // No need to catch, we can just silently stop crawling for that URL.

  // The return value is just a bunch of nested empty arrays, what we want to return is the map.
  return recursiveFetch(rootUrl).then(() => urlMap);
};
