'use strict';

/**
 * ngAnimator service using requestAnimationFrame API
 * for call tasks from pool.
 */

angular.module('ngAnimator')
  .factory('ngAnimator', function () {

    // requestAnimationFrame polyfill.
    // Source: https://gist.github.com/paulirish/1579671.
    var vendors = ['ms', 'moz', 'webkit', 'o'],
        RAF = window.requestAnimationFrame, 
        cRAF = window.cancelAnimationFrame;
    for (var x = 0; x < vendors.length && !RAF; ++x) {
        RAF = window[vendors[x]+'RequestAnimationFrame'];
        cRAF = window[vendors[x]+'CancelAnimationFrame'] || 
               window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    // Fallback to setTimeout.
    if (!RAF) {
      var matMax = Math.max,
          setTimeout = window.setTimeout,
          lastTime, currTime, timeToCall, tid;
      RAF = function(callback) {
            currTime = new Date().getTime();
            timeToCall = matMax(0, 16 - (currTime - lastTime));
            tid = setTimeout(function() { 
              callback(currTime + timeToCall); 
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return tid;
        };
    }

    // Fallback to clearTimeout.
    if (!cRAF) {
      var clearTimeout = window.clearTimeout;
      cRAF = function (tid) {
        return clearTimeout(tid);
      };
    }

    // ngAnimator instance definition..
    var ngAnimator = {
          requestAnimationFrame: RAF,
          cancelAnimationFrame: cRAF
        };

    // Tasks pool definition.
    var pool = ngAnimator.pool = [];
    
    // Timeout id for loop stopping.
    var _tid;

    // Add @task function to calling loop.
    ngAnimator.add = function (task) {
      pool.unshift(task);
      if (!_tid) {
        ngAnimator.start();
      }
      return ngAnimator;
    };

    // Remove @task function from calling loop.
    ngAnimator.remove = function (task) {
      var index;
      while ((index = pool.indexOf(task)) >= 0) {
        pool.splice(index, 1)[0] = null;
      }
      if (!pool.length) {
        ngAnimator.stop();
      }
      return ngAnimator;
    };

    // Check for @task function exists in pool and pool is runned.
    ngAnimator.isRunned = function (task) {
      return !!_tid && pool.indexOf(task) >= 0;
    };

    // Start animation loop.
    ngAnimator.start = function () {
      var _pool, len;
      ngAnimator.stop();
      _tid = RAF(function ngAnimatorLoop () {
        _tid = RAF(ngAnimatorLoop);
        len = pool.length;
        if (!len) {
          return;
        }
        _pool = pool.slice();
        for ( ; len--; ) {
          _pool[len]();
        }
      });
      return ngAnimator;
    };

    // Stop started loop.
    ngAnimator.stop = function () {
      cRAF(_tid);
      _tid = null;
      return ngAnimator;
    };

    // Flush all tasks from pool and stop loop.
    ngAnimator.flush = function () {
      pool.splice(-pool.length);
      this.stop();
      return ngAnimator;
    };

    return ngAnimator;

  });
