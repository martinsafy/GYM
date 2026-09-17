// بيلف أي async function عشان منكتبش try/catch في كل كنترولر
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
