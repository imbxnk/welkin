<template>
  <v-app>
    <v-tabs>
      <!-- Add Student tab -->
      <v-tab>Add student</v-tab>
      <v-tab-item>
        <v-container fluid >
        <v-card max-height="1200px" max-width="900px" class="indigo lighten-5">
          <v-card-title>Add new student</v-card-title>
          <v-content>
            <v-form class="px-3" v-model="valid" ref="form" lazy-validation>
              <v-row align='center'>
                <v-col class='d-flex' col='6' md='4' sm='2'>
                  <v-text-field label="ID" v-model="newData.id" :rules="idRules" required></v-text-field>
                </v-col>
                <v-col class='d-flex' col='6' md='4' sm='2'>
                  <v-select :items="newData.prefix" label="Prefix" outlined :rules='prefixRules'></v-select>
                </v-col>
                <v-col class='d-flex' col='12' sm='6'>
                  <v-text-field label="First name" v-model='newData.firstname' :rules="firstnameRules" required></v-text-field>
                </v-col>
                <v-col class='d-flex' col='12' sm='6'>
                  <v-text-field label="Last name" v-model="newData.lastname" :rules="lastnameRules" required></v-text-field>
                </v-col>
                <v-col class='d-flex' col='12' sm='6'>
                  <v-text-field label="Nickname" v-model="newData.nickname" :rules="nicknameRules" required></v-text-field>
                </v-col>
                <v-col class='d-flex' col='12' sm='6'>
                  <v-text-field label="Email" v-model="newData.email" :rules="emailRules" required></v-text-field>
                </v-col>
                 <v-col class='d-flex' col='6' sm='6'>
                  <v-select :items="newData.entry_trimester" label="Entry Trimester" outlined :rules="entry_trimesterRules"></v-select>
                </v-col>
                <v-col class='d-flex' col='6' sm='6'>
                  <v-text-field label="Entry Year" v-model="newData.entry_year" :rules="entry_yearRules" required></v-text-field>
                </v-col>
                <v-col class='d-flex' col='4' sm='2'>
                  <v-btn  color='error' class="mr-4" @click="reset">Clear</v-btn>
                </v-col>
                <v-col class='d-flex justify-end' col='4' sm='2' >
                  <v-btn  color='dark' class="mr-4" @click="addNewStudent">Add</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-content>
        </v-card>
        </v-container>

        <template>
          <v-container>
          <v-data-table
              :headers="headers"
              :items="tablevalue"
              :items-per-page="10"
              class="elevation-1"
              dark>
              </v-data-table>
          </v-container>
        </template>


      </v-tab-item>
      <!-- ------------------------------------------------------------------------------------------------------ -->



      <v-tab>Upload</v-tab>
      <v-tab-item>
        <v-container>
          <v-card>
            <v-card-title>Test</v-card-title>
          </v-card>
        </v-container>
      </v-tab-item>
      <v-tab>Item Three</v-tab>
    </v-tabs>
  </v-app>



</template>

<script>
  export default {
    data: () => ({
      valid: true,
      dialog: false,
      loading: false,
      files: [],
      newData: {
        id: "",
        prefix: ['Mr', 'Ms', 'Mrs', "Dr"],
        entry_trimester: ['1', '2', '3'],
        firstname: "",
        lastname: "",
        email: "",
        nickname: "",
        entry_year: "",
      },
      newStudent: [{
        id: "",
        prefix: "",
        firstname: "",
        lastname: "",
        email: "",
        nickname: "",
        entry_trimester: "",
        entry_year: "",
      }, ],
      headers:[
        {
          text: 'ID',
          sortable: true,
          value: 'table_id',
        },
        {
          text: 'Prefix',
          value: 'table_prefix'
        },
        {
          text: 'First name',
          value: 'table_firstname'
        },
        {
          text: 'Last name',
          value: 'table_lastname'
        },
        {
          text: 'Nickname',
          value: 'table_nickname'
        },
        {
          text: 'Entry Trymester',
          value: 'table_entry_trimester'
        },
        {
          text: 'email',
          value: 'table_email'
        },
        {
          text: 'Entry Year',
          value: 'table_entry_year'
        },


      ],
      tablevalue:[{
        table_id: '',
        table_prefix: '',
        table_firstname: '',
        table_lastname: '',
        table_entry_trimester: '',
        table_email: "",
        table_nickname: "",
        table_entry_year: "",
      }],
     
      prefixRules:[
        v => !!v || 'Please select honorifix'
      ],

      firstnameRules: [
        v => !!v || 'First name is required',
      ],
      lastnameRules: [
        v => !!v || 'First name is required',
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      idRules: [
        v => !!v || 'ID is required',
        v => v && v.length == 7 || 'Id must be 7 characters!!'
      ],
      nicknameRules: [
        v => !!v || 'Nickname is required',
      ],
      entry_trimesterRules: [
        v => !!v || 'Please select Entry Trimester'
      ],
      entry_yearRules: [
        v => !!v || 'Entry Year is required'
      ]
    }),
    methods: {
      submit: function () {
        this.$refs.form.validate()
      },
      reset: function () {
        this.$refs.form.reset();
      },
      addNewStudent: function () {
        if (this.$refs.form.validate()) {
          this.newStudent.push({
            id: this.newData.id,
            prefix: this.newData.prefix,
            firstname: this.newData.firstname,
            lastname: this.newData.lastname,
            email: this.newData.email,
            nickname: this.newData.nickname,
            entry_trimester: this.newData.entry_trimester,
            entry_year: this.newData.entry_year,
          });
          this.tablevalue.push({
            table_id: this.newData.id,
            table_prefix: this.newData.prefix,
            table_firstname: this.newData.firstname,
            table_lastname: this.newData.lastname,
            table_email: this.newData.email,
            table_nickname: this.newData.nickname,
            table_entry_trimester: this.newData.entry_trimester,
            table_entry_year: this.newData.entry_year,
          })
        }
        console.log(this.newStudent[1].id, this.newStudent[1].prefix.v, this.newStudent[1].firstname, this.newStudent[1].lastname,this.newStudent[1].nickname, this.newStudent[1].email, this.newStudent[1].entry_trimester, this.newStudent[1].entry_year)
        this.$refs.form.reset();
      },
    },
  }
</script>


