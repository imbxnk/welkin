<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <v-btn @click.prevent="ToImportPage()" color="#3c84fb" style="color: white;">Import Student</v-btn>
      </div>
      <div class="p-2 bd-highlight">
        <v-card style="max-width: auto">
            <v-card-title class="ml-6">
                Manage Students
                <v-spacer></v-spacer>
                <v-text-field class="mx-auto" append-icon="mdi-magnify" label="Search" type="text" v-model="search"></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="students" :search="search" class="student px-3 pb-3" hide-default-footer disable-pagination>
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
        { text: "Entry Period", sortable: false, value: "entry_tri_year", width: 100 },
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
      search:"",
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
            student["entry_tri_year"] = "T" + [student.entry_trimester, student.entry_year].join("/");
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
        console.log(this.editedItem, this.editedIndex);
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
        // if (this.editedIndex > -1) {
        //     Object.assign(this.Info[this.editedIndex], this.editedItem);
        // } else {
        //     this.Info.push(this.editedItem);
        // }
        // eslint-disable-next-line no-console
        console.log(this.editedItem);
        let query = `mutation{
                        updateStudent(searchInput: {sid:"${this.editedItem.sid}"},studentInput: {
                            sid: "${this.editedItem.sid}"
                            given_name: "${this.editedItem.given_name}",
                            family_name: "${this.editedItem.family_name}",
                            nick_name: "${this.editedItem.nick_name}"
                            prefix: "${this.editedItem.prefix}",
                            entry_trimester: "${this.editedItem.entry_trimester}",
                            entry_year: "${this.editedItem.entry_year}",
                            email: "${this.editedItem.email}",
                            phone: "${this.editedItem.phone}",
                            ){
                                sid
                                given_name
                                family_name
                                nick_name
                                prefix
                                email
                                phone
                            }
                        }
                        `
            this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials : true }).then(res => {
            this.close()
            console.log(res.data.data.editItem)
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
