<template>
  <div class="search-input">
    <i class="icon-search" @click="search"></i>
    <input
      type="text"
      class="input-inner"
      :value="searchInfo"
      @input="submit"
      ref="inputRef"
      placeholder="请搜索歌手/歌曲"
    />
    <i v-show="searchInfo" class="icon-dismiss" @click="clearAll"></i>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  InputHTMLAttributes,
  ref,
  watch,
  onBeforeUnmount,
} from "vue";
import debounce from "@/utils/debounce";
export default defineComponent({
  name: "search-input",
  props: {
    searchInfo: {
      type: String,
      default: "",
    },
  },
  emits: ["update:searchInfo"],
  setup(props, context) {
    let inputRef = ref<InputHTMLAttributes>();
    let submit: fn | null = debounce(function() {
      context.emit("update:searchInfo", inputRef.value!.value.trim());
    }, 330);
    function clearAll() {
      context.emit("update:searchInfo", "");
    }
    function search() {
      console.log(props.searchInfo);
    }
    onBeforeUnmount(() => {
      submit = null;
    });
    return {
      inputRef,
      submit,
      clearAll,
      search,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-input {
  width: 100%;
  display: flex;
  background-color: rgb(70, 70, 70);
  height: 40px;
  align-items: center;
  box-sizing: border-box;
  border-radius: 6px;
  i {
    width: 36px;
    text-align: center;
    height: 100%;
    line-height: 40px;
  }
  .icon-search {
    font-size: 22px;
  }
  .input-inner {
    flex: 1;
    background-color: transparent;
    height: 100%;
    outline: none;
    color: #fff;
    font-size: 14px;
  }
}
</style>
