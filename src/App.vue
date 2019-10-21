<template>
  <div id="app">
    <p>Welcome to SIDCloud</p>

    <!-- <div>
    <span>Total duration: {{ duration }} seconds</span>
    <span>Progress: {{ (progress * 100) }}%</span>
    <button @click="togglePlayback">{{ playing ? 'Pause' : 'Play' }}</button>
    <button @click="stop">Stop</button>
    </div>-->

    <!-- <audio id="audio" controls autoplay preload="none">
        <source :src=query_url type="audio/wav" />
    </audio>-->
    <!-- <audio
      src="http://localhost:8099/api/v1/audio"
      id="radio"
      preload="none"
      type="audio/wav"
      controls
    ></audio>-->

    <audio id="radio" controls preload="none">
      <source src="http://localhost:8099/api/v1/audio" type="audio/wav" />
    </audio>
    <p />

    <!-- <audio id="audio">
        <source src="http://localhost:8099/api/v1/audio" type="audio/wav" />
      </audio>
      <div class="player-controls">
        <div id="radioIcon"></div>
        <button id="playAudio"></button>
        <p>
          <small id="currentTime">00:00</small>
        </p>
    </div>-->

    <input
      class="form-control"
      v-model="sid_link"
      v-on:keyup.enter="Link"
      placeholder="Type SID or PRG file link"
    />
    <p>{{ sid_data }}</p>

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
// import {Howl} from 'howler';

// var track = new Audio("http://localhost:8099/api/v1/audio")

export default {
  // mixins: [VueHowler],
  data: function() {
    return {
      handle_id: 0,
      handle_name: null,
      info: null,
      sid_link: null,
      sid_data: null,
      query_url: null
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
      var query = "http://localhost:8099/api/v1/audio?sid_url=" + this.sid_link;
      // eslint-disable-next-line
      console.log("Query = " + query);

      this.query_url = "http://localhost:8099/api/v1/audio";

      // document.getElementById('audio').currentTime = 0
      // document.getElementById('audio').play()

      axios.post(query).then(response => (this.sid_data = response.data));
      // axios.post(query);

      // var sound = new Howl({
      //   src: ["http://localhost:8099/api/v1/audio"],
      //   format: ['wav'],
      //   html5: true
      // });

      // sound.play()

      // track.play()

      // var player = document.getElementById("radio");
      // player.pause();
      // player.src = this.query_url;
      // player.play()

      // media.play();
      // axios.get(this.query_url)

      // eslint-disable-next-line
      // console.log("SID data " + this.sid_data);
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
