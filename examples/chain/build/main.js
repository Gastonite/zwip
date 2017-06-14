/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "8b6886cd576156ddd71b"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./index.js")(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../klak/src/emitter.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var internals = {};

internals.TypeFilter = function (type) {
  return function (value) {
    return value.type === type;
  };
};
internals.EqualityFilter = function (value) {
  return function (input) {
    return input === value;
  };
};

internals.getListener = function (value) {
  return value.listener;
};
internals.isString = function (input) {
  return typeof input === 'string';
};
internals.isArray = function (input) {
  return input instanceof Array;
};
internals.isFunction = function (input) {
  return typeof input === 'function';
};
internals.isEmpty = function (input) {
  return input.length < 1;
};
internals.assert = function (condition, message) {
  if (!condition) throw new Error(message);
};
internals.ArgumentCheck = function (types, method) {
  var assert = internals.assert,
      isArray = internals.isArray,
      isString = internals.isString,
      isFunction = internals.isFunction,
      isEmpty = internals.isEmpty;


  assert(isFunction(method), '\'method\' must be a function');

  var check = function check(type, listener) {

    if (isArray(type)) return type.forEach(function (type) {
      return check(type, listener);
    });

    assert(isString(type) && !isEmpty(type), '\'type\' must be a string');

    assert(types.includes(type), '"' + type + '" listener type is not allowed');

    if (isArray(listener)) return listener.forEach(function (handler) {
      return check(type, handler);
    });

    assert(isFunction(listener), '\'listener\' must be a function');

    method(type, listener);
  };

  return check;
};

internals.Emitter = module.exports = function (allowedTypes) {
  var assert = internals.assert,
      TypeFilter = internals.TypeFilter,
      EqualityFilter = internals.EqualityFilter,
      getListener = internals.getListener,
      isArray = internals.isArray,
      isString = internals.isString,
      isEmpty = internals.isEmpty;


  assert(isArray(allowedTypes) && !isEmpty(allowedTypes) && allowedTypes.every(isString), '\'types\' must be an array of string');

  var _listeners = [];

  var _getListeners = function _getListeners(type) {
    return _listeners.filter(TypeFilter(type)).map(getListener);
  };
  var _findListener = function _findListener(type, listener) {
    return _getListeners(type).find(EqualityFilter(listener));
  };

  var emitter = {
    on: function on(type, listener) {

      if (_findListener(type, listener)) return;

      _listeners.push({ type: type, listener: listener });
    },
    off: function off(type, listener) {

      var found = _findListener(type, listener);

      if (!found) return;

      _listeners.splice(_listeners.findIndex(function (item) {
        return item.type === type && item.listener === found;
      }), 1);
    },
    emit: function emit(type) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      assert(isString(type) && !isEmpty(type), '\'type\' must be a string');

      _getListeners(type).forEach(function (handler) {
        return void handler.apply(undefined, args);
      });
    }
  };

  emitter.on = internals.ArgumentCheck(allowedTypes, emitter.on);
  emitter.off = internals.ArgumentCheck(allowedTypes, emitter.off);

  return emitter;
};

/***/ }),

