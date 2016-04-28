import jade from 'jade';

import nest from './nest';

export default (rootUrl, urlMap) => {
  const fn = jade.compileFile('src/lib/template.jade');
  const html = fn({
    urlMap,
    nestedUrls: nest(rootUrl, urlMap),
  });
  return html;
};
