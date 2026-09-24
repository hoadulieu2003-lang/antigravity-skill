import { pathToFileURL } from 'node:url';

const KRONOS_MODULES = pathToFileURL('C:/Users/game/.gemini/projects/kronos-01/node_modules/').href;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'react') {
    return nextResolve(`${KRONOS_MODULES}react/index.js`, context);
  }
  if (specifier === 'react-dom/server') {
    return nextResolve(`${KRONOS_MODULES}react-dom/server.node.js`, context);
  }
  if (specifier.startsWith('react/') || specifier.startsWith('react-dom/')) {
    return nextResolve(`${KRONOS_MODULES}${specifier}`, context);
  }
  return nextResolve(specifier, context);
}
