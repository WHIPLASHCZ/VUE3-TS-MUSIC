import { ref } from "vue";
import animations from "create-keyframe-animation";
export default function() {
  let cdWrapperRef = ref();
  // 大CD漂移到小CD动画 需要求出大CD圆心到小CD圆心的距离
  //   CD横坐标偏移量：大CD圆心(屏幕中线)坐标减去小CD圆心坐标到屏幕左侧的距离
  //   CD纵坐标偏移量：屏幕高度 减去 大CD圆心到顶部的距离 减去 小CD圆心到底部的距离
  const { offsetY, offsetX, scale } = getPosAndScale();
  const enterAnimation = {
    0: {
      transform: `translate3d(${offsetX}px,${offsetY}px,0) scale(${scale})`,
    },
    100: {
      transform: `translate3d(0px,0px,0) scale(1)`,
    },
  };
  const leaveAnimation = {
    100: {
      transform: `translate3d(${offsetX}px,${offsetY}px,0) scale(${scale})`,
    },
    0: {
      transform: `translate3d(0px,0px,0) scale(1)`,
    },
  };

  function enter(el: any, done: fn) {
    animations.registerAnimation({
      name: "move",
      animation: enterAnimation,
      presets: {
        duration: 400,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
      },
    });
    animations.runAnimation(cdWrapperRef.value, "move", done);
  }
  function afterEnter() {
    animations.unregisterAnimation("move");
    cdWrapperRef.value.animation = "";
  }
  function leave(el: any, done: fn) {
    animations.registerAnimation({
      name: "leave",
      animation: leaveAnimation,
      presets: {
        duration: 400,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
      },
    });
    animations.runAnimation(cdWrapperRef.value, "leave", done);
  }
  function afterLeave() {
    animations.unregisterAnimation("leave");
    cdWrapperRef.value.animation = "";
    cdWrapperRef.value.style.animation = "";
  }
  function getPosAndScale() {
    const targetWidth = 40;
    const targetOffsetLeft = 40;
    const targetOffsetBottom = 30;
    const bigTop = 90;
    const bigWrapperWidth = 280;
    const midOfScreen = window.innerWidth / 2;
    const ScreenHeight = window.innerHeight;
    const offsetY =
      ScreenHeight - (bigTop + bigWrapperWidth / 2 + targetOffsetBottom);
    const offsetX = -(midOfScreen - targetOffsetLeft);
    const scale = targetWidth / bigWrapperWidth;
    return {
      offsetY,
      offsetX,
      scale,
    };
  }
  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave,
  };
}
