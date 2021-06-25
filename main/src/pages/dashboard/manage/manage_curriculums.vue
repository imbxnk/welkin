<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <div class="d-flex flex-row justify-content-end bd-highlight">
          <div class="p-2 bd-highlight">
            <v-btn color="primary" @click="classDialog = true"><v-icon>mdi-plus</v-icon> Add Curriculum</v-btn>
          </div>
        </div>
      </div>
      <div class="p-2 bd-highlight">
        <v-card style="max-width: auto"
          ><v-card-title>
            <div class="d-flex flex-column">
              <span>Curriculums</span>
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
            :items="curriculums"
            :search="search"
            class="student px-3 pb-3"
            mobile-breakpoint="0"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.batches`]="{ item }">
              {{ (item.batches.toString()).replaceAll(',', '/') }}
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
          >Add Curriculum
          <v-spacer></v-spacer>
          <v-icon @click="classDialog = false">mdi-close</v-icon></v-card-title
        >
        <AddCurriculum></AddCurriculum>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AddCurriculum from "./components/add_curriculum";
export default {
  components: { AddCurriculum },
  data() {
    return {
      classDialog: false,
      search: "",
      headers: [
        { text: "Curriculum Name", sortable: true, value: "name", width: "80%" },
        { text: "Batches", sortable: true, value: "batches", width: "19%" },
        { text: "Edit", sortable: false, value: "actions", width: "1%" },
      ],
      curriculums: [],
      total: 0,
    };
  },
  mounted() {
    this.getCurriculums()
  },
  methods: {
    async getCurriculums() {
      let query = `
            {
              curriculums {
                total
                curriculums {
                  name
                  batches
                }
              }
            }
          `;
      query = query.replace(/\s+/g, ' ').trim()
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.total = res.data.data.curriculums.total;
          this.curriculums = res.data.data.curriculums.curriculums;
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
