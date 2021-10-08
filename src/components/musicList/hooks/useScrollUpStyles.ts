import { ref, computed } from "vue";
export default function useScrollUpStyles(props: any) {
  let scrollY = ref(0);
  let scrollLimits = ref(0);
  let imgHeight = ref<number>(0);
  let scrollRef = ref();
  let scrollOffsetTop = ref(0);
  let imgRef = ref<HTMLElement>();

  let showRandom = computed(() => {
    return scrollY.value > scrollLimits.value;
  });

  let getScale = () => {
    let scale = 1;
    let bgHeight = imgHeight.value;
    let scrollDistance = scrollY.value;
    if (scrollDistance > 0) {
      //   下拉时图片放大 用 1 + 下拉距离除以图片高度 得到放大的比例
      scale = Number((1 + scrollDistance / bgHeight).toFixed(2));
    }
    return scale;
  };

  //   歌手图片样式
  let bgImgStyle = computed(() => {
    let paddingTop = "70%";
    let height = "0px";
    let translateZ = 0;
    if (scrollY.value < scrollLimits.value) {
      paddingTop = "0px";
      height = "46px";
      translateZ = 1;
    }
    return {
      backgroundImage: `url(${props.pic})`,
      paddingTop,
      height,
      transform: `scale(${getScale()}) translateZ(${translateZ})`,
    };
  });

  //   模糊遮罩层样式
  let filterStyle = computed(() => {
    let blur = 0;
    let limits = scrollLimits.value;
    let bgHeight = imgHeight.value;
    let scrollDistance = scrollY.value;
    if (scrollY.value < 0) {
      blur = Math.min(-limits / bgHeight, -scrollDistance / bgHeight) * 10;
    }
    return {
      backdropFilter: `blur(${blur}px)`,
      transform: `scale(${getScale()})`,
    };
  });

  //   上班区父盒子样式
  let zIndex = computed(() => {
    if (scrollY.value < scrollLimits.value) return 20;
    return 1;
  });

  return {
    bgImgStyle,
    zIndex,
    scrollRef,
    scrollOffsetTop,
    imgRef,
    imgHeight,
    scrollY,
    scrollLimits,
    filterStyle,
    showRandom,
  };
}
