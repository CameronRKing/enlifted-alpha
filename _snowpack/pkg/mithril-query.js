import { r as render, v as vnode, a as hyperscript_1 } from './common/render-afc49bc4.js';
import './common/stream-73cd9106.js';
import './common/_commonjsHelpers-b3efd043.js';

/**
 * map
 */

var map = {
    backspace: 8
  , command: 91
  , tab: 9
  , clear: 12
  , enter: 13
  , shift: 16
  , ctrl: 17
  , alt: 18
  , capslock: 20
  , escape: 27
  , esc: 27
  , space: 32
  , pageup: 33
  , pagedown: 34
  , end: 35
  , home: 36
  , left: 37
  , up: 38
  , right: 39
  , down: 40
  , del: 46
  , comma: 188
  , f1: 112
  , f2: 113
  , f3: 114
  , f4: 115
  , f5: 116
  , f6: 117
  , f7: 118
  , f8: 119
  , f9: 120
  , f10: 121
  , f11: 122
  , f12: 123
  , ',': 188
  , '.': 190
  , '/': 191
  , '`': 192
  , '-': 189
  , '=': 187
  , ';': 186
  , '[': 219
  , '\\': 220
  , ']': 221
  , '\'': 222
};

/**
 * find a keycode.
 *
 * @param {String} name
 * @return {Number}
 */

var yieldsKeycode = function(name){
  return map[name.toLowerCase()] || name.toUpperCase().charCodeAt(0);
};

// const domino = require('domino')
// const Event = require('domino/lib/Event')


// const formatHtml = require('pretty-html-log').highlight

function isString(thing) {
  return Object.prototype.toString.call(thing) === '[object String]'
}

function isArray(thing) {
  return Object.prototype.toString.call(thing) === '[object Array]'
}

function isComponent(thing) {
  return !!(
    (thing && (typeof thing === 'object' && thing.view)) ||
    isFunction(thing) ||
    isClass(thing)
  )
}

function isFunction(thing) {
  return typeof thing === 'function' && !isClass(thing)
}

