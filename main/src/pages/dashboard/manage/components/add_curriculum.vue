<template>
  <v-dialog
      v-model="addDialog"
      fullscreen
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon> Add Curriculum</v-btn>
      </template>
      <v-card>
        <v-toolbar
          light
          color="transparent"
          flat
          extended
          extension-height="60"
        >
          <v-btn
            icon
            light
            @click="addDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Add Curriculum</v-toolbar-title>
        </v-toolbar>


        <v-container>
          <v-stepper
            v-model="stepperAdd"
            vertical
            flat
          >
            <v-stepper-step
              :complete="stepperAdd > 1"
              step="1"
            >
              Create A Curriculum
              <small>Fill a curriculum details</small>
            </v-stepper-step>

            <v-stepper-content step="1">
              <!-- CURRICULUM DETAILS -->
              <div class="d-flex flex-column my-4">
                <v-text-field
                  v-model="item.name"
                  label="Name"
                  outlined
                ></v-text-field>
                <v-combobox
                  v-model="item.batches"
                  :items="item.batches"
                  label="Batches"
                  multiple
                  outlined
                  persistent-hint
                  hint="Please add or select eligible batches for this curriculum"
                  height="48"
                  chips
                  deletable-chips
                  pattern="\d*"
                  onkeydown="return ( event.ctrlKey || event.altKey
                            || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                            || (95<event.keyCode && event.keyCode<106)
                            || (event.keyCode==8) || (event.keyCode==9)
                            || (event.keyCode>34 && event.keyCode<40)
                            || (event.keyCode==46) )"
                ></v-combobox>
              </div>
              <div class="d-flex align-items-center justify-content-end">
                <v-btn
                  color="primary"
                  class="my-4 mx-2"
                  @click="stepperAdd = stepperAdd + 1"
                  :disabled="checkStep()"
                >
                  Continue
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-step
              :complete="stepperAdd > 2"
              step="2"
            >
              Passing Conditions
              <small>Fill total required credits for each type of courses</small>
            </v-stepper-step>

            <v-stepper-content step="2">
              <div class="d-flex flex-wrap my-4">
                <v-text-field
                  v-model="item.passing_conditions.core_courses"
                  label="Core Credits"
                  class="mx-2"
                  outlined
                  pattern="\d*"
                  onkeydown="return ( event.ctrlKey || event.altKey
                            || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                            || (95<event.keyCode && event.keyCode<106)
                            || (event.keyCode==8) || (event.keyCode==9)
                            || (event.keyCode>34 && event.keyCode<40)
                            || (event.keyCode==46) )"
                ></v-text-field>

                <v-text-field
                  v-model="item.passing_conditions.required_courses"
                  label="Major Required Credits"
                  class="mx-2"
                  outlined
                  pattern="\d*"
                  onkeydown="return ( event.ctrlKey || event.altKey
                            || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                            || (95<event.keyCode && event.keyCode<106)
                            || (event.keyCode==8) || (event.keyCode==9)
                            || (event.keyCode>34 && event.keyCode<40)
                            || (event.keyCode==46) )"
                ></v-text-field>

                <v-text-field
                  v-model="item.passing_conditions.elective_courses"
                  label="Major Required Credits"
                  class="mx-2"
                  outlined
                  pattern="\d*"
                  onkeydown="return ( event.ctrlKey || event.altKey
                            || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                            || (95<event.keyCode && event.keyCode<106)
                            || (event.keyCode==8) || (event.keyCode==9)
                            || (event.keyCode>34 && event.keyCode<40)
                            || (event.keyCode==46) )"
                ></v-text-field>
              </div>

              <div class="d-flex align-items-center justify-content-between">
                <v-btn
                  text
                  @click="stepperAdd = stepperAdd - 1"
                >
                  Back
                </v-btn>
                <v-btn
                  color="primary"
                  class="my-4 mx-2"
                  @click="stepperAdd = stepperAdd + 1"
                  :disabled="checkStep()"
                >
                  Continue
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-step
              :complete="stepperAdd > 3"
              step="3"
            >
              Milestone
              <small>Fill the credit according to the study plan.</small>
            </v-stepper-step>

            <v-stepper-content step="3">
              <div class="d-flex flex-wrap">
                  <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                    <label>4th Trimester</label>
                    <v-text-field
                      v-model="item.trimester_milestone.t4"
                      class="w-100"
                      outlined
                      label="Total credits earned at 4th trimester"
                      pattern="\d*"
                      onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"
                    ></v-text-field>
                  </div>

                  <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                    <label>5th Trimester</label>
                    <v-text-field
                      v-model="item.trimester_milestone.t5"
                      class="w-100"
                      outlined
                      label="Total credits earned at 5th trimester"
                      pattern="\d*"
                      onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"
                    ></v-text-field>
                  </div>

                  <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                    <label>6th Trimester</label>
                    <v-text-field
                      v-model="item.trimester_milestone.t6"
                      class="w-100"
                      outlined
                      label="Total credits earned at 6th trimester"
                      pattern="\d*"
                      onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"
                    ></v-text-field>
                  </div>
                  <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                    <label>7th Trimester</label>
                    <v-text-field
                      v-model="item.trimester_milestone.t7"
                      class="w-100"
                      outlined
                      label="Total credits earned at 7th trimester"
                      pattern="\d*"
                      onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"
                    ></v-text-field>
                  </div>
                  <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                    <label>8th Trimester</label>
                    <v-text-field
                      v-model="item.trimester_milestone.t8"
                      class="w-100"
                      outlined
                      label="Total credits earned at 8th trimester"
                      pattern="\d*"
                      onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"
                    ></v-text-field>
                  </div>
                  <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                    <label>9th Trimester</label>
                    <v-text-field
                      v-model="item.trimester_milestone.t9"
                      class="w-100"
                      outlined
                      label="Total credits earned at 9th trimester"
                      pattern="\d*"
                      onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"
                    ></v-text-field>
                  </div>
                  <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                    <label>10th Trimester</label>
                    <v-text-field
                      v-model="item.trimester_milestone.t10"
                      class="w-100"
                      outlined
                      label="Total credits earned at 10th trimester"
                      pattern="\d*"
                      onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"
                    ></v-text-field>
                  </div>
                  <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                    <label>11th Trimester</label>
                    <v-text-field
                      v-model="item.trimester_milestone.t11"
                      class="w-100"
                      outlined
                      label="Total credits earned at 11th trimester"
                      pattern="\d*"
                      onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"
                    ></v-text-field>
                  </div>
                  <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
                    <label>12th Trimester</label>
                    <v-text-field
                      v-model="item.trimester_milestone.t12"
                      class="w-100"
                      outlined
                      label="Total credits earned at 12th trimester"
                      pattern="\d*"
                      onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"
                    ></v-text-field>
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
                <v-slider
                  class="mx-4"
                  max="12"
                  min="0"
                  label="Threshold of Credits"
                  ticks
                  v-model="item.trimester_milestone.gap"
                  thumb-label="always"
                ></v-slider>
              </div>

              <div class="d-flex align-items-center justify-content-between">
                <v-btn
                  text
                  @click="stepperAdd = stepperAdd - 1"
                >
                  Back
                </v-btn>
                <v-btn
                  color="primary"
                  class="my-4 mx-2"
                  @click="createCurriculum()"
                  :disabled="checkStep()"
                >
                  Create Curriculum
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-step
              :complete="stepperAdd > 4"
              step="4"
            >
              Core Courses
              <small>Add courses to core courses category</small>
            </v-stepper-step>
            <v-stepper-content step="4">
              <div class="d-flex flex-column w-100 p-1">
                <v-autocomplete
                  v-model="item.courses.core_courses"
                  :items="courses"
                  outlined
                  chips
                  deletable-chips
                  label="Course"
                  multiple
                  small-chips
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
                </v-data-table>
              </div>
              <div class="d-flex align-items-center justify-content-end">
                <v-btn
                  color="primary"
                  class="my-4 mx-2"
                  @click="addCoreCourses()"
                  :disabled="checkStep()"
                >
                  Continue
                </v-btn>
              </div>
            </v-stepper-content>
            <v-stepper-step
              :complete="stepperAdd > 5"
              step="5"
            >
              Required Courses
              <small>Add courses to required major courses category</small>
            </v-stepper-step>
            <v-stepper-content step="5">
              <div class="d-flex flex-column w-100 p-1">
                <v-autocomplete
                  v-model="item.courses.required_courses"
                  :items="courses"
                  outlined
                  chips
                  deletable-chips
                  label="Course"
                  multiple
                  small-chips
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
                </v-data-table>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <v-btn
                  text
                  @click="stepperAdd = stepperAdd - 1"
                >
                  Back
                </v-btn>
                <v-btn
                  color="primary"
                  class="my-4 mx-2"
                  @click="addRequiredCourses()"
                  :disabled="checkStep()"
                >
                  Continue
                </v-btn>
              </div>
            </v-stepper-content>
            <v-stepper-step
              step="6"
            >
              Elective Courses
              <small>Add courses to major elective courses category</small>
            </v-stepper-step>
            <v-stepper-content step="6">
              <div class="d-flex flex-column w-100 p-1">
                <v-autocomplete
                  v-model="item.courses.elective_courses"
                  :items="courses"
                  outlined
                  chips
                  deletable-chips
                  label="Course"
                  multiple
                  small-chips
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
                </v-data-table>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <v-btn
                  text
                  @click="stepperAdd = stepperAdd - 1"
                >
                  Back
                </v-btn>
                <v-btn
                  color="primary"
                  class="my-4 mx-2"
                  @click="addElectiveCourses()"
                  :disabled="checkStep()"
                >
                  Continue
                </v-btn>
              </div>
            </v-stepper-content>
          </v-stepper>
        </v-container>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      addDialog: false,
      stepperAdd: 1,
      courses: [],
      headers: [
        { text: "Code", sortable: true, value: "code", width: "1%" },
        { text: "Course Name", sortable: false, value: "name", width: "40%" }
      ],
      item: {
        _id: '',
        name: '',
        batches: [],
        passing_conditions: {
          core_courses: '',
          required_courses: '',
          elective_courses: ''
        },
        trimester_milestone: {
          gap: 6,
          t4: '',
          t5: '',
          t6: '',
          t7: '',
          t8: '',
          t9: '',
          t10: '',
          t11: '',
          t12: '',
        },
        courses: {
          core_courses: [],
          required_courses: [],
          elective_courses: [],
        },
      },
    }
  },
  mounted() {
    this.getCourses()
  },
  methods: {
    createCurriculum() {
      let query = `
        mutation {
          addCurriculum (curriculumInput: {
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
          }) {
            _id
            name
            batches
            passing_conditions {
              core_courses
              required_courses
              elective_courses
            }
            trimester_milestone { gap t4 t5 t6 t7 t8 t9 t10 t11 t12 }
            courses {
              core_courses { _id code name }
              required_courses { _id code name }
              elective_courses { _id code name }
            }
          }
        }
      `
      query = query.replace(/\s+/g, " ").trim();
      this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.item = res.data.data.addCurriculum
          this.stepperAdd = 4
          this.$emit('addCurriculum', this.item)
        })
        .catch((err) => {
          console.log(err);
        });
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
    checkStep() {
      switch (this.stepperAdd) {
        case 1:
          return !(this.item.name.length > 0 && this.item.batches.length > 0)
        case 2:
          return !(this.item.passing_conditions.core_courses.length > 0 &&
                  this.item.passing_conditions.required_courses.length > 0 &&
                  this.item.passing_conditions.elective_courses.length > 0)
        case 3:
          return !(this.item.trimester_milestone.t4.length > 0 &&
                  this.item.trimester_milestone.t5.length > 0 &&
                  this.item.trimester_milestone.t6.length > 0 &&
                  this.item.trimester_milestone.t7.length > 0 &&
                  this.item.trimester_milestone.t8.length > 0 &&
                  this.item.trimester_milestone.t9.length > 0 &&
                  this.item.trimester_milestone.t10.length > 0 &&
                  this.item.trimester_milestone.t11.length > 0 &&
                  this.item.trimester_milestone.t12.length > 0)
        case 4:
          return false
        case 5:
          return false
        case 6:
          return false
        default:
          return true
      }
    },
    getCourseIds(courses) {
      let courseIds = []
      courses.forEach((course) => {
        courseIds.push(course._id)
      })
      return courseIds
    },
    addCoreCourses() {
      if(this.item.courses.core_courses.length === 0) return this.stepperAdd = 5
      let query = `
        mutation {
          addCoreCourses(curriculumId: "${this.item._id}", courseId: ${JSON.stringify(this.getCourseIds(this.item.courses.core_courses))}) {
            success
            message
          }
        }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          if(res.data.data.addCoreCourses.success) {
            console.log(res.data.data.addCoreCourses.message)
            this.stepperAdd = 5
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addRequiredCourses() {
      if(this.item.courses.required_courses.length === 0) return this.stepperAdd = 6
      let query = `
        mutation {
          addRequiredCourses(curriculumId: "${this.item._id}", courseId: ${JSON.stringify(this.getCourseIds(this.item.courses.required_courses))}) {
            success
            message
          }
        }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          if(res.data.data.addRequiredCourses.success) {
            console.log(res.data.data.addRequiredCourses.message)
            this.stepperAdd = 6
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addElectiveCourses() {
      if(this.item.courses.elective_courses.length === 0) {
        this.reset()
        return this.$emit('updateCurriculum', this.item)
      }
      let query = `
        mutation {
          addElectiveCourses(curriculumId: "${this.item._id}", courseId: ${JSON.stringify(this.getCourseIds(this.item.courses.elective_courses))}) {
            success
            message
          }
        }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          if(res.data.data.addElectiveCourses.success) {
            this.$emit('updateCurriculum', this.item)
            this.reset()
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    reset() {
      this.addDialog = false
      this.stepperAdd = 1
      this.item = {
        _id: '',
        name: '',
        batches: [],
        passing_conditions: {
          core_courses: '',
          required_courses: '',
          elective_courses: ''
        },
        trimester_milestone: {
          gap: 6,
          t4: '',
          t5: '',
          t6: '',
          t7: '',
          t8: '',
          t9: '',
          t10: '',
          t11: '',
          t12: '',
        },
        courses: {
          core_courses: [],
          required_courses: [],
          elective_courses: [],
        }
      }
    }
  },
}
</script>

<style scoped>
.v-card .v-dialog--fullscreen.v-dialog {
  border-radius: 0px !important;
}

.v-select__selections {
  min-height: unset !important;
}
</style>