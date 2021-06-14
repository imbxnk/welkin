<template>
  <v-row v-resize="onResize">
    <!-- 1st column -->
    <v-col class="wk-left-col" cols="12" md="6" :class="{ hide: !isHidden }">
      <v-card class="mt-3">
        <v-card-title class="text-uppercase pt-7 primary--text"
          ><a @click="$router.back()"> &lt; {{ $route.params.code }} </a></v-card-title
        >
        <div v-if="loading">
          <v-progress-circular
            :size="50"
            class="loading-center  "
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <v-list class="px-3 pb-3">
          <simplebar data-simplebar-auto-hide="true" class="wk-content-full-height-list">
            <div v-if="!loading && this.classes.length == 0" class="mx-2" style="color: #b4b4b4">
              No record
            </div>
            <v-list-item-group
              v-else
              v-model="selected"
              style="margin-top:15px;"
              active-class="primary--text"
            >
              <template v-for="(item, index) in classes">
                <v-list-item
                  :key="item.title"
                  @click="sentData(item._id)"
                  class="my-n4"
                  :class="{ even: index % 2, odd: !(index % 2) }"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.year + 'T' + item.trimester + ' SEC' + item.section"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      >{{ item.instructor.title }} {{ item.instructor.name }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <!-- <v-list-item-action-text v-text="item.action"></v-list-item-action-text> -->
                  </v-list-item-action>
                </v-list-item>
                <!-- <v-divider v-if="index < items.length - 1" :key="index"></v-divider> -->
                <v-divider v-if="index !== classes.length - 1" :key="index" class=""></v-divider>
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
            select the course to see more detail
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
          <studentTable class="ma-1" :classID="this.classID"></studentTable>
        </simplebar>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import studentTable from "./components/student_info.vue";
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";

export default {
  name: "course_detail",
  components: {
    studentTable,
    simplebar,
  },
  created() {
    this.loadClasses();
  },
  mounted() {
    this.onResize();
  },
  data() {
    return {
      loading: true,
      status: false,
      selected: false,
      classes: [],
      classID: "",
      isHidden: true,
      windowSize: {
        x: 0,
        y: 0,
      },
      class_detail: [],
    };
  },
  methods: {
    sentData(item) {
      this.status = true;
      this.isHidden = false;
      this.selected = true;
      return (this.classID = item);
    },
    loadClasses() {
      let query = `
                    {
                      classes (searchInput: { course_code: "${this.$route.params.code}" }) {
                        total
                        classes {
                          _id
                          course {
                            code
                            name
                            description
                          }
                          section
                          instructor {
                            title
                            name
                            email
                          }
                          trimester
                          year
                        }
                      }
                    }
                `;
      query = query.replace(/\s+/g, " ").trim();
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.classes = res.data.data.classes.classes;
          this.loading = false;
        })
        .catch((err) => {});
    },
    onResize() {
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
  height: calc(var(--app-height) - 106px);
  overflow-y: auto;
  overflow-x: hidden;
}
.wk-content-full-height-list {
  height: calc(var(--app-height) - 189px);
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

.wk-left-col {
  padding: 0 8px 0 0;
}

.wk-right-col {
  padding: 0 0 0 8px;
}

@media (max-width: 576px) {
  .wk-content-full-height-list {
    height: calc(var(--app-height) - 237px);
  }
}

@media (max-width: 1200px) {
  .v-list-item__title {
    font-size: 0.9rem !important;
  }
}

@media (max-width: 768px) {
  .wk-left-col {
    padding: 0px 32px 0 0;
    position: absolute;
    top: 16px;
    width: 100%;
    opacity: 1;
    transition: visibility 0s, opacity 0.2s linear;
  }

  .wk-right-col {
    padding: 0px 32px 0 0;
    position: absolute;
    top: 16px;
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
.small--text {
  font-size: 1rem;
  font-weight: lighter;
  width: 100%;
  text-align: center;
  flex-grow: 1;
}
.back svg {
  margin-top: -3px;
}

.even {
  background: #faf9f9;
}
.odd {
  background: #fff;
}
.loading-center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
