import { Component, Injectable, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

function createDecoratedClasses() {
  @Injectable({
    providedIn: 'root',
  })
  class TestRootService implements OnDestroy {
    static destroyCount = 0;
    static initializeCount = 0;

    constructor() {
      TestRootService.initializeCount += 1;
    }

    ngOnDestroy(): void {
      TestRootService.destroyCount += 1;
    }
  }

  @Injectable()
  class TestComponentService implements OnDestroy {
    static destroyCount = 0;
    static initializeCount = 0;

    constructor() {
      TestComponentService.initializeCount += 1;
    }

    ngOnDestroy(): void {
      TestComponentService.destroyCount += 1;
    }
  }

  @Component({
    providers: [TestComponentService],
    selector: 'test-app',
    template: '<h1>TestApp</h1>',
  })
  class TestAppComponent implements OnInit, OnDestroy {
    static destroyCount = 0;
    static initializeCount = 0;

    constructor(
      rootService: TestRootService,
      componentService: TestComponentService
    ) {}

    ngOnInit(): void {
      TestAppComponent.initializeCount += 1;
    }

    ngOnDestroy(): void {
      TestAppComponent.destroyCount += 1;
    }
  }

  @Component({
    selector: 'test-empty-app',
    template: '<h1>TestEmptyApp</h1>',
  })
  class TestEmptyAppComponent {}

  @NgModule({
    declarations: [TestAppComponent, TestEmptyAppComponent],
    providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
  })
  class TestAppModule implements OnDestroy {
    static destroyCount = 0;
    static initializeCount = 0;

    constructor() {
      TestAppModule.initializeCount += 1;
    }

    ngOnDestroy(): void {
      TestAppModule.destroyCount += 1;
    }
  }

  return {
    TestAppComponent,
    TestAppModule,
    TestComponentService,
    TestEmptyAppComponent,
    TestRootService,
  };
}

describe('Root component with component-level service', () => {
  describe('When module teardown is disabled (default)', () => {
    const destroyAfterEach = false;

    describe('TestBed.resetTestingModule', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppComponent.destroyCount;

            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBe(destroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestComponentService.destroyCount;
            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestComponentService.destroyCount).toBe(destroyCount + 1);
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module #${index + 1}`, () => {
            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestAppModule.destroyCount).toBe(0);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestRootService.destroyCount).toBe(0);
          });
        });
    });

    describe('ComponentFixture#destroy', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppComponent.destroyCount;
            fixture.destroy();
            fixture.destroy();

            expect(TestAppComponent.destroyCount).toBe(destroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestComponentService.destroyCount;
            fixture.destroy();
            fixture.destroy();

            expect(TestComponentService.destroyCount).toBe(destroyCount + 1);
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module #${index + 1}`, () => {
            fixture.destroy();
            fixture.destroy();

            expect(TestAppModule.destroyCount).toBe(0);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            fixture.destroy();
            fixture.destroy();

            expect(TestRootService.destroyCount).toBe(0);
          });
        });
    });

    describe('TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n - 1);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n - 1);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n-1 times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppComponent.destroyCount;
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBe(destroyCount);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n - 1);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n-1 times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestComponentService.destroyCount;
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBe(destroyCount);
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(
              n - 1
            );
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module #${index + 1}`, () => {
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppModule.destroyCount).toBe(0);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestRootService.destroyCount).toBe(0);
          });
        });
    });

    describe('afterEach', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n - 1);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n - 1);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n-1 times in total #${
            index + 1
          }`, () => {
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n - 1);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n-1 times in total #${
            index + 1
          }`, () => {
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(
              n - 1
            );
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module #${index + 1}`, () => {
            expect(TestAppModule.destroyCount).toBe(0);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            expect(TestRootService.destroyCount).toBe(0);
          });
        });
    });

    describe('TestBed.resetTestingModule + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              2 * n - 1
            );
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(
              2 * n - 1
            );
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module #${index + 1}`, () => {
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppModule.destroyCount).toBe(0);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestRootService.destroyCount).toBe(0);
          });
        });
    });

    describe('ComponentFixture#destroy + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module #${index + 1}`, () => {
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppModule.destroyCount).toBe(0);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestRootService.destroyCount).toBe(0);
          });
        });
    });

    describe('ComponentFixture#destroy + TestBed.resetTestingModule + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppModule.destroyCount).toBe(0);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestRootService.destroyCount).toBe(0);
          });
        });
    });

    describe('ComponentFixture#destroy + TestBed.resetTestingModule', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestAppModule.destroyCount).toBe(0);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestRootService.destroyCount).toBe(0);
          });
        });
    });
  });

  describe('When module teardown is enabled', () => {
    const destroyAfterEach = true;

    describe('TestBed.resetTestingModule', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppComponent.destroyCount;

            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBe(destroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestComponentService.destroyCount;

            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestComponentService.destroyCount).toBe(destroyCount + 1);
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root module once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppModule.destroyCount;

            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestAppModule.destroyCount).toBe(destroyCount + 1);
            expect(TestAppModule.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a root-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestRootService.destroyCount;

            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestRootService.destroyCount).toBe(destroyCount + 1);
            expect(TestRootService.destroyCount).toBeLessThanOrEqual(n);
          });
        });
    });

    describe('ComponentFixture#destroy', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppComponent.destroyCount;

            fixture.destroy();
            fixture.destroy();

            expect(TestAppComponent.destroyCount).toBe(destroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestComponentService.destroyCount;

            fixture.destroy();
            fixture.destroy();

            expect(TestComponentService.destroyCount).toBe(destroyCount + 1);
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppModule.destroyCount;

            fixture.destroy();
            fixture.destroy();

            expect(TestAppModule.destroyCount).toBe(destroyCount);
            expect(TestAppModule.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            const destroyCount = TestRootService.destroyCount;

            fixture.destroy();
            fixture.destroy();

            expect(TestRootService.destroyCount).toBe(destroyCount);
            expect(TestRootService.destroyCount).toBeLessThanOrEqual(n);
          });
        });
    });

    describe('TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root component, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppComponent.destroyCount;

            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBe(destroyCount);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a component-level service, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestComponentService.destroyCount;

            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBe(destroyCount);
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppModule.destroyCount;

            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppModule.destroyCount).toBe(destroyCount);
            expect(TestAppModule.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestRootService.destroyCount;

            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestRootService.destroyCount).toBe(destroyCount);
            expect(TestRootService.destroyCount).toBeLessThanOrEqual(n);
          });
        });
    });

    describe('afterEach', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component, n times in total #${
            index + 1
          }`, () => {
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service, n times in total #${
            index + 1
          }`, () => {
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root module, n times in total #${index + 1}`, () => {
            expect(TestAppModule.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a root-level service, n times in total #${
            index + 1
          }`, () => {
            expect(TestRootService.destroyCount).toBeLessThanOrEqual(n);
          });
        });
    });

    describe('TestBed.resetTestingModule + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppComponent.destroyCount;

            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBe(destroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestComponentService.destroyCount;

            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBe(destroyCount + 1);
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root module once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppModule.destroyCount;

            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppModule.destroyCount).toBe(destroyCount + 1);
            expect(TestAppModule.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a root-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestRootService.destroyCount;

            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestRootService.destroyCount).toBe(destroyCount + 1);
            expect(TestRootService.destroyCount).toBeLessThanOrEqual(n);
          });
        });
    });

    describe('ComponentFixture#destroy + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module #${index + 1}`, () => {
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppModule.destroyCount).toBe(0);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestRootService.destroyCount).toBe(0);
          });
        });
    });

    describe('ComponentFixture#destroy + TestBed.resetTestingModule + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppModule.destroyCount).toBe(0);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestRootService.destroyCount).toBe(0);
          });
        });
    });

    describe('ComponentFixture#destroy + TestBed.resetTestingModule', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [TestAppModule],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.initializeCount).toBe(n);
        expect(TestAppComponent.destroyCount).toBe(n);

        expect(TestComponentService.initializeCount).toBe(n);
        expect(TestComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestComponentService,
        TestEmptyAppComponent,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestAppModule.destroyCount).toBe(0);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestRootService.destroyCount).toBe(0);
          });
        });
    });
  });
});
