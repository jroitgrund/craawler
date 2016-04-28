export default (rootUrl, urlMap) => {
  console.log(urlMap);
  const seenUrls = { [rootUrl]: true };
  const recursivelyGetNestedStructure = (rootUrl, urlMap) => {
    const structure = { };
    const processRecursively = [];
    urlMap[rootUrl] && urlMap[rootUrl].links.forEach(link => {
      if (!seenUrls[link]) {
        processRecursively.push(link);
        seenUrls[link] = true;
      }
    });
    processRecursively.forEach(link => {
      structure[link] = recursivelyGetNestedStructure(link, urlMap);
    });
    return structure;
  };

  return { [rootUrl]: recursivelyGetNestedStructure(rootUrl, urlMap) };
};
