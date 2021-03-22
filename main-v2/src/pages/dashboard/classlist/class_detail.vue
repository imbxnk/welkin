<template>
<v-card>
    <v-card-title class="text-uppercase">{{ course.code }}: {{ course.name }}</v-card-title>
    <v-card-text>
        <v-btn @click="$router.push('/class')">back to class list</v-btn>
    </v-card-text>
</v-card>
</template>
<script>
export default {
    name:"class_detail",
    created() {
      this.loadClass()
    },
    data() {
        return {
            course: {}
        }
    },
    methods: {
        loadClass() {
            let query = `
                    query {
                    courses (searchInput: {code: "${this.$route.params.code}"}) {
                        total
                        courses {
                        name
                        code
                        }
                    }
                    }
                `;
            this.axios
                .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
                .then((res) => {
                    this.course = res.data.data.courses.courses[0]
                    console.log(this.course)
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    },
}
</script>