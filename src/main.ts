import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/index.scss";
import "@/assets/css/variable.scss";
import register from "@/globalRegister/plugins/index";
import directivesRegister from "@/globalRegister/directives";
import bubble from "@/base-UI/bubble/bubble.vue";
import "@/utils/oldSongHandler";

const app = createApp(App);
app.use(store);
app.use(router);
app.component("bubble", bubble);
register(app);
directivesRegister(app);

app.mount("#app");
