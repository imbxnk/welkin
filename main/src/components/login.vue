<template>
  <div>
    <form @submit.prevent="handleSubmit()">
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
    <div>
        <ul></ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
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
            await axios.post("https://api.welkin.app/v2/graphql",{
                        query: `
                            mutation {
                                login ( username : "${this.username}" , password : "${this.password}") {
                                    token
                                    userId
                                    message
                                }
                                }
                        `
                    }  
                )
                // If axios success. let this.token this.userId this.message 
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err.message)
                    })
        }
    },
}
</script>

<style>

</style>