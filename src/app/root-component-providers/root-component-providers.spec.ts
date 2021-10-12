import { Component, Injectable, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

function createDecoratedClasses() {
  @Injectable({
    providedIn: 'platform',
  })
  class TestPlatformService implements OnDestroy {
    static destroyCount = 0;
    static initializeCount = 0;

    constructor() {
      TestPlatformService.initializeCount += 1;
    }

    ngOnDestroy(): void {
      TestPlatformService.destroyCount += 1;
    }
  }

  @Injectable({
    providedIn: 'any',
  })
  class TestFeatureService implements OnDestroy {
    static destroyCount = 0;
    static initializeCount = 0;

    constructor() {
      TestFeatureService.initializeCount += 1;
    }

    ngOnDestroy(): void {
      TestFeatureService.destroyCount += 1;
    }
  }

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
    template: `
      <h1>TestApp</h1>

      <test-child></test-child>
    `,
  })
  class TestAppComponent implements OnInit, OnDestroy {
    static destroyCount = 0;
    static initializeCount = 0;

    constructor(
      platformService: TestPlatformService,
      rootService: TestRootService,
      featureService: TestFeatureService,
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

  @Injectable()
  class TestChildComponentService implements OnDestroy {
    static destroyCount = 0;
    static initializeCount = 0;

    constructor() {
      TestChildComponentService.initializeCount += 1;
    }

    ngOnDestroy(): void {
      TestChildComponentService.destroyCount += 1;
    }
  }

  @Component({
    providers: [TestChildComponentService],
    selector: 'test-child',
    template: '<h2>TestChild</h2>',
  })
  class TestChildComponent {
    static destroyCount = 0;
    static initializeCount = 0;

    constructor(childComponentService: TestChildComponentService) {}

    ngOnInit(): void {
      TestChildComponent.initializeCount += 1;
    }

    ngOnDestroy(): void {
      TestChildComponent.destroyCount += 1;
    }
  }

  @NgModule({
    declarations: [TestAppComponent, TestEmptyAppComponent, TestChildComponent],
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
    TestChildComponent,
    TestChildComponentService,
    TestComponentService,
    TestEmptyAppComponent,
    TestFeatureService,
    TestPlatformService,
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
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
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
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
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            fixture.destroy();
            fixture.destroy();

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            fixture.destroy();
            fixture.destroy();

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n - 1);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n - 1);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root component, n-1 times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n - 1);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n - 1);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a component-level service, n-1 times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBe(rootDestroyCount);
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(
              n - 1
            );
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n - 1);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n - 1);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 16;

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component, n-1 times in total #${
            index + 1
          }`, () => {
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n - 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n - 1);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service, n-1 times in total #${
            index + 1
          }`, () => {
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(
              n - 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
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
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
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
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);

            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
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
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(0);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(0);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(0);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
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
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 4)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 20;

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
          });
        });

      Array(n / 5)
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

      Array(n / 5)
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

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a feature-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestFeatureService.destroyCount;

            TestBed.resetTestingModule();
            TestBed.resetTestingModule();

            expect(TestFeatureService.destroyCount).toBe(destroyCount + 1);
            expect(TestFeatureService.destroyCount).toBeLessThanOrEqual(n);
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 20;

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            fixture.destroy();
            fixture.destroy();

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            fixture.destroy();
            fixture.destroy();

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
          });
        });

      Array(n / 5)
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

      Array(n / 5)
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

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a feature-level service, n times in total #${
            index + 1
          }`, () => {
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 20;

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root component, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a component-level service, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBe(rootDestroyCount);
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
          });
        });

      Array(n / 5)
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

      Array(n / 5)
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

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a feature-level service, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestFeatureService.destroyCount;

            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestFeatureService.destroyCount).toBe(destroyCount);
            expect(TestFeatureService.destroyCount).toBeLessThanOrEqual(n);
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 20;

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component, n times in total #${
            index + 1
          }`, () => {
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service, n times in total #${
            index + 1
          }`, () => {
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root module, n times in total #${index + 1}`, () => {
            expect(TestAppModule.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a root-level service, n times in total #${
            index + 1
          }`, () => {
            expect(TestRootService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a feature-level service, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestFeatureService.destroyCount;

            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestFeatureService.destroyCount).toBe(destroyCount);
            expect(TestFeatureService.destroyCount).toBeLessThanOrEqual(n);
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 20;

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
          });
        });

      Array(n / 5)
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

      Array(n / 5)
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

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a feature-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestFeatureService.destroyCount;

            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestFeatureService.destroyCount).toBe(destroyCount + 1);
            expect(TestFeatureService.destroyCount).toBeLessThanOrEqual(n);
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 20;

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);

            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys the root module, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppModule.destroyCount;

            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppModule.destroyCount).toBe(destroyCount);
            expect(TestAppModule.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a root-level service, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestRootService.destroyCount;

            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestRootService.destroyCount).toBe(destroyCount);
            expect(TestRootService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`never destroys a feature-level service, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestFeatureService.destroyCount;

            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestFeatureService.destroyCount).toBe(destroyCount);
            expect(TestFeatureService.destroyCount).toBeLessThanOrEqual(n);
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 20;

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root module once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppModule.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestAppModule.destroyCount).toBe(destroyCount + 1);
            expect(TestAppModule.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a root-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestRootService.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestRootService.destroyCount).toBe(destroyCount + 1);
            expect(TestRootService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a feature-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestFeatureService.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestEmptyAppComponent);

            expect(TestFeatureService.destroyCount).toBe(destroyCount + 1);
            expect(TestFeatureService.destroyCount).toBeLessThanOrEqual(n);
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

        expect(TestChildComponent.initializeCount).toBe(n);
        expect(TestChildComponent.destroyCount).toBe(n);

        expect(TestChildComponentService.initializeCount).toBe(n);
        expect(TestChildComponentService.destroyCount).toBe(n);

        expect(TestAppModule.initializeCount).toBe(n);
        expect(TestAppModule.destroyCount).toBe(n);

        expect(TestRootService.initializeCount).toBe(n);
        expect(TestRootService.destroyCount).toBe(n);

        expect(TestPlatformService.initializeCount).toBe(1);
        expect(TestPlatformService.destroyCount).toBe(0);

        expect(TestFeatureService.initializeCount).toBe(n);
        expect(TestFeatureService.destroyCount).toBe(n);
      });

      const {
        TestAppComponent,
        TestAppModule,
        TestChildComponent,
        TestChildComponentService,
        TestComponentService,
        TestEmptyAppComponent,
        TestFeatureService,
        TestPlatformService,
        TestRootService,
      } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const n = 20;

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestAppComponent.destroyCount;
            const childDestroyCount = TestChildComponent.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBe(rootDestroyCount + 1);
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponent.destroyCount).toBe(childDestroyCount + 1);
            expect(TestChildComponent.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a component-level service once, n times in total #${
            index + 1
          }`, () => {
            const rootDestroyCount = TestComponentService.destroyCount;
            const childDestroyCount = TestChildComponentService.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestComponentService.destroyCount).toBe(
              rootDestroyCount + 1
            );
            expect(TestComponentService.destroyCount).toBeLessThanOrEqual(n);
            expect(TestChildComponentService.destroyCount).toBe(
              childDestroyCount + 1
            );
            expect(TestChildComponentService.destroyCount).toBeLessThanOrEqual(
              n
            );
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root module once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestAppModule.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestAppModule.destroyCount).toBe(destroyCount + 1);
            expect(TestAppModule.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a root-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestRootService.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestRootService.destroyCount).toBe(destroyCount + 1);
            expect(TestRootService.destroyCount).toBeLessThanOrEqual(n);
          });
        });

      Array(n / 5)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys a feature-level service once, n times in total #${
            index + 1
          }`, () => {
            const destroyCount = TestFeatureService.destroyCount;

            fixture.destroy();
            TestBed.resetTestingModule();
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestFeatureService.destroyCount).toBe(destroyCount + 1);
            expect(TestFeatureService.destroyCount).toBeLessThanOrEqual(n);
          });
        });
    });
  });
});
