<template>
  <v-dialog v-model="editDialog" fullscreen hide-overlay persistent transition="dialog-bottom-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-icon small v-bind="attrs" v-on="on" @click="loadClass(item._id)">
        mdi-pencil
      </v-icon>
    </template>
    <v-card>
      <v-toolbar light color="transparent" flat>
        <v-btn icon light @click="editDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{  }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="d-flex justify-content-end my-4">
          <v-btn
            color="primary"
            @click="updateEnrollment()"
          >Save</v-btn>
        </div>
      </v-toolbar>
      <v-container class="mt-4" v-if="!loading">

        <div class="d-flex justify-content-between">
          <div class="d-flex flex-column">
            <span><b>International College, Mahidol University</b></span>
            <span><b>Grade Report for Instructor:</b> {{ this.class.instructor.title ? this.class.instructor.title + ' ' : '' }}{{ this.class.instructor.name }}</span>
            <span>{{ this.class.course.code }} {{ this.class.course.name }}, Section {{ this.class.section }}</span>
          </div>
          <div class="d-flex flex-column align-items-end">
            <span><b>MUIC-ICSTUDENT:</b> {{ currentTime }}</span>
            <span><b>Credits:</b> {{ this.class.course.credit + '(' + this.class.course.credit_description.lecture + '-' + this.class.course.credit_description.lab + '-' + this.class.course.credit_description.self_study + ')' }}, <b>Trimester:</b> Y{{this.class.year}}T{{  this.class.trimester }}</span>
          </div>
        </div>

        <div class="v-data-table py-3 theme--light wk-enrollments-container">
          <div class="v-data-table__wrapper">
            <table>
              <thead class="v-data-table-header pb-3 theme--light">
                <tr>
                  <th role="columnheader" scope="col" class="text-start" style="max-width: 100px; width: 1%">
                  </th>
                  <th role="columnheader" scope="col" class="text-start" style="max-width: 100px; width: 3%">
                    <span>ID</span>
                  </th>
                  <th role="columnheader" scope="col" class="text-center" style="max-width: 100px; width: 5%">
                    <span>Program</span>
                  </th>
                  <th role="columnheader" scope="col" class="text-start" style="max-width: 100%;">
                    <span>Name</span>
                  </th>
                  <th role="columnheader" scope="col" class="text-center" style="width: 80px;">
                    <span>Score</span>
                  </th>
                  <th role="columnheader" scope="col" class="text-center" style="width: 80px;">
                    <span>Grade</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(enrollment, i) in enrollments" :key="enrollment.student.sid">
                  <td class="text-start">
                    {{ i+1 }}
                  </td>
                  <td class="text-start">
                    {{ enrollment.student.sid }}
                  </td>
                  <td class="text-center">
                    {{ enrollment.student.program }}
                  </td>
                  <td class="text-start">
                    {{ enrollment.student.given_name + ' ' + enrollment.student.family_name }}
                  </td>
                  <td class="text-center">
                    <div v-show="enrollment.editable == false">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <label v-bind="attrs" v-on="on" class="d-flex align-items-center justify-content-center mb-0" @dblclick="enrollment.grade=''; toggleEdit(i)">{{ enrollment.score }}</label>
                        </template>
                        <span>Double click to edit the score</span>
                      </v-tooltip>
                    </div>
                    <v-text-field v-show="enrollment.editable == true" v-model="enrollment.score"
                      dense
                      outlined
                      hide-details
                      pattern="\d*"
                      onkeydown="return ( event.ctrlKey || event.altKey
                                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                                    || (95<event.keyCode && event.keyCode<106)
                                    || (event.keyCode==8) || (event.keyCode==9)
                                    || (event.keyCode>34 && event.keyCode<40)
                                    || (event.keyCode==46) )"
                      :ref="'editInputId' + i"
                      v-on:blur="toggleEdit(i)"
                      class="wk-edit-grade"
                      @keyup.enter="toggleEdit(i)"></v-text-field>
                  </td>
                  <td class="text-center">
                    <div class="d-flex align-items-center justify-content-center">
                      <v-select
                        class="d-flex align-items-center justify-content-center"
                        label="Grade"
                        :items="grades"
                        style="max-width: 80px"
                        hide-details
                        dense
                        outlined
                        v-on:change="gradeChange(i)"
                        v-model="enrollment.grade"
                      ></v-select>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </v-container>
      <v-container class="wk-enrollments-loading d-flex align-items-center justify-content-center" v-else>
        <div class="d-flex flex-column align-items-center justify-content-center" style="margin-top: -100px">
          <div class="wk-spinner mx-auto my-4"></div>
          <span class="small">Loading...</span>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
