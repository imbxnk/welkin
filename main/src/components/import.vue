<template>
  <v-app>
    <v-content>
      <v-dialog max-width="600px" v-model="dialog">
        <template v-slot:activator="{ on, attrs}">
          <v-btn flat class="dark" v-bind="attrs" v-on="on">+ New student</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <h3>Add new student</h3>
          </v-card-title>
          <v-row>
            <v-card-text>
              <v-form class="px-3" v-model="valid" ref="form" lazy-validation>
                <v-text-field label="First name" v-model='newData.firstname' :counter="20" :rules="firstnameRules"
                  required></v-text-field>
                <v-text-field label="Last name" v-model="newData.lastname" :counter="20" :rules="lastnameRules"
                  required>
                </v-text-field>
                <v-text-field label="Email" v-model="newData.email" :rules="emailRules" required></v-text-field>
                <v-btn flat color='error' class="mr-4" @click="reset">Clear</v-btn>
                <v-btn flat color='dark' class="mr-4" @click="addNewStudent">Add</v-btn>
                <v-btn :loading="loading" color="blue-grey" class="ma-2 white--text" @click="loader = 'loading'">
                  Upload
                  <v-icon right dark>
                    mdi-cloud-upload
                  </v-icon>
                  
                </v-btn>
              </v-form>
            </v-card-text>
          </v-row>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>



</template>

<script>
  export default {
    data: () => ({
      valid: true,
      dialog: false,
      loading: false,
      loader: null,
      files: [],
      newData: {
        firstname: "",
        lastname: "",
        email: "",
      },
      newStudent: [{
        firstname: "test",
        lastname: "test",
        email: "test@welkin.com",
      }, ],

      firstnameRules: [
        v => !!v || 'First name is required',
        v => v && v.length <= 20 || 'First name must be less than 20 characters!!'
      ],
      lastnameRules: [
        v => !!v || 'First name is required',
        v => v && v.length <= 20 || 'Last name must be less than 20 characters!!'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ]
    }),
    methods: {
      submit: function () {
        this.$refs.form.validate()
      },
      reset: function () {
        this.$refs.form.reset();
      },
      addNewStudent: function () {
        this.newStudent.push({
          firstname: this.newData.firstname,
          lastname: this.newData.lastname,
          email: this.newData.email
        });
        console.log("first name: ",this.newStudent[1].firstname);
        console.log("last name: ", this.newStudent[1].lastname);
        console.log("email: ",this.newStudent[1].email);
        this.dialog = false;
      },
    },
    watch: {
      loader() {
        const l = this.loader
        this[l] = !this[l]
        setTimeout(() => (this[l] = false), 3000)
        this.loader = null
      },
    },
  }
</script>


<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }

  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }to {
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }to {
      transform: rotate(360deg);
    }
  }

  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }to {
      transform: rotate(360deg);
    }
  }

  @keyframes loader {
    from {
      transform: rotate(0);
    }to {
      transform: rotate(360deg);
    }
  }
</style>