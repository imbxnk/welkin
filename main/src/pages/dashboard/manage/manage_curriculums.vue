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
              {{ ~~item.passing_conditions.core_courses + ~~item.passing_conditions.required_courses + ~~item.passing_conditions.elective_courses }}
            </template>
            <template v-slot:[`item.edit`]="{ item }">
              <edit-curriculum @click="editItem(item, curriculums.indexOf(item))" :item="item"></edit-curriculum>
            </template>
            <template v-slot:[`item.delete`]="{ item }">
              <v-icon small @click="deleteItem(item, curriculums.indexOf(item))">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
    <!-- DELETE CURRICULUM DIALOG -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title
          >Delete Curriculum ?
          <v-spacer></v-spacer>
          <v-icon @click="deleteDialog = false" tabindex="-1">mdi-close</v-icon></v-card-title
        >
        <v-card-text class="mt-4">
          Warning! This cannot be undone and will affect the performance calculation of student ID(s): {{ deletedItem.batches.join('/') }}
          <div class="mt-3">
            Curriculum Name: <strong>{{ deletedItem.name }}</strong>
          </div>
        </v-card-text>
        <v-card-actions class="pb-4 d-flex justify-content-end">
          <v-btn
            color="gray"
            text
            @click="deleteDialog = false"
          >Cancel</v-btn>
          <v-btn
            color="error"
            @click="deleteConfirmDialog = true"
          >Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteConfirmDialog" max-width="300px">
      <v-card>
        <v-card-title
          >Delete Confirmation
          <v-spacer></v-spacer>
          <v-icon @click="deleteConfirmDialog = false" tabindex="-1">mdi-close</v-icon></v-card-title
        >
        <v-card-text class="mt-4">
          After you press confirm the curriculum (<strong>{{ deletedItem.name }}</strong>) will be deleted forever
        </v-card-text>
        <v-card-actions class="pb-4 d-flex justify-content-end">
          <v-btn
            color="gray"
            text
            @click="deleteConfirmDialog = false"
          >Cancel</v-btn>
          <v-btn
            color="error"
            @click="deleteCurriculum"
          >Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      deleteDialog: false,
      deleteConfirmDialog: false,
      headers: [
        { text: "Curriculum Name", sortable: true, value: "name", width: "60%" },
        { text: "Batches", sortable: true, value: "batches", width: "19%" },
        { text: "Total Credits", sortable: false, value: "passing_conditions", width: "20%", align: 'center' },
        { text: "Edit", sortable: false, value: "edit", width: "1%", align: 'center' },
        { text: "Delete", sortable: false, value: "delete", width: "1%", align: 'center' },
      ],
      curriculums: [],
      total: 0,
      editedIndex: 0,
      editedItem: {},
      deletedIndex: 0,
      deletedItem: {
        _id: '',
        name: '',
        batches: [],
        passing_conditions: {
          core_courses: '',
          required_courses: '',
          elective_courses: ''
        },
        trimester_milestone: {
          gap: 6,
          t4: '',
          t5: '',
          t6: '',
          t7: '',
          t8: '',
          t9: '',
          t10: '',
          t11: '',
          t12: '',
        },
      },
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
          this.curriculums = [...res.data.data.curriculums.curriculums];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addCurriculum(newValue) {
      this.curriculums.push(newValue)
    },
    updateCurriculum() {
      this.getCurriculums()
    },
    editItem(item, index) {
      this.editedIndex = index
      this.editedItem = Object.assign({}, item)
    },
    deleteItem(item, index) {
      this.deletedIndex = index;
      this.deletedItem = Object.assign({}, item);
      this.deleteDialog = true;
    },
    deleteCurriculum() {
      let query = `
        mutation {
          deleteCurriculum(curriculumId: "${this.deletedItem._id}") {
            success
            message
          }
        }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.curriculums.splice(this.deletedIndex,1)
          this.deleteDialog = false
          this.deleteConfirmDialog = false
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
