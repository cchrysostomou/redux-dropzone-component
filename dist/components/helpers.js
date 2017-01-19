export const Helpers = {
    getErrorMessage: (error) => {
        if (typeof error === "string"){
            return error
        }

        if (Object.prototype.toString.call(error) === '[object Object]') {
            if ('detail' in error){
                console.log(error)
                return error['detail']
            }
        }

        console.error('Couldnt figure out what the error message was!')
        console.log(error)
        return error
    },


    filesize: function(size, filesizeBase=1000) {
      var cutoff, i, selectedSize, selectedUnit, unit, units, _i, _len;
      selectedSize = 0;
      selectedUnit = "b";
      if (size > 0) {
        units = ['TB', 'GB', 'MB', 'KB', 'b'];
        for (i = _i = 0, _len = units.length; _i < _len; i = ++_i) {
          unit = units[i];
          cutoff = Math.pow(filesizeBase, 4 - i) / 10;
          if (size >= cutoff) {
            selectedSize = size / Math.pow(filesizeBase, 4 - i);
            selectedUnit = unit;
            break;
          }
        }
        selectedSize = Math.round(10 * selectedSize) / 10;
      }
      return selectedSize + " " + selectedUnit;
    },
    /**
     * Clone of jQuery's extend
     * Usage: extend(true, {}, obj1, obj2)
    */
    extend: function () {
        var options, name, src, copy, copyIsArray, clone, self = this,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false,
            // helper which replicates the jquery internal functions
            objectHelper = {
                hasOwn: Object.prototype.hasOwnProperty,
                class2type: {},

                type: function (obj) {
                    return obj == null ?
                        String(obj) :
                        objectHelper.class2type[Object.prototype.toString.call(obj)] || 'object';
                },

                isPlainObject: function (obj) {
                    var key;

                    if (!obj || objectHelper.type(obj) !== 'object' || obj.nodeType || objectHelper.isWindow(obj)) {
                        return false;
                    }

                    try {
                        if (obj.constructor &&
                            !objectHelper.hasOwn.call(obj, 'constructor') &&
                            !objectHelper.hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                            return false;
                        }
                    } catch (e) {
                        return false;
                    }

                    return key === undefined || objectHelper.hasOwn.call(obj, key);
                },

                isArray: Array.isArray || function (obj) {
                    return objectHelper.type(obj) === 'array';
                },

                isFunction: function (obj) {
                    return objectHelper.type(obj) === 'function';
                },

                isWindow: function (obj) {
                    return obj != null && obj == obj.window;
                }
            };

        // Handle a deep copy situation
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== 'object' && !objectHelper.isFunction(target)) {
            target = {};
        }

        // If no second argument is used then this can extend an object that is using this method
        if (length === i) {
            target = self;
            --i;
        }

        for (; i < length; i = i + 1) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (objectHelper.isPlainObject(copy) || (copyIsArray = objectHelper.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && objectHelper.isArray(src) ? src : [];
                        } else {
                            clone = src && objectHelper.isPlainObject(src) ? src : {};
                        }

                        target[name] = this.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    }
}