/***/ "../../../zwip-fade/node_modules/style-attr/lib/index.js":
/***/ (function(module, exports) {



/*:: type Attr = { [key: string]: string | number } */
/*:: type Opts = { preserveNumbers: ?boolean } */

/*

style-attr
====

Very simple parsing and stringifying of style attributes.

`parse`
----

Convert a style attribute string to an object.

*/

/*:: declare function parse (raw: string, opts: ?Opts): Attr */
function parse(raw, opts) {
  opts = opts || {};

  var preserveNumbers = opts.preserveNumbers;
  var trim = function (s) {
    return s.trim();
  };
  var obj = {};

  getKeyValueChunks(raw).map(trim).filter(Boolean).forEach(function (item) {
    // split with `.indexOf` rather than `.split` because the value may also contain colons.
    var pos = item.indexOf(':');
    var key = item.substr(0, pos).trim();
    var val = item.substr(pos + 1).trim();
    if (preserveNumbers && isNumeric(val)) {
      val = Number(val);
    }

    obj[key] = val;
  });

  return obj;
}

/*

`isNumeric`
----

Check if a value is numeric.
Via: https://stackoverflow.com/a/1830844/9324

*/

/*:: declare function isNumeric (n: any): boolean */

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/*

`getKeyValueChunks`
----

Split a string into chunks matching `<key>: <value>`

*/
/*:: declare function getKeyValueChunks (raw: string): Array<string> */
function getKeyValueChunks(raw) {
  var chunks = [];
  var offset = 0;
  var sep = ';';
  var hasUnclosedUrl = /url\([^\)]+$/;
  var chunk = '';
  var nextSplit;
  while (offset < raw.length) {
    nextSplit = raw.indexOf(sep, offset);
    if (nextSplit === -1) {
      nextSplit = raw.length;
    }

    chunk += raw.substring(offset, nextSplit);

    // data URIs can contain semicolons, so make sure we get the whole thing
    if (hasUnclosedUrl.test(chunk)) {
      chunk += ';';
      offset = nextSplit + 1;
      continue;
    }

    chunks.push(chunk);
    chunk = '';
    offset = nextSplit + 1;
  }

  return chunks;
}

/*

`stringify`
----

Convert an object into an attribute string

*/
/*:: declare function stringify (obj: Attr): string */
function stringify(obj) {
  return Object.keys(obj).map(function (key) {
    return key + ':' + obj[key];
  }).join(';');
}

/*

`normalize`
----

Normalize an attribute string (eg. collapse duplicates)

*/
/*:: declare function normalize (str: string, opts: ?Opts): string */
function normalize(str, opts) {
  return stringify(parse(str, opts));
}

module.exports.parse = parse;
module.exports.stringify = stringify;
module.exports.normalize = normalize;

/***/ }),

/***/ "../../../zwip-fade/src/animation.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_zwip_src_animation__ = __webpack_require__("../../src/animation.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_zwip_src_animation___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_zwip_src_animation__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_style_attr__ = __webpack_require__("../../../zwip-fade/node_modules/style-attr/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_style_attr___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_style_attr__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__ = __webpack_require__("../../src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_zwip_src_utils___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__);





const FadeAnimation = (options = {}) => {

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__["isObject"])(options, 'options');

  const { element, start: _start = __WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__["noop"], stop: _stop = __WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__["noop"] } = options;

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__["isElement"])(element, 'element');
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_zwip_src_utils__["isFunction"])(_start, 'start');

  let style;

  const update = () => {

    style.opacity = animation.value;
  };

  const render = () => {

    element.setAttribute('style', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_style_attr__["stringify"])(style));
  };

  const start = options => {

    style = element.getAttribute('style');
    style = style ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_style_attr__["parse"])(style) : {};

    style.opacity = element.style.opacity ? parseFloat(element.style.opacity) : animation.reverse ? 0 : 1;

    _start(options);
  };

  const stop = () => {

    _stop();
  };

  const animation = __WEBPACK_IMPORTED_MODULE_0_zwip_src_animation___default()(Object.assign(options, { update, render, start, stop }));

  return animation;
};

/* harmony default export */ __webpack_exports__["default"] = (FadeAnimation);

/***/ }),

/***/ "../../src/animation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loop = __webpack_require__("../../src/loop.js");

var _loop2 = _interopRequireDefault(_loop);

var _klak = __webpack_require__("../../../klak/src/emitter.js");

var _klak2 = _interopRequireDefault(_klak);

var _utils = __webpack_require__("../../src/utils.js");

