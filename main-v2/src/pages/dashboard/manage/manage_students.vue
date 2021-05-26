<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <v-btn @click.prevent="ToImportPage()">Import Student</v-btn>
      </div>
      <div class="p-2 bd-highlight">
        <v-card style="max-width: auto">
          <v-data-table :headers="headers" :items="students" class="student">
            <template v-slot:[`item.avatar_url`]="{ item }">
              <v-avatar
                size="35"
                :style="
                  `background: url(${item.avatar_url ||
                    $config.defaultAvatar}) center center / cover;`
                "
              >
              </v-avatar>
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

    <v-dialog v-model="dialog" max-width="1000px">
      <v-card>
        <v-card-title>
            Edit Student
        </v-card-title>
        <v-card-text>
            <v-form>
                <div class="d-flex flex-column bd-highlight">
                    <div class="p-2 bd-highlight">
                        <div class="d-flex flex-row justify-content-evenly bd-highlight">
                            <div class="p-2 bd-highlight">
                                <v-select class="input" label="Prefix" :items="prefix" outlined v-model="editedItem.prefix"></v-select>
                            </div>
                            <div class="p-2 bd-highlight"> 
                                <v-text-field class="input" label="First name" v-model="editedItem.given_name" outlined></v-text-field>
                            </div>
                            <div class="p-2 bd-highlight">
                                <v-text-field class="input" label="Family name" v-model="editedItem.family_name" outlined></v-text-field>
                            </div>
                        </div>
                    </div>
                    <div class="p-2 bd-highlight">
                        <div class="d-flex flex-row justify-content-evenly bd-highlight">
                            <div class="p-2 bd-highlight">
                                <v-text-field class="input" label="Entry Trimester" v-model="editedItem.entry_trimester" outlined></v-text-field>
                            </div>
                            <div class="p-2 bd-highlight">
                                <v-text-field class="input" label="Entry Year" v-model="editedItem.entry_year" outlined></v-text-field>
                            </div>
                            <div class="p-2 bd-highlight">
                                <v-text-field class="input" label="Email" v-model="editedItem.email" outlined></v-text-field>
                            </div>
                        </div>
                    </div>
                    <div class="p-2 bd-highlight">
                        <div class="d-flex flex-row justify-content-evenly bd-highlight">
                            <div class="p-2 bd-highlight">
                                <v-text-field class="input" label="Phone number" v-model="editedItem.phone" outlined></v-text-field>
                            </div>
                        </div>
                    </div>
                    <div class="p-2 bd-highlight">
                        <div class="d-flex flex-row justify-content-end bd-highlight">
                            <v-btn class="my-3" @click="close()" text>close</v-btn>
                            <v-btn class="my-3" color="#3c84fb" @click="save()" text>Submit</v-btn>
                        </div>
                    </div>
                </div>
            </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { sortable: false, value: "avatar_url", width: "1%" },
        { text: "Student ID", sortable: false, value: "sid", width: "9%" },
        { text: "Prefix", sortable: false, value: "prefix", width: "1%" },
        { text: "Name", sortable: false, value: "name", width: 80 },
        { text: "Nickname", sortable: false, value: "nick_name", width: 80 },
        { text: "Email", sortable: false, value: "email", width: 80 },
        { text: "Phone", sortable: false, value: "phone", width: 80 },
        { text: "Entry Trimester", sortable: false, value: "entry_trimester", width: 80 },
        { text: "Entry Year", sortable: false, value: "entry_year", width: 80 },
        { text: "advisor", sortable: false, value: "advisor.name", width: 120 },
        { text: "Edit", sortable: false, value: "actions", width: "1%" },
      ],
      students: [],
      editedIndex: -1,
      editedItem: {
        sid: "",
        prefix: "",
        given_name: "",
        family_name: "",
        nick_name: "",
        email: "",
        phone: "",
        lineID: "",
        entry_trimester: "",
        entry_year: "",
      },
      defaultItem: {
        sid: "",
        prefix: "",
        given_name: "",
        family_name: "",
        nick_name: "",
        email: "",
        phone: "",
        lineID: "",
        entry_trimester: "",
        entry_year: "",
      },
      Info: [],
      dialog: false,
      prefix:["Mr.", "Ms.", "Mrs",],
    };
  },
  mounted() {
    this.getStudents();
  },
  methods: {
    ToImportPage() {
      this.$router.push({ name: "add_student" });
    },
    async getStudents() {
      let query = `
              query {
                students (sortBy: "status") {
                  students {
                    sid
                    given_name
                    family_name
                    nick_name
                    email
                    phone
                    lineID
                    entry_trimester
                    avatar_url
                    entry_year
                    prefix
                    advisor {
                      name
                    }
                    status {
                      current
                    }
                  }
                }
              }
          `;
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          // console.log(res.data.data.students);
          this.students = [...res.data.data.students.students];
          this.students.forEach((student) => {
            student["name"] = [student.given_name, student.family_name].join(" ");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    
    editItem(item) {
        this.editedIndex = this.Info.indexOf(item);
        this.editedItem = Object.assign({}, item);
        // eslint-disable-next-line no-console
        console.log(item,);
        this.dialog = true;
    },
    
    close() {
        this.dialog = false;
        this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
        });
    },
    save() {
        if (this.editedIndex > -1) {
            Object.assign(this.Info[this.editedIndex], this.editedItem);
        } else {
            this.Info.push(this.editedItem);
        }
        // eslint-disable-next-line no-console
        console.log(this.Info[this.editedIndex], this.Info);
        let query = `mutation{
                        updateStudent(searchInput: {sid:"${this.Info[this.editedIndex].sid}"},studentInput: {
                            sid: "${this.Info[this.editedIndex].sid}"
                            given_name: "${this.Info[this.editedIndex].given_name}",
                            family_name: "${this.Info[this.editedIndex].family_name}",
                            nick_name: "${this.Info[this.editedIndex].nick_name}"
                            prefix: "${this.Info[this.editedIndex].prefix}",
                            entry_trimester: "${this.Info[this.editedIndex].entry_trimester}",
                            entry_year: "${this.Info[this.editedIndex].entry_year}",
                            email: "${this.Info[this.editedIndex].email}",
                            phone: "${this.Info[this.editedIndex].phone}",
                            ){
                                sid
                                given_name
                                family_name
                                nick_name
                                prefix
                                email
                                phone
                            }
                        }`
        this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials : true }).then(res => {
            this.close()
        }).catch (err =>{
            console.log(err)
        })
    },
  },
};
</script>

<style>
    .input{
        min-width: 50px;
        max-width: 300px;
        width: 300px;
    }
</style>
