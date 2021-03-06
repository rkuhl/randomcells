(function() {
  (function($) {
    return $.fn.randomCells = function(options) {
      var $wrapper, delay, elements, getCurrentSet, getNextSwapItem, getRandomElement, getRandomItem, hideItem, init, isPlaying, readSrc, selector, settings, showItem, spread, src, startInterval, stopInterval, swap, swapIndex, swapItem, trace, validate;
      settings = $.extend({
        'max': 3,
        'delay': 1000,
        'selector': 'li',
        'innerSelector': '.inner',
        'src': '#rc-data',
        'mode': 'swap',
        'swapMode': 'ordered',
        'cloneClass': 'rc-i-clone',
        'clonedOrygin': 'rc-i-orygin',
        'overlap': false,
        'hideTime': 200,
        'hideClass': 'rc-hide',
        'showTime': 200,
        'showClass': 'rc-show',
        'visibleClass': 'rc-active',
        'dev': false
      }, options);
      delay = settings.delay;
      if (settings.mode === 'spread') {
        delay += settings.hideTime + settings.showTime;
      }
      $wrapper = this;
      selector = settings.selector;
      src = settings.src;
      elements = [];
      isPlaying = false;
      swapIndex = 1;
      trace = function(str) {
        if (settings.dev) {
          return console.info(str);
        }
      };
      validate = function() {
        var myMax, myRequired;
        myMax = settings.max;
        myRequired = elements.length - 1;
        if (settings.mode === 'spread') {
          myMax = settings.max * 2;
          myRequired = Math.floor(elements.length / 2);
        }
        if (elements.length < myMax) {
          trace(":validate: settings.max was updated! Source list was shorter then required");
          return settings.max = myRequired;
        }
      };
      readSrc = function() {
        var i;
        i = 0;
        $(src).find(selector).each(function() {
          i++;
          $(this).data("rc-id", i);
          return elements.push($(this));
        });
        validate();
        return trace(":readSrc: data elements number: " + elements.length);
      };
      getRandomElement = function(set) {
        var $item, id;
        if (set == null) {
          set = [];
        }
        $item = elements[Math.floor(Math.random() * elements.length)];
        id = $item.data("rc-id");
        if ($.inArray(id, set) >= 0) {
          return getRandomElement(set);
        }
        return $item.clone(true).off();
      };
      getRandomItem = function() {
        var $list, $randomIt, num;
        $list = $wrapper.find(selector);
        if ($list.length > 0) {
          num = Math.floor(Math.random() * $list.length + 1);
          $randomIt = $wrapper.find(selector + ':nth-child(' + num + ')');
          if ($randomIt.index() === swapIndex) {
            return getRandomItem();
          }
          swapIndex = $randomIt.index();
          return $randomIt;
        }
        return false;
      };
      getNextSwapItem = function() {
        var $it;
        $it = $wrapper.find(selector + ':nth-child(' + swapIndex + ')');
        swapIndex++;
        if (swapIndex > $wrapper.find(selector).length) {
          swapIndex = 1;
        }
        return $it;
      };
      hideItem = function($it) {
        $it.addClass(settings.hideClass);
        $it.removeClass(settings.visibleClass);
        return $it.timeout = setTimeout(function() {
          $it.removeClass(settings.hideClass);
          return $it.remove();
        }, settings.hideTime);
      };
      showItem = function($it, delay) {
        if (delay == null) {
          delay = 0;
        }
        return $it.timeout = setTimeout(function() {
          $wrapper.prepend($it);
          $it.addClass(settings.showClass);
          $it.addClass(settings.visibleClass);
          return $it.timeout = setTimeout(function() {
            return $it.removeClass(settings.showClass);
          }, settings.showTime);
        }, delay);
      };
      swapItem = function($it, $el) {
        var $cloneInner, $elInner, $itInner;
        if (settings.overlap) {
          $itInner = $it.find(settings.innerSelector);
          $elInner = $el.find(settings.innerSelector);
          $cloneInner = $itInner.clone();
          $cloneInner.html($elInner.html());
          $itInner.addClass(settings.clonedOrygin);
          $cloneInner.addClass(settings.cloneClass);
          $it.append($cloneInner);
        }
        return $it.timeout = setTimeout(function() {
          $it.addClass(settings.hideClass);
          $it.removeClass(settings.visibleClass);
          return $it.timeout = setTimeout(function() {
            $it.removeClass(settings.hideClass);
            $it.data("rc-id", $el.data("rc-id"));
            $it.html($el.html());
            $it.addClass(settings.showClass);
            $it.addClass(settings.visibleClass);
            return $it.timeout = setTimeout(function() {
              $it.removeClass(settings.showClass);
              if (settings.overlap) {
                return $cloneInner.remove();
              }
            }, settings.showTime);
          }, settings.hideTime);
        }, 50);
      };
      getCurrentSet = function() {
        var set;
        set = [];
        $wrapper.find(selector).each(function() {
          return set.push($(this).data("rc-id"));
        });
        return set;
      };
      spread = function() {
        var $el, i, set, showDelay, _results;
        trace(":spread:");
        set = getCurrentSet();
        showDelay = 0;
        $wrapper.find(selector).each(function() {
          hideItem($(this));
          return showDelay = settings.hideTime;
        });
        i = 0;
        _results = [];
        while (i < settings.max) {
          i++;
          $el = getRandomElement(set);
          set.push($el.data("rc-id"));
          _results.push(showItem($el, showDelay));
        }
        return _results;
      };
      swap = function() {
        var set;
        set = getCurrentSet();
        if (settings.swapMode === 'random') {
          return swapItem(getRandomItem(), getRandomElement(set));
        } else {
          return swapItem(getNextSwapItem(), getRandomElement(set));
        }
      };
      startInterval = function() {
        var func;
        if (settings.mode === 'spread') {
          func = spread;
        } else {
          func = swap;
        }
        $wrapper.timer = setInterval(func, delay);
        return isPlaying = true;
      };
      stopInterval = function() {
        clearInterval($wrapper.timer);
        return isPlaying = false;
      };
      $.fn.randomCells.pause = function() {
        return stopInterval();
      };
      $.fn.randomCells.play = function() {
        return startInterval();
      };
      $.fn.randomCells.togglePause = function() {
        if (isPlaying) {
          return stopInterval();
        } else {
          return startInterval();
        }
      };
      init = function() {
        readSrc();
        spread();
        return startInterval();
      };
      return init();
    };
  })(jQuery);

}).call(this);
