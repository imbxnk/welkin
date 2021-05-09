<template>
    <v-row style="max-width: 960px;" class="mx-auto">
        <!-- Left card component -->
        <v-col cols="12">
            <v-card style="padding: 10px 10px;">
                <!-- card title part -->
                <!-- Impord Title -->
                <v-card-title id="cardTitle" v-if="importStatus">
                    <v-row>
                        <v-col cols="12" sm="6" xs="6">
                            Import Student
                        </v-col>
                        <v-col cols="12" sm="6" xs="6">
                            <v-btn v-if="importStatus && !selectedFile" plain text class="float-right overline primary--text" style="font-size:0.8rem; font-weight: normal;" :value="importStatus" @click="changeToAddManually">Add Manually</v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <!-- Add Manually Title -->
                <v-card-title id="cardTitle" v-else-if="!importStatus">
                    <v-row>
                        <v-col cols="12" sm="6" xs="6">
                            Add Manually
                        </v-col>
                        <v-col cols="12" sm="6" xs="6">
                            <v-btn v-if="!importStatus" plain text class="float-right overline primary--text" style="font-size:0.8rem; font-weight: normal" :value="importStatus" @click="changeToAddManually">Import File</v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <!-- Import File content -->
                <v-card-text v-if="importStatus">
                    <div class="row mt-1">
                        <div class="col-lg-12 col-sm-12 mt-1">
                        <!-- <input type="file" @change="selectFile" accept=".xls,.xlsx" label="Choose a file"> -->
                        <vue-dropzone
                            ref="myVueDropzone"
                            id="dropzone"
                            :options="dropzoneOptions"
                            @vdropzone-success="selectFile"></vue-dropzone>
                        </div>
                        <div class="col-6 mt-4" v-show="uploadSuccess">
                        <select class="form-control" name="sheetName" id="sheetName" @change="getSelectedValue($event)">
                            <label>Please select a sheet</label>
                            <option v-for="(item, index) in this.sheetNames" :key="index" :value="item">{{ item }}</option>
                        </select>
                        </div>
                        <br>
                    </div>
                </v-card-text>
                <!-- Add Manually content -->
                <v-card-text v-else-if="!importStatus">
                    <v-form ref="form" lazy-validation>
                        <v-row>
                            <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto;">
                                <v-text-field label="ID"  id="id" dense outlined v-model="manualData.ID" :rules="[rules.required]" required></v-text-field>
                            </v-col>
                            <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto">
                                <v-text-field label="Program" dense outlined v-model="manualData.Program" :rules="[rules.required]" required></v-text-field>
                            </v-col>
                            <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto">
                                <v-select :items="prefix" label="Prefix" dense outlined v-model="manualData.Prefix" :rules="[rules.required]" required></v-select>
                            </v-col>
                            <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto">
                                <v-text-field label="First Name" dense outlined v-model="manualData.Name" :rules="[rules.required, rules.min]" required></v-text-field>
                            </v-col>
                            <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto">
                                <v-text-field label="Last Name" dense outlined v-model="manualData.LastName" :rules="[rules.required, rules.min]" required></v-text-field>
                            </v-col>
                            <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto">
                                <v-text-field label="Advisor" dense outlined v-model="manualData.Advisor" :rules="[rules.required, rules.min]" required></v-text-field>
                            </v-col>
                            <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" auto style="padding: auto; margin: auto">
                                <button class="btn btn-primary float-right" @click.prevent="submitForm();" >Submit</button>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
        <!-- Right card component -->
        <v-col cols="12">
            <v-card>
                <v-card-title v-if="notDuplicateStudents">
                    Students
                </v-card-title>
                <v-card-title v-else-if="!notDuplicateStudents">
                    Duplicated Students
                </v-card-title>
                <v-card-text  v-if="notDuplicateStudents">
                <template>
                    <v-simple-table height="300px">
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
                            <tr
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
                        </template>
                    </v-simple-table>
                    </template>
                    <v-row>
                        <v-col>
                            <v-btn color="primary float-right" @click="upload(); dataStatus();" style="right:100;">Upload</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>


                <v-card-text v-else-if="!notDuplicateStudents">
                    <v-row >
                        <v-col justify="end" align="right">
                        <a class="mt-3 mb-3 mx-3" @click="Back()">Back</a>
                        </v-col>
                    </v-row>
                    <v-row>
                        <template>
                        <v-simple-table class="px-3 mx-auto" height="300px">
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
                                <tr
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
                        </template>
                    </v-row>
                </v-card-text>
                <v-snackbar
                    v-model="addingSuccessStatus"
                    :timeout="timeout"
                    top
                    centered
                    outlined
                    color="success"
                    >
                    {{ successText }}

                    <template v-slot:action="{ attrs }">
                        <v-btn
                        color="blue"
                        text
                        v-bind="attrs"
                        @click="addingSuccessStatus = false"
                        >
                        Close
                        </v-btn>
                    </template>
                    </v-snackbar>

                    <v-snackbar
                    v-model="addingFailingStatus"
                    :timeout="timeout"
                    top
                    centered
                    outlined
                    color="error"
                    >
                    {{ failingText }}

                    <template v-slot:action="{ attrs }">
                        <v-btn
                        color="blue"
                        text
                        v-bind="attrs"
                        @click="addingFailingStatus = false"
                        >
                        Close
                        </v-btn>
                    </template>
                    </v-snackbar>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import XLSX from 'xlsx'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
    name: "manage",
    data() {
        return {
            cpsStatus: null,
            tableData: [],
            selectedFile: "",
            data: [{}],
            sheetNames: [],
            sheetName: "",
            selectedValue: "",
            studentsData: [],
            allStudentData: [],
            entryTrimester: "",
            entryYear: "",
            workbook: {},
            duplicateStudents: [],
            url: "https://api.welkin.app/v2/graphql",
            showContent: false,
            dropzoneOptions: {
                url: 'https://httpbin.org/post',
                thumbnailWidth: 150,
                parallelUploads: 1,
                acceptedFiles: ".xls, .xlsx",
                uploadMultiple: true,
                addRemoveLinks: true
            },
            uploadSuccess: false,
            importStatus: true,
            prefix: ["Mr", "Ms", "Mrs", "Dr"],
            addStudentFormStatus: true,
            manuallyStatus: false,
            uploadPopUp: false,
            timeout: 5000,
            notDuplicateStudents: true,


            //manual
            manualData: {
                ID: "",
                Program: "",
                Prefix: "",
                Name: "",
                LastName: "",
                Advisor: ""
            },
            addManually: false,
            tempData: {
                ID: "",
                Program: "",
                Prefix: "",
                Name: "",
                LastName: "",
                Advisor: ""
            },

            //snackbar
            addingSuccessStatus: false,
            addingFailingStatus: false,
            successText: 'Adding Success!',
            failingText: 'Adding Error!',

            //rules
            rules:{
                required: (value) => !!value || "Required.",
                min: (v) => v.length >= 4 || "Min 4 characters",
            },
        }
    },
    components:{
        vueDropzone: vue2Dropzone
    },
    methods: {
        upload:async function () {
            //clear the duplicatedStudents
            this.duplicateStudents = [];
            //get entry_year and entry_trimester
            [this.entryYear,this.entryTrimester] = this.sheetName.split("T");
            let students = {...this.studentsData}
            for(var i in students) {
                let std = {...students[i]};
                //post graphql by using axios
                std.Advisor = std.Advisor.trim().split(". ").slice(-1).pop().trim()
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
                await this.axios.post(this.url, { query : gql }, { withCredentials: true }).then(res => {
                    console.log(res);
                    this.addingSuccessStatus = true
                }).catch (err => {
                    console.log(err);
                    this.duplicateStudents.push(std);
                    this.showContent = true
                    this.notDuplicateStudents = false
                    this.addingFailingStatus = true
                })
            }
        },
        readMyFile: function (workbook,currentSheetName){
            return XLSX.utils.sheet_to_row_object_array(workbook.Sheets[currentSheetName]);
        },
        selectFile(file){
            //get the selected file' info
            this.selectedFile = file;
            XLSX.utils.json_to_sheet(this.data,'out.xlsx');
            //if file is selected
            if(this.selectedFile){
                this.uploadSuccess = true
                //read data and store it in our variable
                let fileReader = new FileReader();
                fileReader.readAsBinaryString(this.selectedFile);
                fileReader.onload = (event) => {
                    //the data is unreadable
                    let data = event.target.result;
                    //we have to convert it and store in our variable
                    this.workbook = XLSX.read(data, {type: "binary"});
                    //save the data, so we can use later in other functions
                    this.sheetNames = this.workbook.SheetNames;
                    this.sheetName = this.sheetNames[0];
                    this.studentsData = this.readMyFile(this.workbook,this.sheetName);
                    // get entry_year and entry_trimester
                    [this.entryYear,this.entryTrimester] = this.sheetName.split("T");
                }
            }

        },
        getSelectedValue(event){
            //clear the duplicatedStudents
            this.duplicateStudents = [];
            //hide the Duplicate div
            this.showContent = false;
            //get sheet name
            this.sheetName = event.target.value;
            //get entry_year and entry_trimester
            this.studentsData = this.readMyFile(this.workbook,this.sheetName);
            // get entry_year and entry_trimester
            [this.entryYear,this.entryTrimester] = this.sheetName.split("T");

            this.notDuplicateStudents = true
            this.SnackBarStatus = false
        },
        changeToAddManually(){
            this.importStatus = !this.importStatus
        },
        dataStatus(){
            this.SnackBarStatus = true
        },
        submitForm(){
            if(this.$refs.form.validate()){
                console.log(this.manualData)
                let new_data = {...this.manualData}
                this.studentsData.push(new_data)
                console.log(this.studentsData)
            }
        },
        Back(){
            this.notDuplicateStudents = true
        },
        deleteEachStudent(){

        }
    },
    props:[
        "cpnStatus"
    ],
}
</script>

<style>
    @import url("https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css");
</style>