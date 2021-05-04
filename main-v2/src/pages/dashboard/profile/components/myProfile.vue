<template>
  <div class="wk-profile">
    <v-card-title>
      Profile
    </v-card-title>
    <v-card-text>
      <v-img v-if="$currentUser.avatar_url" max-width="200" :src="$currentUser.avatar_url"></v-img>
      <v-img v-else max-width="200" src="https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png"></v-img>
      {{ $currentUser.given_name + " " + $currentUser.family_name }}<br>
      {{ $currentUser.display_name }}<br>
      {{ $currentUser.email }}<br>
      {{ $currentUser.group }}<br>
    </v-card-text>
  </div>
</template>

<script>
export default {
  name: 'MyProfile',
  data() {
    return {
    }
  },
  methods: {
  },
}
</script>