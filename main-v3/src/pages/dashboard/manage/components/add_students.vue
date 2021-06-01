<template>
    <v-card style="width: 800px; padding: 20px 20px;">
        <v-card-title id="cardTitle">
            <v-row>
                <v-col cols="8">
                    Add new Student
                </v-col>
                <v-col cols="4">
                    <v-btn plain text class="float-right overline primary--text" style="font-size:0.8rem; font-weight: normal;" :value="manuallyStatus" @click="changeToImportFile">Import File</v-btn>
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