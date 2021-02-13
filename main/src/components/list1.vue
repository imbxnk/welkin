<template>
  <v-card class="pa-4">
    <div class="overline my-n1">current students</div>
    <div class="h3 text-right totaltxt mr-3">{{ 100 }}</div>

    <!-- <div style="display: flex; line-height: 40px; vertical-align: middle">
      <div>current students</div>
      <h3 class="text-right">{{ 100 }}</h3>
    </div> -->
    <v-divider class="mb-1"></v-divider>
    <v-list>
      <v-list-item>
        <v-list-item-content>598xxxx:</v-list-item-content>
        <v-list-item-content>
          <div class="text-right totaltxt">25</div>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>608xxxx:</v-list-item-content>
        <v-list-item-content>
          <div class="text-right totaltxt">25</div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>618xxxx:</v-list-item-content>
        <v-list-item-content>
          <div class="text-right totaltxt">25</div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>628xxxx:</v-list-item-content>
        <v-list-item-content>
          <div class="text-right totaltxt">25</div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.totaltxt {
  color: #3c84fb;
}
</style>
