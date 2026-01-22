"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/nanoevents";
exports.ids = ["vendor-chunks/nanoevents"];
exports.modules = {

/***/ "(ssr)/./node_modules/nanoevents/index.js":
/*!******************************************!*\
  !*** ./node_modules/nanoevents/index.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createNanoEvents: () => (/* binding */ createNanoEvents)\n/* harmony export */ });\nlet createNanoEvents = ()=>({\n        emit (event, ...args) {\n            for(let callbacks = this.events[event] || [], i = 0, length = callbacks.length; i < length; i++){\n                callbacks[i](...args);\n            }\n        },\n        events: {},\n        on (event, cb) {\n            ;\n            (this.events[event] ||= []).push(cb);\n            return ()=>{\n                this.events[event] = this.events[event]?.filter((i)=>cb !== i);\n            };\n        }\n    });\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbmFub2V2ZW50cy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQU8sSUFBSUEsbUJBQW1CLElBQU87UUFDbkNDLE1BQUtDLEtBQUssRUFBRSxHQUFHQyxJQUFJO1lBQ2pCLElBQ0UsSUFBSUMsWUFBWSxJQUFJLENBQUNDLE1BQU0sQ0FBQ0gsTUFBTSxJQUFJLEVBQUUsRUFDdENJLElBQUksR0FDSkMsU0FBU0gsVUFBVUcsTUFBTSxFQUMzQkQsSUFBSUMsUUFDSkQsSUFDQTtnQkFDQUYsU0FBUyxDQUFDRSxFQUFFLElBQUlIO1lBQ2xCO1FBQ0Y7UUFDQUUsUUFBUSxDQUFDO1FBQ1RHLElBQUdOLEtBQUssRUFBRU8sRUFBRTs7WUFDUixLQUFJLENBQUNKLE1BQU0sQ0FBQ0gsTUFBTSxLQUFLLEVBQUUsRUFBRVEsSUFBSSxDQUFDRDtZQUNsQyxPQUFPO2dCQUNMLElBQUksQ0FBQ0osTUFBTSxDQUFDSCxNQUFNLEdBQUcsSUFBSSxDQUFDRyxNQUFNLENBQUNILE1BQU0sRUFBRVMsT0FBT0wsQ0FBQUEsSUFBS0csT0FBT0g7WUFDOUQ7UUFDRjtJQUNGLEdBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdGF5aW4tdWJ1ZC8uL25vZGVfbW9kdWxlcy9uYW5vZXZlbnRzL2luZGV4LmpzP2M1ZjQiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGxldCBjcmVhdGVOYW5vRXZlbnRzID0gKCkgPT4gKHtcbiAgZW1pdChldmVudCwgLi4uYXJncykge1xuICAgIGZvciAoXG4gICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5ldmVudHNbZXZlbnRdIHx8IFtdLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gY2FsbGJhY2tzLmxlbmd0aDtcbiAgICAgIGkgPCBsZW5ndGg7XG4gICAgICBpKytcbiAgICApIHtcbiAgICAgIGNhbGxiYWNrc1tpXSguLi5hcmdzKVxuICAgIH1cbiAgfSxcbiAgZXZlbnRzOiB7fSxcbiAgb24oZXZlbnQsIGNiKSB7XG4gICAgOyh0aGlzLmV2ZW50c1tldmVudF0gfHw9IFtdKS5wdXNoKGNiKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLmV2ZW50c1tldmVudF0gPSB0aGlzLmV2ZW50c1tldmVudF0/LmZpbHRlcihpID0+IGNiICE9PSBpKVxuICAgIH1cbiAgfVxufSlcbiJdLCJuYW1lcyI6WyJjcmVhdGVOYW5vRXZlbnRzIiwiZW1pdCIsImV2ZW50IiwiYXJncyIsImNhbGxiYWNrcyIsImV2ZW50cyIsImkiLCJsZW5ndGgiLCJvbiIsImNiIiwicHVzaCIsImZpbHRlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/nanoevents/index.js\n");

/***/ })

};
;