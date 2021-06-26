import axios from 'axios';

const options = {};

options.baseURL = process.env.VUE_APP_GRAPHQL_URL;

if(process.env.VUE_APP_MODE == 'development')
  options.headers = {
    Cookies: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDkyMTE1NjVjNzgxMzQ3MGJlOTgxZCIsImlhdCI6MTYyMzM5NjI2MywiZXhwIjoxNjI1OTg4MjYzfQ.6-i0UqRmwRYPbIemFdSpLVIdD09J_-lh5NDuxOpPMHA"
  }

const service = axios.create(options);

export default service