interface JsonOptions {
  space?: string | number
}

const serialize = (value: any, jsonOptions?: JsonOptions) => {
  const getCircularReplacer = () => {
    const map = new Map();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        const id = `${Array.from(map.keys()).length + 1}`;
        if (Array.isArray(value)) {
          if(map.has(value)){
            return value;
          }

          const newValue = [...value];
          map.set(newValue, { $id: id, $values: value });
          return { $id: id, $values: newValue };
        } else {
          if (map.has(value)) {
            return { $ref: `${map.get(value).$id}` };
          }
          map.set(value, { $id: id, ...value });
          return { $id: id, ...value }
        }
      }
      return value;
    };
  };

  const json = JSON.stringify(value, getCircularReplacer(), jsonOptions?.space);
  return json;
}

export { serialize };