import axios from "axios";

// For Development Only
const headers = {
  // Cookies: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNzQ4ZmI3NDY4ZTczNmE5NjZhMGJiYiIsImlhdCI6MTYyMzQzMDgzNSwiZXhwIjoxNjI2MDIyODM1fQ.0fxiMMkygPNnIoQghZ2uGsy1Puqwfb6TQpHL8dR0s6c"
  Cookies: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDkyMTE1NjVjNzgxMzQ3MGJlOTgxZCIsImlhdCI6MTYyMzM5NjI2MywiZXhwIjoxNjI1OTg4MjYzfQ.6-i0UqRmwRYPbIemFdSpLVIdD09J_-lh5NDuxOpPMHA"
}

export default{
  getUser: async function() {
    let query = `
      {
        me { _id display_name username given_name family_name group isAdvisor email isActive avatar { small medium large } createdAt linked_instructor { _id title name given_name family_name } }
      }
    `
    query = query.replace(/\s+/g, ' ').trim()
    return await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { headers })
      .catch(()=> {
        return null;
      });
  },

  auth: async function() {
    let query = `
      {
        me { _id display_name username given_name family_name group isAdvisor email isActive avatar { small medium large } createdAt linked_instructor { _id title name given_name family_name } }
      }
    `
    query = query.replace(/\s+/g, ' ').trim()
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
      {
        config {
          selectedBatches
          defaultAvatar
          announcements { _id title content user { display_name username } createdAt startDate endDate }
          current { trimester year }
        }
      }
    `
    query = query.replace(/\s+/g, ' ').trim()
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