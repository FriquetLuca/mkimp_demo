export function deepClone<T>(value: T, weakMap = new WeakMap()): T {
  // Handle null, undefined, primitives
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Return cached copy for circular references
  if (weakMap.has(value)) {
    return weakMap.get(value);
  }

  // Handle Array
  if (Array.isArray(value)) {
    const arrClone: any[] = [];
    weakMap.set(value, arrClone);
    for (const item of value) {
      arrClone.push(deepClone(item, weakMap));
    }
    return arrClone as any;
  }

  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as any;
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as any;
  }

  // Handle Function (clone by reference)
  if (typeof value === 'function') {
    return value;
  }

  // Handle DOM Nodes
  if (typeof Node !== 'undefined' && value instanceof Node) {
    return value.cloneNode(true) as any;
  }

  // Handle Map
  if (value instanceof Map) {
    const mapClone = new Map();
    weakMap.set(value, mapClone);
    value.forEach((v, k) => {
      mapClone.set(deepClone(k, weakMap), deepClone(v, weakMap));
    });
    return mapClone as any;
  }

  // Handle Set
  if (value instanceof Set) {
    const setClone = new Set();
    weakMap.set(value, setClone);
    value.forEach((v) => {
      setClone.add(deepClone(v, weakMap));
    });
    return setClone as any;
  }

  // Handle WeakMap (clone as same reference)
  if (value instanceof WeakMap) {
    return value as any;
  }

  // Handle WeakSet (same as WeakMap)
  if (value instanceof WeakSet) {
    return value as any;
  }

  // Handle plain objects
  if (value instanceof Object) {
    const objClone: any = {};
    weakMap.set(value, objClone);
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        objClone[key] = deepClone((value as any)[key], weakMap);
      }
    }
    return objClone;
  }

  throw new Error(`Unsupported type: ${Object.prototype.toString.call(value)}`);
}