// import simplebar from "simplebar-vue";
// import "simplebar/dist/simplebar.min.css";
export default {
    props: ['item'],
    mounted() {
      this.getCurrentTime()
      setInterval(() => this.getCurrentTime(), 1 * 1000)
    },
    components: {
      // simplebar,
    },
    data() {
      return {
        editDialog: false,
        enrollments: [],
        grades: [
          'A',
          'B+',
          'B',
          'C+',
          'C',
          'D+',
          'D',
          'S',
          'X',
          'F',
          'AU',
          'I',
          'W',
          'U'
        ],
        class: {
          _id: '',
          course: {
            code: '',
            name: '',
            description: '',
          },
          instructor: {
            title: '',
            name: '',
          },
          section: '',
          trimester: '',
          year: '',
        },
        loading: true,
        updating: true,
        currentTime: null,
      }
    },
    methods: {
      loadClass(classID) {
        this.loading = true
        let query = `
          {
            class(classId: "${classID}") {
              _id
              course {
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
              instructor {
                title
                name
              }
              section
              trimester
              year
              enrollments {
                _id
                student {
                  sid
                  program
                  given_name
                  family_name
                  email
                }
                score
                grade
              }
            }
          }
        `
        query = query.replace(/\s+/g, ' ').trim()
        this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
          .then((res) => {
            this.enrollments = [...res.data.data.class.enrollments];
            delete res.data.data.class.enrollments
            this.enrollments.forEach((enrollment, i) => {
              enrollment.student.name = enrollment.student.given_name + " " + enrollment.student.family_name;
              enrollment.editable = false
              enrollment.edited = false
            });
            this.class = { ...res.data.data.class }
            this.loading = false;
          })
          .catch((err) => {});
      },
      reset() {
        this.editDialog = false
      },
      toggleEdit(i) {
        if(this.enrollments[i].editable) {
          if(this.enrollments[i].score > 100) this.enrollments[i].score = 100
          else if (this.enrollments[i].score === '') this.enrollments[i].score = 0
          let grade = this.calculateGrade(this.enrollments[i].score)
          this.enrollments[i].grade = grade
        } else {
          let ref = `editInputId${i}`
          console.log(this.$refs[ref][0])
          this.$refs[ref][0].focus()
        }
        this.enrollments[i].edited = true
        this.enrollments[i].editable = !this.enrollments[i].editable
      },
      gradeChange(i) {
        this.enrollments[i].edited = true
      },
      calculateGrade(score) {
        let grade

        if(score >= 90) grade = 'A'
        else if (score >= 85 && score < 90) grade = 'B+'
        else if (score >= 80 && score < 85) grade = 'B'
        else if (score >= 75 && score < 80) grade = 'C+'
        else if (score >= 70 && score < 75) grade = 'C'
        else if (score >= 65 && score < 70) grade = 'D+'
        else if (score >= 60 && score < 65) grade = 'D'
        else if (score < 60) grade = 'F'

        return grade
      },
      getEditedItems() {
        let editedItems = []
        this.enrollments.forEach((enrollment) => {
          if(enrollment.edited) editedItems.push(enrollment)
        })
        return editedItems
      },
      updateEnrollment() {
        let editedItems = this.getEditedItems()
        if(editedItems.length === 0) {
          this.editDialog = false
          return
        }
        this.updating = true

        let queryStr
        editedItems.forEach((item) => {
          queryStr = `e${item.student.sid}:updateEnrollment(eid: "${item._id}", enrollmentInput: {
            score: ${item.score},
            grade: "${item.grade}"
          }) { success }`
        })

        let query = `
        mutation {
          ${queryStr}
        }
        `
        query = query.replace(/\s+/g, ' ').trim()
          this.axios.post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
            .then((res) => {
              this.updating = false
              this.editDialog = false
            })
            .catch((err) => {});
      },
      getCurrentTime() {
        this.currentTime = this.moment().format('YYYY-MM-DD HH:mm')
      }
    },
}
</script>

<style scoped>
.wk-enrollments-container {
  border-radius: 1.1rem !important;
  border: 1px solid #efefef;
  margin-top: 20px;
}
.wk-enrollments-loading {
  height: calc(100vh - 164px);
}

.wk-edit-grade >>> input {
  text-align: right;
}

.wk-spinner {
	pointer-events: none;
	width: 2.5em;
	height: 2.5em;
	border: 0.4em solid transparent;
	border-color: #eee;
	border-top-color: #3E67EC;
	border-radius: 50%;
	animation: loadingspin 1s linear infinite;
}

@keyframes loadingspin {
	100% {
		transform: rotate(360deg)
	}
}
</style>
