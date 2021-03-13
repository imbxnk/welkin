<template>
  <v-main>
    <v-row class="vh-100">
      <!-- 1st column -->
      <v-col>
        <v-card class="vh-100">
          <v-list class="pa-3">
            <v-subheader>Class List</v-subheader>
            <v-list-item-group v-model="selected" active-class="primary--text">
              <template v-for="item in items">
                <v-list-item :key="item.title" @click="showdata(item)">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text v-text="item.action"></v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <!-- 2nd column -->
      <v-col>
        <v-card v-if="!status" class="vh-100 pa-4">
          <div class="center grey--text">select the course to see more detail</div>
        </v-card>
        <v-card v-else class="vh-100 pa-4">
          <h4>{{ course.title }}</h4>
        </v-card></v-col
      >
    </v-row>
  </v-main>
</template>

<script>
export default {
  name: "class_list",
  components: {},
  data() {
    return {
      selected: [2],
      course: {},
      status: false,
      items: [
        {
          headline: "",
          title: "EGCI100: Introduction to Computer Engineering",
          course: {
            message: "",
          },
        },
        {
          headline: "bnk",
          title: "EGCI101: Introduction to Computer Programming",
          course: {
            message: "",
          },
        },
      ],
    };
  },
  methods: {
    showdata(item) {
      this.status = true;
      return (this.course = item);
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
</style>
