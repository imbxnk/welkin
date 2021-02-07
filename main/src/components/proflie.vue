<template>
  <v-row>
    <v-col cols="12" sm="6" md="4" lg="2">
      <v-card class="pa-3" height="200">
        <v-img max-width="200" src="https://picsum.photos/id/11/500/300"></v-img>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="8" lg="10">
      <v-card class="pa-3" height="200">
        <div class="overline mb-4">
          Profile
        </div>
        <v-list-item-title class="headline mb-1">
          {{ user.fullName }}
        </v-list-item-title>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "profile",
  components: {},
  computed: {},
  data: () => ({
    user: {
      initials: "MS",
      fullName: "Mingmanas Sivaraksa",
      email: "Mingmanas.siv@mahidol.com",
    },
  }),

  methods: {},
};
</script>
