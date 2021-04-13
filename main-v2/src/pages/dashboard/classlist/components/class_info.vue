<template>
    <div class="wk-detail">
        <!-- <a  @click="$router.push('/class_history')">class history</a> -->
        <div class="float-right overline primary--text"><a  @click="$router.push(`/class/${code.toLowerCase()}`)">class history</a></div>
        <div class="overline my-n1">{{code}} : {{name}}</div>
        <v-divider></v-divider>
        <table style="width:100%;">
            <tr >
            <th class="text-left" > Year:</th>
            <th class="text-center" > 59 </th>
            <th class="text-center" > 60 </th>
            <th class="text-center" > 61 </th>
            <th class="text-center" > 62 </th>
            <th class="text-center" > 63 </th>
            <th class="text-center" > 64 </th>
            <th class="text-center" > 65 </th>
            </tr>
            <tr >
            <th class="text-left" > Remain student: </th>
            <td class="text-center" > 5 </td>
            <td class="text-center" > 6 </td>
            <td class="text-center" > 7 </td>
            <td class="text-center" > 8 </td>
            <td class="text-center" > 9 </td>
            <td class="text-center" > 10 </td>
            <td class="text-center" > 11 </td>
            </tr>
        </table>
        <v-divider></v-divider>
    <v-row>
        <v-col cols="6">
            <h6>Instructor list: </h6>
            <table style="width:100%;">
                <tr>
                    <th>Name :</th>
                </tr>
                <tr>
                    <td>Mingmanas</td>
                </tr>
            </table>
        </v-col>
    </v-row>
    <v-divider></v-divider>
    </div>
</template>
<script>
export default {
    name:"Class_info",
    props: ["name","code"],
    component:[],
    data(){
        return {

        }
    }
}
</script>
<style scoped>
table,th,tr,td{
    border: 1px solid rgba(139, 139, 139, 0.2);
    padding: 5px;
}
.wk-detail {
    width: 100%;
    overflow-x: hidden;
}
</style>
