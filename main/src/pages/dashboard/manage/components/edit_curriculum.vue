<template>
  <v-dialog
      v-model="editDialog"
      fullscreen
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-icon small v-bind="attrs" v-on="on">
          mdi-pencil
        </v-icon>
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
            @click="editDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Edit Curriculum</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items class="align-items-center">
            <v-btn
              dark
              color="primary"
              @click="editDialog = false"
              style="height: 36px !important;"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-container>
          <h5>{{ item.name }}</h5>
          <v-subheader class="px-0">Curriculum Details</v-subheader>
          <div class="d-flex">
            <v-text-field
              v-model="item.name"
              label="Name"
              outlined
            ></v-text-field>
          </div>
        </v-container>
        <v-divider></v-divider>
        <v-container>
          <v-subheader class="px-0">Passing Condiitions</v-subheader>
        </v-container>
        <v-divider></v-divider>
        <v-container>
          <v-subheader class="px-0">Milestone</v-subheader>
        </v-container>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: ['item'],
  data() {
    return {
      editDialog: false,
    }
  },
}
</script>

<style scoped>
.v-card .v-dialog--fullscreen.v-dialog {
  border-radius: 0px !important;
}
</style>