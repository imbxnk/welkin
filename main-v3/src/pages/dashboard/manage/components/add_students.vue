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
          Check each student data
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">
          Upload to the database
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
                  <div class="d-flex flex-md-row flex-column bd-highlight justify-content-around justify-content-md-center">
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
              <v-select label="Please select academic term" name="sheetName" id="sheetName" :items="this.sheetNames" @change="getSelectedValue($event)"></v-select>
            </div>
            <div class="p-2 bd-highlight">
              <v-data-table id="sheetName" :headers="headers" :items="studentsData" mobile-breakpoint="0" hide-default-footer disable-pagination>
              </v-data-table>
            </div>
          </div>
          <div class="d-flex flex-row bd-highlight justify-content-end">
            <div class="p-2 bd-highlight">
              <v-btn
                color="primary"
                @click="e1 = 3"
              >
                Upload
              </v-btn>
              <v-btn text>
                Cancel
              </v-btn>
            </div>
          </div>
          

          
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card
            class="mb-12"
            color="grey lighten-1"
            height="200px"
          ></v-card>

          <v-btn
            color="primary"
            @click="e1 = 1"
          >
            Continue
          </v-btn>

          <v-btn text>
            Cancel
          </v-btn>
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
        entry_trimester: "",
        entry_year: ""
      },
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
      Info: [],
      headers:[
        { text: "Student ID", sortable: false, value: "ID", width: "9%" },
        { text: "Prefix", sortable: false, value: "Prefix", width: "1%" },
        { text: "Name", sortable: false, value: "Name", width: 80 },
        { text: "Program", sortable: false, value: "Program", width: 80 },
        { text: "Entry Trimester", sortable: false, value: "entry_trimester", width: 100 },
        { text: "Entry Year", sortable: false, value: "entry_year", width: 100 },
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
      (this.manuallyData.ID = ""),(this.manuallyData.Program = ""), (this.manuallyData.Prefix = ""), (this.manuallyData.Name = ""), (this.manuallyData.LastName = ""), (this.manuallyData.Advisor = ""), (this.manuallyData.entry_trimester = ""), (this.manuallyData.entry_year = ""),
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
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
        };
      }
    },
    getSelectedValue(event) {
      console.log(event)
      //clear the duplicatedStudents
      this.duplicateStudents = [];
      //get sheet name
      this.sheetName = event;
      console.log(this.sheetName)
      //get entry_year and entry_trimester
      this.studentsData = this.readMyFile(this.workbook, this.sheetName);
      // get entry_year and entry_trimester
      [this.entryYear, this.entryTrimester] = this.sheetName.split("T");
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
    }
  }
}
</script>

<style>
  .drop-zone{
    height: 280px;
  }
</style>