var _easings = __webpack_require__("../../src/easings.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var internal = {};

internal.parseEasing = function () {
  var easing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _easings.easings.linear;


  if (easing) {

    if ((0, _utils.isString)(easing)) {

      if (!_easings.easings[easing]) throw new Error('Unknown "' + easing + '" easing function');

      easing = _easings.easings[easing];
    }

    (0, _utils.isFunction)(easing, 'easing');
  }

  return easing;
};

exports.default = internal.Animation = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


  (0, _utils.isObject)(options, 'options');
  (0, _utils.isUndefined)(options.isZwipAnimation, 'isZwipAnimation');

  var _options$start = options.start,
      _start = _options$start === undefined ? _utils.noop : _options$start,
      _options$stop = options.stop,
      _stop = _options$stop === undefined ? _utils.noop : _options$stop,
      _options$update = options.update,
      _update = _options$update === undefined ? _utils.noop : _options$update,
      _options$render = options.render,
      _render = _options$render === undefined ? _utils.noop : _options$render,
      duration = options.duration,
      _options$frequency = options.frequency,
      _frequency = _options$frequency === undefined ? 1 : _options$frequency;

  var _reverse = options.reverse,
      _easing = options.easing,
      nbFrames = options.nbFrames;


  (0, _utils.assert)((0, _utils.isFunction)(_start), '\'start\' must be a function');
  (0, _utils.assert)((0, _utils.isFunction)(_stop), '\'stop\' must be a function');
  (0, _utils.assert)((0, _utils.isFunction)(_update), '\'update\' must be a function');
  (0, _utils.assert)((0, _utils.isFunction)(_render), '\'render\' must be a function');

  (0, _utils.assert)((0, _utils.isInteger)(_frequency) && _frequency > 0, '\'frequency\' must be an integer greater than 0');

  // console.log(duration, nbFrames, )
  if (!(!(0, _utils.isUndefined)(duration) ^ !(0, _utils.isUndefined)(nbFrames))) throw new Error('Exactly one option of [\'duration\', \'nbFrames\'] is required');

  if (duration) (0, _utils.assert)((0, _utils.isInteger)(duration) && duration > 0, '\'duration\' must be an integer greater than 0');

  if (nbFrames) (0, _utils.assert)((0, _utils.isInteger)(nbFrames) && nbFrames > 0, '\'nbFrames\' must be an integer greater than 0');

  _easing = internal.parseEasing(_easing);
  _reverse = !!_reverse;

  var _startedAt = void 0;
  var _pausedAt = void 0;
  var _pausedTime = void 0;
  var _frameCounter = void 0;

  console.log('frequency', _frequency);

  var animation = {
    isZwipAnimation: true,
    start: function start() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


      if (_startedAt) throw new Error('Animation is already started');

      // console.log('Animation.start()', options)

      (0, _utils.isObject)(options, 'options');

      // const reverse = 'reverse' in options ? !!options.reverse : _reverse;
      if ('reverse' in options) _reverse = !!options.reverse;

      _pausedAt = null;
      _startedAt = Date.now();
      _frameCounter = 0;
      _pausedTime = 0;

      _start(options);

      _loop2.default.register(animation);

      animation.emit('start');
    },
    stop: function stop() {

      _pausedAt = null;
      _startedAt = null;
      _pausedTime = null;

      _stop();

      _loop2.default.deregister(animation);

      animation.emit('stop');
    },
    pause: function pause() {

      if (!_pausedAt) {
        _pausedAt = Date.now();
        animation.emit('unpause');
        return;
      }

      _pausedTime = _pausedTime + (Date.now() - _pausedAt);
      _pausedAt = null;
      animation.emit('pause');
    },
    update: function update() {

      if (!_startedAt) return;

      if (nbFrames && _frameCounter >= nbFrames) return animation.stop();

      _frameCounter++;

      if (duration) {

        var playedTime = animation.played;

        nbFrames = Math.floor(_frameCounter * duration / playedTime);
      }

      _update();
    },
    render: function render() {
      _render();
    },

    get currentFrame() {
      return _frameCounter;
    },
    get reverse() {
      return _reverse;
    },
    get frequency() {
      return _frequency;
    },
    get pausedAt() {
      return _pausedAt;
    },
    get played() {

      if (!_startedAt) return 0;

      var now = Date.now();

      var totalTime = now - _startedAt;

      if (_pausedAt) totalTime = totalTime - (now - _pausedAt);

      return totalTime - _pausedTime;
    },
    get value() {

      var value = _frameCounter / nbFrames;

      return _easing(!_reverse ? value : 1 - value);
    },
    get nbFrames() {

      if (nbFrames) return nbFrames;

      var duration = animation.duration;

      if (!duration) return;

      return duration / 1000 * _loop2.default.fps;
    },
    get duration() {

      if (duration) return duration;

      var nbFrames = animation.nbFrames;

      if (!nbFrames) return;

      return nbFrames / _loop2.default.fps;
    },
    get state() {
      return {
        value: animation.value,
        nbFrames: animation.nbFrames,
        duration: animation.duration,
        played: animation.played,
        currentFrame: animation.currentFrame
      };
    }
  };

  return Object.assign(animation, (0, _klak2.default)(['start', 'stop', 'pause', 'unpause', 'tick']));
};

