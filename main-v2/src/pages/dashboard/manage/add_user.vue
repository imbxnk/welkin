<template>
  <v-container>
  <v-row>
    <v-col justify="center" align="center">
    <v-card class="mt-3 mx-auto pt-3 px-auto float-center" style="max-width: 500px; padding: 20px 20px; margin: 20px 20px;">
        <v-card-title>
            <h2>Add User</h2>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="First Name" id="firstName" v-model="userData.firstName" :rules="[rules.required, rules.min]" outlined required></v-text-field>
                    </v-col>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="Family Name"  id="familyName" v-model="userData.familyName" :rules="[rules.required, rules.min]" outlined required></v-text-field>
                    </v-col>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="Email"  id="email" v-model="userData.email" outlined></v-text-field>
                    </v-col>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="Password" id="password" 
                            class=""
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            v-model="userData.password"
                            :rules="[rules.required, rules.min]"
                            outlined
                            @click:append="show1 = !show1">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" auto style="padding: auto; margin: auto;">
                        <v-btn
                            :loading="loading5"
                            :disabled="loading5"
                            color="primary"
                            class="ma-2 white--text float-right"
                            @click.prevent="submitForm()"
                            >Submit
                        </v-btn>
                        <v-btn color="error" class="ma-2 white--text float-right" @click.prevent="clearForm()">Clear</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
    </v-col>
  </v-row>
    <v-snackbar
      v-model="addingSuccessStatus"
      :timeout="timeout"
      top
      centered
      outlined
      color="success"
    >
      {{ successText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="addingSuccessStatus = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    
    <v-snackbar
      v-model="addingFailingStatus"
      :timeout="timeout"
      top
      centered
      outlined
      color="error"
    >
      {{ failingText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="addingFailingStatus = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
    name: "add_user",
    data() {
        return {
            userData: {
                firstName: "",
                familyName: "",
                email: "",
                password: "",
            },
            rules:{
                required: (value) => !!value || "Required.",
                min: (v) => v.length >= 4 || "Min 4 characters",
            },
            addingSuccessStatus: false,
            addingFailingStatus: false,
            successText: 'Adding Success!',
            failingText: 'Adding Error!',
            timeout: 2000,
        }
    },
    methods:{
        async submitForm(){
            if(this.$refs.form.validate()){
                console.log(this.userData)
                let query = 
                `mutation {
                    createUser (userInput : { 
                        given_name : "${this.userData.firstName}", 
                        family_name : "${this.userData.familyName}", 
                        password : "${this.userData.password}", 
                        email : "${this.userData.email}",}) {
                    token
                    userId
                    }
                }`;
                await this.axios
                .post("https://api.welkin.app/v2/graphql", { query }, {withcredentials : true})
                .then((res)=>{
                    console.log(res)
                    this.addingSuccessStatus = true
                    this.userData = {}
                })
                .catch((err)=>{
                    console.log(err)
                    this.addingFailingStatus = true
                })
            }
        },
        clearForm(){
            this.userData = {}
        }
    }
}
</script>

<style>

</style>