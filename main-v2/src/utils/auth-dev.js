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
  },

  auth: async function() {
    let query = `
      query {
        me { username given_name family_name group email avatar_url }
      }
    `

    const currentUser = await axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, {
      // for developing
      headers: {
        Cookies: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDBlY2VkOTE5Zjc4MTUxZGM3MjI5OCIsImlhdCI6MTYxNjkxODU5OCwiZXhwIjoxNjE2OTIyMTk4fQ.Iazk_1VGQnL5pwNYiuVSId57mGIOibOn6_PtZ5pbtp8"
      },
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
  }
}