internal.Animation.isAnimation = function (input) {
  return (0, _utils.isObject)(input) && input.isZwipAnimation === true;
};

/***/ }),

/***/ "../../src/chain.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _animation = __webpack_require__("../../src/animation.js");

var _animation2 = _interopRequireDefault(_animation);

var _utils = __webpack_require__("../../src/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Chain = function Chain() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _options = options = (0, _utils.isObject)(options, 'options'),
      duration = _options.duration,
      animations = _options.animations,
      _options$start = _options.start,
      _start = _options$start === undefined ? _utils.noop : _options$start,
      _options$stop = _options.stop,
      _stop = _options$stop === undefined ? _utils.noop : _options$stop;

  var _options2 = options,
      _options2$reverse = _options2.reverse,
      reverse = _options2$reverse === undefined ? false : _options2$reverse;


  (0, _utils.isInteger)(duration, 'duration');
  (0, _utils.isArray)(animations, 'animations');

  var durationsSum = animations.reduce(function (sum, animation, i) {

    if (!_animation2.default.isAnimation(animation)) throw new Error('Invalid Chain: Invalid "animations" option: item at position ' + i + ' is not a Zwip animation');

    return sum + animation.duration;
  }, 0);

  if (duration !== durationsSum) throw new Error('Invalid Chain: \'duration\' must be equal to the sum of \'animations\' durations');

  var _started = false;
  var _reverse = false;

  var chain = {
    duration: duration,
    animations: animations,
    start: function start() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


      if (_started) throw new Error('Chain is already started');

      _started = true;

      var _isObject = (0, _utils.isObject)(options, 'options'),
          reverse = _isObject.reverse;

      reverse = !!reverse;

      _start();

      var items = animations;

      var reverseHasChanged = reverse !== _reverse;
      if (reverseHasChanged) {
        _reverse = !_reverse;
      }
      if (reverse) {
        items = animations.slice(0).reverse();
      }

      var _startAnimation = function _startAnimation(animation) {

        var options = {};

        if (reverseHasChanged) options.reverse = !animation.reverse;

        animation.start(options);
      };

      items.forEach(function (item, i) {

        var isFirst = i === 0;
        if (isFirst) _startAnimation(item);

        var _nextAnimation = function _nextAnimation() {

          item.off('stop', _nextAnimation);

          if (i >= items.length - 1) return chain.stop();

          _startAnimation(items[i + 1]);
        };

        item.on('stop', _nextAnimation);
      });
    },
    stop: function stop() {

      _stop();
      _started = false;
    }
  };

  return Object.freeze(chain);
};

exports.default = Chain;

/***/ }),

/***/ "../../src/easings.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EaseIn = exports.EaseIn = function EaseIn(power) {
  return function (t) {
    return Math.pow(t, power);
  };
};
var EaseOut = exports.EaseOut = function EaseOut(power) {
  return function (t) {
    return 1 - Math.abs(Math.pow(t - 1, power));
  };
};
var EaseInOut = exports.EaseInOut = function EaseInOut(power) {
  return function (t) {
    return t < .5 ? EaseIn(power)(t * 2) / 2 : EaseOut(power)(t * 2 - 1) / 2 + 0.5;
  };
};

