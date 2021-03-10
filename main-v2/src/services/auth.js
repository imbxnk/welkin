import axios from "axios";

export default{

  getUser: async function() {
    let query = `
      query {
        me { username }
      }
    `
    return await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
      .catch(()=> {
        return null;
      });
  }
}