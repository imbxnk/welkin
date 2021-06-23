<template>
  <div class="">
    <div class="d-flex flex-row justify-content-end bd-highlight">
      <div class="p-2 bd-highlight">
        <v-btn color="primary" @click="dialog = true"><v-icon>mdi-plus</v-icon> Add User</v-btn>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class=""
          ><h3>Add User</h3>
          <v-spacer></v-spacer>
          <v-icon @click="dialogClose()">mdi-close</v-icon></v-card-title
        >
        <v-form ref="form" v-model="valid" lazy-validation class="pa-3">
          <div class="d-flex justify-content-center flex-column">
            <div class="px-3">
              <v-text-field
                ref="firstName"
                v-model="firstName"
                label="Given Name"
                outlined
                required
                :rules="[() => !!firstName || 'Required']"
              ></v-text-field>
            </div>
            <div class="px-3">
              <v-text-field
                ref="familyName"
                v-model="familyName"
                label="Family Name"
                outlined
                required
                :rules="[() => !!familyName || 'Required']"
              ></v-text-field>
            </div>
          </div>
          <div class="d-flex justify-content-center flex-column">
            <div class="px-3">
              <v-text-field
                ref="email"
                v-model="email"
                label="Email"
                outlined
                required
                :rules="[() => !!email || 'Required', rules.email]"
              ></v-text-field>
            </div>
            <div class="px-3">
              <v-text-field
                ref="password"
                v-model="password"
                label="Password"
                outlined
                required
                :rules="[
                  () => (!!password && password.length >= 4) || 'Required at least 4 characters',
                ]"
              ></v-text-field>
            </div>
            <div class="px-3">
              <v-select
                ref="group"
                :items="items"
                v-model="group"
                label="Group"
                required
                outlined
              ></v-select>
            </div>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="clearText()">clear</v-btn>
            <v-btn color="primary" @click="validate()">submit</v-btn>
          </v-card-actions>
        </v-form>

        <v-dialog v-model="dialog1" max-width="450px">
          <v-card>
            <v-card-title class="headline grey lighten-2"> Confirm Add </v-card-title><br />
            <v-card-text
              >Are you sure you want to add: <br />First Name: <b>{{ this.input.firstName }}</b>
              <br />
              Family Name: <b>{{ this.input.familyName }}</b
              ><br />Email: <b>{{ this.input.email }}</b> <br />
              Password: <b>{{ this.input.password == "" ? " - " : this.input.password }}</b>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="error" @click="dialog1 = false">No</v-btn>
              <v-btn text color="success" @click="addUser()">Yes</v-btn>
            </v-card-actions></v-card
          >
        </v-dialog>
        <v-snackbar centered v-model="snackbar" :timeout="1000">
          Form submission : success!
        </v-snackbar>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "add_user",
  props: [],
  mounted() {},
  data() {
    return {
      firstName: "",
      familyName: "",
      email: "",
      password: "",
      group: "",
      items: ["coordinator", "program director", "lecturer"],
      dialog: false,
      dialog1: false,
      snackbar: false,
      input: {
        firstName: "",
        familyName: "",
        email: "",
        password: "",
        group: "",
      },
      valid: true,
      rules: {
        counter: [(v) => v.length <= 4 || "Min 4 characters"],
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    };
  },
  computed: {
    form() {
      return {
        firstName: this.firstName,
        familyName: this.familyName,
        email: this.email,
        password: this.password,
        group: this.group,
      };
    },
  },
  methods: {
    clearText() {
      (this.firstName = ""),
        (this.familyName = ""),
        (this.email = ""),
        (this.password = ""),
        (this.group = "");
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },
    validate() {
      this.$refs.form.validate();
      console.log(this.$refs.form.validate());
      if (this.$refs.form.validate()) {
        this.input.firstName = this.firstName;
        this.input.familyName = this.familyName;
        this.input.email = this.email;
        this.input.password = this.password;
        this.input.group = this.group;
        this.dialog = true;
      } else {
      }
    },
    dialogClose() {
      this.dialog = false;
      this.clearText();
    },
    addUser() {
      let query = `mutation {
                    createUser (userInput : {
                        given_name : "${this.input.firstName}",
                        family_name : "${this.input.familyName}",
                        password : "${this.input.password}",
                        email : "${this.input.email}",
                        group :"${this.input.group}"}) {
                    success
                    message
                    }
                }`;
      query = query.replace(/\s+/g, " ").trim();
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res);
          this.clearText();
          this.dialog = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // clearForm() {
    //   this.userData = {};
    // },
  },
};
</script>
