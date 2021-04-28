<template>
  <div class="wk-detail">
    <div class="overline my-n1">{{ name }}</div>
    <div class="caption">
      This curriculum is for students with ID {{ batches.toString() }} only.
    </div>
    <v-divider style="margin-top: 0.5rem !important"></v-divider>
  </div>
</template>
<script>
export default {
  name: "Curriculum_Detail",
  props: ["name", "batches"],
  component: [],
  data() {
    return {};
  },
};
</script>
<style scoped>
table,
th,
tr,
td {
  border: 1px solid rgba(139, 139, 139, 0.2);
  padding: 5px;
}
.wk-detail {
  width: 100%;
  overflow-x: hidden;
}

.caption {
  color: #666;
}
</style>
