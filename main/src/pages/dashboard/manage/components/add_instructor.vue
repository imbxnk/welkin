<template>
  <div>
    <v-form ref="form" lazy-validation>
      <div class="d-flex flex-column">
        <div class="d-flex">
          <v-autocomplete
            v-model="instrucData.title"
            :items="titles"
            label="Title"
            class="me-4"
            style="max-width: 170px"
            clearable
            outlined
          ></v-autocomplete>
          <v-text-field
            label="First Name"
            v-model="instrucData.given_name"
            :rules="[rules.required, rules.counter]"
            outlined
            required
          ></v-text-field>
        </div>

        <v-text-field
          label="Last Name"
          v-model="instrucData.family_name"
          :rules="[rules.required, rules.counter]"
          outlined
          required
        ></v-text-field>
        <v-text-field
          label="Email"
          v-model="instrucData.email"
          outlined
        ></v-text-field>
        <v-text-field
          label="phone"
          v-model="instrucData.phone"
          :rules="[]"
          outlined
        ></v-text-field>
      </div>
    </v-form>
    <v-card-action>
      <div class="d-flex flex-row justify-content-end">
        <v-btn class="mt-4 me-4" text @click="clear()">clear</v-btn>
        <v-btn class="mt-4" color="primary" @click="validate()">Submit</v-btn>
      </div>
    </v-card-action>

    <v-dialog v-model="dialogCheck" max-width="450px">
      <v-card>
        <v-card-title class="headline grey lighten-2"> Confirm instructor information</v-card-title
        ><br />
        <v-card-text
          >Are you sure you want to add: <br />Title: <b>{{ this.inputData.title }}</b> <br />First
          Name: <b>{{ this.inputData.given_name }}</b> <br />Last Name:
          <b>{{ this.inputData.family_name }}</b> <br />Email: <b>{{ this.inputData.email }}</b>
          <br />Phone: <b>{{ this.inputData.phone }}</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="dialogCheck = false">No</v-btn>
          <v-btn text color="success" @click="addInstructor()">Yes</v-btn>
        </v-card-actions></v-card
      >
    </v-dialog>
    <v-snackbar centered v-model="snackbar" :timeout="1000">
      Form submission : success!
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: ['titles'],
  data() {
    return {
      snackbar: false,
      instrucData: {
        title: "",
        given_name: "",
        family_name: "",
        email: "",
        phone: "",
      },
      inputData: {
        title: "",
        given_name: "",
        family_name: "",
        email: "",
        phone: "",
      },
      dialogCheck: false,
      rules: {
        required: (value) => !!value || "Required.",
        counter: [(v) => v.length <= 2 || "Min 2 characters"],
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    };
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.inputData.title = this.instrucData.title;
        this.inputData.given_name = this.instrucData.given_name;
        this.inputData.family_name = this.instrucData.family_name;
        this.inputData.email = this.instrucData.email;
        this.inputData.phone = this.instrucData.phone;
        this.dialogCheck = true;
      } else {
      }
    },
    clear() {
      (this.instrucData.title = ""),
        (this.instrucData.given_name = ""),
        (this.instrucData.family_name = ""),
        (this.instrucData.email = ""),
        (this.instrucData.phone = "");
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },
    addInstructor() {
      let query = `mutation{
                    addInstructor(instructorInput:{
                      title: "${this.inputData.title}",
                      given_name: "${this.inputData.given_name}",
                      family_name: "${this.inputData.family_name}",
                      email: "${this.inputData.email}",
                      phone"${this.inputData.phone}",
                    }){
                        title
                        name
                        email
                        phone
                    }
                }`;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res);
          this.dialog = false;
          this.dialogCheck = false;
          this.snackbar = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
