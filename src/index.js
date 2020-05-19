const app = new Vue({
  el: "#app",
  data: {
    date: new Date().toLocaleString(),
    name: "vue",
    tip: "<strong>just a demo</strong>",
  },
  created() {
    console.log("Created.");
    setTimeout(() => {
      this.name = "fake vue";
      console.log("Name changed.");
    }, 3000);
  },
  methods: {
    onClick() {
      console.log("clicked");
    },
  },
});
