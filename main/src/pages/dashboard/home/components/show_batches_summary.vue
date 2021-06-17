<template>
  <v-card v-if="loading" class="pa-5" style="height:80px;">
    <v-progress-circular
      :size="50"
      class="loading totaltxt mt-10"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-card>
  <v-card v-else class="pa-4 pa-5">
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
        <v-list-item-content>{{ batch.replace(/^\D+/g, "") }}</v-list-item-content>
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
      loading: true,
      total: 0,
      batches: {},
      queryBatches: this.$config.selectedBatches,
    };
  },
  mounted() {
    this.getTotalBatches();
  },
  methods: {
    getTotalBatches() {
      // ALGORITHM TO CREATE QUERY
      var queryStr = "";
      this.queryBatches.forEach((batch) => {
        queryStr += `batch${batch}:students (searchInput: { batch : "${batch}"}) { total }`;
      });
      let query = `
              {
                ${queryStr}
              }
          `;
      if(this.queryBatches.length > 0) {
        query = query.replace(/\s+/g, ' ').trim()
        this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          var result = { ...res.data.data };
          for (const i in result) {
            this.batches[i] = result[i].total;
            this.total += result[i].total;
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
      } else {
        this.loading = false
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.totaltxt {
  color: #3c84fb;
}
.loading {
  position: absolute;
  top: 0%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
