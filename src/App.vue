<template>
  <div id="app">
    <h1 class="display-4">Welcome to SIDCloud</h1>

    <audio id="radio" controls preload="none" loop>
      <!-- <source src="http://sidcloud.net/api/v1/audio" type="audio/wav" /> -->
      <source src="http://localhost/api/v1/audio" type="audio/wav" />
    </audio>
    <p />

    <div class="input-group">
      <input
        v-model="sid_link"
        style="margin-left: 20px"
        v-on:keyup.enter="Link"
        placeholder="Paste SID or PRG file link and press Enter to play"
        class="form-control"
      />
      <div class="input-group-append" id="button-addon4">
        <button
          type="button"
          style="margin-right: 20px; margin-left: 5px"
          class="btn btn-success"
          v-on:click="Link"
        >Stream Go...</button>
      </div>
    </div>

    <div class="alert alert-light" role="alert">{{ sid_data }}</div>

    <!-- <input
      class="form-control"
      v-model="handle_id"
      v-on:keyup.enter="Handle"
      placeholder="Type scener handle"
    />
    <p>{{ handle_name }}</p>-->
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      handle_id: 0,
      handle_name: null,
      info: null,
      sid_link: null,
      sid_data: null,
      query_url: ""
    };
  },
  name: "app",
  components: {},
  methods: {
    // ==========================================================
    // Odczyt danych o scenerze
    // ==========================================================
    Handle: function() {
      var query =
        "https://csdb.dk/webservice/?type=scener&id=" + this.handle_id;
      // eslint-disable-next-line
      console.log("Query = " + query);

      axios.get(query).then(response => (this.handle_name = response.data));

      // eslint-disable-next-line
      console.log("Scener " + this.handle_name);
    },

    // ==========================================================
    // Odtworzenie SIDa
    // ==========================================================
    Link: function() {
      // var query = "http://sidcloud.net/api/v1/audio?sid_url=" + this.sid_link;
      var query = "http://localhost/api/v1/audio?sid_url=" + this.sid_link;
      // eslint-disable-next-line
      console.log("Query = " + query);

      var player = document.getElementById("radio");

      player.pause();
      player.currentTime = 0.0;

      axios.post(query).then(response => {
        this.sid_data = response.data;

        // eslint-disable-next-line
        console.log("SID data " + this.sid_data);

        player.load();
        player.play();
      });

      // player.currentTime = 0.0;
      // player.pause();
      // player.currentTime = 0.0;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  /* -moz-osx-font-smoothing: grayscale; */
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
