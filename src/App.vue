
<template>
  <!--
  =================================================================================================
  TEMPLATE
  =================================================================================================
  -->
  <div
    id="app"
    @drop.prevent="addFile"
    @dragover.prevent
    @dragover.capture="dragingOn"
    @drop.capture="dragingOff"
  >
    <h1>Welcome to SIDCloud</h1>
    <img :src="csdb_release_screenshot" />
    <p />
    <p>{{ csdb_release_name }} {{ csdb_release_group }}</p>
    <p />

    <audio id="radio" controls preload="none">
      <source :src="audio_url" type="audio/wav" />
    </audio>
    <!-- <audio
      type="audio/wav"
      id="radio"
      src="http://sidcloud.net/api/v1/audio"
      preload="none"
      controls
      loop
    ></audio>-->

    <p />

    <b-container class="bv-example-row">
      Player:
      <select v-model="player_type">
        <option>sidplayfp</option>
        <option>jsidplay2</option>
      </select>

      <b-row class="my-1">
        <b-col sm="3">
          <button
            type="button"
            style="margin-right: 10px; margin-left: 10px"
            class="btn btn-success"
            :disabled="dragin"
            v-on:click="Link"
          >Load and stream</button>
        </b-col>
        <b-col sm="3">
          <button
            type="button"
            style="margin-right: 20px"
            class="btn btn-success"
            :disabled="dragin"
            v-on:click="Next"
          >Goto next release</button>
        </b-col>
      </b-row>
      <p />
      <b-col sm="3">
        <input
          v-model="sid_link"
          v-on:keyup.enter="Link"
          placeholder="Paste SID/PRG link and press Enter to play or Drag your SID/PRG file here"
          class="form-control"
          style="max-width=300px"
          :disabled="dragin"
        />
      </b-col>
    </b-container>

    <div id="log">{{ log }}</div>
    <!-- <p>Music by {{ csdb_release_credits }}</p> -->

    <!-- <p>Response from sidcloud server: {{ response_from_server }}</p> -->

    <!-- <p>CSDB release ID: {{ csdb_release_id }}</p>
    <p>CSDB release download links: {{ csdb_download_links }}</p>
    <p>CSDB release: {{ csdb_release }}</p>-->
    <!-- <p>CSDB release data: {{ csdb_release_data }}</p> -->
  </div>
</template>

<script>
// ================================================================================================
// SCRIPT
// ================================================================================================

import axios from "axios";

var player;

