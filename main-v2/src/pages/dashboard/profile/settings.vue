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
      <v-card-text>
        <v-text-field
          label="Current Password"
          type="password"
          outlined
          v-model="userInput.currentPassword"
        ></v-text-field>

        <v-text-field
          label="New Password"
          type="password"
          outlined
          v-model="userInput.newPassword"
        ></v-text-field>

        <v-text-field
          label="Confirm Password"
          type="password"
          outlined
          v-model="userInput.confirmPassword"
        ></v-text-field>

        <v-btn
          depressed
          color="primary"
          @click="updatePassword"
        >
          Submit
        </v-btn>
      </v-card-text>
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
        confirmPassword: ''
      }
    }
  },
  methods: {
    updatePassword() {
      if(this.userInput.newPassword === this.userInput.newPassword){
        let query = `
                      mutation {
                        updatePassword (userInput: { currentPassword: "${this.userInput.currentPassword}", newPassword: "${this.userInput.newPassword}" }) {
                          token,
                          userId,
                          message
                        }
                      }
                  `;
        this.axios
          .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => { });
      }
    },
  },
}
</script>