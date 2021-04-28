<template>
  <v-main>
    <v-row style="height: 100%" justify="center" align="center">
      <v-col>
        <v-card class="mx-auto my-4" style="width: 400px;" elevation="2">
          <v-card-title>Log in</v-card-title>
          <v-card-subtitle>Welcome to Welkin</v-card-subtitle>
          <v-card-text>
            <form @submit.prevent="login()">
              <v-text-field
                v-model="username"
                label="Username"
                :rules="[rules.username]"
                outlined
                class="pt-5"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.password]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                placeholder=" "
                outlined
                @click:append="show1 = !show1"
              ></v-text-field>
              <button class="btn btn-primary btn-block wk-login-btn">Login</button>
            </form>
          </v-card-text>
          <v-card-actions>

          </v-card-actions>
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
      rules: { },
    };
  },
  methods: {
    login() {
      this.rules = {
        username: (value) => !!value || "Please enter the username",
        password: (value) => !!value || "Please enter the password"
      }
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
          if(res.success) {
            this.$router.push('/')
          } else {
            console.log(res)
          }
        })
        .catch((err) => {
          alert("Incorrect username or password, please try again");
          this.rules = { }
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
</style>
