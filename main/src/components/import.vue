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
          <v-card-text>
            <v-form class="px-3" v-model="valid" ref="form" lazy-validation>
              <v-text-field label="First name" v-model='newData.firstname' :counter="20" :rules="firstnameRules"
                required></v-text-field>
              <v-text-field label="Last name" v-model="newData.lastname" :counter="20" :rules="lastnameRules" required>
              </v-text-field>
              <v-text-field label="Email" v-model="email" :rules="emailRules" required></v-text-field>
              <v-btn flat color='error' class="mr-4" @click="reset">Clear</v-btn>
              <v-btn flat color='dark' class="mr-4" @click="addNewStudent">Add</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <br><br>

      <template>
        <v-expansion-panels>
          <v-expansion-panel v-for="firstname in newStudent" :key="firstname.firstname">
            <v-expansion-panel-header>
              Student
            </v-expansion-panel-header>
            <v-expansion-panel-content>

            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>


    </v-content>
  </v-app>



</template>

<script>
  export default {
    data: () => ({
      valid: true,
      dialog: false,
      newData: {
        firstname: "",
        lastname: "",
        email: "",
      },
      newStudent: [{
        firstname: "phat",
        lastname: "phatphat",
        email: "phatza131@gmail.com",
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
    method: {
      submit: function () {
        this.$refs.form.validate()
      },
      reset: function () {
        this.$refs.form.reset()
      },
      addNewStudent: function () {
        this.newStudent.push({
          firstname: this.newData.firstname,
          lastname: this.newData.lastname,
          email: this.newData.email,
        });
        
      }
    }
  }
</script>