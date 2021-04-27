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
                <v-list-item :key="item.title" @click="showData(item)" class="my-n4">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
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
    <v-col class="wk-right-col" cols="12" md="6" :class="{ hide: isHidden }">
      <v-card v-if="!status" class="pa-3 box">
        <simplebar data-simplebar-auto-hide="true" class="wk-content-full-height">
          <div class="center grey--text small--text">
            <div class="logo-watermark"></div>
            select the curriculum to see more detail
          </div>
        </simplebar>
      </v-card>
      <v-card v-else class="pa-3">
        <simplebar data-simplebar-auto-hide="true" class="wk-content-full-height">
          <a v-if="windowSize.x < 768" @click="back" class="overline my-n1 back primary--text"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
            BACK</a
          >
          <CurriculumDetail
            :name="this.detail.name"
            :batches="this.detail.batches"
          ></CurriculumDetail>
        </simplebar>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import simplebar from "simplebar-vue";
import CurriculumDetail from "./components/curriculum_detail";
import "simplebar/dist/simplebar.min.css";

export default {
  name: "Curriculum",
  components: {
    simplebar,
    CurriculumDetail,
  },
  mounted() {
    this.getCurriculums();
    this.onResize();
  },
  data() {
    return {
      selected: [],
      items: [],
      detail: [],
      status: false,
      isHidden: true,
      windowSize: {
        x: 0,
        y: 0,
      },
    };
  },
  methods: {
    showData(item) {
      this.status = true;
      this.isHidden = false;
      this.detail = item;
      console.log(this.detail);
    },
    getCurriculums() {
      let query = `
              query {
                curriculums {
                  total
                  curriculums {
                    _id
                    name
                    batches
                  }
                }
              }
          `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.items = [...res.data.data.curriculums.curriculums];
          this.loading = false;
          console.log(this.items);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onResize() {
      console.log("text");
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
    back() {
      this.isHidden = true;
      this.status = false;
    },
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

.wk-left-col {
  padding: 0 8px 0 0;
}

.wk-right-col {
  padding: 0 0 0 8px;
}

@media (max-width: 768px) {
  .wk-left-col {
    padding: 0px;
    position: absolute;
    top: 16px;
    max-width: calc(100vw - 56px - 32px);
    width: 100%;
    opacity: 1;
    transition: visibility 0s, opacity 0.2s linear;
  }

  .wk-right-col {
    padding: 0px;
    position: absolute;
    top: 16px;
    max-width: calc(100vw - 56px - 32px);
    width: 100%;
    opacity: 1;
    transition: visibility 0s, opacity 0.2s linear;
  }

  .hide {
    z-index: -1;
    visibility: hidden;
    opacity: 0 !important;
  }
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
.loading-center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.back svg {
  margin-top: -3px;
}
</style>
