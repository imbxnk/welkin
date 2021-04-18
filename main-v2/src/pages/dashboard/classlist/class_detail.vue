<template>
  <v-row>
    <!-- 1st column -->
    <v-col style="padding: 0 8px 0 0">
      <v-card>
        <v-card-title class="text-uppercase">{{ course.code }}: {{ course.name }}</v-card-title>
        <v-card-text>
          <v-btn @click="$router.push('/class')">back to class list</v-btn>
        </v-card-text>
        <v-list class="pa-3">
          <simplebar data-simplebar-auto-hide="true" class="wk-content-full-height-list">
            <v-list-item-group
              v-model="selected"
              style="margin-top:15px;"
              active-class="primary--text"
            >
              <template v-for="(item, index) in items">
                <v-list-item :key="item.title" @click="showdata(item)" class="my-n4">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.code + ': ' + item.name"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <!-- <v-list-item-action-text v-text="item.action"></v-list-item-action-text> -->
                  </v-list-item-action>
                </v-list-item>
                <!-- <v-divider v-if="index < items.length - 1" :key="index"></v-divider> -->
                <v-divider v-if="index !== items.length - 1" :key="index" class=""></v-divider>
              </template>
            </v-list-item-group>
          </simplebar>
        </v-list>
      </v-card>
    </v-col>
    <!-- 2nd column -->
    <v-col style="padding: 0 0 0 8px">
      <v-card class="box">
        <simplebar data-simplebar-auto-hide="true" class="wk-content-full-height">
          <stdTable class="ma-3"></stdTable>
        </simplebar>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import stdTable from "./components/student_info.vue";
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";

export default {
  name: "class_detail",
  components: {
    stdTable,
    simplebar,
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
  height: calc(100vh - 83px);
  overflow-y: auto;
  overflow-x: hidden;
}
.wk-content-full-height-list {
  height: calc(100vh - 222px);
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
