<template>
    <v-app>
        <v-tabs v-model="tab">
            <v-tab v-for="item in items" :key="item.title" link :to="item.href">{{item.title}}</v-tab>
        </v-tabs> 
        <router-link :to="{ name: 'pasted_course'}"></router-link>
        <router-link :to="{ name: 'remain_course'}"></router-link>
        <router-view></router-view>
    </v-app>
</template>


<script>
export default {
    data: () => ({
        tab: null,
        items: [{
            title: "pastedcourse",
            href: "/course/pastedcourse"
        },{
            title: "remaincourse",
            href: "/course/remaincourse"
        }]
    })
}
</script>