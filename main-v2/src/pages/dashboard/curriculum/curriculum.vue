<template>
  <v-row>
    <!-- 1st column -->
    <v-col style="padding: 0 8px 0 0">
      <v-card>
        <v-card-title class="pt-7">EGCI Curriculum</v-card-title>
        <v-list class="pa-3">
          <simplebar data-simplebar-auto-hide="true" class="wk-content-full-height-list">
            <v-list-item-group
              v-model="selected"
              style="margin-top:15px;"
              active-class="primary--text"
            >
              <template v-for="(item, index) in items">
                <v-list-item :key="item.title" @click="showdata(item)" class="my-n4">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.code + ': ' + item.name"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <!-- <v-list-item-action-text v-text="item.action"></v-list-item-action-text> -->
                  </v-list-item-action>
                </v-list-item>
                <!-- <v-divider v-if="index < items.length - 1" :key="index"></v-divider> -->
                <v-divider v-if="index !== items.length - 1" :key="index" class=""></v-divider>
              </template>
            </v-list-item-group>
          </simplebar>
        </v-list>
      </v-card>
    </v-col>
    <!-- 2nd column -->
    <v-col style="padding: 0 0 0 8px">
      <v-card v-if="!status" class="pa-3 box">
        <simplebar data-simplebar-auto-hide="true" class="wk-content-full-height">
          <div class="center grey--text small--text">
            <div class="logo-watermark"></div>
            select the academic year to see more detail
          </div>
        </simplebar>
      </v-card>
      <v-card v-else class="pa-3">
        <simplebar data-simplebar-auto-hide="true" class="wk-content-full-height">
          hi
        </simplebar>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'

export default {
  name: "Curriculum",
  components: {
    simplebar
  },
  data() {
    return {
      selected : [],
      items: [],
      status: false,
    }
  },
};
</script>

<style scoped>
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.wk-content-full-height {
  height: calc(100vh - 110px);
  overflow: auto;
}
.wk-content-full-height-list {
  height: calc(100vh - 186px);
  overflow: auto;
}
.logo-watermark {
  filter: grayscale(100%);
  opacity: 0.25;
  background: url("/img/logo.1fbb96f9.svg") center no-repeat;
  width: auto;
  min-height: 120px;
}
.box {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.small--text {
  font-size: 1rem;
  font-weight: lighter;
  width: 100%;
  text-align: center;
  flex-grow: 1;
}
</style>
