import { isNil } from "lodash-es";

type Extractor<T> = (t: T) => string

/**
 * Created an associative object
 * @param list list to transform to object
 * @param associateBy key extractor
 * @returns 
 */
export function associateBy<T>(list: T[]|undefined, associateBy: Extractor<T>): { [key: string]: T } {
  if (isNil(list)) return {}
  const map: { [key: string]: T } = {};
  list.forEach(it => {
    map[associateBy(it)] = it;
  });
  return map;
}