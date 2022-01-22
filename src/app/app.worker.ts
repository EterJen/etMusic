/// <reference lib="webworker" />

/*
* 耗时操作放到后台 开启多线程 不影响ui刷新
* */
addEventListener('message', ({data}) => {
  const response = `web worker receive message ${data}, will response bar `;
  console.log(`listen message: ${data}`);
  setTimeout(() => {
    postMessage('bar');
  }, 2000);
});
