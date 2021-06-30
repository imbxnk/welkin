<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 wk-manage-container">
      <div class="ml-auto p-2">
        <div class="d-flex flex-row justify-content-end">
          <div class="p-2">
            <v-btn color="primary" @click="classDialog = true"><v-icon>mdi-plus</v-icon> Add Class</v-btn>
          </div>
        </div>
      </div>
      <div class="p-2">
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
            <template v-slot:[`item.edit`]="{ item }">
              <EditClass :item="item"></EditClass>
            </template>
            <template v-slot:[`item.delete`]="{ item }">
              <v-icon small @click="deleteItem(item, classes.indexOf(item))">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
    <v-dialog persistent class="upload-Dialog" v-model="classDialog" max-width="600px">
        <AddClass @done="closeDialog" @reload="getClasses"></AddClass>
    </v-dialog>
    <!-- DELETE CLASS DIALOG -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title
          >Delete Class ?
          <v-spacer></v-spacer>
          <v-icon @click="deleteDialog = false" tabindex="-1">mdi-close</v-icon></v-card-title
        >
        <v-card-text class="mt-4">
          Warning! This cannot be undone and may affect GPA of <b>{{ deletedItem.enrollments.length }}</b> students
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
        <v-card-text class="mt-4 text-center">
          After you press confirm the class <b>{{ deletedItem.year + 'T' + deletedItem.trimester + ' SEC' + deletedItem.section }}</b> will be deleted forever
        </v-card-text>
        <v-card-actions class="pb-4 d-flex justify-content-end">
          <v-btn
            color="gray"
            text
            @click="deleteConfirmDialog = false"
          >Cancel</v-btn>
          <v-btn
            color="error"
            @click="deleteClass"
          >Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <WKFooter></WKFooter>
  </v-container>
</template>

<script>
import AddClass from "./components/add_grade";
import EditClass from "./components/edit_class"
import WKFooter from './components/footer';
export default {
  components: { AddClass, EditClass, WKFooter },
  data() {
    return {
      classDialog: false,
      search: "",
      headers: [
        { text: "Class Name", sortable: false, value: "name", width: "30%" },
        { text: "Year", sortable: true, value: "year", width: "10%"},
        { text: "Trimester", sortable: true, value: "trimester", width: "15%", align: "center" },
        { text: "Enrollments", sortable: false, value: "enrollments", width: "1%", align: "center" },
        { text: "", sortable: false, value: "", width: "98%", align: "center" },
        { text: "Edit", sortable: false, value: "edit", width: "1%", align: "center" },
        { text: "Delete", sortable: false, value: "delete", width: "1%", align: "center" },
      ],
      classes: [],
      total: 0,
      deleteDialog: false,
      deleteConfirmDialog: false,
      deletedIndex: 0,
      deletedItem: {
        _id: '',
        course: {
          code: '',
          name: ''
        },
        enrollments: [],
        section: '',
        instructor: {
          title: '',
          name: '',
        },
        trimester: '',
        year: '',
      },
    };
  },
  mounted() {
    this.getClasses()
  },
  methods: {
    getClasses() {
      let query = `
            {
              classes (searchInput: { course_code: "${this.$route.params.code}" }) {
                total
                classes {
                  _id
                  course {
                    code
                    name
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
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.total = res.data.data.classes.total;
          this.classes = res.data.data.classes.classes;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteItem(item, index) {
      this.deletedIndex = index;
      this.deletedItem = Object.assign({}, item);
      this.deleteDialog = true;
    },
    deleteClass() {
      let query = `
        mutation {
          delClass(classId: "${this.deletedItem._id}") { success }
        }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.classes.splice(this.deletedIndex,1)
          this.deleteDialog = false
          this.deleteConfirmDialog = false
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closeDialog() {
      this.classDialog = false
    }
  },
};
</script>

<style>
</style>
