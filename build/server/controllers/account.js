// Generated by CoffeeScript 1.9.1
var Adapter, CozyInstance, EMAILREGEX, User, adapter, utils;

utils = require('../lib/passport_utils');

Adapter = require('../lib/adapter');

User = require('../models/user');

CozyInstance = require('../models/cozyinstance');

adapter = new Adapter();

EMAILREGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
  updateAccount: function(req, res, next) {
    var updateData, updatePassword;
    updateData = function(user, body, data, cb) {
      var errors;
      if (body.timezone != null) {
        data.timezone = body.timezone;
      }
      if (body.public_name != null) {
        data.public_name = body.public_name;
      }
      if ((body.email != null) && body.email.length > 0) {
        if (EMAILREGEX.test(body.email)) {
          data.email = body.email;
        } else {
          errors = ["Given email is not a proper email"];
          return cb(null, errors);
        }
      }
      if (data.timezone || data.email || data.password || data.public_name) {
        return adapter.updateUser(user, data, function(err) {
          return cb(err, null);
        });
      } else {
        return cb(null);
      }
    };
    updatePassword = function(user, body, data, cb) {
      var errors, newPassword, newPassword2, oldPassword;
      oldPassword = body.password0;
      newPassword = body.password1;
      newPassword2 = body.password2;
      if (!((newPassword != null) && newPassword.length > 0)) {
        return cb(null);
      }
      errors = [];
      if (!utils.checkPassword(oldPassword, user.password)) {
        errors.push("The current password is incorrect.");
      }
      if (newPassword !== newPassword2) {
        errors.push("The new passwords don't match.");
      }
      if (!(newPassword.length > 5)) {
        errors.push("The new password is too short.");
      }
      if (errors.length) {
        return cb(null, errors);
      }
      data.password = utils.cryptPassword(newPassword);
      return adapter.updateKeys(newPassword, cb);
    };
    return User.all(function(err, users) {
      var data, user;
      if (err) {
        next(err);
      }
      if (users.length === 0) {
        return res.send(400, {
          error: "No user registered"
        });
      }
      user = users[0];
      data = {};
      return updatePassword(user, req.body, data, (function(_this) {
        return function(libErr, userErr) {
          if (libErr) {
            return res.send(500, {
              error: libErr
            });
          }
          if (userErr) {
            return res.send(400, {
              error: userErr
            });
          }
          return updateData(user, req.body, data, function(libErr, userErr) {
            if (libErr) {
              return res.send(500, {
                error: libErr
              });
            }
            if (userErr) {
              return res.send(400, {
                error: userErr
              });
            }
            return res.send({
              success: true,
              msg: 'Your new password is set'
            });
          });
        };
      })(this));
    });
  },
  users: function(req, res, next) {
    return User.all(function(err, users) {
      if (err) {
        return res.send(500, {
          error: "Retrieve users failed."
        });
      } else {
        return res.send({
          rows: users
        });
      }
    });
  },
  instances: function(req, res, next) {
    return CozyInstance.all(function(err, instances) {
      if (err) {
        return res.send(500, {
          error: "Retrieve instances failed."
        });
      } else {
        return res.send({
          rows: instances
        });
      }
    });
  },
  updateInstance: function(req, res, next) {
    var background, domain, helpUrl, locale, ref;
    ref = req.body, domain = ref.domain, locale = ref.locale, helpUrl = ref.helpUrl, background = ref.background;
    if ((domain != null) || (locale != null) || (helpUrl != null) || (background != null)) {
      return CozyInstance.all(function(err, instances) {
        var data;
        data = {
          domain: domain,
          locale: locale,
          helpUrl: helpUrl,
          background: background
        };
        if (err) {
          return next(err);
        } else if (instances.length === 0) {
          return CozyInstance.create(data, function(err, instance) {
            if (err) {
              return next(err);
            } else {
              return res.send({
                success: true,
                msg: 'Instance updated.'
              });
            }
          });
        } else {
          return instances[0].updateAttributes(data, function() {
            return res.send({
              success: true,
              msg: 'Instance updated.'
            });
          });
        }
      });
    } else {
      return res.send(400, {
        error: true,
        msg: 'No accepted parameter given'
      });
    }
  }
};
