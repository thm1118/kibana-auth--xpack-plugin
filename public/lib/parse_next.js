import {parse} from 'url';

export default (location) => {
  const {query, hash} = parse(location.href, true);
  if (query.next) return query.next + (hash || '');
  return '/';
};
