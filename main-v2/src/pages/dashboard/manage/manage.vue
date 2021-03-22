<template>
    <v-row>
        <v-col cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
            <div v-if="!addManually">
            <!-- <v-btn @click="toggle" class="primary">add Manually</v-btn> -->
            <app-import :cpnStatus="addManually" @importCardStatus="addManually = $event"></app-import>
            </div>
            <div v-if="addManually">
            <!-- <v-btn @click="toggle" class="primary">Import File</v-btn> -->
            <app-addManual :cpnStatus="addManually"  @manuallyCardStatus="addManually = $event"></app-addManual>
            </div>
        </v-col>
        <v-col cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
            <v-card>
                <v-card-title>
                    <div class="row mt-3">
                        <div class="col-12 mt-3">
                        <table class="table table-striped table-bordered" :value="tableData" @tableContent="tableData = $event">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Program</th>
                                    <th>Prefix</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Advisor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in tableData" :key="index" :value="item">
                                    <td scope="row">{{item.ID}}</td>
                                    <td scope="row">{{item.Program}}</td>
                                    <td scope="row">{{item.Prefix}}</td>
                                    <td scope="row">{{item.Name}}</td>
                                    <td scope="row">{{item.LastName}}</td>
                                    <td scope="row">{{item.Advisor}}</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </v-card-title>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import AddStudents from "./components/add_students"
import ImportStudents from "./components/import_students"

export default {
    name: "manage",
    data() {
        return {
            addManually: false,
            cpsStatus: null,
            tableData: []
        }
    },
    components:{
        "app-addManual" :AddStudents,
        "app-import": ImportStudents
    },
    methods: {
    },
}
</script>

<style>

</style>