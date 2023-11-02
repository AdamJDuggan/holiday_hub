"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutingModule = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const routes = [];
@(0, core_1.NgModule)({
    imports: [router_1.RouterModule.forRoot(routes)],
    exports: [router_1.RouterModule]
})
class AppRoutingModule {
}
exports.AppRoutingModule = AppRoutingModule;
