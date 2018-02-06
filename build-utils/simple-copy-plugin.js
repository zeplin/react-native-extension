/* eslint-env node */
const fs = require("fs");
class SimpleCopyPlugin {
    constructor(copies) {
        this.copies = copies;
    }
    apply(compiler) {
        compiler.plugin("emit", (compilation, callback) => {
            compilation.chunks.forEach(chunk => {
                const copyEntries = this.copies[chunk.name];
                if (!copyEntries) {
                    throw new Error(`Copy entry not found`);
                }

                copyEntries.forEach(entry => {
                    let file = fs.readFileSync(entry.from);
                    if (entry.transform && typeof entry.transform === "function") {
                        file = entry.transform(file, chunk.files[0]);                    
                    }
                    compilation.assets[`${entry.to}`] = {
                        source: function () {
                            return file;
                        },
                        size: function () {
                            return file.length;
                        }
                    };
                });
            });
            callback();
        });
    }
}

module.exports = SimpleCopyPlugin;