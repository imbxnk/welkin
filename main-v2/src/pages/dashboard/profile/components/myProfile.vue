<template>

  <div class="wk-profile">
    <div class="wk-profile-wrapper">
      <div class="wk-profile-cover"></div>
      <div class="wk-profile-name">
        <div class="wk-profile-img">
          <v-img class="rounded-circle" v-if="$currentUser.avatar_url" max-width="186" :src="$currentUser.avatar_url"></v-img>
          <v-img class="rounded-circle" v-else max-width="186" src="https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png"></v-img>
        </div>
        <div class="d-flex px-4 justify-content-center flex-column flex-sm-row" style="margin-top: 10px">
          <span class="wk-full-name d-flex justify-content-center text-center">{{ $currentUser.given_name + " " + $currentUser.family_name }}</span>
          <span class="wk-display-name d-flex justify-content-center text-center" v-if="$currentUser.display_name">({{ $currentUser.display_name }})</span>
        </div>
        <!-- <div class="d-flex px-4 justify-content-center mt-sm-0 mt-4">
          <span class="wk-badge wk-primary-color">{{ $currentUser.group }}</span>
          <span class="wk-badge wk-grey-color" v-if="$currentUser.isAdvisor">Advisor</span>
        </div> -->
      </div>
      <v-divider class="mx-4" style="opacity:0.35"></v-divider>
      <!-- <div class="d-flex p-0 px-4 flex-grow-1 justify-content-center wk-information mx-auto mb-4 flex-column"> -->
      <div class="p-0 px-4 wk-information mx-auto mb-4 row mt-4">
        <!-- Email -->
        <div class="wk-profile-content col-12 col-md-6">
          <div class="icon flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#8e959f" class="bi bi-envelope" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
            </svg>
          </div>
          <div class="d-flex flex-column wk-profile-detail">
            <span>{{ $currentUser.email }}</span>
            <label>Email</label>
          </div>
        </div>

        <!-- Group -->
        <div class="wk-profile-content col-12 col-md-6">
          <div class="icon flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#8e959f" class="bi bi-person-check-fill" viewBox="0 0 16 16">
              <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z"/>
            </svg>
          </div>
          <div class="d-flex flex-column wk-profile-detail">
            <span style="text-transform: capitalize">{{ $currentUser.group }} <span v-if="$currentUser.isAdvisor">(Advisor)</span></span>
            <label>Group</label>
          </div>
        </div>
        <!-- Instructor -->
        <div class="wk-profile-content col-12 col-md-6" v-if="$currentUser.linked_instructor">
          <div class="icon flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#8e959f" class="bi bi-person-check-fill" viewBox="0 0 16 16">
              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
            </svg>
          </div>
          <div class="d-flex flex-column wk-profile-detail">
            <span style="text-transform: capitalize">{{ $currentUser.linked_instructor.title }} {{ $currentUser.linked_instructor.name }}</span>
            <label>Linked Instructor</label>
          </div>
        </div>

        <!-- Created At -->
        <div class="wk-profile-content col-12 col-md-6">
          <div class="icon flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#8e959f" class="bi bi-person-check-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
              <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            </svg>
          </div>
          <div class="d-flex flex-column wk-profile-detail">
            <span>{{ readableDate($currentUser.createdAt) }}</span>
            <label>Date of Creation</label>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'MyProfile',
  mounted() {
    console.log(this.$currentUser)
  },
  data() {
    return {
    }
  },
  methods: {
    readableDate(date) {
      return this.moment(parseInt(date)).format("DD MMMM YYYY")
    }
  },
}
</script>