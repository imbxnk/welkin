<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <div class="d-flex flex-row justify-content-end bd-highlight">
          <div class="p-2 bd-highlight">
            <AddCurriculum @addCurriculum="addCurriculum" @updateCurriculum="updateCurriculum"></AddCurriculum>
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
            <template v-slot:[`item.passing_conditions`]="{ item }">
              {{ item.passing_conditions.core_courses + item.passing_conditions.required_courses + item.passing_conditions.elective_courses }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <edit-curriculum @click="editItem(item, curriculums.indexOf(item))" :item="item"></edit-curriculum>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import AddCurriculum from "./components/add_curriculum";
import EditCurriculum from "./components/edit_curriculum.vue";
export default {
  components: { AddCurriculum, EditCurriculum },
  data() {
    return {
      search: "",
      headers: [
        { text: "Curriculum Name", sortable: true, value: "name", width: "60%" },
        { text: "Batches", sortable: true, value: "batches", width: "19%" },
        { text: "Total Credits", sortable: false, value: "passing_conditions", width: "20%", align: 'center' },
        { text: "Edit", sortable: false, value: "actions", width: "1%" },
      ],
      curriculums: [],
      total: 0,
      editedIndex: 0,
      editedItem: {},
    };
  },
  mounted() {
    this.getCurriculums()
  },
  methods: {
    getCurriculums() {
      let query = `
            {
              curriculums {
                total
                curriculums {
                  _id
                  name
                  batches
                  passing_conditions {
                    core_courses
                    required_courses
                    elective_courses
                  }
                  trimester_milestone { gap t4 t5 t6 t7 t8 t9 t10 t11 t12 }
                  courses {
                    core_courses { _id code name }
                    required_courses { _id code name }
                    elective_courses { _id code name }
                  }
                }
              }
            }
          `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.total = res.data.data.curriculums.total;
          this.curriculums = res.data.data.curriculums.curriculums;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addCurriculum(newValue) {
      this.curriculums.push(newValue)
    },
    updateCurriculum(newValue) {
      this.getCurriculums()
    },
    editItem(item, index) {
      this.editedIndex = index
      this.editedItem = Object.assign({}, item)
    },
  },
};
</script>

<style>
</style>
