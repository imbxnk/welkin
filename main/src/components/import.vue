<template>
  <v-app>
    <v-tabs v-model="tab">
      <v-tab v-for="item in items" :key="item.title" link :to='item.href'>{{item.title}}</v-tab>
    </v-tabs>

    <router-link :to="{ name: 'add_new_student'}"></router-link>
    <router-link :to="{ name: 'import_file'}"></router-link>
    <router-view></router-view>
    
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      items: [{
          title: "Addnewstudent",
          href: "/manage/addnewstudent"
        },
        {
          title: "Import",
          href: "/manage/importfile"
        }
      ],
      tab: null,
    })
  }
</script>