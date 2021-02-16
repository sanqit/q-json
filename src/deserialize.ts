const deserialize = <T extends unknown>(text: string): T => {
    const cache = {} as any;
    const parsed = JSON.parse(text, (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (Array.isArray(value)) {
                return value.map((x) => {
                    if ("$id" in x) {
                        if ("$values" in x) {
                            let { $id, $values } = x;
                            cache[`"${$id}"`] = $values;
                            return { $ref: $id };
                        } else {
                            let { $id, ...val } = x;
                            cache[`"${$id}"`] = val;
                            return x;
                        }
                    }
                    return x;
                });
            } else {
                if ("$id" in value) {
                    if ("$values" in value) {
                        let { $id, $values } = value;
                        cache[`"${$id}"`] = $values;
                        return { $ref: $id };
                    } else {
                        let { $id, ...val } = value;
                        cache[`"${$id}"`] = val;
                        return value;
                    }
                }
            }
        }
        return value;
    });

    const getRef = (obj: any, refContainer: any) => {
        if (typeof obj === "object" && obj !== null) {
            if ("$ref" in obj) {
                return refContainer[`"${obj.$ref}"`];
            }
        }
        return obj;
    };

    const replaceRef = (obj: any, refContainer: any) => {
        if (typeof obj === "object" && obj !== null) {
            if ("$ref" in obj) {
                return getRef(obj, refContainer);
            }
            if ("$id" in obj) {
                delete obj.$id;
            }
            const keys = Object.keys(obj);
            for (const key of keys) {
                obj[key] = replaceRef(obj[key], refContainer);
            }
        }

        return obj;
    };

    const replacedCache = replaceRef(cache, cache);
    return replaceRef(parsed, replacedCache);
}

export { deserialize };