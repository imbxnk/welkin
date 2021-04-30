<template>
  <div>
  <v-card-title>
    Security
  </v-card-title>
  <v-card-text>
    <div class="d-flex flex-column">
      <div>
        <h6 class="mt-2">Change Password</h6>
      </div>
      <div class="flex-grow-1">
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
          :disabled="userInput.currentPassword === '' || userInput.newPassword === '' || userInput.confirmPassword === ''"
        >
          Submit
        </v-btn>
      </div>
    </div>
  </v-card-text>
  </div>
</template>

<script>
export default {
  name: 'ChangePassword',
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