const debounce = (cb: fn, timeout: number) => {
  let timer: any;
  let that = this;
  return function() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      cb.call(that, arguments);
    }, timeout);
  };
};

export default debounce;
