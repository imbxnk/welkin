<template>
  <div style="max-height:150px">
    <h6 class="primary--text pl-2">Announcements</h6>
    <simplebar class="ex1">
      <v-card v-for="(announcement, i) in $config.announcements" :key="i" class="announce-card ">
        <v-card-title class="m-0 p-0 d-flex justify-content-between" style="font-size: 1.1rem">
          {{ announcement.title }}
          <v-card-subtitle class="m-0 p-0">{{ readableDate(announcement.createdAt) + " - " + readableDate(announcement.endDate)}}</v-card-subtitle>
        </v-card-title>
        <v-card-text class="m-0 p-0 pt-2" v-html="announcement.content"></v-card-text>
      </v-card>
    </simplebar>
  </div>
</template>
<script>
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";
export default {
  name: "Announcements",
  components: { simplebar },
  mounted() {},
  data() {
    return {

    };
  },
  methods: {
    readableDate(date) {
      return this.moment(parseInt(date)).format("DD MMMM YYYY (HH:MM)");
    },
  },
};
</script>
<style>
.ex1 {
  max-height: 130px;
  /* overflow: auto; */
}
.announce-card {
  margin: 5px;

  padding: 10px;
}
</style>
