// Generated by CoffeeScript 1.9.0
var Manifest, StackApplication, cozydb;

cozydb = require('cozydb');

Manifest = require('../lib/manifest').Manifest;

module.exports = StackApplication = cozydb.getModel('StackApplication', {
  name: String,
  version: String,
  lastVersion: String,
  git: String
});

StackApplication.all = function(params, callback) {
  return StackApplication.request("all", params, callback);
};

StackApplication.prototype.checkForUpdate = function(callback) {
  var manifest, setFlag;
  setFlag = (function(_this) {
    return function(repoVersion) {
      return _this.updateAttributes({
        lastVersion: repoVersion
      }, function(err) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, true);
        }
      });
    };
  })(this);
  manifest = new Manifest();
  return manifest.download(this, (function(_this) {
    return function(err) {
      var repoVersion;
      if (err) {
        return callback(err);
      } else {
        repoVersion = manifest.getVersion();
        if (repoVersion == null) {
          return callback(null, false);
        } else if (_this.version == null) {
          return setFlag(repoVersion);
        } else if (_this.version !== repoVersion) {
          return setFlag(repoVersion);
        } else {
          return callback(null, false);
        }
      }
    };
  })(this));
};
