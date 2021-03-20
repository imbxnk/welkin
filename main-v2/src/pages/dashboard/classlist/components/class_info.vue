<template>
    <div>
        <!-- <a  @click="$router.push('/class_history')">class history</a> -->
        <div class="float-right overline primary--text"><a  @click="$router.push('/class_history')">class history</a></div>
        <div class="overline my-n1">{{this.code}} : {{this.name}}</div>
            <v-divider class=""></v-divider>
<table style="width:100%;">
        <tr >
          <th class="text-left" > Year:</th>
          <th class="text-center" > 598 </th>
          <th class="text-center" > 608 </th>
          <th class="text-center" > 618 </th>
          <th class="text-center" > 628 </th>
          <th class="text-center" > 638 </th>
          <th class="text-center" > 648 </th>
          <th class="text-center" > 658 </th>
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
        </tr></table>
<v-divider class=""></v-divider>
<v-row>
    <v-col cols="6"><h6>Instructor list: </h6> 
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
    <v-divider class=""></v-divider>


        


    </div>
</template>
<script>
export default {
    name:"Class_info",
    props: ["name","code"],
    component:[],
    data(){
        return
    }
}
</script>
<style scoped>
table,th,tr,td{
    border: 1px solid black;
      padding: 5px;
}
</style>
