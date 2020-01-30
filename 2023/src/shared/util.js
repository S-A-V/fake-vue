/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return true;
}

/**
 * Mix properties into target object.
 */
export function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
}

export function noop() {}
