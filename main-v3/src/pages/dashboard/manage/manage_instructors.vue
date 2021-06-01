<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <v-btn color="primary" @click="dialog = true">Add Instructor<v-icon>mdi-plus</v-icon></v-btn>
      </div>
      <div class="p-2 bd-highlight">
        <v-card style="max-width: auto"
          ><v-card-title>
              <div class="d-flex flex-column">
                <span>Instructors</span>
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
            :items="instructors"
            :search="search"
            class="student px-3 pb-3"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.display_name`]="{ item }">
              {{ item.display_name == null ? "- " : item.display_name }}
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
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title
          >Add Instructor
          <v-spacer></v-spacer>
          <v-icon @click="dialog = false">mdi-close</v-icon></v-card-title
        >
        <AddInstructor></AddInstructor>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// import AddInstuctor from "./components/add_instructor.vue"
export default {
  components: {
    // AddInstuctor
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "Prefix", sortable: false, value: "title", width: "1%" },
        { text: "Name", sortable: false, value: "name", width: "98%" },
        { text: "Edit", sortable: false, value: "actions", width: "1%" },
      ],
      instructors: [],
      total: 0,
      dialog: false,
    };
  },
  mounted() {
    this.getInstructors();
  },
  methods: {
    async getInstructors() {
      let query = `
            query {
              instructors {
                total
                instructors {
                  name
                  title
                }
              }
            }
          `;
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.total = res.data.data.instructors.total;
          this.instructors = res.data.data.instructors.instructors;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editItem(item) {
      console.log(item);
    },
  },
};
</script>

<style></style>
