<template>
  <v-main>
    <v-row class="wk-login-fh flex-column" justify="center" align="center">
      <v-col class="mx-4 d-flex align-items-center vw-100">
        <v-card class="mx-auto my-4 flex-grow-1" style="max-width: 500px;" elevation="2">
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
      <div class="wk-footer justify-content-between flex-column">
        <div class="d-flex align-items-center">
          <a class="wk-footer-icon mr-2" href="https://welkin.app">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 600 600">
              <path
                fill-rule="evenodd"
                d="M147.857,481.286c-134.22-31.525-126.2-239.169,46.714-230.143,23.222,3.693,34.047-3.736,35.572-30.857,17.366-128.233,212.338-145.2,232.286,13.285-31.054,100.765-31.3,101.728-42.858,135.858-7.579-23.026-12.821-43.421-15.428-48-11.889-22.667-40.109-11.7-43.714,4.714-5.054,15.048-12.219,34.641-17.143,46.286-2.844-9.429-9.253-31.936-15-50.572-9.772-22.832-47.909-18.133-45,13.714,8.457,29.332,21.579,77.391,35.255,100.357,11.8,19.241,34.955,17.873,45.316,2.929,4.367-4.12,12.532-21.147,18-34.714,5.2,14.294,10.265,26.705,16.714,34.286,16.18,19.961,39.581,11.993,48-9,23.226-53.592,49.582-144.59,63-189.429C503.44,33.8,225.232,11.7,185.143,204-26.61,198.168-60.739,483.168,143.571,528.429c99.593-.018,170.873,0,312.858,0,147.579-36.664,168.5-190.528,93.857-266.572C527.191,238.1,495.815,270.1,516,293.571c46.12,46.4,45.213,154.55-65.143,187.715C315.774,481.3,252.433,481.27,147.857,481.286Z"
              />
            </svg>
          </a>
          <span class="wk-footer-text">© 2021 Welkin</span>
        </div>
        <div class="d-flex align-items-center flex-column">
          <span class="wk-footer-text" style="font-size: 0.8rem;">Computer Engineering</span>
          <span class="wk-footer-text" style="font-size: 0.7rem"
            >Mahidol University International College</span
          >
        </div>
      </div>
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
      query = query.replace(/\s+/g, ' ').trim()
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