export default {
  data: function() {
    return {
      handle_id: 0,
      csdb_releases: null,
      csdb_release: null,
      csdb_release_id: null,
      csdb_release_data: null,
      csdb_download_links: null,
      csdb_release_name: "",
      csdb_release_group: "",
      csdb_release_credits: "",
      csdb_release_screenshot: "",
      release_nr: 1,
      info: null,
      sid_link: null,
      response_from_server: null,
      file: null,
      dragin: false,
      log: "log",
      audio_url: "",
      player_type: "sidplayfp"
    };
  },
  name: "app",
  components: {},

  // ==============================================================================================
  // METODY
  // ==============================================================================================

  methods: {
    AudioUrl() {
      // eslint-disable-next-line
      console.log("Player type: ", this.player_type);

      if (
        axios.defaults.baseURL == null ||
        axios.defaults.baseURL === undefined
      ) {
        this.audio_url = "/api/v1/audio/" + this.player_type;
      } else {
        this.audio_url =
          axios.defaults.baseURL + "/api/v1/audio/" + this.player_type;
      }
    },
    // ==========================================================
    // Draging
    // ==========================================================
    dragingOn() {
      // this.response_from_server = "dragin..";
      this.dragin = true;
    },
    dragingOff() {
      // this.response_from_server = "dragin..";
      this.dragin = false;
    },
    // ==========================================================
    // Drag & Drop
    // ==========================================================
    addFile(e) {
      this.AudioUrl();
      player = document.getElementById("radio");

      var query = "/api/v1/audio" + this.player_type;

      // var player = document.getElementById("radio");
      player.pause();
      player.currentTime = 0.0;

      const formData = new FormData();
      formData.append("file", e.dataTransfer.files[0]);

      const config = {
        headers: { "content-type": e.dataTransfer.files[0].type }
      };

      axios.put(query, formData, config).then(response => {
        // eslint-disable-next-line
        console.log("File sent. Response: ", response.data);

        this.response_from_server = response.data;

        player.load();
        player.play();
      });
    },
    // ==========================================================
    // Następna produkcja
    // ==========================================================
    Next: function() {
      this.GetCSDBData();
    },
    // ==========================================================
    // Odczyt danych z CSDB
    // ==========================================================
    GetCSDBData: function() {
      var query;

      this.csdb_release_name = "";
      this.csdb_release_group = "";
      this.csdb_release_credits = "";
      this.csdb_release_screenshot = "";

      // Latest releases
      // --------------------------------------------------------
      query = "/api/v1/csdb_releases";

      // eslint-disable-next-line
      console.log("GetCSDBData() " + query);

      axios.get(query).then(response => {
        this.csdb_releases = response.data;

        var oParser = new DOMParser();

        // Pętla w której szukamy typu release - przerywamy fora gdy znajdziemy
        // --------------------------------------------------------------------
        var i;
        for (i = 0; i < 100; i++) {
          this.csdb_release = oParser
            .parseFromString(this.csdb_releases, "application/xml")
            .getElementsByTagName("description")[
            this.release_nr++
          ].childNodes[0].nodeValue;

          if (
            this.csdb_release.indexOf(">C64 Demo</a><br /><a href=") > 0 ||
            this.csdb_release.indexOf(">C64 One-File Demo</a><br /><a href=") >
              0 ||
            this.csdb_release.indexOf(">C64 Intro</a><br /><a href=") > 0 ||
            this.csdb_release.indexOf(">C64 4K Intro</a><br /><a href=") > 0 ||
            this.csdb_release.indexOf(">C64 Crack intro</a><br /><a href=") >
              0 ||
            this.csdb_release.indexOf(">C64 REU Release</a><br /><a href=") >
              0 ||
            this.csdb_release.indexOf(">C64 Music</a><br /><a href=") > 0 ||
            this.csdb_release.indexOf(
              ">C64 Music Collection</a><br /><a href="
            ) > 0 ||
            this.csdb_release.indexOf(
              ">C64 Graphics Collection</a><br /><a href="
            ) > 0 ||
            this.csdb_release.indexOf(">C64 Diskmag</a><br /><a href=") > 0 ||
            this.csdb_release.indexOf(">C64 Charts</a><br /><a href=") > 0 ||
            this.csdb_release.indexOf(">C64 Invitation</a><br /><a href=") >
              0 ||
            this.csdb_release.indexOf(">C64 1K Intro</a><br /><a href=") > 0 ||
            this.csdb_release.indexOf(">C64 Fake Demo</a><br /><a href=") > 0 ||
            this.csdb_release.indexOf(">C128 Release</a><br /><a href=") > 0 ||
            this.csdb_release.indexOf(">SuperCPU Release</a><br /><a href=") >
              0 ||
            this.csdb_release.indexOf(">C64 DTV</a><br /><a href=") > 0 ||
            this.csdb_release.indexOf(">C64 Fake Demo</a><br /><a href=") > 0
          ) {
            break;
          }
        }

        // Wyciągamy numer ID tej produkcji
        // -------------------------------------------------------------------
        this.csdb_release_id = oParser
          .parseFromString(this.csdb_releases, "application/xml")
          .getElementsByTagName("link")[
          this.release_nr
        ].childNodes[0].nodeValue;

        this.csdb_release_id = parseInt(
          this.csdb_release_id.replace(/^[^0-9]+/, ""),
          10
        );

        // Odczytujemy dane release i szukamy SID'a a potem PRG
        // -------------------------------------------------------------------

        query = "/api/v1/csdb_release?id=" + this.csdb_release_id + "&depth=2";

        axios.post(query).then(response => {
          this.csdb_release_data = response.data;

          // var oParser = new DOMParser();
          // this.csdb_download_links = oParser
          //   .parseFromString(this.csdb_release_data, "application/xml")
          //   .getElementsByTagName("DownloadLinks")[0].childNodes[0].textContent;

          var links_count = (this.csdb_release_data.match(/<Link>/g) || [])
            .length;
          // eslint-disable-next-line
          console.log("Liczba linków: " + links_count);

          this.csdb_download_links = links_count;

          var i;
          var link;
          var sid_found = false;

          this.sid_link = "";

          // szukamy SID
          for (i = 0; i < links_count; i++) {
            link = oParser
              .parseFromString(this.csdb_release_data, "application/xml")
              .getElementsByTagName("Link")[i].childNodes[0].nodeValue;

            if (link.indexOf(".sid") > 0) {
              sid_found = true;
              break;
            }
          }

          if (!sid_found) {
            // szukamy PRG
            for (i = 0; i < links_count; i++) {
              link = oParser
                .parseFromString(this.csdb_release_data, "application/xml")
                .getElementsByTagName("Link")[i].childNodes[0].nodeValue;

              if (link.indexOf(".prg") > 0) {
                break;
              }
            }
          }

          if (sid_found) {
            // Wpisujemy LINK do kontrolki na stronie
            this.sid_link = link;

            // Nazwa produkcji
            this.csdb_release_name = oParser
              .parseFromString(this.csdb_release_data, "application/xml")
              .getElementsByTagName("Name")[0].childNodes[0].nodeValue;

            // Grupy
            var groups_count = (this.csdb_release_data.match(/<Group>/g) || [])
              .length;
            // eslint-disable-next-line
            console.log("Liczba grup: " + groups_count);

            if (groups_count > 0) {
              this.csdb_release_group = "by ";
            } else {
              this.csdb_release_group = "";
            }
            var przecinek = " ";
            for (i = 2; i < groups_count + 2; i++) {
              if (i > 2) {
                przecinek = ", ";
              }
              this.csdb_release_group +=
                przecinek +
                oParser
                  .parseFromString(this.csdb_release_data, "application/xml")
                  .getElementsByTagName("Name")[i].childNodes[0].nodeValue;
            }

            // Screenshot
            this.csdb_release_screenshot = oParser
              .parseFromString(this.csdb_release_data, "application/xml")
              .getElementsByTagName("ScreenShot")[0].childNodes[0].nodeValue;
            // eslint-disable-next-line
            console.log("Screenshot: " + this.csdb_release_screenshot);

            // // Credits
            // var credits_count = (
            //   this.csdb_release_data.match(/<Credit>/g) || []
            // ).length;
            // // eslint-disable-next-line
            // console.log("Liczba credits: " + groups_count);

            // this.csdb_release_credits = oParser
            //   .parseFromString(this.csdb_release_data, "application/xml")
            //   .getElementsByTagName("Handle")[0].childNodes[0].nodeValue;
          } else {
            // Jeżeli nie znaleziono SIDa to idziemy do kolejnej produkcji
            this.GetCSDBData();
          }
        });
      });
    },

    // ==========================================================
    // Link do SIDa
    // ==========================================================
    Link: function() {
      this.AudioUrl();
      player = document.getElementById("radio");

      var query = "/api/v1/audio?sid_url=" + this.sid_link;
      // eslint-disable-next-line
      console.log("Query = " + query);

      document.getElementById("log").innerHTML = "[" + Date.now() + "] start  ";

      player.pause();
      player.currentTime = 0.0;

      // var player = new Audio();
      // player.src = "http://sidcloud.net/api/v1/audio";
      // player.load();

      // player.addEventListener("timeupdate", function() {
      //   // eslint-disable-next-line
      //   console.log("player event: timeupdate");
      // });

      player.addEventListener("waiting", function() {
        // eslint-disable-next-line
        console.log("player event: waiting");
        document.getElementById("log").innerHTML +=
          "[" + Date.now() + "] waiting  ";
      });
      player.addEventListener("play", function() {
        // eslint-disable-next-line
        console.log("player event: play");
        document.getElementById("log").innerHTML +=
          "[" + Date.now() + "] play  ";
      });
      player.addEventListener("pause", function() {
        // eslint-disable-next-line
        console.log("player event: pause");
        document.getElementById("log").innerHTML +=
          "[" + Date.now() + "] pause  ";
      });
      player.addEventListener("ended", function() {
        // eslint-disable-next-line
        console.log("player event: ended");
        document.getElementById("log").innerHTML +=
          "[" + Date.now() + "] ended  ";
      });
      player.addEventListener("loadstart", function() {
        // eslint-disable-next-line
        console.log("player event: loadstart");
        document.getElementById("log").innerHTML +=
          "[" + Date.now() + "] loadstart  ";
      });
      player.addEventListener("durationchange", function() {
        // eslint-disable-next-line
        console.log("player event: durationchange");
        document.getElementById("log").innerHTML +=
          "[" + Date.now() + "] durationchange  ";
      });
      player.addEventListener("loadedmetadata", function() {
        // eslint-disable-next-line
        console.log("player event: loadedmetadata");
        document.getElementById("log").innerHTML +=
          "[" + Date.now() + "] loadedmetadata  ";
      });
      player.addEventListener("loadeddata", function() {
        // eslint-disable-next-line
        console.log("player event: loadeddata");
        document.getElementById("log").innerHTML +=
          "[" + Date.now() + "] loadeddata  ";
      });
      // player.addEventListener("progress", function() {
      //   // eslint-disable-next-line
      //   console.log("player event: progress");
      // });
      player.addEventListener("canplay", function() {
        // eslint-disable-next-line
        console.log("player event: canplay");
        document.getElementById("log").innerHTML +=
          "[" + Date.now() + "] canplay  ";
        player.play();
        // eslint-disable-next-line
        console.log("Playing...");
      });
      player.addEventListener("canplaythrough", function() {
        // eslint-disable-next-line
        console.log("player event: canplaythrough");
        document.getElementById("log").innerHTML +=
          "[" + Date.now() + "] canplaythrough  ";
      });

      axios.post(query).then(response => {
        this.response_from_server = response.data;

        // eslint-disable-next-line
        console.log("SID data " + this.response_from_server);

        player.load();
        // eslint-disable-next-line
        console.log("Loading...");

        // player.play();
        // eslint-disable-next-line
        // console.log("Play.");
      });
    }
  },
  // ==============================================================================================
  // METODY VUE
  // ==============================================================================================

  created: function() {
    this.GetCSDBData();
    player = document.getElementById("radio");
    this.AudioUrl();
  }
};
</script>

<style>
/* 
===================================================================================================
STYLE
===================================================================================================
*/
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  /* -moz-osx-font-smoothing: grayscale; */
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
