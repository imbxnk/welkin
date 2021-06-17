<template>
  <v-main v-if="checked">
    <v-row class="wk-login-fh" justify="center" align="center">
      <v-col class="mx-4">
        <v-card class="mx-auto my-4" style="max-width: 500px;" elevation="2">
          <div class="py-4" v-if="email && !isSuccess">
          <v-card-title>Reset Your Password</v-card-title>
          <v-card-subtitle>Enter a new password for your account <strong>({{ email }})</strong></v-card-subtitle>
          <v-card-text>
            <v-form @submit.prevent="resetPassword()" >
              <div v-if="!isLoading">
                <v-text-field
                  v-model="user.password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showpw ? 'text' : 'password'"
                  @click:append="showpw = !showpw"
                  label="Password"
                  outlined
                  class="mt-3"
                ></v-text-field>
                <v-text-field
                  v-model="user.confirmPassword"
                  label="Confirm Password"
                  type='password'
                  outlined
                  style="margin-top:-15px"
                ></v-text-field>
                <div class="wk-error" v-if="error">
                  {{ error }}
                </div>
                <button class="btn btn-primary btn-block wk-send-btn">Change Password</button>
              </div>
              <div v-else class="wk-spinner mx-auto my-4"></div>
            </v-form>
          </v-card-text>
          </div>
          <div class="py-4 d-flex flex-column" v-else-if="!email && !isSuccess">
            <div class="svg-box">
                <svg class="circular red-stroke">
                    <circle class="path" cx="75" cy="75" r="50" fill="none" stroke-width="5" stroke-miterlimit="10"/>
                </svg>
                <svg class="cross red-stroke">
                    <g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-502.652,-204.518)">
                        <path class="first-line" d="M634.087,300.805L673.361,261.53" fill="none"/>
                    </g>
                    <g transform="matrix(-1.28587e-16,-0.79961,0.79961,-1.28587e-16,-204.752,543.031)">
                        <path class="second-line" d="M634.087,300.805L673.361,261.53"/>
                    </g>
                </svg>
            </div>
            <v-card-title class="justify-content-center">Invalid Token</v-card-title>
            <v-card-subtitle class="text-center">Password Reset token is invalid or has been expired</v-card-subtitle>
          </div>
          <div class="py-4" v-else>
            <div class="success-checkmark">
              <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
              </div>
            </div>
            <v-card-title class="justify-content-center">Password Reset Succesful</v-card-title>
            <v-card-subtitle class="text-center">You have successfully changed your password.</v-card-subtitle>
            <div class="d-flex justify-content-center px-4 text-center" style="color: #999; font-size: 0.88rem">
              <p>If this page doesn't redirect in 5 seconds then please click <a href="/">here</a></p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
export default {
  mounted() {
    this.token = this.$route.query.token
    this.checkToken()
  },
  data() {
    return {
      checked: false,
      isLoading: false,
      isSuccess: false,
      showpw: false,
      user: {
        password: '',
        confirmPassword: '',
      },
      token: '',
      email: '',
      error: '',
    }
  },
  methods: {
    checkToken() {
      let query = `
          query {
            checkToken(token: "${this.token}") {
              success
              email
            }
          }
      `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.checked = true
          if(res.data.data.checkToken.success) {
            this.email = res.data.data.checkToken.email
          }
        })
        .catch((err) => {
          this.checked = true
        });
    },
    resetPassword() {
      if (this.user.password.length < 5 || this.user.confirmPassword.length < 5) return this.error = "Password should be more than 6 characters"
      if (this.user.password != this.user.confirmPassword) return this.error = "Passwords do not match"
      this.isLoading = true;
      let query = `
          mutation {
            resetPassword(token: "${this.token}", password: "${this.user.password}") {
              success
              message
            }
          }
      `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.isLoading = false
          if(res.data.data.resetPassword.success) {
            this.isSuccess = true
            setTimeout(() => { window.location.replace("/") }, 5000)
          }
        })
        .catch((err) => {
          this.isLoading = false
          this.error = err.response.data.errors[0]
        });
    }
  },
}
</script>

<style scoped>
.wk-send-btn {
  height: 48px;
}
.wk-send-btn:hover, .wk-send-btn:focus, .wk-send-btn:active {
  outline:0px !important;
  -webkit-appearance:none;
  box-shadow: none !important;
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

.wk-error {
  margin: -20px 0 20px 0;
  color: #e24056;
}
</style>