<template>
  <v-row v-resize="onResize">
    <!-- 1st column -->
    <v-col class="wk-left-col" cols="12" md="6" :class="{ hide: !isHidden }">
      <v-card class="mt-3">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card-title class="pt-4 mb-n10"
              >Course List
              <v-tooltip
                v-if="
                  this.$currentUser.group == 'coordinator' ||
                    this.$currentUser.group == 'program director' ||
                    this.$currentUser.group == 'admin'
                "
                bottom
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    v-bind="attrs"
                    v-on="on"
                    class="ml-1"
                    @click="$router.push({ name: 'course_overall' })"
                    ><v-icon dark>
                      mdi-information
                    </v-icon></v-btn
                  ></template
                ><span>see overall</span></v-tooltip
              ></v-card-title
            ></v-col
          ><v-col class="mx-4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              type="text"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- <v-btn
          x-small
          class="mx-3 justify-end"
          color="primary"
          v-if="
            this.$currentUser.group == 'coordinator' ||
              this.$currentUser.group == 'program director' ||
              this.$currentUser.group == 'admin'
          "
          @click="$router.push(`/course_overall`)"
        >
          Overall Student Registration
        </v-btn> -->

        <v-list class="pa-3">
          <simplebar
            v-if="loading"
            data-simplebar-auto-hide="true"
            class="wk-content-full-height-list"
          >
            <v-progress-circular
              :size="50"
              class="loading-center  "
              color="primary"
              indeterminate
            ></v-progress-circular
          ></simplebar>
          <simplebar v-else data-simplebar-auto-hide="true" class="wk-content-full-height-list">
            <v-list-item-group
              v-model="selected"
              style="margin-top:15px;"
              active-class="primary--text"
            >
              <template v-for="(item, index) in filterItems">
                <v-list-item
                  :key="item.title"
                  @click="showdata(item)"
                  :class="{ even: index % 2, odd: !(index % 2) }"
                  class="my-n4"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.code + ': ' + item.name"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action> </v-list-item-action>
                </v-list-item>
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
          <CourseInfo :curriculums="this.curriculums" :code="this.course.code"></CourseInfo>
        </simplebar>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import CourseInfo from "./components/course_info.vue";
import simplebar from "simplebar-vue";
// import OverallRemain from "./components/overall_remain.vue";
import "simplebar/dist/simplebar.min.css";

export default {
  name: "Course_list",
  components: {
    CourseInfo,
    simplebar,
    // OverallRemain,
  },
  mounted() {
    this.getClasses();
    this.onResize();
  },
  computed: {
    filterItems: function() {
      return this.items.filter((item) => {
        return (
          item.name.toLowerCase().match(this.search.toLowerCase()) ||
          item.code.toLowerCase().match(this.search.toLowerCase())
        );
      });
    },
  },
  data() {
    return {
      selected: [2],
      course: {},
      status: false,
      loading: true,
      items: [],
      search: "",
      isHidden: true,
      curriculums: [],
      windowSize: {
        x: 0,
        y: 0,
      },
      // items: [
      //   {
      //     headline: "",
      //     title: "EGCI100: Introduction to Computer Engineering",
      //     course: {
      //       message: "",
      //     },
      //   },
      //   {
      //     headline: "bnk",
      //     title: "EGCI101: Introduction to Computer Programming",
      //     course: {
      //       message: "",
      //     },
      //   },
      // ],
    };
  },
  methods: {
    showdata(item) {
      this.status = true;
      this.isHidden = false;
      return (this.course = item);
    },
    getClasses() {
      let query = `
              {
              courses {
                total
                courses {
                  name
                  code
                }
              }
              curriculums {
                total
                curriculums {
                  batches
                  courses {
                    core_courses {
                      code
                    }
                    required_courses {
                      code
                    }
                    elective_courses {
                      code
                    }
                  }
                }
              }
            }
          `;
      query = query.replace(/\s+/g, " ").trim();
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.items = [...res.data.data.courses.courses];
          this.curriculums = [...res.data.data.curriculums.curriculums];
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
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
  height: calc(var(--app-height) - 107px);
  /* height: var(--app-height); */
  /* height: auto; */
  overflow: auto;
}
.wk-content-full-height-list {
  height: calc(var(--app-height) - 189px);
  /* height: var(--app-height); */
  /* height: auto; */
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

@media (max-width: 767px) {
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
.even {
  background: #faf9f9;
}
.odd {
  background: #fff;
}
</style>
