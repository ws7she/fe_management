let download = require('./download');

export default function exportCSV(dom, fileName, firstCol, lastCol) {
    function escapeCSV(str) {
        return '"' + String(str).replace(/"/g, '""') + '"';
    }


    let ths = $(dom).find('.el-table__header-wrapper th');
    let trs = $(dom).find('.el-table__body-wrapper tr');
    let row = [];
    let length = ths.length;
    ths.each(function(idx) {
        if ((firstCol ? idx > -1 : idx > 0) && (lastCol ? idx < length : idx < length - 1)) {
            let title = $(this).attr('title') || $(this).attr('exportInfo');
            let cell = escapeCSV(title || _.trim($(this).text()));
            row.push(cell);
        }
    });

    let collect = [row];
    trs.each((trIdx, tr) => {
        let tds = $(tr).find('td');
        let row = [];
        console.log(tds)
        tds.each((idx, item) => {
            
            if ((firstCol ? idx > -1 : idx > 0) && (lastCol ? idx < tds.length : idx < tds.length - 1)) {
                let $div = $(item).find('div:first');
                // 如果不存在div，则可能单元格里面直接是文本节点
                if (!$div.length) $div = $(item);
                let title = $div.attr('title');
                // 有些title为undefined字符串
                if (title === 'undefined' || !title) {
                    title = _.trim($div.text());
                }
                row.push(escapeCSV(title));
            }
        });
        collect.push(row);
    });

    // console.log(collect, download.download);

    download.download('\uFEFF' + collect.join('\r\n'), fileName + '.csv', 'text/csv;charset=UTF-8');
}
