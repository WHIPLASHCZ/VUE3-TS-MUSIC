import { ref, onMounted, computed } from "vue";
export default function useFixed(props: any) {
  let listRef = ref<HTMLElement>();
  let listsHeight = ref<number[]>([]);
  let fixedTitle = ref("");
  let scrollRef = ref<HTMLElement>();
  let scrollY = ref(0);
  let distance = ref(0);
  let titleHeight = 30;
  let currentIndex = ref(0);
  let mapTitleToHeight = ref(new Map());
  //   title被顶上去的动画效果
  let fixedStyle = computed(() => {
    let distanceVal = distance.value;
    let diff =
      distanceVal >= 0 && distanceVal <= titleHeight
        ? distanceVal - titleHeight
        : 0;
    return {
      transform: `translate(0,${diff}px)`,
    };
  });

  function calulate() {
    let list = listRef.value?.children;
    listsHeight.value.push(0);
    mapTitleToHeight.value.set(props.list[0].title, 0);
    for (let i = 1; i < list!.length; i++) {
      let currentHeight = (list![i] as HTMLElement).offsetTop;
      listsHeight.value.push(currentHeight);
      mapTitleToHeight.value.set(props.list[i].title, currentHeight);
    }
  }

  onMounted(() => {
    calulate();
    fixedTitle.value = props.list[0].title;
    let i = 0;
    let len = listsHeight.value.length - 1;
    let listHeightVal = listsHeight.value;
    (scrollRef.value?.scroll as any).on("scroll", (pos: any) => {
      scrollY.value = -pos.y;
      for (i = 0; i < len; i++) {
        if (
          scrollY.value >= listHeightVal[i] &&
          scrollY.value <= listHeightVal[i + 1]
        ) {
          fixedTitle.value = props.list[i].title;
          distance.value = listHeightVal[i + 1] - scrollY.value;
          currentIndex.value = i;
          break;
        } else if (scrollY.value >= listHeightVal[len]) {
          fixedTitle.value = props.list[len].title;
          currentIndex.value = len;
          distance.value = listHeightVal[len] - scrollY.value;
        }
      }
    });
  });

  return {
    listRef,
    fixedTitle,
    scrollRef,
    scrollY,
    fixedStyle,
    currentIndex,
    mapTitleToHeight,
  };
}
