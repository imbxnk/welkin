<template>
  <v-container>
    <v-card style="width: 1600px; padding: 20px 20px; margin: 20px 20px;">
        <v-card-title>
            <h2>Add Instructor</h2>
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="First Name"  id="firstName" v-model="instructorData.firstName" outlined></v-text-field>
                    </v-col>
                    <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="Family Name"  id="familyName" v-model="instructorData.familyName" outlined></v-text-field>
                    </v-col>
                    <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="Email"  id="email" v-model="instructorData.email" outlined></v-text-field>
                    </v-col>
                    <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="Password"  id="password" 
                            class=""
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            v-model="instructorData.password"
                            outlined
                            @click:append="show1 = !show1">
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-spacer></v-spacer>
                <v-btn color="error" class="ma-2 white--text" plain>Clear</v-btn>
                <v-btn
                    :loading="loading5"
                    :disabled="loading5"
                    color="primary"
                    class="ma-2 white--text"
                    plain
                    @click.prevent="submitForm()"
                    >Submit
                </v-btn>
            </v-form>
        </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
    data() {
        return {
            show1: false,
            instructorData:{
                firstName: "",
                familyName: "",
                email: "",
                password: ""
            }
        }
    },
    methods:{
        async submitForm(){
            console.log(this.instructorData)
            let query = 
            `mutation {
                createUser (userInput : { 
                    given_name : "${this.instructorData.firstName}", 
                    family_name : "${this.instructorData.familyName}", 
                    password : "${this.instructorData.password}", 
                    email : "${this.instructorData.email}",}) {
                token
                userId
                }
            }`;
            await this.axios
            .post("https://api.welkin.app/v2/graphql", { query }, {withcredentials : true})
            .then((res)=>{
                console.log(res)
            })
            .catch((err)=>{
                console.log(err)
                alert("Adding was error, please try again!")
            })
                
        }
    }
}
</script>

<style>

</style>