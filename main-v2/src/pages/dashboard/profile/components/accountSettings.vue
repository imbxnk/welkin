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
              <v-avatar v-if="$currentUser.avatar.medium" size="75" @click="show = true">
                <img :src="$currentUser.avatar.medium" />
              </v-avatar>
              <v-img v-else max-width="75" @click="show = true" src="https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png">
              </v-img>
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
    <img :src="imgDataUrl">
    <!-- <vue_avatar_upload v-if="show_upload"></vue_avatar_upload> -->
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
</style>