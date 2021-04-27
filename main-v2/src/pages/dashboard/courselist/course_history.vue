<template>
<v-main>
    <div>
        <h4>this is class history page</h4>
        <v-btn @click="$router.push('/course')">back to course list</v-btn>
    </div></v-main>
</template>
<script>
export default {
    name:"course_history",
}
</script>