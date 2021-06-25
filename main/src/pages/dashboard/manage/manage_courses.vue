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
              <span>Courses</span>
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
            :items="courses"
            :search="search"
            class="student px-3 pb-3"
            mobile-breakpoint="0"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.name`]="{ item }">
              {{ item.name + ` (${item.credit_description.lecture}-${item.credit_description.lab}-${item.credit_description.self_study})` }}
            </template>
            <template v-slot:[`item.class`]="{ item }">
              <router-link :to="{ name: 'manage_class', params: { code: item.code.toLowerCase() }}" target="_blank" style="text-decoration: none">
                <v-icon small>
                  mdi-folder-multiple
                </v-icon>
              </router-link>
            </template>
            <template v-slot:[`item.edit`]="{ item }">
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
        { text: "Code", sortable: true, value: "code", width: "1%" },
        { text: "Course Name", sortable: false, value: "name", width: "97%" },
        { text: "Classes", sortable: false, value: "class", width: "1%", align: "center" },
        { text: "Edit", sortable: false, value: "edit", width: "1%", align: "center" },
      ],
      courses: [],
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
              courses {
                total
                courses {
                  code
                  name
                  description
                  credit
                  credit_description {
                    lecture
                    lab
                    self_study
                  }
                }
              }
            }
          `;
      query = query.replace(/\s+/g, ' ').trim()
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.total = res.data.data.courses.total;
          this.courses = res.data.data.courses.courses;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>

<style>
</style>
