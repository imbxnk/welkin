<template>
  <div class="wk-add-course">
    <div class="d-flex flex-row justify-content-end">
      <div class="p-2">
        <v-btn color="primary" @click="addDialog = true"><v-icon>mdi-plus</v-icon> Add Course</v-btn>
      </div>
    </div>
    <v-dialog persistent v-model="addDialog" max-width="700px">
      <v-card>
        <v-card-title class="card-title"
          >Add Course
          <v-spacer></v-spacer>
          <v-icon @click="close()">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <div class="d-flex justify-content-start flex-column flex-sm-row">
            <div class="flex-shrink-1">
              <v-text-field
                v-model="item.code"
                label="Code"
                outlined
                required
                class="forceUppercase"
              ></v-text-field>
            </div>
            <div class="flex-grow-1 ms-sm-3">
              <v-text-field
                v-model="item.name"
                label="Course Name"
                outlined
                required
              ></v-text-field>
            </div>
          </div>
          <div class="d-flex">
            <v-textarea
              outlined
              label="Course Description"
              v-model="item.description"
            ></v-textarea>
          </div>
          <v-text-field
            v-model="item.credit"
            label="Credit"
            outlined
            required
            hide-details
            pattern="\d*"
            onkeydown="return ( event.ctrlKey || event.altKey
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9)
                      || (event.keyCode>34 && event.keyCode<40)
                      || (event.keyCode==46) )"
          ></v-text-field>
          <div class="d-flex mt-1">
            <v-divider></v-divider>
            <span class="flex-shrink-1 d-flex align-items-center mx-2">
              Credit Description
            </span>
            <v-divider></v-divider>
          </div>
          <div class="d-flex">
            <v-text-field
              v-model="item.credit_description.lecture"
              class="me-1"
              label="Lecture Hours"
              outlined
              required
              pattern="\d*"
              onkeydown="return ( event.ctrlKey || event.altKey
                        || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                        || (95<event.keyCode && event.keyCode<106)
                        || (event.keyCode==8) || (event.keyCode==9)
                        || (event.keyCode>34 && event.keyCode<40)
                        || (event.keyCode==46) )"
            ></v-text-field>
            <v-text-field
              v-model="item.credit_description.lab"
              class="mx-2"
              label="Lab Hours"
              outlined
              required
              pattern="\d*"
              onkeydown="return ( event.ctrlKey || event.altKey
                        || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                        || (95<event.keyCode && event.keyCode<106)
                        || (event.keyCode==8) || (event.keyCode==9)
                        || (event.keyCode>34 && event.keyCode<40)
                        || (event.keyCode==46) )"
            ></v-text-field>
            <v-text-field
              v-model="item.credit_description.self_study"
              class="ms-1"
              label="Self Study Hours"
              outlined
              required
              pattern="\d*"
              onkeydown="return ( event.ctrlKey || event.altKey
                        || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
                        || (95<event.keyCode && event.keyCode<106)
                        || (event.keyCode==8) || (event.keyCode==9)
                        || (event.keyCode>34 && event.keyCode<40)
                        || (event.keyCode==46) )"
            ></v-text-field>
          </div>
          <v-card-actions class="d-flex justify-content-end">
            <v-btn
              class="py-3"
              style="min-width: 120px"
              :disabled="!(item.code.length === 7 && item.name.length > 0 && item.credit.toString().length > 0 && item.credit_description.lecture.toString().length > 0 && item.credit_description.self_study.toString().length > 0 && item.credit_description.lab.toString().length > 0)"
              color="primary"
              @click="createCourse()"
            >submit</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addDialog: false,
      item: {
        _id: '',
        name: '',
        code: '',
        description: '',
        credit: '',
        credit_description: {
          lecture: '',
          lab: '',
          self_study: ''
        }
      }
    }
  },
  methods: {
    createCourse() {
      let query = `
        mutation {
          addCourse(courseInput: {
            name: "${this.item.name}",
            code: "${this.item.code}",
            description: "${this.item.description}",
            credit: ${this.item.credit},
            credit_description: {
              lecture: ${this.item.credit_description.lecture},
              lab: ${this.item.credit_description.lab},
              self_study: ${this.item.credit_description.self_study}
            }
          }) {
            _id
            name
            code
            description
            credit
            credit_description{ lecture lab self_study }
          }
        }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.$emit('addCourse', res.data.data.addCourse)
          this.close()
        })
        .catch((err) => {
          console.log(err);
        });
    },
    close() {
      this.addDialog = false
      this.item = {
        _id: '',
        name: '',
        code: '',
        description: '',
        credit: '',
        credit_description: {
          lecture: '',
          lab: '',
          self_study: ''
        }
      }
    }
  },
}
</script>


<style scoped>
.forceUppercase >>> input {
  text-transform: uppercase;
}
</style>