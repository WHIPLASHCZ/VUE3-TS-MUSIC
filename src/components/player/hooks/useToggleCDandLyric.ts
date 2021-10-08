import { ref, computed } from "vue";

export default function() {
  let currentShowPage = ref("CD");
  let midLStyle = ref();
  let midRStyle = ref();
  let midBoxRef = ref();
  let forbidScrollY = ref(false);
  let currentView = "CD";
  const touch: obj = {};

  function onMiddleTouchStart(e: any) {
    forbidScrollY.value = false;
    touch.startX = e.touches[0].pageX;
    touch.startY = e.touches[0].pageY;
    touch.directLock = "";
  }
  function onMiddleTouchMove(e: any) {
    let distanceX = e.touches[0].pageX - touch.startX; //滑动终点减去最开始点击的坐标  算出滑动的距离
    let distanceY = e.touches[0].pageY - touch.startY;
    let distanceXabs = Math.abs(distanceX);
    let distanceYabs = Math.abs(distanceY);
    if (!touch.directLock) {
      touch.directLock = distanceXabs >= distanceYabs ? "X" : "Y";
    }
    if (touch.directLock == "Y") {
      console.log("y");
      forbidScrollY.value = false;
      return;
    } else {
      //   forbidScrollY.value = true;
    }

    let left = currentView == "CD" ? 0 : -window.innerWidth;
    let offsetWidth = Math.min(
      0,
      Math.max(-window.innerWidth, left + distanceX)
    ); //拖动距离等于本身left的值加上我们滑动的距离
    touch.percent = Math.abs(offsetWidth / window.innerWidth); //拖动距离除以屏幕宽度得到拖动比例
    // midBoxRef.value.style.right = `${touch.percent * 100}%`;
    // midBoxRef.value.style.transitionDuration = "0ms";
    if (currentView === "CD") {
      if (touch.percent >= 0.2) {
        currentShowPage.value = "lyric";
      }
    } else {
      if (touch.percent <= 0.8) {
        currentShowPage.value = "CD";
      }
    }
    midLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: "0ms",
    };
    midRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
      transitionDuration: "0ms",
    };
  }
  function onMiddleTouchEnd(e: any) {
    // forbidScrollY.value = false;
    let offsetWidth = 0;
    let opacity = 0;
    if (currentShowPage.value == "CD") {
      currentView = "CD";
      offsetWidth = 0;
      opacity = 1;
      //   midBoxRef.value.style.transitionDuration = "300ms";
      //   midBoxRef.value.style.right = "0%";
    } else {
      currentView = "lyric";
      offsetWidth = -window.innerWidth;
      opacity = 0;
      //   midBoxRef.value.style.transitionDuration = "300ms";
      //   midBoxRef.value.style.right = "100%";
    }
    const duration = 300;
    midLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`,
    };
    midRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
      transitionDuration: `${duration}ms`,
    };
  }

  return {
    currentShowPage,
    midLStyle,
    midRStyle,
    midBoxRef,
    forbidScrollY,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
  };
}
