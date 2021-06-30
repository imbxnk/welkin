<template>
  <div class="announce-hight mb-5">
    <v-card class="pa-4">
      <h6 class="primary--text pl-2">Announcements</h6>
      <simplebar class="ex1">
        <span v-if="this.$config.announcements.length > 0">
          <v-card
            elevation="0"
            color="#f7f7f8"
            v-for="(announcement, i) in $config.announcements"
            :key="i"
            class="announce-card mb-4"
          >
            <v-card-title class="m-0 p-0 d-flex justify-content-between" style="font-size: 1.1rem">
              {{ announcement.title }}
              <v-card-subtitle class="m-0 p-0">{{
                readableDate(announcement.startDate) + " - " + readableDate(announcement.endDate)
              }}</v-card-subtitle>
            </v-card-title>
            <v-card-text class="m-0 p-0 pt-2" v-html="announcement.content"></v-card-text> </v-card
        ></span>
        <span v-else>
          <v-card elevation="0" color="#f7f7f8" class="announce-card">
            <span style="color: #b4b4b4">There are currently no announcements.</span>
          </v-card>
        </span>
      </simplebar>
    </v-card>
  </div>
</template>
<script>
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";
export default {
  name: "Announcements",
  components: { simplebar },
  mounted() {
  },
  data() {
    return {};
  },
  methods: {
    readableDate(date) {
      return this.moment(parseInt(date)).format("DD MMMM YYYY");
    },
  },
};
</script>
<style>
.ex1 {
  max-height: 280px;
  /* overflow: auto; */
}
.announce-card {
  margin: 5px;
  padding: 10px;
}
.announce-hight {
  height: 311px;
}
</style>
