<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <div class="d-flex flex-row justify-content-end bd-highlight">
          <div class="p-2 bd-highlight">
            <v-btn color="primary" @click="classDialog = true"><v-icon>mdi-plus</v-icon> Add Course</v-btn>
          </div>
        </div>
      </div>
      <div class="p-2 bd-highlight">
        <v-card style="max-width: auto"
          ><v-card-title>
            <div class="d-flex flex-column">
              <span>{{ this.$route.params.code.toUpperCase() }}</span>
              <span style="font-size:0.8rem; color:#999; margin-top: -10px;">Total: {{ total }}</span>
            </div>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              type="text"
              class="mx-3"
            ></v-text-field
          ></v-card-title>
          <v-data-table
            :headers="headers"
            :items="classes"
            :search="search"
            class="student px-3 pb-3"
            mobile-breakpoint="0"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.name`]="{ item }">
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.year + 'T' + item.trimester + ' SEC' + item.section"
                ></v-list-item-title>
                <v-list-item-subtitle style="font-size: 0.8rem; color: #999">
                  {{ item.instructor.title }} {{ item.instructor.name }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
            <template v-slot:[`item.enrollments`]="{ item }">
              {{ item.enrollments.length }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="editItem(item)">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
    <v-dialog class="upload-Dialog" v-model="classDialog" max-width="1000px" width="600px" min-height="500px">
      <v-card>
        <v-card-title class="card-title"
          >Add Course
          <v-spacer></v-spacer>
          <v-icon @click="classDialog = false">mdi-close</v-icon></v-card-title
        >
        <AddCourse></AddCourse>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AddCourse from "./components/add_course";
export default {
  components: { AddCourse },
  data() {
    return {
      classDialog: false,
      search: "",
      headers: [
        { text: "Class Name", sortable: false, value: "name", width: "30%" },
        { text: "Year", sortable: true, value: "year", width: "10%"},
        { text: "Trimester", sortable: true, value: "trimester", width: "15%" },
        { text: "Enrollments", sortable: false, value: "enrollments", width: "1%", align: "center" },
        { text: "", sortable: false, value: "", width: "98%", align: "center" },
        { text: "Action", sortable: false, value: "actions", width: "1%", align: "center" },
      ],
      classes: [],
      total: 0,
    };
  },
  mounted() {
    this.getCourses()
  },
  methods: {
    async getCourses() {
      let query = `
            {
              classes (searchInput: { course_code: "${this.$route.params.code}" }) {
                total
                classes {
                  _id
                  course {
                    code
                    name
                    description
                  }
                  enrollments {
                    _id
                  }
                  section
                  instructor {
                    title
                    name
                  }
                  trimester
                  year
                }
              }
            }
          `;
      query = query.replace(/\s+/g, ' ').trim()
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.total = res.data.data.classes.total;
          this.classes = res.data.data.classes.classes;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>

<style>
  .card-title{
    background: #97b8f0;
    color: white;
  }
</style>
