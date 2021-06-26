<template>
  <v-main>
    <v-row class="wk-login-fh flex-column" justify="center" align="center">
      <v-col class="mx-4 d-flex align-items-center vw-100">
        <v-card class="mx-auto my-4 flex-grow-1" style="max-width: 400px;" elevation="2">
          <v-card-title v-if="!isLoading">Log in</v-card-title>
          <v-card-title v-else>Logging in...</v-card-title>
          <v-card-subtitle v-if="!isLoading">Welcome to Welkin</v-card-subtitle>
          <v-card-subtitle v-else>We are logging you to Welkin</v-card-subtitle>
          <v-card-text>
            <v-form ref="loginForm" @submit.prevent="login()" >
              <div v-if="!isLoading">
                <v-text-field
                  v-model="username"
                  label="Username"
                  outlined
                  class="pt-5"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Password"
                  placeholder=" "
                  outlined
                  style="margin-top:-10px;"
                  @click:append="show1 = !show1"
                ></v-text-field>
                <button class="btn btn-primary btn-block wk-login-btn">Login</button>
              </div>
              <div v-else class="wk-spinner mx-auto my-4"></div>
            </v-form>
          </v-card-text>
          <v-divider v-if="!isLoading"></v-divider>
          <div class="px-4 text-center" v-if="!isLoading"><router-link class="wk-link" :to="{ name: 'reset_password' }">Forgot your password?</router-link></div>
          <v-card-actions></v-card-actions>
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
      show1: false,
      username: "",
      password: "",
      token: "",
      userId: "",
      message: "",
      isLoading: false,
    };
  },
  methods: {
    login() {
      this.isLoading = true
      //axios post to check token, userId compare with the username and password
      let query = `
          mutation {
            login ( username : "${this.username}" , password : "${this.password}") {
              message
            }
          }
      `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          if(res.data) {
            window.location.replace(`${this.$route.query.redirect || '/'}`)
          } else {
            alert("Invalid Username or Password");
            this.isLoading = false
          }
        })
        .catch((err) => {
          alert(err.response.data.errors[0].message)
          this.isLoading = false
        });


    },
  },
};
</script>

<style scoped>

.wk-login-btn {
  height: 48px;
}
.wk-login-btn:hover, .wk-login-btn:focus, .wk-login-btn:active {
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
</style>
