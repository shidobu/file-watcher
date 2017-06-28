
export function isDev(): boolean {
    return process.mainModule.filename.indexOf('app.asar') === -1;
};
