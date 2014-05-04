/**
 * @file 工具类
 *
 * @author jinzhiwei
 */
define(function (require) {
    var util = {};
    
    util.format = function () {
        var cache = {};
     
        return function tmpl(str, data){
       
        var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
            tmpl(document.getElementById(str).innerHTML) :
         
         
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
           
           
            "with(obj){p.push('" +
           
            //\n = new line 
            //\r = carriage return 
            //\t = tab 
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");
       

        return data ? fn( data ) : fn;
      };
    }();
    
    util.getType = function (obj) {
        var class2Type = {};
        
        'Boolean Number String Object Array Function Error Date RegExp'.replace(/[^, ]+/g, function (name) {
            class2Type['[object ' + name + ']'] = name.toLowerCase();
        });
        
        if (obj == null) {
            return String(obj);
        }
        
        return class2Type[Object.prototype.toString.call(obj)];
    }
    
    util.mix = function () {
        var option, src, copy, clone, name, copyIsArray;
        var me = this,
            target = arguments[0] || {},
            length = arguments.length,
            i = 1,
            deep = false;
        
        //深拷贝
        if (typeof target === 'boolean') {
            deep = true;
            target = arguments[1] || {};
            i++;
        }
        
        if (typeof target !== 'object') {
            target = {};
        }
        
        if (i === length) {
            target = this;
            i--;
        }
        
        for (; i < length; i++) {
            if ((option = arguments[i]) != null) {
                for (name in option) {
                    src = target[name];
                    copy = option[name];
                    if (option === target) {
                        continue
                    }
                    if (deep 
                        && copy 
                        && ((copyIsArray = me.getType(copy) === 'array') || me.getType(copy) === 'object')) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = me.getType(src) === 'array' ? src : [];    
                        } else {
                            clone = me.getType(src) === 'object' ? src : {};
                        }
                        
                        target[name] = me.mix(deep, clone, copy);
                    
                    } else if (copy != void 0) {
                        target[name] = copy;
                    }
                    
                }  
                
            }
        }
        
        return target
    }

    return util;
});