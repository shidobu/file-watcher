var chokidar = require('chokidar');
var fs = require('fs');
var anymatch = require('anymatch');

module.exports = class Watcher {
    constructor(log) {
        this.log = log || console.log.bind(console);
        this.watcher = null;
    }

    dispose() {
        this.watcher.close();
        this.watcher = null;
    }

    watch(source, output, includeInitial, includedPatterns, ignoredPatterns) {
        this.watcher = chokidar.watch(source, {
            cwd: source,
            ignoreInitial: !includeInitial,
            persistent: true,
            ignored: ignoredPatterns
        });

        this.watcher
            .on('add', (path) => Watcher.addFile(path, this.log, source, output))
            .on('addDir', (path) => Watcher.addDirectory(path, this.log, source, output))
            .on('change', (path) => Watcher.updateFile(path, this.log, source, output))
            .on('unlink', (path) => Watcher.unlinkFile(path, this.log, source, output))
            .on('unlinkDir', (path) => Watcher.unlinkDirectory(path, this.log, source, output))
            .on('error', (error) => Watcher.onError(error, this.log, source, output))
            .on('ready', () => this.log('Info', 'Initial scan complete. Ready for changes.'));

        return this.watcher;
    }

    static addFile(path, log, source, output) {
        log('File', path, 'added');
        var sourceFile = `${source}/${path}`;
        var outFile = `${output}/${path}`;

        Watcher.createDirectory(path, source, output, () => {
            Watcher.copy(sourceFile, outFile);
        });
    }

    static updateFile(path, log, source, output) {
        log('File', path, 'updated');
        var sourceFile = `${source}/${path}`;
        var outFile = `${output}/${path}`;

        Watcher.createDirectory(path, source, output, () => {
            var p = Watcher.copy(sourceFile, outFile);
        });
    }

    static unlinkFile(path, log, source, output) {
        log('File', path, 'unlinked');
        var outFile = `${output}/${path}`;
        fs.removeSync(outFile);
    }

    static addDirectory(path, log, source, output) {
        log('Directory', path, 'added');

        Watcher.createDirectory(path, source, output, () => {});
    }

    static unlinkDirectory(path, log, source, output) {
        log('Directory', path, 'unlinked');
    }

    static onError(error, log, source, output) {
        log('Error', error);
    }

    static copy(from, to) {
        return new Promise(function(resolve, reject) {
            fs.access(from, fs.F_OK, function(error) {
                if (error) {
                    reject(error);
                } else {
                    var inputStream = fs.createReadStream(from);
                    var outputStream = fs.createWriteStream(to);

                    function rejectCleanup(error) {
                        inputStream.destroy();
                        outputStream.end();
                        reject(error);
                    }

                    inputStream.on('error', rejectCleanup);
                    outputStream.on('error', rejectCleanup);

                    outputStream.on('finish', resolve);

                    inputStream.pipe(outputStream);
                }
            });
        });
    }

    static createDirectory(path, source, output, callback) {
        fs.stat(`${source}/${path}`, (err, stats) => {
            if (err != null) {
                callback(err);
            } else {

                var isFile = stats.isFile();
                fs.stat(`${output}/${path}`, (err, stats) => {
                    if (err != null) {
                        var parts = path.split(/[\/\\]/);

                        var fileName = null;
                        if (isFile) {
                            fileName = parts.pop();
                        }

                        if (parts.length == 1) {
                            console.log(`Creating directory part: ${parts.join('/')}`);
                            fs.mkdir(`${output}/${parts[0]}`, (err) => {
                                callback();
                            });
                        } else if (parts.length == 0) {
                            callback("Directory not created.")
                        } else {
                            var currentPart = parts.pop();
                            Watcher.createDirectory(parts.join('/'), source, output, () => {
                                console.log(`Creating directory part: ${parts.join('/')}`);
                                fs.mkdir(`${output}/${parts.join('/')}/${currentPart}`, (err) => {
                                    callback();
                                });
                            });
                        }
                    } else {
                        callback();
                    }
                });
            }
        });
    }
}