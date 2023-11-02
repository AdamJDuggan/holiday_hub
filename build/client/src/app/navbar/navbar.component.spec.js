"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const navbar_component_1 = require("./navbar.component");
describe('NavbarComponent', () => {
    let component;
    let fixture;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({
            declarations: [navbar_component_1.NavbarComponent]
        });
        fixture = testing_1.TestBed.createComponent(navbar_component_1.NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
