const colors = require('colors');
const program = require('commander');
const path = require('path');
const co = require('co');
const fs = require('co-fs');
const mkdirp = require('mkdirp');
const mpt = require('./lib/mpt');

let list = function (val) {
    return val.split(',');
};

program.version('0.0.1')
    .usage('[options] <file>')
    .option('-q, --query-list <nubmer>', 'Media query list.', list)
    .option('-u, --ui-width <number>', 'UI/UE given mark width.', 720)
    .option('-b, --base-width <number>', 'Default base width', 320)
    .parse(process.argv);

// console.log(program);

co(function *() {
    let input = yield new Promise((resovle, reject, notify) => {
        let result = [];
        process.stdin.on('readable', () => {
            let buf = process.stdin.read();
            result.push(buf);
            if(null === buf) {
                resovle(result.join(''));
            }
        });
    });
    let tStats = yield program.args.map(file => fs.stat(file));
    let files = program.args.filter((file, i) => tStats[i].isFile());
    let sources = yield files.map(file => fs.readFile(file));
    let parsed = sources.map(source => source.toString('utf8'));
    let source = '';
    if (parsed.length > 0) {
        source = parsed.reduce((prev, next) => prev + '\n' + next);
    }
    let output = mpt({
        source: input + '\n' + source,
        queryList: program.queryList,
        uiWidth: program.uiWidth,
        baseWidth: program.baseWidth
    });
    console.log(output);
}).catch(function (err) {
    console.log(err.stack);
});
