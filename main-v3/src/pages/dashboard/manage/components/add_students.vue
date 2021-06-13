<template>
  <v-container class="mx-auto">
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step
          :complete="e1 > 1"
          step="1"
        >
          Import File or add manually
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          :complete="e1 > 2"
          step="2"
        >
          Checking & Uploading
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">
          Result of uploading
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <div class="d-flex flex-column bd-highlight">
            <div v-if="importFile" class="p-2 bd-highlight">
              <vue-dropzone
                class="drop-zone"
                ref="myVueDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                @vdropzone-success="selectFile"
              >
              </vue-dropzone>
            </div>
             <div v-else-if="addManually" class="p-2 bd-highlight">
              <v-card class="px-5 py-5">
                <v-form ref="form" lazy-validation>
                  <div class="d-flex flex-column">
                    <div class="p-2 bd-highlight">
                      <v-divider inset></v-divider>
                    </div>
                    <div class="p-2 bd-highlight">
                      <div class="d-flex flex-row bd-highlight justify-content-center">
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
                    </div>
                  </div>
                  

                  <div class="d-flex flex-md-row flex-column bd-highlight justify-content-around justify-content-md-center">
                    <div class="p-2 bd-highlight">
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
                    <div class="p-2 bd-highlight">
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

                   <div class="d-flex flex-md-row flex-column bd-highlight justify-content-around justify-content-md-center">
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

                   <div class="d-flex flex-md-row flex-column bd-highlight justify-content-around justify-content-md-center">
                    <div class="p-2 bd-highlight">
                      <v-select
                        type="number"
                        class="input"
                        :items="entrytri"
                        label="Entry Trimester"
                        v-model="manuallyData.entryTrimester"
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
                        v-model="manuallyData.entryYear"
                        :rules="[rules.required]"
                        dense
                        outlined
                      ></v-text-field>
                    </div>
                  </div>
                </v-form>
              </v-card>
            </div>

              <div class="d-flex flex-row bd-highlight justify-content-end">
                <div class="p-2 flex-fill bd-highlight">
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
                <div class="p-2 bd-highlight">
                  <v-btn color="error" text @click="clear()">
                    Clear
                  </v-btn>
                  <v-btn color="primary" text @click="toSecondStep(); submitForm();" >
                    Continue
                  </v-btn>
                </div>
              </div>
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <div class="d-flex flex-column bd-highlight justify-content-center">
            <div class="p-2 bd-highlight">
              <v-select label="Please select academic term" name="sheetName" id="sheetName" :items="sheetNames" @change="getSelectedValue($event)" v-model="sheetNames[0]"></v-select>
            </div>
            <div class="p-2 bd-highlight">
              <v-data-table id="sheetName" :headers="headers" :items="studentsData" mobile-breakpoint="0" hide-default-footer >
              </v-data-table>
            </div>
          </div>
          <div class="d-flex flex-row bd-highlight justify-content-end">
            <div class="p-2 bd-highlight">
              <v-btn text @click="e1 = 1">Back</v-btn>
              <v-btn color="error" text @click="clearCheck()">
                clear
              </v-btn>
              <v-btn
                color="primary"
                @click="upload()"
                text
              >
                Upload
              </v-btn>
            </div>
          </div>



        </v-stepper-content>

        <v-stepper-content step="3">
          <div class="d-flex flex-column bd-highlight justify-content-center">
            <div class="p-2 bd-highlight" v-if="successData">
               <v-data-table class="success-table" style="color:#47db16"  id="sheetName" :headers="headers" :items="studentsData" mobile-breakpoint="0" hide-default-footer disable-pagination>
              </v-data-table>
            </div>
            <div class="duplicate-table p-2 bd-highlight" v-else-if="duplicatedData">
               <v-data-table class="duplicate-table" style="color:#db9b12" id="sheetName" :headers="headers" :items="duplicateStudents" mobile-breakpoint="0" hide-default-footer disable-pagination>
              </v-data-table>
            </div>
            <div></div>
          </div>
            <div class="p-2 bd-highlight">
              <div class="d-flex flex-row bd-highlight justify-content-end">
                <div class="p-2 bd-highlight">
                  <v-btn text @click="e1 = 2">
                    Back
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="reset(); removefile();"
                    text
                  >
                    Add more
                  </v-btn>
                </div>
              </div>
            </div>
          
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import XLSX from "xlsx";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  components:{
  vueDropzone: vue2Dropzone
  },
  data(){
    return{
      e1 : 1,
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
        entryTrimester: "",
        entryYear: ""
      },
      entry_trimester: "",
      entry_year: "",
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 4 || "Min 4 characters",
      },
      sheetNames: [],
      sheetName: "",
      selectedFile: "",
      data: [{}],
      studentsData: [],
      allStudentData: [],
      workbook: "",
      file: "",
      duplicateStudents: [],
      successData: false,
      duplicatedData: false,
      Info: [],
      headers:[
        { text: "Student ID", sortable: false, value: "ID", width: "9%" },
        { text: "Prefix", sortable: false, value: "Prefix", width: "1%" },
        { text: "Name", sortable: false, value: "Name", width: 80 },
        { text: "Program", sortable: false, value: "Program", width: 80 },
        { text: "Entry Trimester", sortable: false, value: "entryTrimester", width: 100 },
        { text: "Entry Year", sortable: false, value: "entryYear", width: 100 },
        { text: "advisor", sortable: false, value: "Advisor", width: 120 },
      ]
    }
  },
  mounted(){
    this.loadAdvisors();
  },
  methods:{
    toggleForm(){
      this.addManually = !this.addManually
      this.importFile = !this.importFile
      console.log(this.addManually, this.importFile)
    },
    clear(){
      (this.manuallyData.ID = ""),(this.manuallyData.Program = ""), (this.manuallyData.Prefix = ""), (this.manuallyData.Name = ""), (this.manuallyData.LastName = ""), (this.manuallyData.Advisor = ""), (this.manuallyData.entryTrimester = ""), (this.manuallyData.entryYear = ""),
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },
    async loadAdvisors() {
        let query = `
            {
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
        query = query.replace(/\s+/g, ' ').trim()
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
      selectFile(file) {
      console.log(file)
      //get the selected file' info
      this.selectedFile = file
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
          for (var i = 0; i<this.studentsData.length; i++){
            this.studentsData[i].entryYear = this.entryYear
            this.studentsData[i].entryTrimester = this.entryTrimester
          }
        };
      }
    },
    getSelectedValue(event) {
      //clear the duplicatedStudents
      this.duplicateStudents = [];
      //get sheet name
      this.sheetName = event;
      //get entry_year and entry_trimester
      this.studentsData = this.readMyFile(this.workbook, this.sheetName);
      // get entry_year and entry_trimester
      [this.entryYear, this.entryTrimester] = this.sheetName.split("T");
      for (var i = 0; i<this.studentsData.length; i++){
        this.studentsData[i].entryYear = this.entryYear
        this.studentsData[i].entryTrimester = this.entryTrimester
      }
    },
    readMyFile: function(workbook, currentSheetName) {
      return XLSX.utils.sheet_to_row_object_array(workbook.Sheets[currentSheetName]);
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
    toSecondStep(){
      this.e1 = 2
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
        let query = `
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
                query = query.replace(/\s+/g, ' ').trim()
                await this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true }).then(res => {
                    console.log(res);
                    this.e1 = 3;
                    this.addingSuccessStatus = true
                    this.successData = true
                }).catch (err => {
                    switch(err.response.data.errors[0].status){
                      case 409: // duplicated
                        console.log(err.response.data.errors[0].message)
                        this.duplicateStudents.push(std);
                        this.duplicateStatus = true;
                        this.duplicatedData = true;
                        this.e1 = 3;
                        break
                      default: // other errors
                        console.log(err.response.data.errors[0].message)
                        break
                    }
                    // console.log(this.duplicateStudents)
                    
                })
            }
      },
      reset(){
        this.studentsData = []
        this.duplicatedData = []
        this.sheetName = ""
        this.sheetNames = []
        this.manuallyData = {}
        this.e1 = 1
      },
      removefile(){

      },
      clearCheck(){
        this.studentsData = []
      }
  }
}
</script>

<style>
  .drop-zone{
    height: 280px;
  }

  .success-table{
    color: green;
  }

  .duplicate-table{
    color: yellow;
  }
</style>