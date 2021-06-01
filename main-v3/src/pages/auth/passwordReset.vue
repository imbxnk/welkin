<template>
  <v-main>
    <v-row class="wk-login-fh" justify="center" align="center">
      <v-col class="mx-4">
        <v-card class="mx-auto my-4" style="max-width: 500px;" elevation="2">
          <div class="py-4" v-if="!isSent">
          <v-card-title>Reset Your Password</v-card-title>
          <v-card-subtitle>Please enter your username and we'll send an email with the recovery link to reset  your password.</v-card-subtitle>
          <v-card-text>
            <v-form @submit.prevent="sendPasswordRecovery()" >
              <div v-if="!isLoading">
                <v-text-field
                  v-model="username"
                  label="Username"
                  outlined
                  class="mt-3"
                ></v-text-field>
                <div class="wk-error" v-if="error">
                  {{ error }}
                </div>
                <div class="d-flex flex-row-reverse justify-content-between align-items-center">
                  <button class="btn btn-primary btn-block wk-send-btn">Send</button>
                  <router-link class="wk-link" :to="{ name: 'login'}">Back to Login</router-link>
                </div>
              </div>
              <div v-else class="wk-spinner mx-auto my-4"></div>
            </v-form>
          </v-card-text>
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
            <v-card-title class="justify-content-center">Check Your Email</v-card-title>
            <v-card-subtitle class="text-center">We have sent a password recovery link to your email.</v-card-subtitle>
            <router-link class="wk-link d-flex justify-content-center mt-3 mb-2" :to="{ name: 'login'}">Back to Login</router-link>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      isSent: false,
      username: '',
      error: '',
    }
  },
  methods: {
    sendPasswordRecovery() {
      if (!this.username) return this.error = "Please enter the username"
      this.isLoading = true;
      let query = `
          mutation {
            requestPasswordRecovery(username: "${this.username}") {
              success
              message
            }
          }
      `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.isLoading = false
          if(res.data.data.requestPasswordRecovery.success) this.isSent = true
        })
        .catch((err) => {
          this.isLoading = false
          this.error = err.response.data.errors[0].message
        });
    }
  },
}
</script>

<style scoped>
.wk-send-btn {
  height: 45px;
  width: 140px;
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
  color: #e24056;
  margin: -20px 0 20px 0;
}

</style>