<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <v-btn @click.prevent="ToImportPage()">Import Student</v-btn>
      </div>
      <div class="p-2 bd-highlight">
        <v-card style="max-width: auto">
            <v-data-table
                :headers="headers"
                :items="students"
                class="student"
            >
              <template v-slot:item.avatar_url="{ item }">
                <v-avatar
                  size="35"
                  :style="`background: url(${item.avatar_url || $config.defaultAvatar}) center center / cover;`"
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

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          <h5>Test</h5>
        </v-card-title>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
    data(){
        return{
            headers:[
                { sortable: false, value: "avatar_url", width: "1%" },
                { text: "Student ID", sortable: false, value: "sid", width: "9%" },
                { text: "Prefix", sortable: false, value: "prefix", width: "1%" },
                { text: "Name", sortable: false, value: "name", width: 80 },
                { text: "Nickname", sortable: false, value: "nick_name", width: 80 },
                { text: "Email", sortable: false, value: "email", width: 80 },
                { text: "Phone", sortable: false, value: "phone", width: 80 },
                { text: "advisor", sortable: false, value: "advisor.name", width: 120 },
                { text: "Edit", sortable: false, value:"actions", width: "1%" },
            ],
            students:[],
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
                entry_year: "",
                advisor:{
                    name: ""
                },
            },
            Info: [],
            dialog: false,
        }
    },
    mounted(){
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
      console.log(item);
      this.dialog = true;
    },
  },
};
</script>

<style></style>
