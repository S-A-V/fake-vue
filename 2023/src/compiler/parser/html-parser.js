// 匹配属性，形如：id="app"
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 匹配标签名，形如：abc-123
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// 匹配特殊标签，形如：abc:234，前面的 abc: 可有可无
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 匹配标签开始，形如：<abc-123，捕获里面的标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 匹配标签结束，>
const startTagClose = /^\s*(\/?)>/;
// 匹配标签结尾，形如：</abc-123>，捕获里面的标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

export { attribute, startTagOpen, startTagClose, endTag };
