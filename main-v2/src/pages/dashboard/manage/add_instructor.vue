<template>
  <v-container>
    <v-card style="width: 500px; padding: 20px 20px; margin: 20px 20px;">
        <v-card-title>
            <h2>Add Instructor</h2>
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="Title"  id="title" :value="instructorData.title" v-model="instructorData.title" :rules="[rules.required, rules.min]" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="First Name"  id="firstName" v-model="instructorData.firstName" :rules="[rules.required, rules.min]" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="Family Name"  id="familyName" v-model="instructorData.familyName" :rules="[rules.required, rules.min]" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="Email"  id="email" v-model="instructorData.email" outlined dense></v-text-field>
                    </v-col>
                    <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12" auto style="padding: auto; margin: auto;">
                        <v-text-field label="Phone no."  id="phone" v-model="instructorData.phone" :rules="[rules.required, rules.min]" outlined dense></v-text-field>
                    </v-col>
                </v-row>
                <v-spacer></v-spacer>
                <v-btn color="error" class="ma-2 white--text" @click.prevent="clearForm()" plain>Clear</v-btn>
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
    name: "add_instructor",
    data() {
        return {
            show1: false,
            instructorData:{
                title: "",
                firstName: "",
                familyName: "",
                email: "",
                phone: ""
            }, 
            rules:{
                required: (value) => !!value || "Required.",
                min: (v) => v.length >= 4 || "Min 4 characters",
            }
        }
    },
    methods:{
        async submitForm(){
            console.log(this.instructorData)
            let query = 
            `mutation {
                addInstructor(instructorInput:{
                    title: "${this.instructorData.title}",
                    given_name: "${this.instructorData.firstName}",
                    family_name: "${this.instructorData.familyName}",
                    email: "${this.instructorData.email}",
                    phone: "${this.instructorData.phone}",
                } 
                ) {
                    _id
                    title
                    given_name
                    family_name
                    email
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
        },
        clearForm(){
            
        }
    }
}
</script>

<style>

</style>