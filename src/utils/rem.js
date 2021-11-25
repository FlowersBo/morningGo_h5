// 设置 rem 函数
function setRem () {
  // 375px iphone6 屏幕的大小; 375px = 20rem; 1rem = 18.75px
  let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
//得到html的Dom元素
  let htmlDom = document.getElementsByTagName('html')[0];
//设置根元素字体大小
  htmlDom.style.fontSize= htmlWidth/10 + 'px';
  console.log(htmlDom.style.fontSize);
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}

