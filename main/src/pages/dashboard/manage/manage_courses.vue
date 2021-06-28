<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2">
      <div class="ml-auto p-2">
        <AddCourse @addCourse="addCourse"></AddCourse>
      </div>
      <div class="p-2">
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
                  mdi-folder-open
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

    <v-dialog persistent v-model="editDialog" max-width="700">
      <v-card>
        <v-card-title
          >Edit Course
          <v-spacer></v-spacer>
          <v-icon @click="close()">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <div class="d-flex justify-content-start flex-column flex-sm-row">
            <div class="flex-shrink-1">
              <v-text-field
                v-model="editedItem.code"
                label="Code"
                outlined
                required
                class="forceUppercase"
              ></v-text-field>
            </div>
            <div class="flex-grow-1 ms-sm-3">
              <v-text-field
                v-model="editedItem.name"
                label="Course Name"
                outlined
                required
              ></v-text-field>
            </div>
          </div>
          <div class="d-flex">
            <v-textarea
              outlined
              label="Course Description"
              v-model="editedItem.description"
            ></v-textarea>
          </div>
          <v-text-field
            v-model="editedItem.credit"
            label="Credit"
            outlined
            required
            hide-details
            pattern="\d*"
            onkeydown="return ( event.ctrlKey || event.altKey
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9)
                      || (event.keyCode>34 && event.keyCode<40)
                      || (event.keyCode==46) )"
          ></v-text-field>
          <div class="d-flex mt-1">
            <v-divider></v-divider>
            <span class="flex-shrink-1 d-flex align-items-center mx-2">
              Credit Description
            </span>
            <v-divider></v-divider>
          </div>
          <div class="d-flex">
            <v-text-field
              v-model="editedItem.credit_description.lecture"
              class="me-1"
              label="Lecture Hours"
              outlined
              required
              pattern="\d*"
              onkeydown="return ( event.ctrlKey || event.altKey
                        || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                        || (95<event.keyCode && event.keyCode<106)
                        || (event.keyCode==8) || (event.keyCode==9)
                        || (event.keyCode>34 && event.keyCode<40)
                        || (event.keyCode==46) )"
            ></v-text-field>
            <v-text-field
              v-model="editedItem.credit_description.lab"
              class="mx-2"
              label="Lab Hours"
              outlined
              required
              pattern="\d*"
              onkeydown="return ( event.ctrlKey || event.altKey
                        || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                        || (95<event.keyCode && event.keyCode<106)
                        || (event.keyCode==8) || (event.keyCode==9)
                        || (event.keyCode>34 && event.keyCode<40)
                        || (event.keyCode==46) )"
            ></v-text-field>
            <v-text-field
              v-model="editedItem.credit_description.self_study"
              class="ms-1"
              label="Self Study Hours"
              outlined
              required
              pattern="\d*"
              onkeydown="return ( event.ctrlKey || event.altKey
                        || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                        || (95<event.keyCode && event.keyCode<106)
                        || (event.keyCode==8) || (event.keyCode==9)
                        || (event.keyCode>34 && event.keyCode<40)
                        || (event.keyCode==46) )"
            ></v-text-field>
          </div>
          <v-card-actions class="d-flex justify-content-end">
            <v-btn
              class="py-3"
              style="min-width: 120px"
              :disabled="!(editedItem.code.length === 7 && editedItem.name.length > 0 && editedItem.credit.toString().length > 0 && editedItem.credit_description.lecture.toString().length > 0 && editedItem.credit_description.self_study.toString().length > 0 && editedItem.credit_description.lab.toString().length > 0)"
              color="primary"
              @click="updateCourse()"
            >submit</v-btn>
          </v-card-actions>
        </v-card-text>
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
      editDialog: false,
      search: "",
      headers: [
        { text: "Code", sortable: true, value: "code", width: "1%" },
        { text: "Course Name", sortable: false, value: "name", width: "97%" },
        { text: "Classes", sortable: false, value: "class", width: "1%", align: "center" },
        { text: "Edit", sortable: false, value: "edit", width: "1%", align: "center" },
      ],
      courses: [],
      editedItem: {
        _id: '',
        name: '',
        code: '',
        description: '',
        credit: '',
        credit_description: {
          lecture: '',
          lab: '',
          self_study: ''
        }
      },
      editedIndex: -1,
      total: 0,
    };
  },
  mounted() {
    this.getCourses()
  },
  methods: {
    getCourses() {
      let query = `
            {
              courses {
                total
                courses {
                  _id
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
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.total = res.data.data.courses.total;
          this.courses = res.data.data.courses.courses;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addCourse(newValue) {
      this.courses.unshift(newValue)
    },
    editItem(item) {
      this.editedIndex = this.courses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editDialog = true;
    },
    close() {
      this.editDialog = false
    },
    updateCourse() {
      let query = `
        mutation {
          updateCourse(searchInput: { _id: "${this.editedItem._id}" }, courseInput: {
            name: "${this.editedItem.name}",
            code: "${this.editedItem.code}",
            description: "${this.editedItem.description}",
            credit: ${this.editedItem.credit},
            credit_description: {
              lecture: ${this.editedItem.credit_description.lecture},
              lab: ${this.editedItem.credit_description.lab},
              self_study: ${this.editedItem.credit_description.self_study}
            }
          }) {
            _id
            name
            code
            description
            credit
            credit_description{ lecture lab self_study }
          }
        }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          Object.assign(this.courses[this.editedIndex], this.editedItem);
          this.close()
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
