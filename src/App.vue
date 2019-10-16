<template>
  <div id="app">
    <p>Welcome to SIDCloud</p>
    <input
      class="form-control"
      v-model="handle_id"
      v-on:keyup.enter="Handle"
      placeholder="Type scener handle"
    />
    <p>{{ handle_name }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      handle_id: 0,
      handle_name: null,
      info: null
    };
  },
  name: "app",
  components: {},
  methods: {
    Handle: function() {
      var query =
        "https://csdb.dk/webservice/?type=scener&id=" + this.handle_id;
      // eslint-disable-next-line
      console.log("Query = " + query);

      axios
        .get(query)
        .then(response => (this.handle_name = response.data));

      // eslint-disable-next-line
      console.log("Scener " + this.handle_name);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
