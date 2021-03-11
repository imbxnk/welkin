<template>
  <v-main>
    <v-card style="width: 600px; margin: 20px auto">
      <form @submit.prevent="handleSubmit()" style="padding: 30px">
          <h4>Login</h4>
          <div class="form-group">
              <label>Username</label>
              <input class="form-control" v-model='username' placeholder="Username"/>
          </div>
          <div class="form-group">
              <label>Password</label>
              <input type="password" class="form-control" v-model='password' placeholder="Password"/>
          </div>
          <button class="btn btn-primary btn-block">Login</button>
      </form>
    </v-card>
  </v-main>
</template>

<script>
export default {
    data(){
        return{
                username: "",
                password: "",
                token: "",
                userId: "",
                message: "",
        }
    },
    methods: {
      async handleSubmit(){
          //axios post to check token, userId compare with the username and password
          let query = `
              mutation {
                login ( username : "${this.username}" , password : "${this.password}") {
                  token
                  userId
                  message
                }
              }
          `
          await this.axios
            .post(process.env.VUE_APP_GRAPHQL_URL,{ query }, { withCredentials: true })
            .then(res => {
              console.log(res)
              window.location.replace("/")
            })
            .catch(err => { console.log(err.message)})
      },
    },
}
</script>

<style>

</style>