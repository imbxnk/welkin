import axios from "axios";

// For Development Only
const headers = {
  Cookies: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDkyMTE1NjVjNzgxMzQ3MGJlOTgxZCIsImlhdCI6MTYyMjgwNTYzMCwiZXhwIjoxNjI1Mzk3NjMwfQ.9aQlessuyBelIdkAGzQ5XX7o-85rZwtMBW76dminlTI"
}

export default{
  getUser: async function() {
    let query = `
      query {
        me { display_name username given_name family_name group isAdvisor email avatar { small medium large } createdAt linked_instructor { _id title name given_name family_name } }
      }
    `
    return await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { headers })
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
      // for developing
      headers
      // for production
      // withCredentials: true
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
          announcements { _id title content user { display_name username } createdAt startDate endDate }
          current { trimester year }
        }
      }
    `

    const current = await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, {
      // for developing
      headers
      // for production
      // withCredentials: true
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