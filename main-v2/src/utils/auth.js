import axios from "axios";

export default{
  getUser: async function() {
    let query = `
      query {
        me { display_name username given_name family_name group isAdvisor email avatar { small medium large } createdAt linked_instructor { _id title name given_name family_name } }
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
        me { display_name username given_name family_name group isAdvisor email avatar { small medium large } createdAt linked_instructor { _id title name given_name family_name } }
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
  },

  config: async function() {
    let query = `
      query {
        config {
          selectedBatches
          defaultAvatar
          announcements { content user { display_name username } createdAt startDate endDate }
        }
      }
    `

    const current = await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, {
      withCredentials: true
    })
      .then((res) => {
        return res.data.data.config
      })
      .catch(()=> {
        return undefined
      });

    return { current }
  }
}