<template>
  <v-row class="ma-4">
    <!-- 1st column -->
    <v-col style="padding: 0 8px 0 0">
      <v-card>
        <v-card-title class="text-uppercase">{{ course.code }}: {{ course.name }}</v-card-title>
        <v-card-text>
          <v-btn @click="$router.push('/class')">back to class list</v-btn>
        </v-card-text>
        <v-list class="pa-3"> </v-list>
      </v-card>
    </v-col>
    <!-- 2nd column -->
    <v-col style="padding: 0 0 0 8px">
      <v-card class="pa-3 box"><stdTable></stdTable></v-card>
    </v-col>
  </v-row>
</template>
<script>
import stdTable from "./components/student_info.vue";
export default {
  name: "class_detail",
  components: {
    stdTable,
  },
  created() {
    this.loadClass();
  },
  data() {
    return {
      course: {},
    };
  },
  methods: {
    loadClass() {
      let query = `
                    query {
                    courses (searchInput: {code: "${this.$route.params.code}"}) {
                        total
                        courses {
                        name
                        code
                        }
                    }
                    }
                `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.course = res.data.data.courses.courses[0];
          console.log(this.course);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.wk-content-full-height {
  height: calc(100vh - 110px);
  overflow: auto;
}
.wk-content-full-height-list {
  height: calc(100vh - 186px);
  overflow: auto;
}
.logo-watermark {
  filter: grayscale(100%);
  opacity: 0.25;
  background: url("/img/logo.1fbb96f9.svg") center no-repeat;
  width: auto;
  min-height: 120px;
}
.box {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.small--text {
  font-size: 1rem;
  font-weight: lighter;
  width: 100%;
  text-align: center;
  flex-grow: 1;
}
</style>
