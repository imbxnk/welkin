<template>
  <div class="wk-security">
    <v-card flat elevation="2">
      <v-card-title style="font-weight: 700">
        Security
      </v-card-title>
      <v-card-text>
        <div class="d-flex wk-account-form d-flex flex-column">
          <div class="mb-3">
            <label class="form-label">Current Password</label>
            <input @keydown="isSuccess = false" class="form-control" type="password" :disabled="isLoading" v-model="userInput.currentPassword" placeholder="">
          </div>
          <div class="mb-3">
            <label class="form-label">New Password</label>
            <input @keydown="isSuccess = false" class="form-control" type="password" :disabled="isLoading" v-model="userInput.newPassword" placeholder="">
          </div>
          <div class="mb-3">
            <label class="form-label">Current Password</label>
            <input @keydown="isSuccess = false" class="form-control" type="password" :disabled="isLoading" v-model="userInput.confirmPassword" placeholder="">
          </div>
          <div class="wk-error" v-if="error">
            {{ error }}
          </div>
          <div class="d-flex align-items-end flex-column mt-4">
            <button class="btn wk-btn wk-success-color"
              v-if="isSuccess"
            ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" class="bi bi-check" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg>
            </button>
            <button type="submit" @click="updatePassword" v-else class="btn wk-btn btn-primary wk-primary-color"
              :disabled="userInput.currentPassword === '' || userInput.newPassword === '' || userInput.confirmPassword === ''"
            >Submit</button>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ChangePassword',
  data() {
    return {
      userInput: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      isLoading: false,
      isSuccess: false,
      error: '',
    }
  },
  methods: {
    updatePassword() {
      this.isLoading = true
      if(this.userInput.newPassword === this.userInput.confirmPassword){
        let query = `
                      mutation {
                        updatePassword (userInput: { currentPassword: "${this.userInput.currentPassword}", newPassword: "${this.userInput.newPassword}" }) {
                          message
                        }
                      }
                  `;
        this.axios
          .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
          .then((res) => {
            console.log(res)
            if(res.data.data) this.isSuccess = true
            else this.error = res.data.errors[0].message
            this.isLoading = false
          })
          .catch((err) => {
            this.isLoading = false
            this.isSuccess = false
            this.error = err
          });
      } else {
        this.error = 'Password not matched.'
        this.isLoading = false
      }
    },
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

.wk-error {
  color: #e24056;
  margin-left: 10px;
}
</style>