export default (rootUrl, urlMap) => {
  const seenUrls = { [rootUrl]: true };
  const recursivelyGetNestedStructure = (url) => {
    const structure = { };
    const processRecursively = [];
    if (urlMap[url]) {
      urlMap[url].links.forEach(link => {
        if (!seenUrls[link]) {
          processRecursively.push(link);
          seenUrls[link] = true;
        }
      });
    }

    processRecursively.forEach(link => {
      structure[link] = recursivelyGetNestedStructure(link);
    });
    return structure;
  };

  return { [rootUrl]: recursivelyGetNestedStructure(rootUrl) };
};
