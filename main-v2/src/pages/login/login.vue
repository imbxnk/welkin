<template>
  <v-main>
    <v-row style="height: 100%" justify="center" align="center">
      <v-col>
        <v-card class="mx-auto my-4" style="width: 400px;" elevation="2">
          <v-card-title v-if="isLoading">Log in</v-card-title>
          <v-card-title v-else>Logging in...</v-card-title>
          <v-card-subtitle v-if="isLoading">Welcome to Welkin</v-card-subtitle>
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
                  @click:append="show1 = !show1"
                ></v-text-field>
                <button class="btn btn-primary btn-block wk-login-btn">Login</button>
              </div>
              <div v-else class="wk-spinner mx-auto my-4"></div>
            </v-form>
          </v-card-text>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-col>
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
              token
              userId
              message
            }
          }
      `;

      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res.data)
          if(res.data) {
            window.location.replace("/")
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
