export default (rootUrl, urlMap) => {
  const seenUrls = { [rootUrl]: true };
  const structure = { [rootUrl]: {} };
  const toProcess = [{ url: rootUrl, into: structure[rootUrl] }];
  while (toProcess.length > 0) {
    const { url, into } = toProcess.shift();
    if (urlMap[url]) {
      urlMap[url].links.forEach(link => {
        if (!seenUrls[link]) {
          into[link] = {};
          toProcess.push({ url: link, into: into[link] });
          seenUrls[link] = true;
        }
      });
    }
  }

  return structure;
};
