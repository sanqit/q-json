interface JsonOptions{
    space?: string | number
}

const serialize = (value: any, jsonOptions?: JsonOptions) => {
    const cache: any = [];
    return JSON.stringify(
      value,
      (key, value) => {
        if (typeof value === "object" && value !== null) {
          let ref = 0;

          if (Array.isArray(value)) {
            if (cache.includes(value)) {
              return value;
            }
            cache.push(value);
            return { $id: `${cache.length}`, $values: value };
          }

          if (cache.includes(value)) {
            ref = cache.indexOf(value) + 1;
            return { $ref: `${ref}` };
          }

          if (Array.isArray(value)) {
            cache.push(value);
            return { $id: `${cache.length}`, $values: value };
          } else {
            // Store value in our collection
            cache.push(value);
            return { $id: `${cache.length}`, ...value };
          }
        }
        return value;
      },
      jsonOptions?.space
    );
}

export { serialize };