<template>
  <div class="container">
    <form @submit.prevent='handleSubmit'>
        <h4>Login</h4>
        <div class="form-group">
            <label>Username</label>
            <input type="username" class="form-control" v-model='username' placeholder="Username"/> 
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type='password' class="form-control" v-model='password' placeholder="Password"/>
        </div>
        <button class="btn btn-primary btn-block">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            username: '',
            password: '',
        }
    },
    methods: {
        async handleSubmit(){
            const response = await axios.post('https://api.welkin.app/v2/graphql', {
                query : `
                    mutation {
                        login ( username : "phattharaporn.roe", password : "phatphat") {
                            token
                            userId
                            message
                        }
                    }
                `
            })
            console.log(response)
        }
    },
}
</script>

<style>

</style>