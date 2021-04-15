<template>
  <v-main>
    <v-row style="height: 100%" justify="center" align="center">
      <v-col>
        <v-card style="width: 400px; margin: 20px auto">
          <form @submit.prevent="handleSubmit()" style="padding: 30px">
            <h4 ou style="text-align:center">Login to your WELKIN account</h4>
            <v-text-field v-model="username" label="Username" outlined class="pt-5"></v-text-field>

            <v-text-field
              v-model="password"
              class=""
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              hint="At least 4 characters"
              outlined
              @click:append="show1 = !show1"
            ></v-text-field>

            <button class="btn btn-primary btn-block">Login</button>
          </form>
        </v-card></v-col
      >
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
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 4 || "Min 4 characters",
        emailMatch: () => "The email and password you entered don't match",
      },
    };
  },
  methods: {
    async handleSubmit() {
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
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res);
          window.location.replace("/");
        })
        .catch((err) => {
          alert("Incorrect username or password, please try again");
          console.log(err.message);
        });
    },
  },
};
</script>

<style></style>
