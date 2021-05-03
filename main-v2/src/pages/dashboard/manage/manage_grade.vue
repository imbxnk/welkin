<template>
    <v-row>
        <!-- Left card component -->
        <v-col cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
            <v-card style="width: 800px; padding: 10px 10px;">
                <!-- card title part -->
                <!-- Impord Title -->
                <v-card-title id="cardTitle" v-if="importStatus">
                    <v-row>
                        <v-col cols="12" xl="8" lg="8" md="12" sm="12" xs="12">
                            Import Grade
                        </v-col>
                        <v-col cols="4"  xl="4" lg="4" md="4" sm="4" xs="4">
                            <v-btn v-if="importStatus" plain text class="float-right overline primary--text" style="font-size:0.8rem; font-weight: normal" :value="importStatus" @click="changeToAddManually">Add Manually</v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <!-- Add Manually Title -->
                <v-card-title id="cardTitle" v-else-if="!importStatus">
                    <v-row>
                        <v-col cols="12" xl="8" lg="8" md="12" sm="12" xs="12">
                            Add Manually
                        </v-col>
                        <v-col cols="4"  xl="4" lg="4" md="4" sm="4" xs="4">
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
                            @vdropzone-success="selectFile">
                        </vue-dropzone>
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
                    <v-form>
                        <v-row>
                            <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto;">
                                <v-text-field label="test"  id="id" dense outlined></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
        <!-- Right card component -->
        <v-col cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
            <v-card>
                <v-card-title v-if="notDuplicateGrade">
                    Grade
                </v-card-title>
                <v-card-title v-else-if="!notDuplicateGrade">
                    Duplicated Grade
                </v-card-title>
                <v-card-text  v-if="notDuplicateGrade">
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Test</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <button class="btn btn-primary" @click="upload(); dataStatus();">Upload</button>
                <v-snackbar
                color="success"
                outlined
                    v-model="SnackBarStatus"
                    :timeout="timeout">
                    {{ SnackBarText }}
                    <template v-slot:action="{ attrs }">
                        <v-btn
                        color="blue"
                        text
                        v-bind="attrs"
                        @click="SnackBarStatus = false"
                        >
                        Close
                        </v-btn>
                    </template>
                    </v-snackbar>
                </v-card-text>
                <v-card-text v-else-if="!notDuplicateGrade">
                    <table class="table table-stripped table-bordered">
                    <thead>
                        <tr>
                            <th>Test</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <v-snackbar
                    color="error"
                    outlined
                    v-model="SnackBarDuplicateStatus"
                    :timeout="timeout">
                    {{ SnackBarDuplicateText }}
                    <template v-slot:action="{ attrs }">
                        <v-btn
                        color="blue"
                        text
                        v-bind="attrs"
                        @click="SnackBarDuplicateStatus = false"
                        >
                        Close
                        </v-btn>
                    </template>
                    </v-snackbar>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
    name: "manage_grade",
    data() {
        return {
            addManually: false,
            cpsStatus: null,
            tableData: [],
            selectedFile: "",
            lines: '',
            data: [{}],
            sheetNames: [],
            sheetName: "",
            selectedValue: "",
            duplicateGrade: [],
            url: "https://api.welkin.app/v2/graphql",
            showContent: false,
            dropzoneOptions: {
                url: 'https://httpbin.org/post',
                thumbnailWidth: 150,
                maxFilesize: 2,
                parallelUploads: 1,
                acceptedFiles: ".pdf",
                maxFiles: 1,
                addRemoveLinks: true
            },
            uploadSuccess: false,
            importStatus: true,
            manuallyStatus: false,
            uploadPopUp: false,
            SnackBarText: 'Upload Success!',
            SnackBarDuplicateText: 'Students data duplicated!',
            SnackBarDuplicateStatus: false,
            SnackBarStatus: false,
            timeout: 5000,
            notDuplicateGrade: true,
            pdffile: null,
            pdfData: null,
            uploadValue: 0
        }
    },
    components:{
        vueDropzone: vue2Dropzone,
    },
    methods: {
        changeToAddManually(){
            this.importStatus = !this.importStatus
        },
        dataStatus(){
            this.SnackBarStatus = true
        },
        selectFile(file){
            this.selectedFile = file
            this.pdfData = file
        },
        upload(){
            this.pdffile = null
            const storageRef = firebase.storage().ref(`${this.pdfData.name}`).put(this.pdfData)
            storageRef.on(`state_changed`,snapshot=>{
                this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100
            },error=>{
                console.log(error.message)
            },
            ()=>{
                this.uploadValue=100
                storageRef.snapshot.ref.getDownloadURL().then(async (url)=>{
                    let gql = `
                        mutation{
                            uploadUrl(url: "${url}"){
                                message
                            }
                        }
                    `
                    console.log(url);
                    this.pdffile = url
                    await this.axios.post(this.url, { query : gql }, { withCredentials: true }).then(res => {
                        console.log(res);
                    }).catch (err => {
                        console.log(err);
                    })
                })
            })
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