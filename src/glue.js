
// Bindings utilities

function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare: function() {
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc: function(array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = (len + 7) & -8; // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, ensureCache time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
  copy: function(array, view, offset) {
    var offsetShifted = offset;
    var bytes = view.BYTES_PER_ELEMENT;
    switch (bytes) {
      case 2: offsetShifted >>= 1; break;
      case 4: offsetShifted >>= 2; break;
      case 8: offsetShifted >>= 3; break;
    }
    for (var i = 0; i < array.length; i++) {
      view[offsetShifted + i] = array[i];
    }
  },
};

function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    ensureCache.copy(intArray, HEAP8, offset);
    return offset;
  }
  return value;
}
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    ensureCache.copy(value, HEAP8, offset);
    return offset;
  }
  return value;
}
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    ensureCache.copy(value, HEAP16, offset);
    return offset;
  }
  return value;
}
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    ensureCache.copy(value, HEAP32, offset);
    return offset;
  }
  return value;
}
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    ensureCache.copy(value, HEAPF32, offset);
    return offset;
  }
  return value;
}
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    ensureCache.copy(value, HEAPF64, offset);
    return offset;
  }
  return value;
}


// RARHeaderDataEx
/** @suppress {undefinedVars, duplicate} */function RARHeaderDataEx() {
  this.ptr = _emscripten_bind_RARHeaderDataEx_RARHeaderDataEx_0();
  getCache(RARHeaderDataEx)[this.ptr] = this;
};;
RARHeaderDataEx.prototype = Object.create(WrapperObject.prototype);
RARHeaderDataEx.prototype.constructor = RARHeaderDataEx;
RARHeaderDataEx.prototype.__class__ = RARHeaderDataEx;
RARHeaderDataEx.__cache__ = {};
Module['RARHeaderDataEx'] = RARHeaderDataEx;

  RARHeaderDataEx.prototype['get_FileNameW'] = RARHeaderDataEx.prototype.get_FileNameW = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return UTF8ToString(_emscripten_bind_RARHeaderDataEx_get_FileNameW_0(self));
};
    RARHeaderDataEx.prototype['set_FileNameW'] = RARHeaderDataEx.prototype.set_FileNameW = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  else arg0 = ensureString(arg0);
  _emscripten_bind_RARHeaderDataEx_set_FileNameW_1(self, arg0);
};
    Object.defineProperty(RARHeaderDataEx.prototype, 'FileNameW', { get: RARHeaderDataEx.prototype.get_FileNameW, set: RARHeaderDataEx.prototype.set_FileNameW });
  RARHeaderDataEx.prototype['get_UnpSize'] = RARHeaderDataEx.prototype.get_UnpSize = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RARHeaderDataEx_get_UnpSize_0(self);
};
    RARHeaderDataEx.prototype['set_UnpSize'] = RARHeaderDataEx.prototype.set_UnpSize = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RARHeaderDataEx_set_UnpSize_1(self, arg0);
};
    Object.defineProperty(RARHeaderDataEx.prototype, 'UnpSize', { get: RARHeaderDataEx.prototype.get_UnpSize, set: RARHeaderDataEx.prototype.set_UnpSize });
  RARHeaderDataEx.prototype['get_PackSize'] = RARHeaderDataEx.prototype.get_PackSize = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RARHeaderDataEx_get_PackSize_0(self);
};
    RARHeaderDataEx.prototype['set_PackSize'] = RARHeaderDataEx.prototype.set_PackSize = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RARHeaderDataEx_set_PackSize_1(self, arg0);
};
    Object.defineProperty(RARHeaderDataEx.prototype, 'PackSize', { get: RARHeaderDataEx.prototype.get_PackSize, set: RARHeaderDataEx.prototype.set_PackSize });
  RARHeaderDataEx.prototype['get_Flags'] = RARHeaderDataEx.prototype.get_Flags = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RARHeaderDataEx_get_Flags_0(self);
};
    RARHeaderDataEx.prototype['set_Flags'] = RARHeaderDataEx.prototype.set_Flags = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RARHeaderDataEx_set_Flags_1(self, arg0);
};
    Object.defineProperty(RARHeaderDataEx.prototype, 'Flags', { get: RARHeaderDataEx.prototype.get_Flags, set: RARHeaderDataEx.prototype.set_Flags });
  RARHeaderDataEx.prototype['__destroy__'] = RARHeaderDataEx.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_RARHeaderDataEx___destroy___0(self);
};
// RAROpenArchiveDataEx
/** @suppress {undefinedVars, duplicate} */function RAROpenArchiveDataEx() {
  this.ptr = _emscripten_bind_RAROpenArchiveDataEx_RAROpenArchiveDataEx_0();
  getCache(RAROpenArchiveDataEx)[this.ptr] = this;
};;
RAROpenArchiveDataEx.prototype = Object.create(WrapperObject.prototype);
RAROpenArchiveDataEx.prototype.constructor = RAROpenArchiveDataEx;
RAROpenArchiveDataEx.prototype.__class__ = RAROpenArchiveDataEx;
RAROpenArchiveDataEx.__cache__ = {};
Module['RAROpenArchiveDataEx'] = RAROpenArchiveDataEx;

  RAROpenArchiveDataEx.prototype['get_ArcName'] = RAROpenArchiveDataEx.prototype.get_ArcName = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return UTF8ToString(_emscripten_bind_RAROpenArchiveDataEx_get_ArcName_0(self));
};
    RAROpenArchiveDataEx.prototype['set_ArcName'] = RAROpenArchiveDataEx.prototype.set_ArcName = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  else arg0 = ensureString(arg0);
  _emscripten_bind_RAROpenArchiveDataEx_set_ArcName_1(self, arg0);
};
    Object.defineProperty(RAROpenArchiveDataEx.prototype, 'ArcName', { get: RAROpenArchiveDataEx.prototype.get_ArcName, set: RAROpenArchiveDataEx.prototype.set_ArcName });
  RAROpenArchiveDataEx.prototype['get_OpenMode'] = RAROpenArchiveDataEx.prototype.get_OpenMode = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RAROpenArchiveDataEx_get_OpenMode_0(self);
};
    RAROpenArchiveDataEx.prototype['set_OpenMode'] = RAROpenArchiveDataEx.prototype.set_OpenMode = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RAROpenArchiveDataEx_set_OpenMode_1(self, arg0);
};
    Object.defineProperty(RAROpenArchiveDataEx.prototype, 'OpenMode', { get: RAROpenArchiveDataEx.prototype.get_OpenMode, set: RAROpenArchiveDataEx.prototype.set_OpenMode });
  RAROpenArchiveDataEx.prototype['get_Callback'] = RAROpenArchiveDataEx.prototype.get_Callback = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RAROpenArchiveDataEx_get_Callback_0(self);
};
    RAROpenArchiveDataEx.prototype['set_Callback'] = RAROpenArchiveDataEx.prototype.set_Callback = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RAROpenArchiveDataEx_set_Callback_1(self, arg0);
};
    Object.defineProperty(RAROpenArchiveDataEx.prototype, 'Callback', { get: RAROpenArchiveDataEx.prototype.get_Callback, set: RAROpenArchiveDataEx.prototype.set_Callback });
  RAROpenArchiveDataEx.prototype['get_OpenResult'] = RAROpenArchiveDataEx.prototype.get_OpenResult = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RAROpenArchiveDataEx_get_OpenResult_0(self);
};
    RAROpenArchiveDataEx.prototype['set_OpenResult'] = RAROpenArchiveDataEx.prototype.set_OpenResult = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RAROpenArchiveDataEx_set_OpenResult_1(self, arg0);
};
    Object.defineProperty(RAROpenArchiveDataEx.prototype, 'OpenResult', { get: RAROpenArchiveDataEx.prototype.get_OpenResult, set: RAROpenArchiveDataEx.prototype.set_OpenResult });
  RAROpenArchiveDataEx.prototype['get_Flags'] = RAROpenArchiveDataEx.prototype.get_Flags = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RAROpenArchiveDataEx_get_Flags_0(self);
};
    RAROpenArchiveDataEx.prototype['set_Flags'] = RAROpenArchiveDataEx.prototype.set_Flags = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RAROpenArchiveDataEx_set_Flags_1(self, arg0);
};
    Object.defineProperty(RAROpenArchiveDataEx.prototype, 'Flags', { get: RAROpenArchiveDataEx.prototype.get_Flags, set: RAROpenArchiveDataEx.prototype.set_Flags });
  RAROpenArchiveDataEx.prototype['__destroy__'] = RAROpenArchiveDataEx.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_RAROpenArchiveDataEx___destroy___0(self);
};
// VoidPtr
/** @suppress {undefinedVars, duplicate} */function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

  VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};
(function() {
  function setupEnums() {
    
  }
  if (runtimeInitialized) setupEnums();
  else addOnPreMain(setupEnums);
})();