function isBabelTranspiledClass(thing) {
  const code = thing.toString().replace(/^[^{]+{/, '');

  return (
    // Regular Babel transpiled class
    /(?:^|\s+)_classCallCheck\(/.test(code) ||
    // Babel with @babel/transform-runtime and Webpack
    /(?:^|\s+)_[^\s]+_classCallCheck__[^\s()]+\(/.test(code) ||
    // Babel with @babel/transform-runtime (useESModules: true) and Webpack
    /(?:^|\s+)Object\(_[^\s]+_classCallCheck__[^\s()]+\)\(/.test(code)
  )
}

function isClass(thing) {
  return (
    typeof thing === 'function' &&
    (/^\s*class\s/.test(thing.toString()) || // ES6 class
      isBabelTranspiledClass(thing)) // Babel class
  )
}

function consoleLogHtml(els) {
  // eslint-disable-next-line no-console
  console.log(els.map(el => /*formatHtml(*/el.outerHTML/*)*/).join('---------\n'));
}


function scan(api) {
  const rootEl = api.rootEl;
  api.vnodes = rootEl.vnodes;

  
  // $queries return vnodes, not dom nodes
  const queries = (() => {
    function visit(vnode, fn) {
      fn(vnode);
  
      if (vnode.instance) visit(vnode.instance, fn);
      if (vnode.children) vnode.children.forEach(child => visit(child, fn));
    }
  
    function gather(vnodes, test) {
      const gathered = [];
      vnodes.forEach(vnode => {
        visit(vnode, child => {
          if (test(child)) gathered.push(child);
        });      
      });
      return gathered;
    }

    const queries = {
      dmq: (name) => (node) => node.attrs && node.attrs['data-mq'] == name,
      is: (name) => (node) => node.tag == name || (node.tag.view && node.tag.view.name == name)
    };

    const $$ = (test) => gather(api.vnodes, test);
    const $ = (test) => $$(test)[0];

    const allQueries = { $$, $ };

    Object.entries(queries).forEach(([queryName, testFn]) => {
      allQueries[`$${queryName}`] = (arg) => $(testFn(arg));
      allQueries[`$$${queryName}`] = (arg) => $$(testFn(arg));
    });

    return allQueries;
  })();

  Object.assign(api, queries);

  function find(selectorString, node) {
    return Array.prototype.slice.call(node.querySelectorAll(selectorString))
  }

  function first(selector) {
    const node = rootEl.querySelector(selector);
    if (!node) {
      throw new Error('No element matches ' + selector)
    }
    return node
  }

  function has(selector) {
    return find(selector, rootEl).length > 0
  }

  function contains(value, node) {
    return node.innerHTML.includes(value);
    // :contains() must have been a domino thing, because it didn't make it to web standard
    // return !!find(':contains(' + value + ')', node).length
  }

  function shouldHaveAtLeast(minCount, selector) {
    const actualCount = find(selector, rootEl).length;
    if (actualCount < minCount) {
      throw new Error(
        'Wrong count of elements that matches "' +
          selector +
          '"\n  expected: >=' +
          minCount +
          '\n  actual: ' +
          actualCount
      )
    }
    return true
  }

  function shouldHave(expectedCount, selector) {
    if (!selector) {
      return isArray(expectedCount)
        ? shouldHaveCollection(expectedCount)
        : shouldHaveAtLeast(1, expectedCount)
    }

    const actualCount = find(selector, rootEl).length;
    if (actualCount !== expectedCount) {
      throw new Error(
        'Wrong count of elements that matches "' +
          selector +
          '"\n  expected: ' +
          expectedCount +
          '\n  actual: ' +
          actualCount
      )
    }
    return true
  }

  function shouldHaveCollection(selectors) {
    selectors.forEach(function(selector) {
      shouldHaveAtLeast(1, selector);
    });
    return true
  }

  function shouldNotHave(selector) {
    shouldHave(0, selector);
    return true
  }

  function shouldContain(string) {
    if (!contains(string, rootEl)) {
      throw new Error('Expected "' + string + '" not found!')
    }
    return true
  }

  function shouldNotContain(string) {
    if (contains(string, rootEl)) {
      throw new Error('Unexpected "' + string + '" found!')
    }
    return true
  }

  function setValue(selector, string, eventData = {}) {
    const el = first(selector);
    el.value = string;
    const inputEvent = new Event('input', eventData);
    const changeEvent = new Event('change', eventData);
    const keyupEvent = new Event('keyup', eventData);
    el.dispatchEvent(inputEvent);
    el.dispatchEvent(changeEvent);
    el.dispatchEvent(keyupEvent);
    if (
      inputEvent.redraw !== false &&
      changeEvent.redraw !== false &&
      keyupEvent.redraw !== false
    ) {
      api.redraw();
    }
  }

  function trigger(eventName) {
    return function(selector, eventData) {
      const event = new Event(eventName, eventData);
      const el = first(selector);
      el.dispatchEvent(event);
      if (event.redraw !== false) {
        api.redraw();
      }
    }
  }

  function triggerKey(eventName) {
    const fire = trigger(eventName);
    return function handleEvent(selector, key, eventData = {}) {
      const keyCode = isString(key) ? yieldsKeycode(key) : key;
      const defaultEvent = {
        altKey: false,
        shiftKey: false,
        ctrlKey: false,
        type: eventName,
        keyCode,
        which: keyCode,
      };
      fire(selector, { ...defaultEvent, ...eventData });
    }
  }

  shouldHave.at = {
    least: shouldHaveAtLeast,
  };

  api.first = first;
  api.has = has;
  api.contains = function(value) {
    return contains(value, rootEl)
  };
  api.find = function(selector) {
    return find(selector, rootEl)
  };
  api.setValue = setValue
  ;[
    'focus',
    'click',
    'blur',
    'mousedown',
    'mouseup',
    'mouseover',
    'mouseout',
    'mouseenter',
    'mouseleave',
    'contextmenu',
  ].map(function(eventName) {
    api[eventName] = trigger(eventName);
  });
  api.keydown = triggerKey('keydown');
  api.keypress = triggerKey('keypress');
  api.keyup = triggerKey('keyup');
  api.trigger = function(selector, eventName, event, silent) {
    trigger(eventName)(selector, event, silent);
  };
  api.should = {
    not: {
      have: shouldNotHave,
      contain: shouldNotContain,
    },
    have: shouldHave,
    contain: shouldContain,
  };
  api.log = function(selector, logFn = consoleLogHtml) {
    logFn(api.find(selector));
    return api
  };

  return api
}

var mithrilQuery = function init(componentOrRootNode, nodeOrAttrs) {
  const render$1 = render(window);
  
  let rootNode = {
    view: () => {
      return isComponent(componentOrRootNode)
        ? hyperscript_1(componentOrRootNode, nodeOrAttrs)
        : componentOrRootNode
    },
  };

  const rootEl = document.createElement('div');
  const redraw = () => render$1(rootEl, vnode(rootNode));

  redraw();

  const onremove = () => {
    componentOrRootNode = null;
    redraw();
  };
  return scan({
    redraw,
    onremove,
    rootEl
  })
};

export default mithrilQuery;
//# sourceMappingURL=mithril-query.js.map
