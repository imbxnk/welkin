import axios from "axios";

export default{
  getUser: async function() {
    let query = `
      query {
        me { display_name username given_name family_name group isAdvisor email avatar_url createdAt linked_instructor { title name given_name family_name } }
      }
    `
    return await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
      .catch(()=> {
        return null;
      });
  },

  auth: async function() {
    let query = `
      query {
        me { display_name username given_name family_name group isAdvisor email avatar_url createdAt linked_instructor { title name given_name family_name } }
      }
    `

    const currentUser = await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, {
      withCredentials: true
    })
      .then((res) => {
        return res.data.data.me
      })
      .catch(()=> {
        return undefined
      });

    return { currentUser }
  }
}