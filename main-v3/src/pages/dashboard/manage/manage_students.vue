<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <v-btn @click.prevent="ToImportPage()" color="#3c84fb" style="color: white;"
          >Import Student</v-btn
        >
      </div>
      <div class="p-2 bd-highlight">
        <v-card style="max-width: auto">
          <v-card-title class="ml-6">
            Manage Students
            <v-spacer></v-spacer>
            <v-text-field
              class="mx-auto"
              append-icon="mdi-magnify"
              label="Search"
              type="text"
              v-model="search"
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="students"
            :search="search"
            mobile-breakpoint="0"
            class="student px-3 pb-3"
            hide-default-footer
            disable-pagination
          >
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
            <template v-slot:[`item.prefix`]="{ item }">
              {{ item.prefix ? item.prefix : "-" }}
            </template>
            <template v-slot:[`item.nick_name`]="{ item }">
              {{ item.nick_name ? item.nick_name : "-" }}
            </template>
            <template v-slot:[`item.entry_tri_year`]="{ item }">
              {{ item.entry_tri_year ? item.entry_tri_year : "Unknown" }}
            </template>
            <template v-slot:[`item.advisor.name`]="{ item }">
              {{ item.advisor.name ? item.advisor.name : "Unknown" }}
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
                    <v-select
                      class="input"
                      label="Prefix"
                      :items="prefix"
                      outlined
                      v-model="editedItem.prefix"
                    ></v-select>
                  </div>
                  <div class="p-2 bd-highlight">
                    <v-text-field
                      class="input"
                      label="First name"
                      v-model="editedItem.given_name"
                      outlined
                    ></v-text-field>
                  </div>
                  <div class="p-2 bd-highlight">
                    <v-text-field
                      class="input"
                      label="Family name"
                      v-model="editedItem.family_name"
                      outlined
                    ></v-text-field>
                  </div>
                </div>
              </div>
              <div class="p-2 bd-highlight">
                <div class="d-flex flex-row justify-content-evenly bd-highlight">
                  <div class="p-2 bd-highlight">
                    <v-select
                      class="input"
                      label="Entry Trimester"
                      :items="trimester"
                      outlined
                      v-model="editedItem.entry_trimester"
                    ></v-select>
                  </div>
                  <div class="p-2 bd-highlight">
                    <v-text-field
                      type="number"
                      class="input"
                      label="Entry Year"
                      v-model="editedItem.entry_year"
                      outlined
                      :rules="[() => entry_year.length >= 4 || 'Required 4 characters']"
                    ></v-text-field>
                  </div>
                  <div class="p-2 bd-highlight">
                    <v-text-field
                      class="input"
                      label="Program"
                      v-model="editedItem.program"
                      outlined
                    ></v-text-field>
                  </div>
                </div>
              </div>
              <div class="p-2 bd-highlight">
                <div class="d-flex flex-row justify-content-evenly bd-highlight">
                  <div class="p-2 bd-highlight">
                    <v-text-field
                      class="input"
                      label="Nickname"
                      v-model="editedItem.nick_name"
                      outlined
                    ></v-text-field>
                  </div>
                  <div class="p-2 bd-highlight">
                    <v-text-field
                      class="input"
                      label="Email"
                      v-model="editedItem.email"
                      outlined
                    ></v-text-field>
                  </div>
                  <div class="p-2 bd-highlight">
                    <v-text-field
                      class="input"
                      label="Phone number"
                      v-model="editedItem.phone"
                      outlined
                    ></v-text-field>
                  </div>
                </div>
              </div>
              <div class="p-2 bd-highlight">
                <div class="d-flex flex-row justify-content-end bd-highlight">
                  <v-btn class="my-3 mr-auto success" text>Line</v-btn>
                  <v-btn class="my-3" @click="close()" text>close</v-btn>
                  <v-btn class="my-3" color="#3c84fb" @click="dialogCheck = true" text
                    >Submit</v-btn
                  >
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCheck" max-width="450px">
      <v-card>
        <v-card-title class="headline grey lighten-2"> Confirm Student Information </v-card-title
        ><br />
        <v-card-text
          >Are you sure you want to edit: <br />Student ID: <b>{{ this.editedItem.sid }}</b>
          <br />Prefix: <b>{{ this.editedItem.prefix }}</b> <br />First Name:
          <b>{{ this.editedItem.given_name }}</b> <br />Last Name:
          <b>{{ this.editedItem.family_name }}</b> <br />Nickname:
          <b>{{ this.editedItem.nick_name }}</b> <br />Email: <b>{{ this.editedItem.email }}</b>
          <br />Phone: <b>{{ this.editedItem.phone }}</b> <br />Entry Trimester:
          <b>{{ this.editedItem.entry_trimester }}</b> <br />Entry Year:
          <b>{{ this.editedItem.entry_year }}</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="dialogCheck = false">No</v-btn>
          <v-btn text color="success" @click="save()">Yes</v-btn>
        </v-card-actions></v-card
      >
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
        { text: "Program", sortable: false, value: "program", width: 80 },
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
        program: "",
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
        program: "",
        email: "",
        phone: "",
        lineID: "",
        entry_trimester: "",
        entry_year: "",
      },
      Info: [],
      dialog: false,
      dialogCheck: false,
      prefix: ["Mr.", "Ms.", "Mrs"],
      search: "",
      trimester: ["1", "2", "3"],
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
                    program
                    entry_trimester
                    avatar_url
                    entry_year
                    prefix
                    program
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
          this.Info = [...res.data.data.students.students];
          this.students.forEach((student) => {
            student["name"] = [student.given_name, student.family_name].join(" ");
            student["entry_tri_year"] =
              student.entry_trimester && student.entry_year
                ? `T${student.entry_trimester}/${student.entry_year}`
                : null;
            if (!student.advisor) student.advisor = { name: "" };
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
      this.dialogCheck = false;
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
      console.log(this.Info[this.editedIndex]);
      let query = `
          mutation{
            updateStudent(searchInput: {sid:"${this.Info[this.editedIndex].sid}"},studentInput:{
              sid:"${this.Info[this.editedIndex].sid}",
              given_name:"${this.Info[this.editedIndex].given_name}",
              family_name:"${this.Info[this.editedIndex].family_name}",
              nick_name: "${this.Info[this.editedIndex].nick_name}"
              prefix:"${this.Info[this.editedIndex].prefix}",
              program:"${this.Info[this.editedIndex].program}",
              entry_trimester: "${this.Info[this.editedIndex].entry_trimester}",
              entry_year: "${this.Info[this.editedIndex].entry_year}",
              phone: "${this.Info[this.editedIndex].phone}",
              email: "${this.Info[this.editedIndex].email}",
              }){
                sid
                given_name
                family_name
                nick_name
                prefix
                entry_trimester
                entry_year
                phone
                email
                program
                advisor {
                _id
                title
                name
                given_name
                family_name
              }
            }
          }
        `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.close();
          console.log(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.input {
  min-width: 50px;
  max-width: 300px;
  width: 300px;
}
</style>
