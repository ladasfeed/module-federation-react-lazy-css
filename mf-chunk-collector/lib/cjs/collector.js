"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exposedComponent = exports.MfLoader = exports.MfLazyChunkLoaderFactory = exports.ChunkCollectorContext = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
// METHODS
const defaultContextValue = {
    collectChunk: () => { },
};
exports.ChunkCollectorContext = (0, react_2.createContext)(defaultContextValue);
const MfLazyChunkLoaderFactory = (mfName) => ({ chunkName, fallback, children }) => {
    const context = (0, react_2.useContext)(exports.ChunkCollectorContext);
    // also we can use https://www.npmjs.com/package/webpack-remove-code-blocks
    if (typeof window === "undefined") {
        context.collectChunk({
            type: "lazy",
            name: chunkName,
            mf: mfName,
        });
    }
    return react_1.default.createElement(react_1.default.Suspense, { fallback: fallback }, children);
};
exports.MfLazyChunkLoaderFactory = MfLazyChunkLoaderFactory;
const MfLoader = ({ component, componentProps, mf, name, fallback, }) => {
    const context = (0, react_2.useContext)(exports.ChunkCollectorContext);
    if (typeof window === "undefined") {
        context.collectChunk({
            type: "federation",
            name,
            mf,
        });
    }
    return (react_1.default.createElement(react_1.default.Suspense, { fallback: fallback }, react_1.default.createElement(component, Object.assign(Object.assign({}, componentProps), { contextValue: context }))));
};
exports.MfLoader = MfLoader;
const exposedComponent = (component) => (_a) => {
    var { contextValue } = _a, componentProps = __rest(_a, ["contextValue"]);
    return (react_1.default.createElement(exports.ChunkCollectorContext.Provider, { value: contextValue || defaultContextValue }, react_1.default.createElement(component, componentProps)));
};
exports.exposedComponent = exposedComponent;
