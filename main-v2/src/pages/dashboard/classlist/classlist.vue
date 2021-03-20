<template>
  <v-row>
    <!-- 1st column -->
    <v-col style="padding: 0 8px 0 0">
      <v-card>
        <v-card-title class="pt-7">Class List</v-card-title>
        <v-list class="pa-3">
          <simplebar data-simplebar-auto-hide="true" class="wk-content-full-height-list">
          <v-list-item-group v-model="selected" style="margin-top:10px;" active-class="primary--text">
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
      <v-card v-if="!status" class="pa-3">
        <simplebar data-simplebar-auto-hide="true" class="wk-content-full-height">
          <div class="center grey--text">select the course to see more detail</div>
        </simplebar>
      </v-card>
      <v-card v-else class="pa-3">
        <simplebar data-simplebar-auto-hide="true" class="wk-content-full-height">
          <ClassInfo :name="this.course.name" :code="this.course.code"></ClassInfo>
        </simplebar>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ClassInfo from "./components/class_info.vue"
import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'

export default {
  name: "Class_list",
  components: {
    ClassInfo,
    simplebar
  },
  mounted() {
    this.getClasses();
  },
  data() {
    return {
      selected: [2],
      course: {},
      status: false,
      items: [],
      // items: [
      //   {
      //     headline: "",
      //     title: "EGCI100: Introduction to Computer Engineering",
      //     course: {
      //       message: "",
      //     },
      //   },
      //   {
      //     headline: "bnk",
      //     title: "EGCI101: Introduction to Computer Programming",
      //     course: {
      //       message: "",
      //     },
      //   },
      // ],
    };
  },
  methods: {
    showdata(item) {
      this.status = true;
      return (this.course = item);
    },
    getClasses() {
      let query = `
              query {
              courses {
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
          this.items = [...res.data.data.courses.courses];
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
.scroll {
  overflow-y: scroll;
}
.wk-content-full-height {
  height: calc(100vh - 110px);
  overflow: auto;
}
.wk-content-full-height-list {
  height: calc(100vh - 186px);
  overflow: auto;
}
</style>
