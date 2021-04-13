<template>
  <v-card class="pa-4">
    <div class="overline my-n1">current students</div>
    <div class="h3 text-right totaltxt mr-3">
      {{ total }}
    </div>
    <!-- <div style="display: flex; line-height: 40px; vertical-align: middle">
      <div>current students</div>
      <h3 class="text-right">{{ 100 }}</h3>
    </div> -->
    <v-divider class="mb-1"></v-divider>
    <v-list>
      <v-list-item v-for="batch in Object.keys(batches)" :key="batch">
        <v-list-item-content>{{ batch.replace( /^\D+/g, '') }}</v-list-item-content>
        <v-list-item-content>
          <div class="text-right totaltxt">{{ batches[batch] }}</div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>

export default {
  name: "batches_summary",
  components: {},
  data() {
    return {
      total: 0,
      batches: {},
      started_batch: 60,
    };
  },
  mounted() {
    this.getTotalBatches();
  },
  methods: {
    getTotalBatches() {
      let query = `
              query {
                batch${this.started_batch}:students (searchInput: { batch : "${this.started_batch}"}) { total }
                batch${this.started_batch+1}:students (searchInput: { batch : "${this.started_batch+1}"}) { total }
                batch${this.started_batch+2}:students (searchInput: { batch : "${this.started_batch+2}"}) { total }
                batch${this.started_batch+3}:students (searchInput: { batch : "${this.started_batch+3}"}) { total }
                batch${this.started_batch+4}:students (searchInput: { batch : "${this.started_batch+4}"}) { total }
              }
          `
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true } )
        .then((res) => {
          var result = {...res.data.data};
          for(const i in result) {
            this.batches[i] = result[i].total;
            this.total += result[i].total;
          }
          console.log(this.batches);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.totaltxt {
  color: #3c84fb;
}
</style>
