<template>
  <div class="wk-account">
    <v-card-title style="font-weight: 700 !important">
      Account Settings
    </v-card-title>
    <v-card-text>
      <div class="my-4">
        <div class="d-flex align-items-center">
          <div class="me-4">
            <v-avatar v-if="$currentUser.avatar_url" size="75">
              <img :src="$currentUser.avatar_url" />
            </v-avatar>
          </div>
          <div class="d-flex flex-column">
            <div class="wk-name" v-if="$currentUser.display_name"><h5>{{ $currentUser.display_name }}</h5></div>
            <div class="wk-name" v-else><h5>{{ $currentUser.given_name + " " + $currentUser.family_name }}</h5></div>
            <div class="d-inline-block">
              <span class="wk-badge wk-group-badge">{{ $currentUser.group }}</span>
              <span class="wk-badge wk-advisor-badge" v-if="$currentUser.isAdvisor">Advisor</span>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex wk-account-form d-flex flex-column">
        <div class="mb-3">
          <label class="form-label">Display name</label>
          <input class="form-control" type="text" v-model="user.display_name" placeholder="">
        </div>
        <div class="mb-3 row">
          <div class="col col-12 col-md-6">
            <label class="form-label">Given name</label>
            <input class="form-control" style="text-transform:capitalize" type="text" v-model="user.given_name" required placeholder="">
          </div>
          <div class="col col-12 col-md-6">
            <label class="form-label">Family name</label>
            <input class="form-control" style="text-transform:uppercase" required type="text" v-model="user.family_name" placeholder="">
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <div class="ms-3">{{ $currentUser.email }}</div>
        </div>
        <div class="d-flex align-items-end flex-column">
          <button type="submit" @click="updateAccount" class="btn btn-primary wk-group-badge">Save Changes</button>
        </div>
      </div>
    </v-card-text>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        display_name: this.$currentUser.display_name,
        given_name: this.$currentUser.given_name,
        family_name: this.$currentUser.family_name,
      }
    }
  },
  methods: {
    updateAccount() {
      let query = `mutation {
                    updateMyAccount(userInput: {
                      display_name: "${this.user.display_name}",
                      given_name: "${this.user.given_name}",
                      family_name: "${this.user.family_name}"
                    }) {
                      success
                      message
                    }
                  }`
      this.axios
          .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
          .then((res) => {
            console.log(res);
            if(res.data.success) {
              this.$currentUser.display_name = this.user.display_name
              this.$currentUser.given_name = this.user.given_name
              this.$currentUser.family_name = this.user.family_name
            }
          })
          .catch((err) => { });
    }
  },
}
</script>
<style scoped>
.wk-name h5{
  font-weight: 600;
  margin-bottom: 5px;
  cursor: default;
}
.wk-badge {
  padding: 2px 10px;
  border-radius: 30px;
  display: inline-block;
  text-align: center;
  vertical-align: baseline;
  white-space: nowrap;
  text-transform: capitalize;
  margin-right: 5px;
  font-size: 0.8rem;
  cursor: default;
}

.wk-group-badge {
  background: #1976d2;
  color: #fff;
}

.wk-advisor-badge {
  background: #f8f9fa;
  color: #212529;
}

.wk-account-form {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px 10px;
}

input, button {
  box-shadow: none !important;
}
</style>