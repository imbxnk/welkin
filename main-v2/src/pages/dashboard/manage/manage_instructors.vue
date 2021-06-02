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
            <template v-slot:[`item.title`]="{ item }">
              {{ item.title || "-" }}
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
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title
          >Add Instructor
          <v-spacer></v-spacer>
          <v-icon @click="dialog = false">mdi-close</v-icon></v-card-title>
        <add-instuctor></add-instuctor>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="550px">
      <v-card>
        <v-card-title>
            Edit Student
             <v-spacer></v-spacer>
            <v-icon @click="editDialog = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
            <v-form>
                <div class="d-flex flex-column bd-highlight">
                    <div class="p-2 bd-highlight mx-auto">
                        <div class="d-flex flex-row justify-content-evenly bd-highlight">
                            <div class="p-2 bd-highlight">
                              <v-text-field label="Title" v-model="editedItem.title" outlined ></v-text-field>
                            </div>
                            <div class="p-2 bd-highlight">
                              <v-text-field label="First Name" v-model="editedItem.given_name" outlined ></v-text-field>
                            </div>
                            <div class="p-2 bd-highlight">
                              <v-text-field label="Last Name" v-model="editedItem.family_name" outlined ></v-text-field>
                            </div>
                        </div>
                    </div>
                    <div class="p-2 bd-highlight mx-auto">
                        <div class="d-flex flex-row justify-content-evenly bd-highlight">
                            <div class="p-2 bd-highlight">
                              <v-text-field label="email" v-model="editedItem.email" outlined ></v-text-field>
                            </div>
                            <div class="p-2 bd-highlight">
                              <v-text-field type="number" label="phone" v-model="editedItem.phone" outlined></v-text-field>
                            </div>
                        </div>
                    </div>
                </div>
            </v-form>
        </v-card-text>
        <v-card-action>
          <div class="d-flex flex-row justify-content-end bd-highlight">
            <div class="p-2 bd-highlight">
              <v-btn class="my-4" text @click="clear">clear</v-btn>
              <v-btn class="my-4" color="#3c84fb" @click="dialogCheck=true" text>Submit</v-btn>
            </div>
          </div>
        </v-card-action>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AddInstuctor from "./components/add_instructor.vue"
export default {
  components: {
    AddInstuctor
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
      Info: [],
      total: 0,
      dialog: false,
      editDialog: false,
      editedItem:{
        title: "",
        given_name: "",
        family_name: "",
        email: "",
        phone: "",
      },
      intrucTitle:["Asst.", "Assoc.", "Prof.", "Dr."]
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
                  given_name
                  family_name
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
      this.editedIndex = this.Info.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // eslint-disable-next-line no-console
      console.log(this.editedItem, this.editedIndex);
      this.editDialog = true
    },
    close(){
      this.dialog = false
      this.editDialog = false
    },
    clear() {
      (this.editedItem.title = ""), (this.editedItem.given_name = ""), (this.editedItem.family_name = ""), (this.editedItem.email = ""), (this.editedItem.phone = "")
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },
  },
};
</script>

<style>
</style>
