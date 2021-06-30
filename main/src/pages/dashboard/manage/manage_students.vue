<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 wk-manage-container">
      <div class="ml-auto p-2">
        <div class="d-flex flex-row justify-content-end">
          <AddStudent @addNewStudent="addNewStudent"></AddStudent>
        </div>
      </div>
      <div class="p-2">
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

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="card-title">
          Edit Student
        </v-card-title>
        <v-card-text>
          <v-form>
            <div class="d-flex flex-column">
              <div class="d-flex">
                <v-combobox
                  v-model="editedItem.program"
                  :items="programs"
                  label="Program"
                  class="me-4"
                  auto-select-first
                  clearable
                  outlined
                ></v-combobox>
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
                v-model="editedItem.status"
                return-object
                item-text="current"
              ></v-select>
              <v-select
                label="Advisor"
                :items="instructors"
                outlined
                v-model="editedItem.advisor"
                item-text="_id"
                return-object
              >
                <template v-slot:selection="data">
                  {{ data.item._id ? "" : "-" }}{{ data.item.title }} {{ data.item.name }}
                </template>
                <template v-slot:item="data">
                  {{ data.item._id ? "" : "-" }}{{ data.item.title }} {{ data.item.name }}
                </template>
              </v-select>
            </div>
            <div class="d-flex justify-content-between">
              <div class="d-flex align-items-center">
                LINE: <v-chip class="ms-4" v-if="editedItem.lineUID" color="success">Connected</v-chip><v-chip class="ms-4" v-else>Not Registered</v-chip>
              </div>
              <div class="flex-shrink-1 align-items-center" v-if="editedItem.lineUID"><v-btn text small color="red" @click="unlinkedDialog = true">Unlinked</v-btn></div>
            </div>
          </v-form>
          <v-card-actions>
            <div class="d-flex justify-content-end mt-4 w-100">
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
          >Are you sure you want to edit: <br />Student ID: <b>{{ editedItem.sid }}</b>
          <br />Prefix: <b>{{ editedItem.prefix }}</b> <br />
          First Name:<b>{{ editedItem.given_name }}</b> <br />
          Last Name: <b>{{ editedItem.family_name }}</b> <br />
          Nickname: <b>{{ editedItem.nick_name || "-" }}</b> <br />
          Email: <b>{{ editedItem.email || "-" }}</b> <br />
          Phone: <b>{{ editedItem.phone || "-" }}</b> <br />
          Entry Trimester: <b>{{ editedItem.entry_trimester }}</b> <br />
          Entry Year: <b>{{ editedItem.entry_year }}</b><br/>
          Status: <b>{{ editedItem.status.current }}</b>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="gray" @click="dialogCheck = false">No</v-btn>
            <v-btn color="primary" @click="save()">Yes</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="unlinkedDialog" max-width="450px">
      <v-card>
        <v-card-title class="headline grey lighten-2">Unlink LINE Account?</v-card-title
        ><br />
        <v-card-text>
          Unlink LINE account from this student will prevent he/she from using some features
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="gray" @click="unlinkedDialog = false">No</v-btn>
            <v-btn color="primary" @click="unlink()">Yes</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <WKFooter></WKFooter>
  </v-container>
</template>

<script>
import AddStudent from "./components/add_students.vue"
import WKFooter from './components/footer';
export default {
  components:{
    AddStudent,
    WKFooter
  },
  mounted() {
    this.getInstructors()
    this.getStudents()
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
        entry_trimester: "",
        entry_year: "",
        lineUID: "",
        status: {
          current: "",
        },
        advisor: {
          _id: '',
          title: '',
          name: '',
          given_name: '',
        }
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
        lineUID: "",
        entry_trimester: "",
        entry_year: "",
        status: {
          current: "",
        },
      },
      Info: [],
      dialog: false,
      dialogCheck: false,
      unlinkedDialog: false,
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
        { current: 'Studying' },
        { current: 'Leave of absence' },
        { current: 'On Exchange' },
        { current: 'Retired' },
        { current: 'Resigned' },
        { current: 'Alumni' },
        { current: 'Unknown' },
      ],
      instructors: []
    };
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
                students (sortBy: "status", includeNonCI: true, getConnectedApps: true) {
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
                    lineUID
                    advisor {
                      _id
                      title
                      given_name
                      name
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
        this.editedItem.name = this.editedItem.given_name.trim() + ' ' + this.editedItem.family_name
        this.editedItem.entry_tri_year = this.editedItem.entry_trimester && this.editedItem.entry_year ? `T${this.editedItem.entry_trimester}/${this.editedItem.entry_year}` : null;
        Object.assign(this.Info[this.editedIndex], this.editedItem);
        Object.assign(this.students[this.editedIndex], this.editedItem);
      } else {
        this.Info.push(this.editedItem);
      }
      // eslint-disable-next-line no-console
      let student = this.Info[this.editedIndex]
      let query = `
          mutation{
            updateStudent(searchInput: {sid:"${student.sid}"}, studentInput:{
              given_name:"${student.given_name}"
              family_name:"${student.family_name}"
              nick_name: "${student.nick_name || ''}"
              prefix:"${student.prefix || ''}"
              program:"${student.program}"
              ${student.entry_trimester ? 'entry_trimester: "' + student.entry_trimester + '",': ''}
              entry_year: "${student.entry_year || ''}"
              phone: "${student.phone || ''}"
              email: "${student.email || ''}",
              advisor: ${student.advisor._id ? '"' + student.advisor._id + '"' : '""'},
              status: {
                current: "${student.status.current}"
              }
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
                status{
                  current
                }
              }
          }
        `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.close();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getInstructors() {
      let query = `
            {
              instructors {
                total
                instructors {
                  _id
                  title
                  given_name
                  name
                }
              }
            }
          `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.instructors = [ this.instructors, ...res.data.data.instructors.instructors ]
        })
        .catch((err) => {
          console.log(err);
        });
    },
    unlink() {
      let query = `
        mutation {
          unlinkStudentUID(searchInput: {sid: "${this.editedItem.sid}"}) {
            success
            message
          }
        }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.editedItem.lineUID = null
          this.unlinkedDialog = false
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addNewStudent() {
      this.getStudents()
    }
  },
};
</script>

<style>
.upload-Dialog{
  min-height: 500px;
}
</style>
