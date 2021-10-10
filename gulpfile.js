const { series,parallel } = require('gulp');
require('require-dir')('./gulpTasks');

exports.default = series(
    'clean',
    parallel(
        'cssTransfer',
        'jsonTransfer',
        'wxmlTransfer',
        'jsTransfer',
        'tsTransfer',
        'wxsTransfer')
    );
