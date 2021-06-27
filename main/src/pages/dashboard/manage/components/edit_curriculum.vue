<template>
  <v-dialog v-model="editDialog" fullscreen hide-overlay persistent transition="dialog-bottom-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-icon small v-bind="attrs" v-on="on">
        mdi-pencil
      </v-icon>
    </template>
    <v-card>
      <v-toolbar light color="transparent" flat extended extension-height="100">
        <v-btn icon light @click="editDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Edit Curriculum</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="align-items-center">
          <v-btn dark color="primary" @click="editDialog = false" style="height: 36px !important;">
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <!-- CURRICULUM DETAILS -->
      <v-container>
        <h5>{{ item.name }}</h5>
        <v-subheader class="px-0">Curriculum Details</v-subheader>
        <div class="d-flex flex-column">
          <v-text-field v-model="item.name" label="Name" outlined></v-text-field>
          <v-combobox v-model="item.batches" :items="item.batches" label="Batches" multiple deletable-chips outlined persistent-hint
            hint="Please add or select eligible batches for this curriculum" height="48" chips></v-combobox>
        </div>
      </v-container>

      <v-divider></v-divider>

      <!-- PASSING CONDITIONS -->
      <v-container>
        <v-subheader class="px-0">Passing Condiitions</v-subheader>
        <div class="d-flex flex-wrap my-4">
          <v-text-field v-model="item.passing_conditions.core_courses" label="Core Credits" class="mx-2" outlined
            pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                            || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                            || (95<event.keyCode && event.keyCode<106)
                            || (event.keyCode==8) || (event.keyCode==9)
                            || (event.keyCode>34 && event.keyCode<40)
                            || (event.keyCode==46) )"></v-text-field>

          <v-text-field v-model="item.passing_conditions.required_courses" label="Major Required Credits" class="mx-2"
            outlined pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                            || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                            || (95<event.keyCode && event.keyCode<106)
                            || (event.keyCode==8) || (event.keyCode==9)
                            || (event.keyCode>34 && event.keyCode<40)
                            || (event.keyCode==46) )"></v-text-field>

          <v-text-field v-model="item.passing_conditions.elective_courses" label="Major Required Credits" class="mx-2"
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
            <v-text-field v-model="item.trimester_milestone.t4" class="w-100" outlined
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
            <v-text-field v-model="item.trimester_milestone.t5" class="w-100" outlined
              label="Total credits earned at 5th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"></v-text-field>
          </div>

          <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
            <label>6th Trimester</label>
            <v-text-field v-model="item.trimester_milestone.t6" class="w-100" outlined
              label="Total credits earned at 6th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"></v-text-field>
          </div>
          <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
            <label>7th Trimester</label>
            <v-text-field v-model="item.trimester_milestone.t7" class="w-100" outlined
              label="Total credits earned at 7th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"></v-text-field>
          </div>
          <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
            <label>8th Trimester</label>
            <v-text-field v-model="item.trimester_milestone.t8" class="w-100" outlined
              label="Total credits earned at 8th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"></v-text-field>
          </div>
          <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
            <label>9th Trimester</label>
            <v-text-field v-model="item.trimester_milestone.t9" class="w-100" outlined
              label="Total credits earned at 9th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"></v-text-field>
          </div>
          <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
            <label>10th Trimester</label>
            <v-text-field v-model="item.trimester_milestone.t10" class="w-100" outlined
              label="Total credits earned at 10th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"></v-text-field>
          </div>
          <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
            <label>11th Trimester</label>
            <v-text-field v-model="item.trimester_milestone.t11" class="w-100" outlined
              label="Total credits earned at 11th trimester" pattern="\d*" onkeydown="return ( event.ctrlKey || event.altKey
                                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                || (95<event.keyCode && event.keyCode<106)
                                || (event.keyCode==8) || (event.keyCode==9)
                                || (event.keyCode>34 && event.keyCode<40)
                                || (event.keyCode==46) )"></v-text-field>
          </div>
          <div class="d-flex flex-column align-items-start flex-grow-1 mx-2" style="flex-basis: 30%">
            <label>12th Trimester</label>
            <v-text-field v-model="item.trimester_milestone.t12" class="w-100" outlined
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
      </v-container>

      <!-- COURSES -->

      <v-divider></v-divider>

      <v-container>
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

      </v-container>

      <v-divider></v-divider>

      <v-container>
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

      </v-container>

      <v-divider></v-divider>

      <v-container>
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

      </v-container>
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
        editDialog: false,
        headers: [
          { text: "Code", sortable: true, value: "code", width: "1%" },
          { text: "Course Name", sortable: false, value: "name", width: "40%" }
        ],
      }
    },
    methods: {
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
      }
    },
  }
</script>

<style scoped>
  .v-card .v-dialog--fullscreen.v-dialog {
    border-radius: 0px !important;
  }
</style>