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
          <h5>{{ item.name ? item.name : 'Curriculum Name' }}</h5>
          <v-subheader class="px-0">Curriculum Details</v-subheader>
          <div class="d-flex">
            <v-text-field
              v-model="item.name"
              label="Name"
              outlined
            ></v-text-field>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      addDialog: false,
      item: {
        name: '',
        batches: [],
        passing_conditions: {
          core_courses: 0,
          required_courses: 0,
          elective_courses: 0
        }
      },
    }
  },
  methods: {
    addCurriculum() {
        let query = `
          mutation {
            addCurriculum (curriculumInput: {
              name: "${this.item.name}",
              batches: "${JSON.stringify(this.item.batches)}",
              passing_conditions: {
                core_courses: ${this.passing_conditions.core_courses},
                required_courses: ${this.passing_conditions.required_courses},
                elective_courses: ${this.passing_conditions.elective_courses}
              },
            }) {
              name
            }
          }
        `
      }
  },
}
</script>

<style scoped>
.v-card .v-dialog--fullscreen.v-dialog {
  border-radius: 0px !important;
}
</style>