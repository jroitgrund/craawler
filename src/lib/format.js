import jade from 'jade';

import nest from './nest';

export default (rootUrl, urlMap) => {
  const fn = jade.compileFile('src/lib/template.jade');
  const { nestedUrls, urlIds } = nest(rootUrl, urlMap);
  const html = fn({
    rootUrl,
    urlMap,
    nestedUrls,
    urlIds,
  });
  return html;
};
