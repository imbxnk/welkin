<template>
  <v-dialog v-model="importDialog" fullscreen hide-overlay persistent transition="dialog-bottom-transition">
    <template v-slot:activator="{ on, attrs }">
      <div class="p-2">
        <v-btn color="primary" v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon> Import Students</v-btn>
      </div>
    </template>
    <v-card>
      <v-toolbar light color="transparent" flat extended extension-height="60">
        <v-btn icon light @click="done()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Import Students</v-toolbar-title>
      </v-toolbar>

      <v-container>
        <v-stepper flat vertical v-model="step">
          <!-- STEP 1 CHOOSE THE WAY TO IMPORT STUDENT -->
          <v-stepper-step step="1" :complete="step > 1">
            Choose Import Option
            <small class="mt-2">Upload File or Manually Add</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <div class="d-flex flex-column">
              <v-radio-group
                v-model="importOption"
                mandatory
                active-class="wk-options-active"
                row
                class="wk-radio-group"
                hide-details
              >
                <v-radio
                  :value="0"
                  class="wk-radio"
                  :ripple=false
                >
                  <template v-slot:label>
                    <div>Upload File</div>
                  </template>
                </v-radio>
                <v-radio
                  :value="1"
                  class="wk-radio"
                  :ripple=false
                >
                  <template v-slot:label>
                    <div class="d-flex align-items-center m-0">Add Manually</div>
                  </template>
                </v-radio>
              </v-radio-group>
              <div class="d-flex justify-content-end align-items-center">
                <v-btn
                  color="primary"
                  class="my-4 mx-2"
                  @click="step++"
                  :disabled="checkStep()"
                >
                  Continue
                </v-btn>
              </div>
            </div>
          </v-stepper-content>

          <!-- STEP 2 UPLOAD/FILE | ADD MANUAL -->
          <v-stepper-step step="2" :complete="step > 2">
            Add Data
            <small class="mt-2">Import/Add Students Data</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <!-- FILE UPLOAD OPTION -->
            <div class="d-flex flex-column" v-if="importOption === 0">
              <vueDropzone
                class="drop-zone"
                ref="myVueDropzone"
                id="dropzone"
                :useCustomSlot="true"
                :options="dropzoneOptions"
                @vdropzone-success="selectFile"
                @vdropzone-removed-file="removeFiles"
              >
                <div class="dropzone-custom-content">
                  <h5>Drag and drop Student List File here</h5>
                  <div class="subtitle small" style="color: #999">...or click to select a file from your computer</div>
                </div>
              </vueDropzone>
              <div class="d-flex px-4 mt-4 justify-content-center wk-error" v-show="fileFormatError.show">{{ fileFormatError.message }}</div>
            </div>
            <!-- MANUALLY ADD OPTION -->
            <div class="d-flex flex-column mx-2" v-if="importOption === 1">
              <div class="d-flex flex-column mt-4">
                <div class="d-flex">
                  <v-combobox
                    v-model="studentInput.Program"
                    :items="programs"
                    label="Program"
                    class="me-4"
                    hide-details
                    auto-select-first
                    clearable
                    outlined
                  ></v-combobox>
                  <div class="d-flex">
                    <v-select
                      label="Trimester"
                      :items="trimester"
                      style="max-width: 100px"
                      class="me-4"
                      outlined
                      hide-details
                      v-model="studentInput.entryTrimester"
                    ></v-select>
                    <v-text-field
                      style="max-width: 120px"
                      type="text"
                      pattern="\d*"
                      hide-details
                      onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"
                      label="Year"
                      v-model="studentInput.entryYear"
                      outlined
                    ></v-text-field>
                  </div>
                </div>
                <div class="d-flex mt-4">
                  <v-text-field
                    v-model="studentInput.ID"
                    label="Student ID"
                    outlined
                    hide-details
                    pattern="\d*"
                    onkeydown="return ( event.ctrlKey || event.altKey
                              || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                              || (95<event.keyCode && event.keyCode<106)
                              || (event.keyCode==8) || (event.keyCode==9)
                              || (event.keyCode>34 && event.keyCode<40)
                              || (event.keyCode==46) )"
                  ></v-text-field>
                </div>
                <div class="d-flex flex-wrap mt-4">
                  <v-select
                    label="Prefix"
                    :items="prefix"
                    style="max-width: 100px"
                    class="me-4"
                    outlined
                    v-model="studentInput.Prefix"
                    hide-details
                  ></v-select>
                  <v-text-field
                    class="flex-grow-1"
                    label="Given name"
                    v-model="studentInput.Name"
                    outlined
                    hide-details
                  ></v-text-field>
                </div>
                <div class="d-flex mt-4">
                  <v-text-field
                    class="flex-grow-1"
                    label="Family name"
                    v-model="studentInput.LastName"
                    outlined
                    hide-details
                  ></v-text-field>
                </div>
                <div class="d-flex mt-4">
                  <v-select
                    label="Advisor"
                    :items="instructors"
                    outlined
                    v-model="studentInput.Advisor"
                    item-text="name"
                  >
                    <template v-slot:selection="data">
                      {{ data.item._id ? "" : "-" }}{{ data.item.title }} {{ data.item.name }}
                    </template>
                    <template v-slot:item="data">
                      {{ data.item._id ? "" : "-" }}{{ data.item.title }} {{ data.item.name }}
                    </template>
                  </v-select>
                </div>
                <v-btn
                  color="primary"
                  height="40"
                  class="mb-4"
                  :disabled="checkDisabled()"
                  @click="addStudentToTable">
                  Add Student To Table
                </v-btn>

                <v-data-table
                  class="mt-4"
                  :headers="StudentsHeaders"
                  :items="students"
                  mobile-breakpoint="0"
                >
                </v-data-table>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-4">
              <v-btn
                text
                @click="reset()"
              >
                Back
              </v-btn>
              <v-btn
                color="primary"
                class="my-4 mx-2"
                @click="step++"
                :disabled="checkStep()"
              >
                Next
              </v-btn>
            </div>
          </v-stepper-content>

          <!-- STEP 3 DATA PREPARATION -->
          <v-stepper-step step="3" :complete="step > 3">
            Data Preparation
            <small class="mt-2">Create Lists of Students to Upload</small>
          </v-stepper-step>
          <v-stepper-content step="3">
            <!-- FILE UPLOAD OPTION -->
            <div class="d-flex flex-column" v-if="importOption === 0">
              <div class="d-flex flex-column">
                <div class="d-flex flex-column mt-2">
                  <span>Available Sheets</span>
                  <small style="color: #666">You can select multiple sheets</small>
                </div>
                <v-chip-group
                  multiple
                  active-class="primary--text"
                  v-model="selectedSheet"
                  column
                  class="my-4"
                >
                  <v-chip
                    v-for="(sheet, i) in sheetNames"
                    :key="i"
                  >
                    {{ sheet }}
                  </v-chip>
                </v-chip-group>
              </div>

              <v-data-table
                :headers="StudentsHeaders"
                :items="students"
                mobile-breakpoint="0"
              >
              </v-data-table>
            </div>
            <!-- MANUALLY ADD OPTION -->
            <div class="d-flex flex-column" v-if="importOption === 1">
              <v-data-table
                :headers="StudentsHeaders"
                :items="students"
                mobile-breakpoint="0"
              >
              </v-data-table>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-4">
              <v-btn
                text
                @click="step--"
              >
                Back
              </v-btn>
              <v-btn
                color="primary"
                class="my-4 mx-2"
                @click="uploadStudents()"
                :disabled="checkStep()"
              >
                Import
              </v-btn>
            </div>
          </v-stepper-content>

          <!-- STEP 4 RESULTS -->
          <v-stepper-step step="4" :complete="step > 4">
            Results
            <small class="mt-2">Results of Importing Students</small>
          </v-stepper-step>
          <v-stepper-content step="4">
            <div class="d-flex flex-column">
              <v-data-table
                :headers="RestulsHeaders"
                :items="students"
                mobile-breakpoint="0"
              >
                <template v-slot:[`item.result`]="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip v-bind="attrs" v-on="on" small :color="getColor(item.result)"> </v-chip>
                    </template>
                    <span>{{ item.result.message }}</span>
                  </v-tooltip>

                </template>
              </v-data-table>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-4">
              <v-btn
                color="primary"
                class="my-4 mx-2"
                @click="done()"
                :disabled="checkStep()"
              >
                Done
              </v-btn>
            </div>
          </v-stepper-content>
        </v-stepper>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import XLSX from "xlsx";
import vueDropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  components: {
    vueDropzone,
  },
  mounted() {
    this.getInstructors()
  },
  data() {
    return {
      importDialog: false,
      step: 1,
      importOption: 0,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 100,
        parallelUploads: 1,
        acceptedFiles: ".xls, .xlsx",
        uploadMultiple: false,
        addRemoveLinks: true,
      },
      selectedFile: null,
      excelFile: null,
      sheetNames: [],
      students: [],
      selectedSheet: [],
      studentInput: {
        ID: '',
        Prefix: '',
        Name: '',
        LastName: '',
        Program: 'ICCI',
        entryTrimester: '',
        entryYear: '',
        Advisor: '',
        result: {
          success: null,
          warning: null,
          message: null
        }
      },
      fileFormatError: { show: false, message: ''},
      StudentsHeaders: [
        { text: "ID", sortable: false, value: "ID", width: "1%" },
        { text: "Program", sortable: false, value: "Program", width: "10%", align: "center" },
        { text: "Name", sortable: false, value: "FullName", width: "40%" },
        { text: "Entry Trimester", sortable: false, value: "entryTrimester", width: "1%", align: "center"},
        { text: "Entry Year", sortable: false, value: "entryYear", width: "1%", align: "center" },
        { text: "Advisor", sortable: false, value: "Advisor", width: "20%" },
      ],
      RestulsHeaders: [
        { text: "ID", sortable: false, value: "ID", width: "1%" },
        { text: "Program", sortable: false, value: "Program", width: "10%", align: "center" },
        { text: "Name", sortable: false, value: "FullName", width: "20%" },
        { text: "Entry Trimester", sortable: false, value: "entryTrimester", width: "1%", align: "center"},
        { text: "Entry Year", sortable: false, value: "entryYear", width: "1%", align: "center" },
        { text: "Advisor", sortable: false, value: "Advisor", width: "20%" },
        { text: "Status", sortable: false, value: "result", width: "1%", align: "center" },
      ],
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
      trimester: ["1", "2", "3"],
      prefix: ["Mr.", "Ms.", "Mrs"],
      instructors: [],
    }
  },
  watch: {
    selectedSheet(sheets) {
      this.students = []
      sheets.forEach((i) => {
        let studentList = this.getStudentsData(i)
        let [entryYear, entryTrimester] = this.sheetNames[i].split("T");
        studentList.forEach((student) => {
          student.entryYear = entryYear
          student.entryTrimester = entryTrimester
          student.FullName = student.Name + ' ' + student.LastName
          student.Advisor = student.Advisor.trim().split(". ").slice(-1).pop().trim()
          student.result = { success: null, warning: null, message: null }
        })
        this.students = [ ...this.students, ...studentList ]
        this.students.sort((a,b) => {
          if(a.ID < b.ID) return -1
          return 1
        })
      })
    }
  },
  methods: {
    checkStep() {
      switch (this.step) {
        case 1:
          return false
        case 2:
          if(this.importOption === 0) {
            if(this.sheetNames.length === 0 && !this.excelFile) return true
            if(this.sheetNames.length === 0 && this.excelFile) {
              this.excelFile = null
              this.$refs.myVueDropzone.removeAllFiles()
              this.fileFormatError.show = true
              this.fileFormatError.message = 'You have uploaded an incorrect format file.'
              return true
            } else {
              this.fileFormatError.show = false
              this.fileFormatError.message = null
              return false
            }
          }

          if(this.importOption === 1) {
            return !(this.students.length > 0)
          }
          return true
        case 3:
          if(this.students.length === 0) return true
          return false
        case 4:
          return false
        case 5:
          return false
        case 6:
          return false
        default:
          return true
      }
    },
    selectFile(file) {
      //get the selected file' info
      this.selectedFile = file
      //if file is selected
      if (this.selectedFile) {
        //read data and store it in our variable
        let fileReader = new FileReader()
        fileReader.readAsBinaryString(this.selectedFile)
        fileReader.onload = (event) => {
          //the data is unreadable
          let data = event.target.result;
          //we have to convert it and store in our variable
          this.excelFile = XLSX.read(data, { type: "binary" })
          //save the data, so we can use later in other functions
          this.sheetNames = this.excelFile.SheetNames
          this.sheetNames.forEach((sheet,i,obj) => {
            if(!sheet.match(/\d\d\d\dT[123S]/gm)) {
              obj.splice(i,1)
            }
          })
        }
      }
    },
    getStudentsData(i) {
      return XLSX.utils.sheet_to_row_object_array(this.excelFile.Sheets[this.sheetNames[i]])
    },
    removeFiles() {
      this.$refs.myVueDropzone.removeAllFiles()
    },
    uploadStudents() {
      this.excelFile = null
      this.students.forEach((student) => {
        let query = `
          mutation {
            addStudent ( studentInput: {
              sid: "${student.ID}",
              prefix: "${student.Prefix}",
              given_name: "${student.Name}",
              family_name: "${student.LastName}",
              program: "${student.Program}",
              entry_trimester: "${student.entryTrimester}",
              entry_year: "${student.entryYear}",
              advisor_name: "${student.Advisor}"
            }){
                sid
                given_name
                family_name
                prefix
                program
                entry_trimester
                entry_year
                advisor{
                  name
              }
            }
          }
        `
        query = query.replace(/\s+/g, " ").trim()
        this.axios
          .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
          .then((res) => {
            student.result = {
              success: true,
              warning: false,
              message: `${student.ID} has been added`
            }
          })
          .catch((err) => {
            switch (err.response.data.errors[0].status) {
              case 409: // duplicated
                student.result = {
                  success: false,
                  warning: true,
                  message: "Duplicated Student"
                }
                break
              default:
                // other errors
                student.result = {
                  success: false,
                  warning: false,
                  message: err.response.data.errors[0].status
                }
                break
            }
          });
      })
      this.step++
    },
    getColor(result) {
      if(result.success === null) return "grey"
      if(result.success) return "green"
      else {
        if(result.warning) return "yellow"
        else return "red"
      }
    },
    done() {
      this.$emit('addNewStudent')
      this.importDialog = false
      this.reset()
    },
    reset() {
      this.excelFile = null
      this.students = []
      this.sheetNames = []
      this.selectedSheet = []
      this.selectedFile = null
      this.step = 1
      if(this.importOption === 0 && this.step > 2) this.removeFiles()
      this.importOption = 0
      this.fileFormatError = { show: false, message: ''}
    },
    getInstructors() {
      let query = `
            {
              instructors {
                total
                instructors {
                  _id
                  title
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
    addStudentToTable() {
      let newStudent = Object.assign({}, this.studentInput)
      newStudent.FullName = newStudent.Name + ' ' + newStudent.LastName
      if(typeof(newStudent.Advisor) !== 'string') newStudent.Advisor = ''
      this.students.push(newStudent)
      this.studentInput = {
        ID: '',
        Prefix: '',
        Name: '',
        LastName: '',
        Program: 'ICCI',
        entryTrimester: newStudent.entryTrimester,
        entryYear: newStudent.entryYear,
        Advisor: '',
        result: {
          success: null,
          warning: null,
          message: null
        }
      }
    },
    checkDisabled() {
      return !(this.studentInput.Program.length === 4 && this.studentInput.ID.length === 7 && this.studentInput.entryTrimester.length > 0 && this.studentInput.entryYear.length > 0 && this.studentInput.Prefix.length > 0 && this.studentInput.Name.length > 0 && this.studentInput.LastName.length > 0)
    }
  },
}
</script>
<style scoped>
.drop-zone {
  height: 276px;
}
.wk-error {
  color: rgb(226 64 86);
  font-size: 0.9rem;
}

.wk-options-active {
  border: 1px solid #007bffcb !important;
  color: var(--primary) !important;
}

.wk-options-active:hover {
  border: 1px solid var(--primary) !important;
  cursor: default;
}

.wk-radio:not(.wk-options-active):hover {
  background: #fafafa;
}

.wk-options-active >>> label {
  color: var(--primary);
}

.wk-radio-group >>> .v-input--radio-group__input {
  justify-content: center;
}

.wk-radio {
  display: flex;
  flex-direction: column-reverse;
  margin: 20px;
  border-radius: 2rem !important;
  min-width: 300px;
  border: 1px solid #efefef;
}

.wk-radio >>> .v-input--selection-controls__input {
  display: none;
}

.wk-radio >>> label {
  padding: 20px 0;
  margin: 0;
}
</style>