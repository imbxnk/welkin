<template>
  <div class="pa-3">
      <div class="d-flex flex-column bd-highlight justify-content-center">
        <div class="p-2 bd-highlight">
          <vue-dropzone
            class="dropZone"
            ref="myVueDropzone"
            id="dropzone"
            :options="dropzoneOptions"
            @vdropzone-success="selectFile"
            >
          </vue-dropzone>
        </div>
        <div class="p-2 bd-highlight">
          <div class="d-flex flex-row bd-highlight justify-content-end">
            <div class="p-2 bd-highlight">
              <v-btn text>clear</v-btn>
            </div>
            <div class="p-2 bd-highlight">
              <v-btn text color="#3c84fb" @click="Upload()">Upload</v-btn>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
    data(){
        return{
            e1 : 1,
            dropzoneOptions: {
              url: 'https://httpbin.org/post',
              thumbnailWidth: 150,
              maxFilesize: 2,
              parallelUploads: 1,
              acceptedFiles: ".pdf",
              maxFiles: 1,
              addRemoveLinks: true
            },
            selectedFile: "",
            pdfData: null,
            tableData: [],
            lines: '',
            data: [{}],
            sheetNames: [],
            sheetName: "",
            selectedValue: "",
            duplicateGrade: [],
            url: process.env.VUE_APP_GRAPHQL_URL
        }
    },
    components:{
        vueDropzone: vue2Dropzone,
    },
    methods:{
      selectFile(file){
            this.selectedFile = file
            this.pdfData = file
            console.log(this.selectedFile, this.pdfData)
        },
      Upload(){
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
                let query = `
                    mutation{
                        uploadUrl(url: "${url}"){
                            message
                        }
                    }
                `
                query = query.replace(/\s+/g, ' ').trim()
                console.log(url);
                this.pdffile = url
                await this.axios.post(this.url, { query }, { withCredentials: true }).then(res => {
                    console.log(res);
                }).catch (err => {
                    console.log(err);
                })
            })
        })
        }
    }
}
</script>

<style>
  .dropZone{
    width: 560px;
    height: 250px;
  }
</style>