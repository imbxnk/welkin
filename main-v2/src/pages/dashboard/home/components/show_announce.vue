<template>
  <div style="height:150px">
    <h6 class="primary--text pl-2">Announcements</h6>
    <simplebar class="ex1">
      <v-card v-for="(announcement, i) in $config.announcements" :key="i" class="announce-card "
        >{{ announcement.content }} - {{ announcement.user.display_name || announcement.user.username }}</v-card
      >
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
};
</script>
<style>
.ex1 {
  height: 130px;
  overflow: auto;
}
.announce-card {
  margin: 5px;

  padding: 10px;
}
</style>
