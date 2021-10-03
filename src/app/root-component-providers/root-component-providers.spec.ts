import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

function createDecoratedClasses() {
  @Injectable()
  class TestService implements OnDestroy {
    static destroyCount = 0;
    static initializeCount = 0;

    constructor() {
      TestService.initializeCount += 1;
    }

    ngOnDestroy(): void {
      TestService.destroyCount += 1;
    }
  }

  @Component({
    providers: [TestService],
    selector: 'test-app',
    template: '<h1>TestApp</h1>',
  })
  class TestAppComponent implements OnInit, OnDestroy {
    static destroyCount = 0;
    static initializeCount = 0;

    ngOnInit(): void {
      TestAppComponent.initializeCount += 1;
    }

    ngOnDestroy(): void {
      TestAppComponent.destroyCount += 1;
    }
  }

  return {
    TestAppComponent,
    TestService,
  };
}

describe('Root component with component-level service', () => {
  describe('When module teardown is disabled (default)', () => {
    const destroyAfterEach = false;

    describe('TestBed.resetTestingModule', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(testCases);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component n times #${index + 1}`, () => {
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              testCases
            );
          });
        });

      it('never destroys a component-level service', () => {
        TestBed.resetTestingModule();

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('ComponentFixture#destroy', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(testCases);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component n times #${index + 1}`, () => {
            fixture.destroy();

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              testCases
            );
          });
        });

      it('never destroys a component-level service', () => {
        fixture.destroy();

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(2 * (testCases - 1));
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component 2(n-1) times #${index + 1}`, () => {
            TestBed.createComponent(TestAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              2 * (testCases - 1)
            );
          });
        });

      it('never destroys a component-level service', () => {
        TestBed.createComponent(TestAppComponent);

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('afterEach', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(testCases - 1);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component n-1 times #${index + 1}`, () => {
            expect(TestAppComponent.destroyCount).toBeLessThan(testCases);
          });
        });

      it('never destroys a component-level service', () => {
        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('TestBed.resetTestingModule + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(2 * testCases - 1);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component 2n-1 times #${index + 1}`, () => {
            TestBed.resetTestingModule();
            TestBed.createComponent(TestAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              2 * testCases - 1
            );
          });
        });

      it('never destroys a component-level service', () => {
        TestBed.resetTestingModule();
        TestBed.createComponent(TestAppComponent);

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('ComponentFixture#destroy + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(2 * testCases - 1);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component 2n-1 times #${index + 1}`, () => {
            fixture.destroy();
            TestBed.createComponent(TestAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              2 * testCases - 1
            );
          });
        });

      it('never destroys a component-level service', () => {
        fixture.destroy();
        TestBed.createComponent(TestAppComponent);

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('ComponentFixture#destroy + TestBed.resetTestingModule + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(2 * testCases - 1);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component 2n-1 times #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              2 * testCases - 1
            );
          });
        });

      it('never destroys a component-level service', () => {
        fixture.destroy();
        TestBed.resetTestingModule();
        TestBed.createComponent(TestAppComponent);

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('ComponentFixture#destroy + TestBed.resetTestingModule', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(testCases);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component n times #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              2 * testCases - 1
            );
          });
        });

      it('never destroys a component-level service', () => {
        fixture.destroy();
        TestBed.resetTestingModule();

        expect(TestService.destroyCount).toBe(0);
      });
    });
  });

  describe('When module teardown is enabled', () => {
    const destroyAfterEach = true;

    describe('TestBed.resetTestingModule', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(testCases);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component n times #${index + 1}`, () => {
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              testCases
            );
          });
        });

      it('never destroys a component-level service', () => {
        TestBed.resetTestingModule();

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('ComponentFixture#destroy', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(testCases);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component n times #${index + 1}`, () => {
            fixture.destroy();

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              testCases
            );
          });
        });

      it('never destroys a component-level service', () => {
        fixture.destroy();

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(2 * testCases);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component 2n times #${index + 1}`, () => {
            TestBed.createComponent(TestAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              2 * testCases
            );
          });
        });

      it('never destroys a component-level service', () => {
        TestBed.createComponent(TestAppComponent);

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('afterEach', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(testCases);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component n times #${index + 1}`, () => {
            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              testCases
            );
          });
        });

      it('never destroys a component-level service', () => {
        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('TestBed.resetTestingModule + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(2 * testCases - 1);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component 2n-1 times #${index + 1}`, () => {
            TestBed.resetTestingModule();
            TestBed.createComponent(TestAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              2 * testCases - 1
            );
          });
        });

      it('never destroys a component-level service', () => {
        TestBed.resetTestingModule();
        TestBed.createComponent(TestAppComponent);

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('ComponentFixture#destroy + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(2 * testCases);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component 2n times #${index + 1}`, () => {
            fixture.destroy();
            TestBed.createComponent(TestAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              2 * testCases
            );
          });
        });

      it('never destroys a component-level service', () => {
        fixture.destroy();
        TestBed.createComponent(TestAppComponent);

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('ComponentFixture#destroy + TestBed.resetTestingModule + TestBed.createComponent', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(2 * testCases - 1);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component 2n-1 times #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();
            TestBed.createComponent(TestAppComponent);

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              2 * testCases - 1
            );
          });
        });

      it('never destroys a component-level service', () => {
        fixture.destroy();
        TestBed.resetTestingModule();
        TestBed.createComponent(TestAppComponent);

        expect(TestService.destroyCount).toBe(0);
      });
    });

    describe('ComponentFixture#destroy + TestBed.resetTestingModule', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestAppComponent],
          teardown: { destroyAfterEach },
        });

        fixture = TestBed.createComponent(TestAppComponent);
      });

      afterAll(() => {
        expect(TestAppComponent.destroyCount).toBe(testCases);
        expect(TestService.destroyCount).toBe(0);
      });

      const { TestAppComponent, TestService } = createDecoratedClasses();
      let fixture: ComponentFixture<unknown>;
      const testCases = 9;

      Array(testCases - 1)
        .fill(undefined)
        .forEach((_, index) => {
          it(`destroys the root component n times #${index + 1}`, () => {
            fixture.destroy();
            TestBed.resetTestingModule();

            expect(TestAppComponent.destroyCount).toBeLessThanOrEqual(
              2 * testCases - 1
            );
          });
        });

      it('never destroys a component-level service', () => {
        fixture.destroy();
        TestBed.resetTestingModule();

        expect(TestService.destroyCount).toBe(0);
      });
    });
  });
});
