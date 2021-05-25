<template>
  <div style="height:150px">
    <h6 class="primary--text pl-2">Announcements</h6>
    <div class="ex1">
      <v-card v-for="(item, i) in items" :key="i" class="announce-card "
        >{{ item.text }} - {{ item.from }}</v-card
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "Announcements",
  components: {},
  mounted() {},
  data() {
    return {
      items: [
        {
          text:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
          from: "Teoy",
        },
        {
          text: "nhanniee so cute",
          from: "Teoy",
        },
        {
          text: "nhanniee so cute",
          from: "Teoy",
        },
      ],
    };
  },
};
</script>
<style>
.ex1 {
  height: 130px;
  overflow: scroll;
}
.announce-card {
  margin: 5px;

  padding: 10px;
}
</style>
