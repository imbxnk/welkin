<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <div class="d-flex flex-row justify-content-end bd-highlight">
          <div class="p-2 bd-highlight">
            <v-btn @click.prevent="importDialog = true" color="#3c84fb" style="color: white;"
              ><v-icon>mdi-plus</v-icon> Import Students</v-btn
            >
          </div>
        </div>
      </div>
      <div class="p-2 bd-highlight">
        <v-card style="max-width: auto">
          <v-card-title>
            <div class="d-flex flex-column">
              <span>Students</span>
              <span style="font-size:0.8rem; color:#999; margin-top: -10px;"
                >Total: {{ total }}</span
              >
            </div>
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
            <template v-slot:[`item.name`]="{ item }">
              <router-link style="text-decoration: none; color:inherit" target="_blank" :to="{ name: 'student_record', params: { sid: item.sid } }">{{ item.prefix ? item.prefix + ' ' + item.name : item.name }}</router-link>
            </template>
            <!-- <template v-slot:[`item.nick_name`]="{ item }">
              {{ item.nick_name ? item.nick_name : "-" }}
            </template> -->
            <template v-slot:[`item.entry_tri_year`]="{ item }">
              {{ item.entry_tri_year ? item.entry_tri_year : "Unknown" }}
            </template>
            <template v-slot:[`item.advisor.given_name`]="{ item }">
              {{ item.advisor.given_name ? item.advisor.given_name : "Unknown" }}
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

    <v-dialog class="upload-Dialog" v-model="importDialog" width="1000px">
      <v-card>
        <v-card-title class="card-title"
          >Import Student
          <v-spacer></v-spacer>
          <v-icon @click="importDialog = false">mdi-close</v-icon></v-card-title
        >
        <AddStudent></AddStudent>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="card-title">
          Edit Student
        </v-card-title>
        <v-card-text>
          <v-form>
            <div class="d-flex flex-column">
              <div class="d-flex">
                <v-autocomplete
                  v-model="editedItem.program"
                  :items="programs"
                  label="Program"
                  class="me-4"
                  auto-select-first
                  clearable
                  outlined
                ></v-autocomplete>
                <div class="d-flex">
                  <v-select
                    label="Trimester"
                    :items="trimester"
                    style="max-width: 80px"
                    class="me-4"
                    outlined
                    v-model="editedItem.entry_trimester"
                  ></v-select>
                  <v-text-field
                    style="max-width: 120px"
                    type="text"
                    pattern="\d*"
                    onkeydown="return ( event.ctrlKey || event.altKey
                              || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                              || (95<event.keyCode && event.keyCode<106)
                              || (event.keyCode==8) || (event.keyCode==9)
                              || (event.keyCode>34 && event.keyCode<40)
                              || (event.keyCode==46) )"
                    label="Year"
                    v-model="editedItem.entry_year"
                    outlined
                    :rules="[() => editedItem.entry_year.length >= 4 || 'Required 4 characters']"
                  ></v-text-field>
                </div>
              </div>

              <div class="d-flex flex-wrap">
                <v-select
                  label="Prefix"
                  :items="prefix"
                  style="max-width: 100px"
                  class="me-4"
                  outlined
                  v-model="editedItem.prefix"
                ></v-select>
                <v-text-field
                  class="flex-grow-1"
                  label="First name"
                  v-model="editedItem.given_name"
                  outlined
                ></v-text-field>
              </div>
              <v-text-field
                label="Family name"
                v-model="editedItem.family_name"
                outlined
              ></v-text-field>

              <v-text-field
                label="Nickname (optional)"
                v-model="editedItem.nick_name"
                outlined
              ></v-text-field>
              <v-text-field
                label="Email (optional)"
                v-model="editedItem.email"
                outlined
              ></v-text-field>
              <v-text-field
                label="Phone number (optional)"
                v-model="editedItem.phone"
                outlined
              ></v-text-field>
              <v-select
                label="Status"
                :items="allStatus"
                outlined
                v-model="editedItem.status.current"
                item-value="current"
              ></v-select>
            </div>
          </v-form>
          <v-card-actions>
            <div class="d-flex justify-content-between w-100">
              <v-btn class="my-3 me-4 success" text>Line</v-btn>
              <div class="d-flex">
                <v-btn class="my-3 me-4" @click="close()" text>close</v-btn>
                <v-btn class="my-3" color="primary" @click="dialogCheck = true">Submit</v-btn>
              </div>
            </div>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCheck" max-width="450px">
      <v-card>
        <v-card-title class="headline grey lighten-2"> Confirm Student Information </v-card-title
        ><br />
        <v-card-text
          >Are you sure you want to edit: <br />Student ID: <b>{{ this.editedItem.sid }}</b>
          <br />Prefix: <b>{{ this.editedItem.prefix }}</b> <br />
          First Name:<b>{{ this.editedItem.given_name }}</b> <br />
          Last Name: <b>{{ this.editedItem.family_name }}</b> <br />
          Nickname: <b>{{ this.editedItem.nick_name || "-" }}</b> <br />
          Email: <b>{{ this.editedItem.email || "-" }}</b> <br />
          Phone: <b>{{ this.editedItem.phone || "-" }}</b> <br />
          Entry Trimester: <b>{{ this.editedItem.entry_trimester }}</b> <br />
          Entry Year: <b>{{ this.editedItem.entry_year }}</b><br/>
          Status: <b>{{ this.editedItem.status.current }}</b>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="error" @click="dialogCheck = false">No</v-btn>
            <v-btn color="primary" @click="save()">Yes</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AddStudent from "./components/add_students.vue"
