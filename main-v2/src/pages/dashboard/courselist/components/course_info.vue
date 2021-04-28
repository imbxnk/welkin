<template>
    <div class="wk-detail">
        <!-- <a  @click="$router.push('/class_history')">class history</a> -->
        <div class="float-right overline primary--text"><a  @click="$router.push(`/course/${code.toLowerCase()}`)">Course History</a></div>
        <div class="overline my-n1">{{ code }} : {{ course.name }}</div>
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
    <div v-for="batch in Object.keys(batches)" :key="batch">
        Remain [{{ batch }}]: {{ batches[batch].total - batches[batch].passed }}/{{ batches[batch].total }} students
    </div>
    <v-divider></v-divider>
    </div>
</template>
<script>
export default {
    name:"Class_info",
    props: ["name","code"],
    component:[],
    created() {
        this.loadCourse(this.$props.code)
    },
    data(){
        return {
            course: {},
            batches: {},
            queryBatches: ["59", "60", "61", "63"],
        }
    },
    watch: {
        code: function(current) {
            this.loadCourse(current)
        }
    },
    methods: {
        loadCourse(code) {
            // ALGORITHM TO CREATE QUERY
            var queryStr = `
                course (searchInput: { code: "${code}" }) {
                        _id
                        name
                        category
                        description
                        credit_description {
                        lab
                        lecture
                        self_study
                        }
                        credit
                    }
            `;
            this.queryBatches.forEach((batch) => {
                queryStr += `batch${batch}:countStudent(course_code: "${code}", batch: "${batch}") { total }
                            total${batch}:students (searchInput: { batch : "${batch}"}) { total }
                            `;
            });
            let query = `
                query {
                    ${queryStr}
                }
            `;
            this.axios
                .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
                .then((res) => {
                    this.course = res.data.data.course
                    delete res.data.data.course
                    var result = { ...res.data.data }
                    for (const i in result) {
                        if(i.startsWith("batch"))
                            this.batches[i.replace(/\D/g, "")] = { ...this.batches[i.replace(/\D/g, "")], passed: result[i].total }
                        else if (i.startsWith("total"))
                            this.batches[i.replace(/\D/g, "")] = { ...this.batches[i.replace(/\D/g, "")], total: result[i].total }
                    }
                })
                .catch((err) => {})

        }
    },
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
