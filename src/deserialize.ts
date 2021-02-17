const deserialize = <T extends unknown>(json: string): T => {
  const map = new Map();
  const parsed = JSON.parse(json, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map((x) => {
          if ('$id' in x) {
            if ('$values' in x) {
              const { $id, $values } = x;
              if (!map.has($id)) {
                map.set($id, $values);
              }
              return { $ref: $id };
            } else {
              const { $id, ...val } = x;
              if (!map.has($id)) {
                map.set($id, val);
              }
              return { $ref: $id };
            }
          }
          return x;
        });
      } else {
        if ('$id' in value) {
          if ('$values' in value) {
            const { $id, $values } = value;
            if (!map.has($id)) {
              map.set($id, $values);
            }
            return { $ref: $id };
          } else {
            const { $id, ...val } = value;
            if (!map.has($id)) {
              map.set($id, val);
            }
            return { $ref: $id };
          }
        }
      }
    }
    return value;
  });

  const getRef = (obj: any, refContainer: any) => {
    if (typeof obj === 'object' && obj !== null) {
      if ('$ref' in obj) {
        return refContainer[obj.$ref];
      }
    }
    return obj;
  };

  const replaceRef = (obj: any, refContainer?: any) => {
    refContainer ??= obj;
    if (typeof obj === 'object' && obj !== null) {
      if ('$ref' in obj) {
        return getRef(obj, refContainer);
      }
      if ('$id' in obj) {
        delete obj.$id;
      }
      const keys = Object.keys(obj);
      for (const key of keys) {
        obj[key] = replaceRef(obj[key], refContainer);
      }
    }

    return obj;
  };

  const replacedCache = replaceRef(Object.fromEntries(map));
  return replaceRef(parsed, replacedCache);
};

export { deserialize };
