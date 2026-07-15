
export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode,
            Error.captureStackTrace(this, this.constructor);
    }
}

export const getEnvVar = (key: string) => {
    const value = process.env[key]
    if(!value){
        throw new Error(`missing env key : ${key}`)
    }
    return value;
}