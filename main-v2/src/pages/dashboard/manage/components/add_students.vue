<template>
<div>
    <v-card style="width: 800px; padding: 20px 20px;">
        <v-card-title id="cardTitle">
            <v-row>
                <v-col cols="12" xl="8" lg="8"  md="12" sm="12" xs="12">
                    <h2>Add new Student</h2>
                </v-col>
                <v-col cols="4" xl="4" lg=4 md="4" sm="4" xs="4">
                    <v-btn class="primary" :value="manuallyStatus" @click="changeToImportFile">Import File</v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text>
        <v-form>
            <v-row>
                <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto;">
                    <v-text-field label="ID"  id="id"></v-text-field>
                </v-col>
                <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto">
                    <v-text-field label="Program" ></v-text-field>
                </v-col>
                <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto">
                    <v-select :items="prefix" label="Prefix" ></v-select>
                </v-col>
                <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto">
                    <v-text-field label="First Name" ></v-text-field>
                </v-col>
                <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto">
                    <v-text-field label="Last Name" ></v-text-field>
                </v-col>
                <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" auto style="padding: auto; margin: auto">
                    <v-text-field label="Advisor" ></v-text-field>
                </v-col>
            </v-row>
        </v-form>
        </v-card-text>
    </v-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            prefix: ["Mr", "Ms", "Mrs", "Dr"],
            addStudentFormStatus: true,
            manuallyStatus: false
        }
    },
    methods: {
        changeToImportFile(event){
            this.$emit("manuallyCardStatus", event.target.value)
            console.log(event.target.value)
        }
    },
    props:[
        "cpnStatus"
    ],
}
</script>

<style>
    #card{
        padding: 20px 20px;
        margin: 10%;
    };
    #cardTitle{
        background-color: blue
    };
    #id{
        border: 1px solid;
    }
</style>