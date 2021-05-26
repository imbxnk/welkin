<template>
  <!-- this included : showRemark, addRemark, deleteRemark -->
  <v-card elevation="0" class="remark-card pa-3 mx-3">
    <b>Remark(s):</b>
    <span v-if="this.stdRemark == ''">
      -
    </span>
    <span v-else
      ><simplebar data-simplebar-auto-hide="true" class="wk-content-full-height-list mx-n2">
        <ul class="mb-n1">
          <li v-for="(msg, i) in this.stdRemark" :key="i">
            "{{ msg.message }}",
            {{ !msg.user.display_name ? msg.user.username : msg.user.display_name }}
            <v-icon
              v-if="msg.user.username === $currentUser.username"
              small
              @click="showDialog2(msg._id, msg.message, msg.user.display_name, i)"
              >mdi-delete</v-icon
            >
          </li>
        </ul>
      </simplebar>
    </span>
    <div class="w-100 d-flex justify-content-end align-self-end mt-1">
      <v-btn color="primary" @click="dialog = true" outlined x-small class=""
        >Add <v-icon small>mdi-pencil</v-icon></v-btn
      >
    </div>

    <!-- add remark -->
    <v-dialog v-model="dialog" max-width="300px">
      <v-card class=" pa-3">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-icon @click="closedialog()">mdi-close</v-icon>
        </v-card-title>
        <div class="text-center mt-n8">
          <p class="overline primary--text my-n2">Add Remark For</p>
          <p class="font-weight-bold ">{{ sid }}</p>
        </div>
        <v-divider class=""></v-divider>
        <v-textarea
          outlined
          :rules="rules"
          counter="140"
          label="Remark"
          v-model="remark"
        ></v-textarea>

        <v-btn
          block
          class="mb-3"
          color="primary"
          :disabled="isDisable"
          rounded
          @click="saveremark(remark)"
        >
          save
        </v-btn>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" max-width="450px">
      <v-card>
        <v-card-title class="headline grey lighten-2"> Confirm delete </v-card-title><br />
        <v-card-text
          >Are you sure you want to delete "{{ delremarkMsg }}" from
          {{ delremarkUser }}?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="dialog2 = false">No</v-btn>
          <v-btn text color="success" @click="delRemark(delremarkID, delindex)">Yes</v-btn>
        </v-card-actions></v-card
      >
    </v-dialog>

    <v-snackbar centered v-model="snackbar" :timeout="1000">
      {{ snackbartext }}
    </v-snackbar>
  </v-card>
</template>
<script>
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";

export default {
  name: "Student_Remark",
  props: ["sid"],
  components: { simplebar },
  created() {
    this.getRemark(this.$props.sid);
  },
  watch: {
    sid: function(current) {
      this.getRemark(current);
    },
  },
  computed: {
    isDisable() {
      if (this.remark.length > 0 && this.remark.length <= 140) {
        return false;
      } else {
        return true;
      }
    },
  },
  data() {
    return {
      dialog: false,
      dialog2: false,
      snackbar: false,
      stdRemark: [],
      rules: [(v) => v.length <= 140 || "Max 140 characters"],
      remark: "",
      remarktext: {
        msg: "",
      },
      snackbartext: "",
      delremarkID: "",
      delremarkMsg: "",
      delremarkUser: "",
      delindex: 0,
    };
  },
  methods: {
    getRemark(sid) {
      let query = `
             query {
                remarks (studentId: "${sid}") {
                    total
                    remarks {
                    _id
                    user {
                        display_name
                        username
                        given_name
                        family_name
                    }
                    message
                    createdAt
                    }
                }
                }
          `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.stdRemark = res.data.data.remarks.remarks;
          console.log(this.stdRemark);
        })
        .catch((err) => {});
    },
    closedialog() {
      this.dialog = false;
      //   this.remark = "";
    },
    saveremark() {
      this.remarktext.msg = this.remark;
      this.addRemark(this.remarktext);
    },
    async addRemark(val) {
      this.snackbar = false;
      this.snackbartext = "";
      let query = `
                mutation {
                  addRemark(remarkInput: {
                    studentId: "${this.$props.sid}",
                    message: "${val.msg.trim()}"
                  }) {
                    _id
                    message
                  }
                }
              `;

      await this.axios
        .post(
          process.env.VUE_APP_GRAPHQL_URL,
          { query },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.data.addRemark) {
            this.snackbartext = "The remark has been saved";
            this.snackbar = true;
            this.stdRemark.push({
              message: res.data.data.addRemark.message,
              user: {
                username: this.$currentUser.username,
                display_name: this.$currentUser.display_name,
              },
              _id: res.data.data.addRemark._id,
            });
            this.dialog = false;
            this.remark = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showDialog2(id, msg, usr, index) {
      this.dialog2 = true;
      this.delremarkID = id;
      this.delremarkMsg = msg;
      this.delremarkUser = usr;
      this.delindex = index;
    },
    delRemark(id) {
      this.snackbar = false;
      this.snackbartext = "";
      let query = `
                mutation {
                  delRemark(remarkId: "${id}") {
                    success
                    message
                  }
                }
              `;
      this.axios
        .post(
          process.env.VUE_APP_GRAPHQL_URL,
          { query },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.data.delRemark) {
            this.snackbartext = "The remark has been deleted";
            this.snackbar = true;
            this.stdDetail.remarks.splice(this.delindex, 1);
          }
          this.dialog3 = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.remark-card {
  width: 100%;
  background: #f7f7f8;
  color: #000;
}
.wk-content-full-height-list {
  height: 90px;
  /* height: var(--app-height); */
  /* height: auto; */
  overflow: auto;
}
</style>
