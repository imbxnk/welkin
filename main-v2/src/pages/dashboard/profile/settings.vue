<template>
  <div>
    <v-row>
      <v-col>
        <v-card-title>
          Settings
        </v-card-title>
      </v-col>
    </v-row>
    <v-card>
    <input type="text" v-model="userInput.currentPassword"/>
    <input type="text" v-model="userInput.newPassword"/>
    <button @click="updatePassword">Submit</button>
    </v-card>
  </div>
</template>

<script>
// import welkin from "../../../utils/auth"
export default {
  data() {
    return {
      userInput: {
        currentPassword: '',
        newPassword: '',
      }
    }
  },
  methods: {
    updatePassword() {
      let query = `
                    mutation {
                      updatePassword (userInput: { currentPassword: "${this.userInput.currentPassword}", newPassword: "${this.userInput.newPassword}" }) {
                        token,
                        userId,
                        message
                      }
                    }
                `;
      console.log(query)
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
}
</script>