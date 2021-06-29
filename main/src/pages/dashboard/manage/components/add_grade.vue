<template>
<v-card>
  <v-card-title class="card-title">
    Add Class
    <v-spacer></v-spacer>
    <v-icon v-if="!isUploading" @click="done()">mdi-close</v-icon>
  </v-card-title>
  <div class="pa-3">
      <div class="d-flex flex-column justify-content-center">
        <div class="p-2" v-if="!isSuccess && !isUploading">
          <div class="mb-4">
            Please Upload Grade Report File
          </div>
          <vue-dropzone
            class="dropZone"
            ref="myVueDropzone"
            id="dropzone"
            :options="dropzoneOptions"
            @vdropzone-success="selectFile"
          >
          </vue-dropzone>
          <div class="d-flex flex-row justify-content-end mt-4">
            <div class="p-2">
              <v-btn text @click="clear()">clear</v-btn>
            </div>
            <div class="p-2">
              <v-btn color="primary" :disabled="!isSent" @click="Upload()">Upload</v-btn>
            </div>
          </div>
        </div>
        <div class="p-2" style="margin-bottom: 40px" v-else-if="!isSuccess && isUploading">
          <div class="d-flex flex-column align-items-center justify-content-center">
            <div class="wk-spinner mx-auto mt-4"></div>
            <span class="small">Uploading...</span>
          </div>
        </div>
        <div class="p-2 d-flex flex-column" v-else-if="isSuccess && !isUploading">
          <div class="success-checkmark">
            <div class="check-icon">
              <span class="icon-line line-tip"></span>
              <span class="icon-line line-long"></span>
              <div class="icon-circle"></div>
              <div class="icon-fix"></div>
            </div>
          </div>
          <span class="d-flex align-items-center justify-content-center mt-4">Grade Report has been uploaded</span>
          <div class="d-flex flex-row justify-content-end mt-4">
            <div class="p-2">
              <v-btn text color="primary" @click="done()">Done</v-btn>
            </div>
          </div>
        </div>
      </div>
  </div>
</v-card>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
    data(){
      return {
        dropzoneOptions: {
          url: 'https://httpbin.org/post',
          thumbnailWidth: 150,
          maxFilesize: 2,
          parallelUploads: 1,
          acceptedFiles: ".pdf",
          maxFiles: 1,
          addRemoveLinks: true
        },
        selectedFile: null,
        pdfData: null,
        data: [{}],
        duplicateGrade: [],
        isSent: false,
        isSuccess: false,
        isUploading: false,
        isError: false,
      }
    },
    components:{
        vueDropzone: vue2Dropzone,
    },
    methods:{
      selectFile(file){
        this.selectedFile = file
        this.pdfData = file
        this.isSent = true
      },
      Upload(){
        this.isUploading = true
        const storageRef = firebase.storage().ref(`${this.pdfData.name}`).put(this.pdfData)
        storageRef.on(`state_changed`, snapshot => {
          this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100
        }, err =>{
          console.log(err.message)
          this.isError = true
          this.isUploading = false
        },
        () =>{
            storageRef.snapshot.ref.getDownloadURL().then(async (url)=>{
                let query = `
                    mutation{
                        uploadUrl(url: "${url}"){
                            message
                        }
                    }
                `
                query = query.replace(/\s+/g, ' ').trim()
                await this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true }).then(res => {
                    console.log(res);
                    this.$emit('reload')
                    this.isSuccess = true
                    this.isUploading = false

                    var fileRef = firebase.storage().refFromURL(url)
                    console.log(fileRef)
                    fileRef.delete().then(() => {
                      console.log('file is deleted')
                    }).catch((err) => {
                      console.log(err)
                    })
                }).catch (err => {
                    console.log(err);
                })
            })
        })
      },
      clear() {
        this.$refs.myVueDropzone.removeAllFiles()
      },
      done() {
        this.$emit('done')
        this.isSuccess = false
        this.isUploading = false
        this.isSent = false
      }
    }
}
</script>

<style>
  .dropZone{
    width: 560px;
    height: 250px;
  }

  .wk-spinner {
    pointer-events: none;
    width: 2.5em;
    height: 2.5em;
    border: 0.4em solid transparent;
    border-color: #eee;
    border-top-color: #3E67EC;
    border-radius: 50%;
    animation: loadingspin 1s linear infinite;
  }

  @keyframes loadingspin {
    100% {
      transform: rotate(360deg)
    }
  }
</style>