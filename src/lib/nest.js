export default (rootUrl, urlMap) => {
  let nextUrlId = 0;
  const urlIds = { [rootUrl]: nextUrlId };
  const nestedUrls = { [rootUrl]: {} };
  const toProcess = [{ url: rootUrl, into: nestedUrls[rootUrl] }];
  while (toProcess.length > 0) {
    const { url, into } = toProcess.shift();
    if (urlMap[url]) {
      for (const link of urlMap[url].links) {
        if (urlIds[link] === undefined) {
          into[link] = {};
          toProcess.push({ url: link, into: into[link] });
          urlIds[link] = ++nextUrlId;
        }
      }
    }
  }

  return { nestedUrls, urlIds };
};