var easings = exports.easings = {
  linear: EaseInOut(1),
  easeInQuad: EaseIn(2),
  easeOutQuad: EaseOut(2),
  easeInOutQuad: EaseInOut(2),
  easeInCubic: EaseIn(3),
  easeOutCubic: EaseOut(3),
  easeInOutCubic: EaseInOut(3),
  easeInQuart: EaseIn(4),
  easeOutQuart: EaseOut(4),
  easeInOutQuart: EaseInOut(4),
  easeInQuint: EaseIn(5),
  easeOutQuint: EaseOut(5),
  easeInOutQuint: EaseInOut(5),
  easeInCirc: function easeInCirc(t) {
    return -(Math.sqrt(1 - easings.easeInQuad(t)) - 1);
  },
  easeOutCirc: function easeOutCirc(t) {
    return Math.sqrt(easings.easeOutQuad(t));
  }
};

/***/ }),

/***/ "../../src/loop.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _klak = __webpack_require__("../../../klak/src/emitter.js");

var _klak2 = _interopRequireDefault(_klak);

var _utils = __webpack_require__("../../src/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var internal = {
  animations: [],
  listeners: [],
  state: {
    status: 'initialized'
  },
  fps: 60,
  listenerTypes: ['start', 'stop', 'pause', 'unpause']
};

internal.loop = function () {

  if (internal.paused) return;

  internal.requestId = requestAnimationFrame(internal.loop);
  internal.now = Date.now();

  internal.interval = 1000 / internal.fps;
  internal.delta = internal.now - internal.then;

  if (internal.delta > internal.interval) {

    internal.AnimationLoop.frame();
  }
};

internal.MethodCaller = function (key) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  (0, _utils.isRequired)(key, 'key');
  (0, _utils.isString)(key, 'key');

  return function (animation) {

    // console.log(internal.counter, animation, animation.frequency, internal.counter % animation.frequency)
    if (animation[key] && internal.counter % animation.frequency === 0) animation[key].apply(animation, args);
  };
};

internal.emitTick = internal.MethodCaller('emit', 'tick');
internal.callUpdate = internal.MethodCaller('update');
internal.callRender = internal.MethodCaller('render');
internal.callPause = internal.MethodCaller('pause');

internal.isNotPaused = function (object) {
  return !object.pausedAt;
};

internal.AnimationLoop = {
  start: function start() {

    if (internal.requestId) throw new Error('Loop is already started');

    internal.counter = 0;
    internal.paused = null;
    internal.then = Date.now();
    internal.state.status = 'started';

    internal.loop();

    internal.AnimationLoop.emit('start');
  },
  stop: function stop() {

    if (internal.requestId) cancelAnimationFrame(internal.requestId);

    internal.requestId = null;
    internal.state.status = 'stopped';

    internal.AnimationLoop.emit('stop');
  },
  pause: function pause() {

    if (internal.paused) {

      internal.paused = null;
      internal.state.status = 'started';

      internal.animations.forEach(internal.callPause);

      internal.AnimationLoop.emit('unpause');

      internal.loop();
      return;
    }

    internal.animations.forEach(internal.callPause);

    internal.paused = Date.now();
    internal.state.status = 'paused';

    internal.AnimationLoop.emit('pause');
  },
  register: function register(animation) {
    var auto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


    (0, _utils.isObject)(animation, 'animation');

    (0, _utils.assert)(animation.isZwipAnimation === true, '\'animation\' must be a ZwipAnimation object');

    (0, _utils.assert)((0, _utils.isFunction)(animation.render) || (0, _utils.isFunction)(animation.update), 'At least \'render\' or \'update\' method is required');

    animation.render = animation.render || _utils.noop;
    animation.update = animation.update || _utils.noop;

    if (auto && !internal.requestId) internal.AnimationLoop.start();

    if (internal.animations.includes(animation)) return;

    internal.animations.push(animation);
  },
  deregister: function deregister(animation) {
    var auto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


    var index = internal.animations.indexOf(animation);

    if (~index) internal.animations.splice(index, 1);

    if (auto && internal.requestId && !internal.animations.length) internal.AnimationLoop.stop();
  },
  frame: function frame() {

    internal.AnimationLoop.emit('tick');

    internal.counter++;

    internal.elapsed = internal.now - internal.then;
    internal.then = internal.now - internal.delta % internal.interval;

    internal.state.fps = 1000 / internal.elapsed;
    internal.state.animations = internal.animations.length;
    internal.state.frames = internal.counter;

    var animations = internal.animations.filter(internal.isNotPaused);

    animations.forEach(internal.emitTick);

    animations.forEach(internal.callUpdate);

    animations.forEach(internal.callRender);
  },


  get state() {
    return internal.state;
  },
  get fps() {
    return internal.fps;
  },
  set fps(newValue) {

    (0, _utils.isInteger)(newValue, 'fps');

    internal.fps = newValue;
  }
};

