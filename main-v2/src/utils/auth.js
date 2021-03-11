import axios from "axios";

export default{
  getUser: async function() {
    let query = `
      query {
        me { username given_name family_name group email avatar_url }
      }
    `
    return await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
      .catch(()=> {
        return null;
      });
  }
}