// Generated by CoffeeScript 1.9.0
var request;

request = require('request');

module.exports.get = function(req, res) {
  return req.pipe(request(req.query.url)).pipe(res);
};
