<template>
  <v-dialog v-model="editDialog" fullscreen hide-overlay persistent transition="dialog-bottom-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-icon small v-bind="attrs" v-on="on">
        mdi-pencil
      </v-icon>
    </template>
    <v-card>
      <v-toolbar light color="transparent" flat extended extension-height="60">
        <v-btn icon light @click="editDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Edit Curriculum</v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="d-flex justify-content-end my-4">
          <v-btn
            color="primary"
            @click="updateCurriculum()"
          >Save</v-btn>
        </div>
        <template v-slot:extension>
          <v-tabs
            v-model="tabs"
            grow
          >
            <v-tabs-slider></v-tabs-slider>
            <v-tab
              href="#details"
            >
              Details
            </v-tab>

            <v-tab
              href="#includedcourse"
            >
              Courses
            </v-tab>

          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tabs">
        <v-tab-item value="details">
          <!-- CURRICULUM DETAILS -->
          <v-container class="mt-4">
            <h5>{{ item.name }}</h5>
            <v-subheader class="px-0">Curriculum Details</v-subheader>
            <div class="d-flex flex-column">
              <v-text-field rounded v-model="item.name" label="Name" outlined></v-text-field>
              <v-combobox  v-model="item.batches" :items="item.batches" label="Batches" multiple deletable-chips outlined persistent-hint rounded
                hint="Please add or select eligible batches for this curriculum" height="48" chips></v-combobox>
            </div>
          </v-container>

          <v-divider></v-divider>

          <!-- PASSING CONDITIONS -->
          <v-container>
            <v-subheader class="px-0">Passing Condiitions</v-subheader>
            <div class="d-flex flex-wrap my-4">
              <v-text-field v-model="item.passing_conditions.core_courses" label="Core Credits" class="mx-2" outlined rounded
                pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"></v-text-field>

              <v-text-field v-model="item.passing_conditions.required_courses" label="Major Required Credits" class="mx-2" rounded
                outlined pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"></v-text-field>

              <v-text-field v-model="item.passing_conditions.elective_courses" label="Major Required Credits" class="mx-2" rounded
                outlined pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"></v-text-field>
            </div>
          </v-container>

          <v-divider></v-divider>
          <!-- MILESTONE -->
          <v-container>
            <v-subheader class="px-0">Milestone</v-subheader>
            <div class="d-flex flex-wrap">
              <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                <label>4th Trimester</label>
                <v-text-field v-model="item.trimester_milestone.t4" class="w-100" outlined rounded
                  label="Total credits earned at 4th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                    || (95<event.keyCode && event.keyCode<106)
                                    || (event.keyCode==8) || (event.keyCode==9)
                                    || (event.keyCode>34 && e
                                    vent.keyCode<40)
                                    || (event.keyCode==46) )"></v-text-field>
              </div>

              <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                <label>5th Trimester</label>
                <v-text-field v-model="item.trimester_milestone.t5" class="w-100" outlined rounded
                  label="Total credits earned at 5th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                    || (95<event.keyCode && event.keyCode<106)
                                    || (event.keyCode==8) || (event.keyCode==9)
                                    || (event.keyCode>34 && event.keyCode<40)
                                    || (event.keyCode==46) )"></v-text-field>
              </div>

              <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                <label>6th Trimester</label>
                <v-text-field v-model="item.trimester_milestone.t6" class="w-100" outlined rounded
                  label="Total credits earned at 6th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                    || (95<event.keyCode && event.keyCode<106)
                                    || (event.keyCode==8) || (event.keyCode==9)
                                    || (event.keyCode>34 && event.keyCode<40)
                                    || (event.keyCode==46) )"></v-text-field>
              </div>
              <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                <label>7th Trimester</label>
                <v-text-field v-model="item.trimester_milestone.t7" class="w-100" outlined rounded
                  label="Total credits earned at 7th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                    || (95<event.keyCode && event.keyCode<106)
                                    || (event.keyCode==8) || (event.keyCode==9)
                                    || (event.keyCode>34 && event.keyCode<40)
                                    || (event.keyCode==46) )"></v-text-field>
              </div>
              <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                <label>8th Trimester</label>
                <v-text-field v-model="item.trimester_milestone.t8" class="w-100" outlined rounded
                  label="Total credits earned at 8th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                    || (95<event.keyCode && event.keyCode<106)
                                    || (event.keyCode==8) || (event.keyCode==9)
                                    || (event.keyCode>34 && event.keyCode<40)
                                    || (event.keyCode==46) )"></v-text-field>
              </div>
              <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                <label>9th Trimester</label>
                <v-text-field v-model="item.trimester_milestone.t9" class="w-100" outlined rounded
                  label="Total credits earned at 9th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                    || (95<event.keyCode && event.keyCode<106)
                                    || (event.keyCode==8) || (event.keyCode==9)
                                    || (event.keyCode>34 && event.keyCode<40)
                                    || (event.keyCode==46) )"></v-text-field>
              </div>
              <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                <label>10th Trimester</label>
                <v-text-field v-model="item.trimester_milestone.t10" class="w-100" outlined rounded
                  label="Total credits earned at 10th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                    || (95<event.keyCode && event.keyCode<106)
                                    || (event.keyCode==8) || (event.keyCode==9)
                                    || (event.keyCode>34 && event.keyCode<40)
                                    || (event.keyCode==46) )"></v-text-field>
              </div>
              <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                <label>11th Trimester</label>
                <v-text-field v-model="item.trimester_milestone.t11" class="w-100" outlined rounded
                  label="Total credits earned at 11th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                    || (95<event.keyCode && event.keyCode<106)
                                    || (event.keyCode==8) || (event.keyCode==9)
                                    || (event.keyCode>34 && event.keyCode<40)
                                    || (event.keyCode==46) )"></v-text-field>
              </div>
              <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                <label>12th Trimester</label>
                <v-text-field v-model="item.trimester_milestone.t12" class="w-100" outlined rounded
                  label="Total credits earned at 12th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                    || (95<event.keyCode && event.keyCode<106)
                                    || (event.keyCode==8) || (event.keyCode==9)
                                    || (event.keyCode>34 && event.keyCode<40)
                                    || (event.keyCode==46) )"></v-text-field>
              </div>
            </div>

            <div class="d-flex align-items-center">
              <v-divider></v-divider>
              <div class="flex-shrink-1 justify-content-center mx-4">
                <span class="small">This will affect the performance calculation of students using this curriculum</span>
              </div>
              <v-divider></v-divider>
            </div>

            <div class="d-flex" style="margin-top: 3rem">
              <v-slider class="mx-4" max="12" min="0" label="Threshold of Credits" ticks
                v-model="item.trimester_milestone.gap" thumb-label="always"></v-slider>
            </div>

            <v-divider></v-divider>
            <v-container>
              <div class="d-flex justify-content-center justify-content-sm-end my-4">
                <v-btn
                  color="primary"
                  :class="{'w-100': $vuetify.breakpoint.sm}"
                  height="48"
                  @click="updateCurriculum()"
                >Save Changes</v-btn>
              </div>
            </v-container>
          </v-container>
        </v-tab-item>

        <v-tab-item value="includedcourse">
          <v-container class="mt-4">
            <v-subheader class="px-0">Core Courses</v-subheader>
            <div class="d-flex flex-column w-100 p-1">
              <v-autocomplete
                v-model="item.courses.core_courses"
                :items="availableCourses"
                outlined
                rounded
                label="Course"
                multiple
                :item-text="item => item.code + ' ' + item.name"
                return-object
              ></v-autocomplete>

              <v-data-table
                v-if="item.courses.core_courses.length > 0"
                :headers="headers"
                :items="item.courses.core_courses"
                hide-default-header
                class="elevation-1"
                sort-by.sync="code"
              >
                <template v-slot:[`item.remove`]="{ data }">
                  <v-icon @click="deleteCourses('core', item.courses.core_courses.indexOf(data))">
                    mdi-close-circle
                  </v-icon>
                </template>
              </v-data-table>
            </div>

          </v-container>

          <v-divider></v-divider>

          <v-container>
            <v-subheader class="px-0">Major Required Courses</v-subheader>
            <div class="d-flex flex-column w-100 p-1">
              <v-autocomplete
                v-model="item.courses.required_courses"
                :items="availableCourses"
                outlined
                rounded
                label="Course"
                multiple
                :item-text="item => item.code + ' ' + item.name"
                return-object
              ></v-autocomplete>

              <v-data-table
                v-if="item.courses.required_courses.length > 0"
                :headers="headers"
                :items="item.courses.required_courses"
                hide-default-header
                class="elevation-1"
                sort-by.sync="code"
              >
                <template v-slot:[`item.remove`]="{ data }">
                  <v-icon @click="deleteCourses('required', item.courses.core_courses.indexOf(data))">
                    mdi-close-circle
                  </v-icon>
                </template>
              </v-data-table>
            </div>
          </v-container>

          <v-divider></v-divider>

          <v-container>
            <v-subheader class="px-0">Major Elective Courses</v-subheader>
            <div class="d-flex flex-column w-100 p-1">
              <v-autocomplete
                v-model="item.courses.elective_courses"
                :items="availableCourses"
                outlined
                rounded
                label="Course"
                multiple
                :item-text="item => item.code + ' ' + item.name"
                return-object
              ></v-autocomplete>

              <v-data-table
                v-if="item.courses.elective_courses.length > 0"
                :headers="headers"
                :items="item.courses.elective_courses"
                hide-default-header
                class="elevation-1"
                sort-by.sync="code"
              >
                <template v-slot:[`item.remove`]="{ data }">
                  <v-icon @click="deleteCourses('elective', item.courses.core_courses.indexOf(data))">
                    mdi-close-circle
                  </v-icon>
                </template>
              </v-data-table>
            </div>
          </v-container>
          <v-divider></v-divider>
            <v-container>
              <div class="d-flex justify-content-center justify-content-sm-end my-4">
                <v-btn
                  color="primary"
                  :class="{'w-100': $vuetify.breakpoint.sm}"
                  height="48"
                  @click="updateCurriculum()"
                >Save Changes</v-btn>
              </div>
            </v-container>
        </v-tab-item>
      </v-tabs-items>

    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['item'],
    mounted() {
      this.item.batches.sort()
      this.getCourses()
    },
    data() {
      return {
        tabs: null,
        editDialog: false,
        headers: [
          { text: "Code", sortable: true, value: "code", width: "1%" },
          { text: "Course Name", sortable: false, value: "name", width: "98%" },
          { text: "Remove", sortable: false, value: "remove", width: "1%", align: 'end' },
        ],
        courses: [],
      }
    },
    computed: {
      availableCourses: function() {
        let selectedCourses = [ ...this.item.courses.core_courses, ...this.item.courses.required_courses, ...this.item.courses.elective_courses ]
        return this.courses.filter(this.comparer(selectedCourses))
      }
    },
    methods: {
      comparer(otherArray) {
        return function(current){
          return otherArray.filter(function(other){
            return other.code == current.code
          }).length == 0;
        }
      },
      getCourses() {
        let query = `
              {
                courses {
                  total
                  courses {
                    _id
                    code
                    name
                    description
                    credit
                    credit_description {
                      lecture
                      lab
                      self_study
                    }
                  }
                }
              }
            `;
        query = query.replace(/\s+/g, ' ').trim()
        this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
          .then((res) => {
            this.courses = res.data.data.courses.courses;
          })
          .catch((err) => {
            console.log(err);
          });
      },
      reset() {
        this.editDialog = false
        this.tabs = null

      },
      getCourseIds(courses) {
        let courseIds = []
        courses.forEach((course) => {
          courseIds.push(course._id)
        })
        return courseIds
      },
      updateCurriculum() {
        let query = `
              mutation {
                updateCurriculum(curriculumId: "${this.item._id}",
                  curriculumInput: {
                    name: "${this.item.name}",
                    batches: ${JSON.stringify(this.item.batches)},
                    passing_conditions: {
                      core_courses: ${this.item.passing_conditions.core_courses},
                      required_courses: ${this.item.passing_conditions.required_courses},
                      elective_courses: ${this.item.passing_conditions.elective_courses}
                    },
                    trimester_milestone: {
                      gap: ${~~this.item.trimester_milestone.gap},
                      t4: ${~~this.item.trimester_milestone.t4},
                      t5: ${~~this.item.trimester_milestone.t5},
                      t6: ${~~this.item.trimester_milestone.t6},
                      t7: ${~~this.item.trimester_milestone.t7},
                      t8: ${~~this.item.trimester_milestone.t8},
                      t9: ${~~this.item.trimester_milestone.t9},
                      t10: ${~~this.item.trimester_milestone.t10},
                      t11: ${~~this.item.trimester_milestone.t11},
                      t12: ${~~this.item.trimester_milestone.t12}
                    }
                  }) { _id }

                updateCoreCourses (curriculumId: "${this.item._id}", courseId: ${JSON.stringify(this.getCourseIds(this.item.courses.core_courses))}) { _id }
                updateRequiredCourses (curriculumId: "${this.item._id}", courseId: ${JSON.stringify(this.getCourseIds(this.item.courses.required_courses))}) { _id }
                updateElectiveCourses (curriculumId: "${this.item._id}", courseId: ${JSON.stringify(this.getCourseIds(this.item.courses.elective_courses))}) { _id }
              }
            `;
        query = query.replace(/\s+/g, ' ').trim()
        this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
          .then((res) => {
            this.reset()
            this.$emit('updateCurriculum')
          })
          .catch((err) => {
            console.log(err);
          });
      },
      deleteCourses(type, index) {
        switch(type) {
          case 'core':
            this.item.courses.core_courses.splice(index, 1)
            break
          case 'required':
            this.item.courses.required_courses.splice(index, 1)
            break
          case 'elective':
            this.item.courses.elective_courses.splice(index, 1)
            break
        }
      },
    },
  }
</script>

<style scoped>
  .v-card .v-dialog--fullscreen.v-dialog {
    border-radius: 0px !important;
  }
  a:hover {
    text-decoration: none;
  }
</style>