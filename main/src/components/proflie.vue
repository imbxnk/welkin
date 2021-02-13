<template>
  <v-row>
    <v-col cols="12" sm="6" md="4" lg="4" align="center">
      <v-card class="pa-3 ">
        <v-img max-width="200" src="https://picsum.photos/id/11/500/300"></v-img>
        <div class="overline text-center">{{ user.role }}</div>
      </v-card>
    </v-col>
    <v-col cols="12" sm="10" md="8" lg="8">
      <v-card class="pa-3">
        <div class="overline mb-4">
          Profile
        </div>
        <v-list-item-title class="h3 mb-1">
          {{ user.fullName }}
        </v-list-item-title>
        <v-divider class="pb-3"></v-divider>
        <!-- <v-list-item-title class="mb-1"> Email: {{ user.email }} </v-list-item-title> -->
        <v-row>
          <v-col cols="3" sm="4" md="2" lg="2" class="overline"><p>Email</p></v-col>
          <v-col class="my-1"
            ><p>{{ user.email }}</p></v-col
          >
        </v-row>
        <v-divider class="pb-3"></v-divider>
        <v-row>
          <v-col cols="3" sm="4" md="2" lg="2" class="overline"><p>Line Id</p></v-col>
          <v-col class="my-1"><p>{{}}</p></v-col>
        </v-row>
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
      role: "Advisor",
    },
  }),

  methods: {},
};
</script>
