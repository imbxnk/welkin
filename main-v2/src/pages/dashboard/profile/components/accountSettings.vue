<template>
  <div class="wk-account">
    <v-card flat elevation="2">
      <v-card-title style="font-weight: 700 !important">
        Account Settings
      </v-card-title>
      <v-card-text>
        <div class="my-4">
          <div class="d-flex align-items-center">
            <div class="me-4">
              <v-avatar class="wk-avatar-upload" size="75" :style="`background: url(${$currentUser.avatar.medium ? $currentUser.avatar.medium : 'https://cdn.welkin.app/uploads/avatar/default.png'}) center center / cover;`" >
                  <div class="wk-avatar-upload-btn" @click="show = true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" class="bi bi-camera-fill" viewBox="-2 -2 20 20">
                      <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                      <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                    </svg>
                  </div>
                  <div class="wk-avatar-delete-btn" @click="dialog = true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                  </div>
              </v-avatar>
            </div>
            <div class="d-flex flex-column">
              <div class="wk-name" v-if="$currentUser.display_name"><h5>{{ $currentUser.display_name }}</h5></div>
              <div class="wk-name" v-else><h5>{{ $currentUser.given_name + " " + $currentUser.family_name }}</h5></div>
              <div class="d-inline-block">
                <span class="wk-badge wk-primary-color">{{ $currentUser.group }}</span>
                <span class="wk-badge wk-grey-color" v-if="$currentUser.isAdvisor">Advisor</span>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex wk-account-form d-flex flex-column">
          <div class="mb-3">
            <label class="form-label">Display name</label>
            <input @keydown="isSuccess = false" maxlength="16" class="form-control" type="text" :disabled="isLoading" v-model="user.display_name" placeholder="">
          </div>
          <div class="mb-3 row">
            <div class="col col-12 col-md-6">
              <label class="form-label">Given name</label>
              <input @keydown="isSuccess = false" class="form-control" style="text-transform:capitalize" :disabled="isLoading" type="text" v-model="user.given_name" required placeholder="">
            </div>
            <div class="col col-12 col-md-6">
              <label class="form-label">Family name</label>
              <input @keydown="isSuccess = false" class="form-control" style="text-transform:uppercase" :disabled="isLoading" required type="text" v-model="user.family_name" placeholder="">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <div class="ms-3">{{ $currentUser.email }}</div>
          </div>
          <div class="d-flex align-items-end flex-column">
            <button class="btn wk-btn wk-success-color"
              v-if="isSuccess && (user.display_name === $currentUser.display_name) && (user.given_name === $currentUser.given_name) && (user.family_name === $currentUser.family_name)"
            ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg>
            </button>
            <button type="submit" @click="updateAccount" v-else class="btn wk-btn btn-primary wk-primary-color"
              :disabled="(user.display_name === $currentUser.display_name) && (user.given_name === $currentUser.given_name) && (user.family_name === $currentUser.family_name) || isLoading"
            >Save Changes</button>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <avatar-upload field="img"
        @crop-success="cropSuccess"
        v-model="show"
        :width="300"
        :height="300"
        langType="en"
        :noCircle=true
        :noSquare=true
        img-format="png">
    </avatar-upload>
    <!-- Dialog -->
    <v-dialog
      v-model="dialog"
      persistent
      max-width="390"
    >
      <v-card>
        <v-card-title>
          Remove Profile Picture?
        </v-card-title>
        <v-card-text style="margin-top: -10px">
          You will lose your current avatar if you delete it.
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red darken-1"
            style="color: #fff"
            @click="deleteAvatar()"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

// import vue_avatar_upload from "../profile-upload/upload-2"
import myUpload from 'vue-image-crop-upload/upload-2.vue';

export default {
  components: {
    // vue_avatar_upload,
    'avatar-upload': myUpload,
  },
  data() {
    return {
      user: {
        display_name: this.$currentUser.display_name,
        given_name: this.$currentUser.given_name,
        family_name: this.$currentUser.family_name,
      },
      isLoading: false,
      isSuccess: false,
      show: false,
      imgDataUrl: '',
      dialog: false,
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    },
    cropSuccess(imgDataUrl, field){
      // this.$currentUser.avatar.small = imgDataUrl
      // this.$currentUser.avatar.medium = imgDataUrl
      var formData = new FormData()
      let query = `
          mutation($file: Upload!) {
            updateAvatar(file: $file) {
              success
              message
              avatar { small medium large }
            }
          }
      `;
      let file = this.dataURLtoFile(imgDataUrl, `${this.$currentUser.username}.png`)
      console.log(file)
      let operations = JSON.stringify({ query, variables: { file: null }})
      formData.append("operations", operations)
      const map = {
        "0": ["variables.file"]
      }
      formData.append("map", JSON.stringify(map))
      formData.append("0", file)
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, formData, { withCredentials: true })
        .then((res) => {
          console.log(res.data)
          if(res.data.data.updateAvatar.success) {
            this.$currentUser.avatar.small = res.data.data.updateAvatar.avatar.small
            this.$currentUser.avatar.medium = res.data.data.updateAvatar.avatar.medium
            this.$currentUser.avatar.large = res.data.data.updateAvatar.avatar.large
          }
        })
        .catch((err) => {
          console.log(err)
        });
    },
    updateAccount() {
      this.isLoading = true
      let query = `mutation {
                    updateMyAccount(userInput: {
                      display_name: "${this.user.display_name}",
                      given_name: "${this.user.given_name}",
                      family_name: "${this.user.family_name}"
                    }) {
                      success
                      message
                    }
                  }`
      this.axios
          .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
          .then((res) => {
            if(res.data.data.updateMyAccount.success) {
              this.$currentUser.display_name = this.user.display_name
              this.$currentUser.given_name = this.user.given_name
              this.$currentUser.family_name = this.user.family_name
              this.isSuccess = true
            } else {
              this.isSuccess = false
            }
            this.isLoading = false
          })
          .catch((err) => {
            this.isLoading = false
            this.isSuccess = false
          });
    },
    deleteAvatar() {
      let query = `mutation {
        deleteAvatar {
          success
          message
        }
      }`
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          if(res.data.data.deleteAvatar.success) {
            delete this.$currentUser.avatar
            this.dialog = false
          }
        })
        .catch((err) => { });
    }
  },
}
</script>
<style scoped>
.wk-name h5{
  font-weight: 600;
  margin-bottom: 5px;
  cursor: default;
  color: #000;
}

.wk-account-form {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px 10px;
}

input, button {
  box-shadow: none !important;
}

button:disabled {
  cursor: not-allowed;
}

.wk-btn {
  width: 150px;
}

.v-btn {
  border-radius: 1.44rem;
}
</style>