# ngAnimator

Paradigm of `central application processor for animations` with [requestAnimationFrame API](https://developer.mozilla.org/ru/docs/DOM/window.requestAnimationFrame) technique for [AngularJS](https://angularjs.org/) framework.

Current module provides `ngAnimator` service with API (see description below) for manage tasks in animation loop.

## Install

Install this package via bower in your node.js-based project:
```bash
bower i ssh:git@github.com:vasiliy0s/ngAnimator.git --save
```
It automatic installs angular.js bower package as dependency (currently based angular version is _~1_).

If you want to use custom version of module type:
```bash
bower i git@github.com:vasiliy0s/ngAnimator.git#1.0.0 --save
```
Where is _#1.0.0_ is your needing version.

## Update

Update current project via (available stable releases placing in _'master'_ branch, if not defined custom tag):
```bash
bower update
```

## Build

Build package via typing (generates module JavaScript files):
```bash
grunt build
```

## ngAnimator (service)
Service have wide tasks pool and run its inside requested browser animation frames loop.

All of the methods provides `chaining` style (returns current ngAnimator instance).

### ngAnimator.add(task)
Adding `task` callback to processing pool. Every `task` will be called (without context) on every from requested animation frame. *Do __not add any hard__ tasks for not getting performance issues in browsers.*

### ngAnimator.remove(task)
Remove all `task` instances from processing pool.

### ngAnimator.isRunned()
Get runned state. *Processing is automatically stopping when pool is empty for best performance.*

### ngAnimator.start()
Starts pool processing loop if it not started. *Note than every [ngAnimator.add()](#user-content-ngscorechargeranimatoraddtask) calling is autmatically starts processing if it not starter already and not need to start manually (if it not be stopped manually).*

### ngAnimator.stop()
Ends started pool processing loop.

### ngAnimator.flush()
Flush pool from all tasks and stop loop.

## Author:
Module initiator and main developer [Vasiliy Os](http://vasiliy0s.com/).

## TODO:
- Adding tests.
- Adding demo.
