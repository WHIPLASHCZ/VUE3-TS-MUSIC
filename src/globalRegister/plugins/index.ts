import lazyPlugin from "vue3-lazy";
interface obj {
  [index: string]: any;
}
let plugins: obj = {
  plg: {
    plugin: lazyPlugin,
    config: {
      loading: require("@/assets/images/default.png"),
      // error:''
    },
  },
};
export default function(app: any) {
  for (let p in plugins) {
    app.use(plugins[p].plugin, plugins[p].config);
  }
}