export default {
  components:{
    AddStudent
  },
  data() {
   return {
      headers: [
        { sortable: false, value: "avatar_url", width: "1%" },
        { text: "Student ID", sortable: false, value: "sid", width: "9%" },
        { text: "Program", sortable: false, value: "program", width: "1%", align: "center" },
        { text: "Name", sortable: false, value: "name", width: "40%" },
        { text: "Status", sortable: false, value: "status.current", width: "10%" },
        { text: "Entry Period", sortable: false, value: "entry_tri_year", width: "10%" },
        { text: "advisor", sortable: false, value: "advisor.given_name", width: "10%" },
        { text: "Edit", sortable: false, value: "actions", width: "1%" },
      ],
      students: [],
      total: 0,
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
        status: {
          current: "",
        },
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
      importDialog: false,
      programs: [
        'ICCI',
        'ICBE',
        'ICCS',
        'ICMI',
        'ICMF',
        'ICMK',
        'ICCU',
        'ICSS',
        'ICMC',
        'ICCD',
        'ICIR',
        'ICIH',
        'ICIB',
        'ICEN',
        'ICCH',
        'ICPY',
        'ICFS'
      ],
      allStatus: [
        'Studying',
        'Leave of absence',
        'On Exchange',
        'Retired',
        'Resigned',
        'Alumni',
        'Unknown'
      ]
    };
  },
  mounted() {
    this.getStudents();
  },
  watch: {
    dialog(value) {
      if(value) {
        if(!this.programs.includes(this.editedItem.program)) {
          this.programs.push(this.editedItem.program)
        }
      }
    }
  },
  methods: {
    async getStudents() {
      let query = `
              {
                students (sortBy: "status", includeNonCI: true) {
                  total
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
                      given_name
                    }
                    status {
                      current
                    }
                  }
                }
              }
          `;
      query = query.replace(/\s+/g, ' ').trim()
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.total = res.data.data.students.total
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
      console.log("TEST")
      console.log(this.Info[this.editedIndex]);
      let query = `
          mutation{
            updateStudent(searchInput: {sid:"${this.Info[this.editedIndex].sid}"}, studentInput:{
              given_name:"${this.Info[this.editedIndex].given_name}",
              family_name:"${this.Info[this.editedIndex].family_name}",
              nick_name: "${this.Info[this.editedIndex].nick_name || ''}"
              prefix:"${this.Info[this.editedIndex].prefix}",
              program:"${this.Info[this.editedIndex].program}",
              entry_trimester: "${this.Info[this.editedIndex].entry_trimester}",
              entry_year: "${this.Info[this.editedIndex].entry_year}",
              phone: "${this.Info[this.editedIndex].phone || ''}",
              email: "${this.Info[this.editedIndex].email || ''}",
              },
              status: "${this.Info[this.editedIndex].status.current}"
              ){
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

              }
          }
        `;
      query = query.replace(/\s+/g, ' ').trim()
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
.upload-Dialog{
  min-height: 500px;
}
</style>
