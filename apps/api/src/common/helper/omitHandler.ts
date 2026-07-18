

export const omitHandler = <T extends Record<string, unknown>>(obj: T): { [K in keyof T]: Exclude<T[K], undefined> } => {
    const result = {} as any;
    for (const key in obj) {
        if (obj[key] !== undefined) {
            result[key] = obj[key]
        }
    }
    return result;
}