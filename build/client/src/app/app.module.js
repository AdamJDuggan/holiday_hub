"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
// Angular modules
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const app_routing_module_1 = require("./app-routing.module");
const animations_1 = require("@angular/platform-browser/animations");
// Components
const app_component_1 = require("./app.component");
const home_component_1 = require("./home/home.component");
const navbar_component_1 = require("./navbar/navbar.component");
// Material
const toolbar_1 = require("@angular/material/toolbar");
const icon_1 = require("@angular/material/icon");
const button_1 = require("@angular/material/button");
@(0, core_1.NgModule)({
    declarations: [app_component_1.AppComponent, home_component_1.HomeComponent, navbar_component_1.NavbarComponent],
    imports: [
        app_routing_module_1.AppRoutingModule,
        animations_1.BrowserAnimationsModule,
        platform_browser_1.BrowserModule,
        button_1.MatButtonModule,
        icon_1.MatIconModule,
        toolbar_1.MatToolbarModule,
    ],
    providers: [],
    bootstrap: [app_component_1.AppComponent],
})
class AppModule {
}
exports.AppModule = AppModule;