exports.default = Object.assign(internal.AnimationLoop, (0, _klak2.default)(['start', 'stop', 'pause', 'unpause', 'tick']));

/***/ }),

/***/ "../../src/polyfills/matchesSelector.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Element.prototype.matches = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
  var matches = (this.document || this.ownerDocument).querySelectorAll(s);
  var i = matches.length;
  while (--i >= 0 && matches.item(i) !== this) {}
  return i > -1;
};

/***/ }),

/***/ "../../src/polyfills/requestAnimationFrame.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
  window.setTimeout(function () {

    callback(+new Date());
  }, 1000 / 60);
};

/***/ }),

/***/ "../../src/utils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var internals = {};

internals.Assertion = function (check, errorMessage) {

  return function (input, assert) {

    var isTrue = !!check(input);
    if (isTrue) return input || true;

    if (!assert) return false;

    throw new Error('"' + (typeof assert !== 'string' ? 'input' : assert) + '" ' + errorMessage);
  };
};

var assert = exports.assert = function assert(condition, message) {

  if (condition) return condition;

  throw new Error(message);
};

var noop = exports.noop = function noop() {};
var isEqualTo = exports.isEqualTo = function isEqualTo(value) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'is not equal to value';
  return internals.Assertion(function (input) {
    return input === value;
  }, message);
};
var isTrue = exports.isTrue = isEqualTo(true, 'must be true');
var isUndefined = exports.isUndefined = isEqualTo(void 0, 'must be undefined');
var isRequired = exports.isRequired = internals.Assertion(function (input) {
  return !!input;
}, 'is required');
var isInstanceOf = exports.isInstanceOf = function isInstanceOf(type) {
  return internals.Assertion(function (input) {
    return input instanceof type;
  }, 'is not an instance of ' + type.name);
};
var isArray = exports.isArray = isInstanceOf(Array);
var isObject = exports.isObject = internals.Assertion(function (input) {
  return (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object';
}, 'must be an object');
var isString = exports.isString = internals.Assertion(function (input) {
  return typeof input === 'string';
}, 'must be a string');
var isFunction = exports.isFunction = internals.Assertion(function (input) {
  return typeof input === 'function';
}, 'must be a function');
var isNumber = exports.isNumber = internals.Assertion(function (input) {
  return typeof input === 'number';
}, 'must be a number');
var isInteger = exports.isInteger = internals.Assertion(function (input) {
  return Number.isInteger(input);
}, 'must be an integer');

var isElement = exports.isElement = internals.Assertion(function (object) {

  if (!object || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== "object") return false;

  if ((typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === "object") return object instanceof HTMLElement;

  return object.nodeType === 1 && typeof object.nodeName === "string";
}, 'must be a HTMLElement');

var round = exports.round = function round(value, decimals) {

  isNumber(value, 'value');

  isRequired(decimals, 'decimals');
  isInteger(decimals, 'decimals');

  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

/***/ }),

/***/ "./index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _loop = __webpack_require__("../../src/loop.js");

var _loop2 = _interopRequireDefault(_loop);

var _animation = __webpack_require__("../../src/animation.js");

var _animation2 = _interopRequireDefault(_animation);

var _utils = __webpack_require__("../../src/utils.js");

var _chain = __webpack_require__("../../src/chain.js");

var _chain2 = _interopRequireDefault(_chain);

var _zwipFade = __webpack_require__("../../../zwip-fade/src/animation.js");

var _zwipFade2 = _interopRequireDefault(_zwipFade);

__webpack_require__("../../src/polyfills/requestAnimationFrame.js");

__webpack_require__("../../src/polyfills/matchesSelector.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.log = console.log.bind(console);
window.error = console.error.bind(console);

var SlideAnimation = function SlideAnimation(_ref) {
  var element = _ref.element,
      duration = _ref.duration,
      reverse = _ref.reverse;


  var parentWidth = element.parentNode.clientWidth;
  var width = element.clientWidth;

  var min = 0;
  var max = parentWidth - width;

  element.style.position = 'absolute';

  var _setLeft = function _setLeft(left) {
    return element.style.left = left + 'px';
  };

  var start = function start() {
    log('Slide.start()', animation.reverse);

    _setLeft(animation.reverse ? max : min);
  };

  var render = function render() {
    var v = animation.value;
    element.style.left = v * max;
  };

  var animation = (0, _animation2.default)({ start: start, render: render, duration: duration, reverse: reverse });

  return animation;
};

var MyChain = function MyChain(_ref2) {
  var element = _ref2.element,
      reverse = _ref2.reverse,
      duration = _ref2.duration,
      frequency = _ref2.frequency;


  var firstAnimation = SlideAnimation({ element: element, reverse: reverse, frequency: frequency, duration: Math.ceil(duration * (1 / 3)) });

  var lastAnimation = (0, _zwipFade2.default)({ element: element.firstChild, reverse: !reverse, frequency: frequency, duration: Math.floor(duration * (2 / 3)) });

  return (0, _chain2.default)({
    duration: duration,
    frequency: frequency,
    animations: [firstAnimation, lastAnimation]
  });
};

document.addEventListener('DOMContentLoaded', function () {

  var circle = document.body.appendChild(document.createElement('div'));
  var loopState = document.body.appendChild(document.createElement('pre'));
  var container = document.body.appendChild(document.createElement('pre'));
  var firstAnimationState = container.appendChild(document.createElement('pre'));
  var lastAnimationState = container.appendChild(document.createElement('pre'));

  circle.classList.add('circle');
  circle.innerHTML = '<div></div><strong>click me</strong>';

  loopState.classList.add('loop-state');
  container.classList.add('animation-state');

  var myChain = MyChain({ element: circle, duration: 1000, frequency: 1 });

  var reverse = false;

  var displayLoopState = function displayLoopState() {
    loopState.innerHTML = 'Loop state: ' + JSON.stringify(_loop2.default.state, null, 2);
  };
  var displaySlideAnimationState = function displaySlideAnimationState() {
    firstAnimationState.innerHTML = 'firstAnimation state: ' + JSON.stringify(myChain.animations[0].state, null, 2);
  };
  var displayFadeAnimationState = function displayFadeAnimationState() {
    lastAnimationState.innerHTML = 'lastAnimation state: ' + JSON.stringify(myChain.animations[1].state, null, 2);
  };

  circle.addEventListener('mouseup', function () {

    myChain.start({ reverse: reverse });
    reverse = !reverse;

    myChain.animations[0].on('tick', displaySlideAnimationState);
    myChain.animations[1].on('tick', displayFadeAnimationState);
  });

  _loop2.default.on(['tick', 'stop'], displayLoopState);

  displayLoopState();
  displaySlideAnimationState();
  displayFadeAnimationState();
});

/***/ })

/******/ });
//# sourceMappingURL=main.js.map