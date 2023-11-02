"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
const core_1 = require("@angular/core");
@(0, core_1.Component)({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass'],
})
class AppComponent {
    title = 'client';
    ngOnInit() {
        fetch('https://localhost:5000/api/goals')
            .then((res) => res.json())
            .then((res) => console.log('RES', res));
    }
}
exports.AppComponent = AppComponent;
