<template>
  <div class="history">
    <Dialogs ref="dialogRef" @confirm="sureClearAll"></Dialogs>
    <h2 class="title" v-if="showTitle">
      <span>搜索历史</span>
      <i class="icon-clear" @click="clearAll"></i>
    </h2>
    <scroll :click="true" :probeType="3" :style="scrollHeight" ref="scrollRef">
      <ul class="historyList">
        <li v-for="i of historyList">
          <span class="name" @click="searchByHistory(i)">{{ i }}</span>
          <div class="delete" v-if="canDelete" @click.stop="deleteHistory(i)">
            <i class="icon-delete"></i>
          </div>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import Dialogs from "@/base-UI/dialog/dialogs.vue";
import { useStore } from "vuex";
import scroll from "@/components/wrap-scroll/wrap-scroll";
export default defineComponent({
  name: "historyList",

  emits: ["searchByHistory"],
  props: {
    showTitle: {
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
      default: window.innerHeight - 410,
    },
    canDelete: {
      type: Boolean,
      default: true,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    let $store = useStore();
    let historyList = computed(() => {
      let list = $store.state.searchHistory;
      let newList = [];
      if (props.reverse) {
        let j = 0;
        for (let i = list.length - 1; i >= 0; i--) {
          newList[j] = list[i];
          j++;
        }
        return newList;
      }
      return list;
    });
    let scrollRef = ref();

    const scrollHeight = computed(() => {
      let listLen = $store.state.player.playList.length;
      let listHeight = props.height;
      return {
        height: listLen ? listHeight - 60 + "px" : listHeight + "px",
      };
    });
    let dialogRef = ref();
    onMounted(() => {
      dialogRef.value.setText("确定清空搜索历史吗?");
    });

    function refreshScroll() {
      scrollRef.value.scroll.refresh();
    }
    function clearAll() {
      dialogRef.value.show();
    }
    function sureClearAll() {
      $store.commit("clearHistory");
    }
    function deleteHistory(his: obj) {
      $store.commit("removeRecord", his);
    }
    function searchByHistory(name: string) {
      context.emit("searchByHistory", name);
    }
    return {
      historyList,
      dialogRef,
      scrollRef,

      scrollHeight,
      refreshScroll,

      clearAll,
      sureClearAll,
      deleteHistory,
      searchByHistory,
    };
  },
  components: {
    Dialogs,
    scroll,
  },
});
</script>

<style lang="scss" scoped>
.title {
  margin: 10px 0 20px 0;
  font-size: 14px;
  color: $color-text-l;
  display: flex;
  justify-content: space-between;
}
.historyList {
  li {
    height: 40px;
    line-height: 40px;
    color: $color-text-l;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .name {
      flex: 1;
    }
    .delete {
      width: 20px;
      height: 100%;
      text-align: center;
      .icon-delete {
        font-size: 12px;
      }
    }
  }
}
</style>
