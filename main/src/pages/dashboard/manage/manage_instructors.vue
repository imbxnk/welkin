<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <v-btn color="primary" @click="dialog = true"
          ><v-icon>mdi-plus</v-icon>Add Instructor</v-btn
        >
      </div>
      <div class="p-2 bd-highlight">
        <v-card style="max-width: auto"
          ><v-card-title>
            <div class="d-flex flex-column">
              <span>Instructors</span>
              <span style="font-size:0.8rem; color:#999; margin-top: -10px;"
                >Total: {{ total }}</span
              >
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
            mobile-breakpoint="0"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.title`]="{ item }">
              {{ item.title ? item.title : "-" }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="editItem(item, instructors.indexOf(item))">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="card-title"
          >Add Instructor
          <v-spacer></v-spacer>
          <v-icon @click="dialog = false">mdi-close</v-icon></v-card-title
        >
        <v-card-text>
          <add-instuctor :titles="intrucTitle"></add-instuctor>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="550px">
      <v-card>
        <v-card-title class="card-title">
          Edit Student
          <v-spacer></v-spacer>
          <v-icon @click="editDialog = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <v-form>
            <div class="d-flex flex-column">
              <div class="d-flex">

                <v-combobox
                  v-model="editedItem.title"
                  :items="intrucTitle"
                  label="Title"
                  class="me-4"
                  style="max-width: 170px"
                  clearable
                  outlined
                ></v-combobox>
                <v-text-field
                  label="First Name"
                  v-model="editedItem.given_name"
                  outlined
                ></v-text-field>
              </div>
              <v-text-field
                label="Last Name"
                v-model="editedItem.family_name"
                outlined
              ></v-text-field>
              <v-text-field
                label="Email"
                v-model="editedItem.email"
                outlined
              ></v-text-field>
              <v-text-field
                type="text"
                max-length="10"
                pattern="\d*"
                onkeydown="return ( event.ctrlKey || event.altKey
                          || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                          || (95<event.keyCode && event.keyCode<106)
                          || (event.keyCode==8) || (event.keyCode==9)
                          || (event.keyCode>34 && event.keyCode<40)
                          || (event.keyCode==46) )"
                label="Phone"
                v-model="editedItem.phone"
                outlined
              ></v-text-field>
            </div>
          </v-form>
          <v-card-actions>
            <div class="d-flex flex-row w-100 justify-content-end bd-highlight">
              <v-btn class="mt-4 me-4" text @click="clear">clear</v-btn>
              <v-btn class="mt-4" color="primary" @click="update()">Submit</v-btn>
            </div>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AddInstuctor from "./components/add_instructor.vue";
export default {
  components: {
    AddInstuctor,
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "Prefix", sortable: false, value: "title", width: "1%" },
        { text: "Name", sortable: false, value: "name", width: "98%" },
        { text: "Edit", sortable: false, value: "actions", width: "1%" },
      ],
      Info: [],
      instructors: [],
      total: 0,
      dialog: false,
      editDialog: false,
      editedItem: {
        _id: "",
        title: "",
        given_name: "",
        family_name: "",
        name: "",
        email: "",
        phone: "",
      },
      intrucTitle: ["Asst.Prof.", "Assoc.Prof.", "Prof.", "Dr."],
    };
  },
  watch: {
    editDialog(value) {
      if(value) {
        if(!this.intrucTitle.includes(this.editedItem.title)) {
          this.intrucTitle.push(this.editedItem.title)
        }
      }
    }
  },
  mounted() {
    this.getInstructors();
  },
  methods: {
    async getInstructors() {
      let query = `
            {
              instructors {
                total
                instructors {
                  _id
                  name
                  title
                  given_name
                  family_name
                  email
                  phone
                }
              }
            }
          `;
      query = query.replace(/\s+/g, ' ').trim()
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.total = res.data.data.instructors.total;
          this.instructors = [...res.data.data.instructors.instructors];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editItem(item, index) {
      this.editedIndex = index;
      this.editedItem = Object.assign({}, item);
      // eslint-disable-next-line no-console
      console.log(this.editedItem, this.editedIndex);
      this.editDialog = true;
    },
    close() {
      this.dialog = false;
      this.editDialog = false;
    },
    clear() {
      (this.editedItem.title = ""),
        (this.editedItem.given_name = ""),
        (this.editedItem.family_name = ""),
        (this.editedItem.name = ""),
        (this.editedItem.email = ""),
        (this.editedItem.phone = "");
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },
    update() {
      let query = `mutation{
                    updateInstructor(instructorID: "${this.editedItem._id}",instructorInput:{
                      title: "${this.editedItem.title || ''}",
                      given_name: "${this.editedItem.given_name}",
                      family_name: "${this.editedItem.family_name}",
                      email: "${this.editedItem.email || ''}",
                      phone: "${this.editedItem.phone || ''}"
                    }){
                        success
                        message
                    }
                }`;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.editedItem.name = this.editedItem.given_name.trim() + " " + this.editedItem.family_name.trim()
          Object.assign(this.instructors[this.editedIndex], this.editedItem);
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