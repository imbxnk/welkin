<template>
    <div id="app">
        <h5>Test API Calling</h5>
        <ul v-for="student in students" v-bind:key="student">
            <li>{{student.sid}} {{student.first_name}} {{student.last_name}}</li>
        </ul>
    </div>
</template>

<script>

// const authAxios = axios.create({
//     baseURL : apiUrl,
//     withCredentials : true
// })
export default {
    name : 'Student',
    data () {
        return {
            students: []
        }
    },
    mounted() {
        this.loadStudents();
    },
    methods: {
        loadStudents : function() {
            const apiUrl = 'https://api.welkin.app/v1';
            this.axios.get(`${apiUrl}/students`)
                .then((res) => {
                    var result = JSON.parse(JSON.stringify(res.data))
                    this.students = result.data
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    },
}
</script>