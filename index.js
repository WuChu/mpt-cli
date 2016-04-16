var colors = require('colors');
var program = require('commander');
var path = require('path');
var co = require('co');
var fs = require('co-fs');
var mkdirp = require('mkdirp');
var mpt = require('./lib/mpt');

var list = function (val) {
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
    var tStats = yield program.args.map(file => fs.stat(file));
    var files = program.args.filter((file, i) => tStats[i].isFile());
    var sources = yield files.map(file => fs.readFile(file));
    var source = sources.map(source => source.toString('utf8')).reduce((prev, next) => prev + '\n' + next);
    var output = mpt({
        source: source,
        queryList: program.queryList,
        uiWidth: program.uiWidth,
        baseWidth: program.baseWidth
    });
    console.log(output);
}).catch(function (err) {
    console.log(err.stack);
});
