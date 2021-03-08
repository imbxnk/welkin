<template>
  <v-card class="pa-4">
    <div class="overline my-n1">current students</div>
    <div class="h3 text-right totaltxt mr-3">
      0
    </div>

    <!-- <div style="display: flex; line-height: 40px; vertical-align: middle">
      <div>current students</div>
      <h3 class="text-right">{{ 100 }}</h3>
    </div> -->
    <v-divider class="mb-1"></v-divider>
    <v-list>
      <v-list-item v-for="batch in total" :key="batch">
        <v-list-item-content>xxxx:</v-list-item-content>
        <v-list-item-content>
          <div class="text-right totaltxt">TEST</div>
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
      total: {},
      started_batch: 598,
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
                batch${this.started_batch+10}:students (searchInput: { batch : "${this.started_batch+10}"}) { total }
                batch${this.started_batch+20}:students (searchInput: { batch : "${this.started_batch+20}"}) { total }
                batch${this.started_batch+30}:students (searchInput: { batch : "${this.started_batch+30}"}) { total }
                batch${this.started_batch+40}:students (searchInput: { batch : "${this.started_batch+40}"}) { total }
              }
          `
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true } )
        .then((res) => {
          var result = {...res.data.data};
          for(const i in result) {
            this.total[i] = result[i].total
          }
          console.log(this.total);
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
