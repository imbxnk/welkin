<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <v-btn @click.prevent="ToEditPage()" color="#3c84fb" style="color: white;"
          >Manage Students</v-btn
        >
      </div>
      <div class="p-2 bd-highlight">
        <v-stepper
          class="mx-auto"
          v-model="e6"
          vertical
          style="max-width: 800px;"
          min-width="150px"
        >
          <v-stepper-header class="stepper-header">
            <div class="d-flex flex-row bd-highlight ml-4 my-auto">
              <div class="p-2 bd-highlight">
                <h3>Add Student</h3>
              </div>
            </div>
          </v-stepper-header>
          <v-stepper-step :complete="e6 > 1" class="my-auto py-auto step-num" step="1">
            <div class="d-flex bd-highlight">
              <div class="p-2 bd-highlight my-auto">
                Import File or Add Manually
              </div>
            </div>
          </v-stepper-step>

          <v-stepper-content step="1" class="my-3">
            <div class="d-flex flex-row bd-highlight justify-content-center align-items-center">
              <div class="p-2 flex-sm-grow-1 bd-highlight md-12">
                <v-card v-if="importFile" color="#97b8f0" class="mb-12" style="min-width: 100px">
                  <v-card-text>
                    <vue-dropzone
                      ref="myVueDropzone"
                      id="dropzone"
                      :options="dropzoneOptions"
                      @vdropzone-success="selectFile"
                      style="min-width:80px"
                      lazy-validation
                    >
                    </vue-dropzone>
                  </v-card-text>
                </v-card>
                <v-form v-if="addManually" ref="form" lazy-validation style="min-width:300px">
                  <div
                    class="d-flex flex-md-row flex-column bd-highlight justify-content-center align-items-center"
                  >
                    <div class="p-2 bd-highlight">
                      <v-text-field
                        type="number"
                        class="input"
                        label="ID"
                        id="id"
                        v-model="manuallyData.ID"
                        :rules="[rules.required]"
                        dense
                        outlined
                        required
                      ></v-text-field>
                    </div>
                    <div class="p-2 bd-highlight">
                      <v-select
                        class="input"
                        :items="icProgram"
                        label="Program"
                        v-model="manuallyData.Program"
                        :rules="[rules.required]"
                        dense
                        outlined
                        required
                      ></v-select>
                    </div>
                  </div>
                  <div
                    class="d-flex flex-md-row flex-column bd-highlight justify-content-center align-items-center"
                  >
                    <div class="p-2  bd-highlight">
                      <v-select
                        class="input"
                        :items="prefix"
                        label="Prefix"
                        v-model="manuallyData.Prefix"
                        :rules="[rules.required]"
                        dense
                        outlined
                        required
                      ></v-select>
                    </div>
                    <div class="p-2  bd-highlight">
                      <v-text-field
                        class="input"
                        label="Name"
                        v-model="manuallyData.Name"
                        :rules="[rules.required]"
                        dense
                        outlined
                        required
                      ></v-text-field>
                    </div>
                  </div>
                  <div
                    class="d-flex flex-md-row flex-column bd-highlight justify-content-center align-items-center"
                  >
                    <div class="p-2 bd-highlight">
                      <v-text-field
                        class="input"
                        label="Lastname"
                        v-model="manuallyData.LastName"
                        :rules="[rules.required]"
                        dense
                        outlined
                        required
                      ></v-text-field>
                    </div>
                    <div class="p-2 bd-highlight">
                      <!-- <v-text-field class="input" label="Advisor" v-model="manuallyData.Advisor" :rules="[rules.required]" dense outlined></v-text-field -->
                      <v-select
                        class="input"
                        :items="advisorlist"
                        label="Advisor"
                        v-model="manuallyData.Advisor"
                        :rules="[rules.required]"
                        dense
                        outlined
                        required
                      ></v-select>
                    </div>
                  </div>
                  <div
                    class="d-flex flex-md-row flex-column bd-highlight justify-content-center align-items-center"
                  >
                    <div class="p-2 bd-highlight">
                      <!-- <v-text-field
                        type="number"
                        class="input"
                        label="Entry Trimester"
                        v-model="manuallyData.entry_trimester"
                        :rules="[rules.required]"
                        dense
                        outlined
                      ></v-text-field> -->
                      <v-select
                        type="number"
                        class="input"
                        :items="entrytri"
                        label="Entry Trimester"
                        v-model="manuallyData.entry_trimester"
                        :rules="[rules.required]"
                        dense
                        outlined
                      ></v-select>
                    </div>
                    <div class="p-2 bd-highlight">
                      <v-text-field
                        type="number"
                        class="input"
                        label="Entry Year"
                        v-model="manuallyData.entry_year"
                        :rules="[rules.required]"
                        dense
                        outlined
                      ></v-text-field>
                    </div>
                  </div>
                </v-form>
              </div>
            </div>
            <div class="d-flex flex-row bd-highlight">
              <div class="p-2 bd-highlight">
                <v-btn
                  color="#3c84fb"
                  @click.prevent="
                    toStep2();
                    submitForm();
                  "
                  style="color: white;"
                >
                  Submit
                </v-btn>
                <v-btn color="#3c84fb" text @click="cancelStep1()">
                  Cancel
                </v-btn>
              </div>
              <div class="ms-auto p-2 bd-highlight justify-content-sm-start">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="speed-dial"
                      dark
                      color="#3c84fb"
                      @click.prevent="toggleForm()"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>
                        mdi-account-circle
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Change to add manually or import files</span>
                </v-tooltip>
              </div>
            </div>
          </v-stepper-content>

          <v-stepper-step :complete="e6 > 2" class="my-auto py-auto" step="2">
            Select the trimester, Check the student detail and Upload to the data base
          </v-stepper-step>

          <v-stepper-content step="2" class="my-3">
            <div class="d-flex flex-column bd-highlight justify-content-center align-items-center">
              <div class="p-2 flex-sm-grow-1 bd-highlight md-12">
                <select
                  class="form-control"
                  name="sheetName"
                  id="sheetName"
                  label="Seleted a term"
                  v-show="fileStatus"
                  @change="getSelectedValue($event)"
                  style="max-width:300px; min-width:50px"
                >
                  <option selected>Please select a term</option>
                  <option v-for="(item, index) in this.sheetNames" :key="index" :value="item">{{
                    item
                  }}</option>
                </select>
              </div>
              <div class="p-2 bd-highlight">
                <v-simple-table height="300px" class="mx-auto my-auto py-2 px-2">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          ID
                        </th>
                        <th class="text-left">
                          Program
                        </th>
                        <th class="text-left">
                          Prefix
                        </th>
                        <th class="text-left">
                          First Name
                        </th>
                        <th class="text-left">
                          Family Name
                        </th>
                        <th class="text-left">
                          Advisor
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in studentsData" :key="index" :value="item">
                        <td>{{ item.ID }}</td>
                        <td>{{ item.Program }}</td>
                        <td>{{ item.Prefix }}</td>
                        <td>{{ item.Name }}</td>
                        <td>{{ item.LastName }}</td>
                        <td>{{ item.Advisor }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
              <div class="p-2 bd-highlight">
                <v-btn
                  color="#3c84fb"
                  class="my-auto"
                  @click="
                    e6 = 3;
                    upload();
                  "
                  style="color: white;"
                >
                  Upload
                </v-btn>
                <v-btn color="#3c84fb" text @click="cancelStep2()">Cancel</v-btn>
              </div>
            </div>
          </v-stepper-content>

          <v-stepper-step :complete="e6 > 3" class="my-auto py-auto" step="3">
            Upload Result
          </v-stepper-step>
          <v-stepper-content step="3" class="my-3">
            <v-simple-table height="300px" class="mx-auto my-auto py-2 px-2">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      ID
                    </th>
                    <th class="text-left">
                      Program
                    </th>
                    <th class="text-left">
                      Prefix
                    </th>
                    <th class="text-left">
                      First Name
                    </th>
                    <th class="text-left">
                      Family Name
                    </th>
                    <th class="text-left">
                      Advisor
                    </th>
                    <th class="text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody v-if="!duplicateStatus">
                  <tr
                    class="success"
                    v-for="(item, index) in studentsData"
                    :key="index"
                    :value="item"
                  >
                    <td>{{ item.ID }}</td>
                    <td>{{ item.Program }}</td>
                    <td>{{ item.Prefix }}</td>
                    <td>{{ item.Name }}</td>
                    <td>{{ item.LastName }}</td>
                    <td>{{ item.Advisor }}</td>
                  </tr>
                </tbody>
                <tbody v-else-if="duplicateStatus">
                  <tr
                    class="duplicate"
                    v-for="(item, index) in duplicateStudents"
                    :key="index"
                    :value="item"
                  >
                    <td>{{ item.ID }}</td>
                    <td>{{ item.Program }}</td>
                    <td>{{ item.Prefix }}</td>
                    <td>{{ item.Name }}</td>
                    <td>{{ item.LastName }}</td>
                    <td>{{ item.Advisor }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div class="d-flex justify-content-end">
              <div class="p-2 bd-highlight">
                <v-btn color="#3c84fb" text @click="cancelStep3()">
                  Cancel
                </v-btn>
              </div>
            </div>
          </v-stepper-content>
        </v-stepper>
      </div>
    </div>
  </v-container>
</template>

<script>
import XLSX from "xlsx";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  name: "add_student",
  mounted() {
    this.loadAdvisors()
  },
  data() {
    return {
      e6: 1,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        parallelUploads: 1,
        acceptedFiles: ".xls, .xlsx",
        uploadMultiple: true,
        addRemoveLinks: true,
      },
      addManually: false,
      importFile: true,

      //manual
      prefix: ["Mr.", "Ms.", "Mrs"],
      entrytri: ["1", "2", "3"],
      advisorlist: [],
      icProgram: [
        "ICBE",
        "ICCI",
        "ICCS",
        "ICMI",
        "ICMF",
        "ICMK",
        "ICCU",
        "ICSS",
        "ICMC",
        "ICCD",
        "ICIR",
        "ICIH",
        "ICIB",
        "ICEN",
        "ICCH",
        "ICPY",
        "ICFS",
      ],
      manuallyData: {
        ID: "",
        Program: "",
        Prefix: "",
        Name: "",
        LastName: "",
        Advisor: "",
      },
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 4 || "Min 4 characters",
      },
      //importFile
      data: [{}],
      sheetNames: [],
      sheetName: "",
      selectedValue: "",
      studentsData: [],
      allStudentData: [],
      entryTrimester: "",
      entryYear: "",
      workbook: {},
      selectedFile: "",
      fileStatus: false,
      fileStep: false,
      //duplicate
      duplicateStudents: [],
      duplicateStatus: false,
    };
  },
  components: {
    vueDropzone: vue2Dropzone,
  },
  methods: {
    toggleForm() {
      this.addManually = !this.addManually;
      this.importFile = !this.importFile;
      console.log(this.addManually, this.importFile);
    },
    selectFile(file) {
      //show file is already upload
      this.fileStep = true;
      //show the select component
      this.fileStatus = true;
      //get the selected file' info
      this.selectedFile = file;
      XLSX.utils.json_to_sheet(this.data, "out.xlsx");
      //if file is selected
      if (this.selectedFile) {
        this.uploadSuccess = true;
        //read data and store it in our variable
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(this.selectedFile);
        fileReader.onload = (event) => {
          //the data is unreadable
          let data = event.target.result;
          //we have to convert it and store in our variable
          this.workbook = XLSX.read(data, { type: "binary" });
          //save the data, so we can use later in other functions
          this.sheetNames = this.workbook.SheetNames;
          this.sheetName = this.sheetNames[0];
          this.studentsData = this.readMyFile(this.workbook, this.sheetName);
          // get entry_year and entry_trimester
          [this.entryYear, this.entryTrimester] = this.sheetName.split("T");
        };
      }
    },
    submitForm() {
      if (this.manuallyData == {}) {
        console.log(this.studentsData);
      } else if (this.$refs.form.validate()) {
        console.log(this.manuallyData);
        let new_data = { ...this.manuallyData };
        this.studentsData.push(new_data);
        console.log(this.studentsData);
      } else {
        this.e6 = 1;
      }
    },
    getSelectedValue(event) {
      //clear the duplicatedStudents
      this.duplicateStudents = [];
      //hide the Duplicate div
      this.showContent = false;
      //get sheet name
      this.sheetName = event.target.value;
      //get entry_year and entry_trimester
      this.studentsData = this.readMyFile(this.workbook, this.sheetName);
      // get entry_year and entry_trimester
      [this.entryYear, this.entryTrimester] = this.sheetName.split("T");
    },
    readMyFile: function(workbook, currentSheetName) {
      return XLSX.utils.sheet_to_row_object_array(workbook.Sheets[currentSheetName]);
    },
    upload: async function() {
      //clear the duplicatedStudents
      this.duplicateStudents = [];
      //get entry_year and entry_trimester
      [this.entryYear, this.entryTrimester] = this.sheetName.split("T");
      let students = { ...this.studentsData };
      for (var i in students) {
        let std = { ...students[i] };
        //post graphql by using axios
        std.Advisor = std.Advisor.trim()
          .split(". ")
          .slice(-1)
          .pop()
          .trim();
        let gql = `
                        mutation{
                            addStudent ( studentInput: {
                                    sid: "${std.ID}",
                                    prefix: "${std.Prefix}",
                                    given_name: "${std.Name}",
                                    family_name: "${std.LastName}",
                                    program: "${std.Program}",
                                    entry_trimester: "${this.entryTrimester}",
                                    entry_year: "${this.entryYear}",
                                    advisor_name: "${std.Advisor}"
                                }
                            ){
                                sid
                                given_name
                            }
                        }
                    `
                await this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query : gql }, { withCredentials: true }).then(res => {
                    console.log(res);
                    this.addingSuccessStatus = true
                }).catch (err => {
                    console.log(err);
                    this.duplicateStudents.push(std);
                    this.duplicateStatus = true
                })
            }
      },
      cancelStep1(){
        this.manuallyData = {}
        this.selectedFile = {}
      },
      cancelStep2(){
        this.e6 = 1
        this.manuallyData = {}
        this.selectedFile = {}
      },
      cancelStep3(){
        this.e6 = 2
      },
      ToEditPage() {
        this.$router.push({ name: "manage_student" });
      },
      toStep2(){
        this.e6 = 2
      },
      async loadAdvisors() {
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
            res.data.data.instructors.instructors.forEach((instructor) => {
              this.advisorlist.push(instructor.name)
            })
          })
          .catch((err) => {
            console.log(err);
          });
      },
    }
  }
</script>

<style>
.stepper-header {
  background-color: #3c84fb;
  color: white;
}
.form-font {
  color: white;
}
.input {
  min-width: 50px;
  max-width: 300px;
  width: 300px;
}
.speed-dial {
  background-color: #3c84fb;
}

.success {
  color: #47db16;
}

.duplicate {
  color: #db9b12;
}

.btn-color {
  color: white;
}
</style>
