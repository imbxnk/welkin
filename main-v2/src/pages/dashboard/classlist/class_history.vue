<template>
<v-main>
    <div>
        <h4>this is class history page</h4>
        <v-btn @click="$router.push('/class')">back to class list</v-btn>
    </div></v-main>
</template>
<script>
export default {
    name:"class_history",
}
</script>