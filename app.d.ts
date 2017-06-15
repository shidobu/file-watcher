declare module '@node/path' {
    import path = require("path");
    export = path;
}

declare module "@node/fs" {
    import * as fs from 'fs';
    export = fs;
}