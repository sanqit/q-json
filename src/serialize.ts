interface JsonOptions {
  space?: string | number;
}

const serialize = (value: any, jsonOptions?: JsonOptions) => {
  const getCircularReplacer = () => {
    const map = new Map();
    return (key, val) => {
      if (typeof val === 'object' && val !== null) {
        const id = `${Array.from(map.keys()).length + 1}`;
        if (Array.isArray(val)) {
          if (map.has(val)) {
            return val;
          }

          const newValue = [...val];
          map.set(newValue, { $id: id, $values: val });
          return { $id: id, $values: newValue };
        } else {
          if (map.has(val)) {
            return { $ref: `${map.get(val).$id}` };
          }
          map.set(val, { $id: id, ...val });
          return { $id: id, ...val };
        }
      }
      return val;
    };
  };

  const json = JSON.stringify(value, getCircularReplacer(), jsonOptions?.space);
  return json;
};

export { serialize };
