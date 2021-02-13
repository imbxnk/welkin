<template>
  <v-card class="pa-4">
    <div class="overline my-n1">current students</div>
    <div class="h3 text-right totaltxt mr-3">
      {{ this.std59 + this.std60 + this.std61 + this.std62 }}
    </div>

    <!-- <div style="display: flex; line-height: 40px; vertical-align: middle">
      <div>current students</div>
      <h3 class="text-right">{{ 100 }}</h3>
    </div> -->
    <v-divider class="mb-1"></v-divider>
    <v-list>
      <v-list-item>
        <v-list-item-content>598xxxx:</v-list-item-content>
        <v-list-item-content>
          <div class="text-right totaltxt">{{ this.std59 }}</div>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>608xxxx:</v-list-item-content>
        <v-list-item-content>
          <div class="text-right totaltxt">{{ this.std60 }}</div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>618xxxx:</v-list-item-content>
        <v-list-item-content>
          <div class="text-right totaltxt">{{ this.std61 }}</div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>628xxxx:</v-list-item-content>
        <v-list-item-content>
          <div class="text-right totaltxt">{{ this.std62 }}</div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
export default {
  name: "currentStd",
  components: {},
  data() {
    return {
      std59: 0,
      std60: 0,
      std61: 0,
      std62: 0,
      totalcurrentstd: 0,
    };
  },
  mounted() {
    this.get598();
    this.get608();
    this.get618();
    this.get628();
  },
  methods: {
    get598() {
      this.axios
        .get("https://api.welkin.app/v1/students?status.current=Studying&batch=598")
        .then((res) => {
          var result = JSON.parse(JSON.stringify(res.data));
          this.std59 = result.total;
          console.log(this.std59);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    get608() {
      this.axios
        .get("https://api.welkin.app/v1/students?status.current=Studying&batch=608")
        .then((res) => {
          var result = JSON.parse(JSON.stringify(res.data));
          this.std60 = result.total;
          console.log(this.std60);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    get618() {
      this.axios
        .get("https://api.welkin.app/v1/students?status.current=Studying&batch=618")
        .then((res) => {
          var result = JSON.parse(JSON.stringify(res.data));
          this.std61 = result.total;
          console.log(this.std61);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    get628() {
      this.axios
        .get("https://api.welkin.app/v1/students?status.current=Studying&batch=628")
        .then((res) => {
          var result = JSON.parse(JSON.stringify(res.data));
          this.std62 = result.total;
          console.log(this.std62);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    total() {
      this.totalcurrentstd = this.get598 + this.get608 + this.get618 + this.get628;
      return this.totalcurrentstd;
    },
  },
};
</script>
<style lang="scss" scoped>
.totaltxt {
  color: #3c84fb;
}
</style>
