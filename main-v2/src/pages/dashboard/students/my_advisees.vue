<template>
  <div id="app">
    My Advisees
    <div v-if="advisees.length == 0 && !isLoading">You have no advisees</div>
    <div v-else-if="!isLoading">{{ advisees }}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      advisees: [],
      isLoading: true,
    }
  },
  mounted() {
    this.getMyAdvisees()
  },
  methods: {
    getMyAdvisees() {
      let query = `
          query {
            students (searchInput: { advisor: "${this.$currentUser.linked_instructor._id}"}) {
              advisees:students {
                sid
                prefix
                given_name
                family_name
                email
                nick_name
                entry_trimester
                entry_year
                avatar_url
                batch
              }
              total
            }
          }
      `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.isLoading = false
          this.advisees = res.data.data.students.advisees
        })
        .catch((err) => {
          this.isLoading = false
        });
    }
  },
}
</script>