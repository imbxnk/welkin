<template>
    <div class="container-sm-fliud p-5 my-3 border ">
        <div class="row mt-3">
            <div class='col-lg-12 mt-1'>
              <h1>Import Student</h1>
            </div>
            <div class="col-lg-12 col-sm-12 mt-4">
              <input type="file" @change="selectFile" accept=".xls,.xlsx" label="Choose a file">
            </div>
            <div class="col-6 mt-4">
            <select class="form-control" name="sheetName" id="sheetName" @change="getSelectedValue($event)">
                <label>Please select a sheet</label>
                <option v-for="(item, index) in this.sheetNames" :key="index" :value="item">{{ item }}</option>
            </select>
            </div>
            <br>
        </div>
        <div class="row mt-3">
            <div class="col-12 mt-3">
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Program</th>
                        <th>Prefix</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Advisor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in studentsData" :key="index" :value="item">
                        <td scope="row">{{item.ID}}</td>
                        <td scope="row">{{item.Program}}</td>
                        <td scope="row">{{item.Prefix}}</td>
                        <td scope="row">{{item.Name}}</td>
                        <td scope="row">{{item.LastName}}</td>
                        <td scope="row">{{item.Advisor}}</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        <button class="btn btn-primary" @click="upload()">Upload</button>
        <div v-show="showContent">
        <div class="row mt-3">
          <div class="col-12 mt-3">
            <h2>Duplicated Students: </h2>
          </div>
          <div class="col-12 mt-3">
            <table class="table table-stripped table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Program</th>
                        <th>Prefix</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Advisor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in duplicateStudents" :key="index" :value="item">
                        <td scope="row">{{item.ID}}</td>
                        <td scope="row">{{item.Program}}</td>
                        <td scope="row">{{item.Prefix}}</td>
                        <td scope="row">{{item.Name}}</td>
                        <td scope="row">{{item.LastName}}</td>
                        <td scope="row">{{item.Advisor}}</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
//already downloaded the package "npm i xlsx axios", and import some vaiables from them
import XLSX from 'xlsx'
import axios from 'axios'
export default {
    data(){
        return{
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
            showContent: false
        };
    },
    methods:{
        upload:async function () {
            //clear the duplicatedStudents
            this.duplicateStudents = [];
            //get entry_year and entry_trimester
            [this.entryYear,this.entryTrimester] = this.sheetName.split("T");
            let students = {...this.studentsData}
            for(var i in students) {
                let std = {...students[i]};
                //post graphql by using axios
                let gql = `
                        mutation{
                            addStudent ( studentInput: {
                                    sid: "${std.ID}",
                                    prefix: "${std.Prefix}",
                                    given_name: "${std.Name}",
                                    family_name: "${std.LastName}",
                                    program: "${std.Program}",
                                    entry_trimester: "${this.entryTrimester}",
                                    entry_year: "${this.entryYear}"
                                }
                            ){
                                sid given_name
                            }
                        }
                    `
                await axios.post(this.url, {
                    query : gql
                }).then(res => {
                    console.log(res);
                }).catch (err => {
                    console.log(err);
                    this.duplicateStudents.push(std);
                    this.showContent = true
                })
            }
        },
        readMyFile: function (workbook,currentSheetName){
            return XLSX.utils.sheet_to_row_object_array(workbook.Sheets[currentSheetName]);
        },
        selectFile(event){
            //get the selected file' info
            this.selectedFile = event.target.files[0];
            XLSX.utils.json_to_sheet(this.data,'out.xlsx');
            //if file is selected
            if(this.selectedFile){
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
        }
    }
}
</script>

<style>
@import url("https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css");
</style>