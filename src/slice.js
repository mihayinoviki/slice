var $aop = {};
(function($aop){
	$aop.after = function(parentObj, fnName, callback) {
		var fn = parentObj[fnName];
		if(fn && typeof fn === 'function') {
			
			if(!fn.__after && !fn.__before) {
				parentObj[fnName] = createNewFn(parentObj, fnName);
			}

			if(!fn.__after){
				fn.__after = [];
			}
			fn.__after.push(callback);
		}
	};

	$aop.before = function(parentObj, fnName, callback) {
		var fn = parentObj[fnName];
		if(fn && typeof fn === 'function') {
			
			if(!fn.__after && !fn.__before) {
				parentObj[fnName] = createNewFn(parentObj, fnName);
			}
			
			if(!fn.__before) {
				fn.__before = [];
			}
			fn.__before.push(callback);
		}
	};

	$aop.around = function(parentObj, fnName, callback) {
		var fn = parentObj[fnName];
		if(fn && (typeof fn === 'function')){
			fn.__joint = fn;
		}
		
		var newFn = function() {
		 	var result = callback.call(this, fn.__joint,arguments);
			return result;
		};
		
		parentObj[fnName] = newFn;
	};
	
	function createNewFn(parentObj, fnName) {
		var fn = parentObj[fnName];
		var newFn = function() {
			if(fn.__before){
				for(var j=0; j<fn.__before.length; j++) {
					fn.__before[j].call(this, arguments);
				}
			}
			var result = fn.call(this, arguments);
			if(fn.__after){
				for(var i=0; i<fn.__after.length; i++) {
					fn.__after[i].call(this, result);
				}
			}
		};
		return newFn;
	}
})($aop);

if(typeof define === "function" && define.amd){
	define('slice', [], function(){
		return $aop;
	});
}

