import { reactive } from "../reactive";
import { effect, stop } from "../effect";
describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    // update
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should return runner when call effect", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });
  it("scheduler", () => {
    // 1.通过 effect的第二个参数给定的 一个 scheduler的 fn
    // 2.effect第一次执行的时候还会执行fn
    // 3.当响应式对象 set update 不会执行 fn 而是执行 scheduler
    // 4.如果说当执行 runner的时候，会再次执行 fn

    let dummy;
    let run;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        scheduler,
      }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    // toHaveBeenCalledTimes(1)期望被调用1次
    expect(scheduler).toHaveBeenCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    // should have run
    expect(dummy).toBe(2);
  });
  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dummy).toBe(2);
    // stoped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });
  it("onStop", () => {
    const obj = reactive({ foo: 1 });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { onStop }
    );
    // onstop stop的回调函数，stop执行之后 onstop需要被执行一次
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
