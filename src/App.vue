<template>
  <div class="head">
    <headers></headers>
    <tabs></tabs>
  </div>

  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>

  <router-view name="user" v-slot="{ Component }">
    <transition name="slide">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>

  <player></player>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import headers from "@/components/header/headers.vue";
import tabs from "@/components/tabs/tabs.vue";
import player from "@/components/player/player.vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "app",
  setup() {
    // let playList = computed(() => $store.state.player.playList);
    return {};
  },
  components: {
    headers,
    tabs,
    player,
  },
});
</script>
<style lang="scss">
.head {
  z-index: 9;
  position: relative;
  top: 0px;
  background-color: #2222;
  height: 92px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
