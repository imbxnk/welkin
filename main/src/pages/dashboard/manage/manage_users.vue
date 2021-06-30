<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 wk-manage-container">
      <div class="ml-auto p-2">
        <AddUser @addUser="adduser"></AddUser>
      </div>
      <div class="p-2">
        <v-card style="max-width: auto"
          ><v-card-title>
            <div class="d-flex flex-column">
              <span>Users</span>
              <span style="font-size:0.8rem; color:#999; margin-top: -10px;"
                >Total: {{ total }}</span
              >
            </div>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              type="text"
              class="mx-3"
            ></v-text-field
          ></v-card-title>
          <v-data-table
            :headers="headers"
            :items="users"
            :search="search"
            mobile-breakpoint="0"
            class="student px-3 pb-3"
            hide-default-footer
            disable-pagination
          >
            <template v-slot:[`item.avatar.small`]="{ item }">
              <v-avatar
                size="35"
                :class="{isDisabled: !item.isActive}"
                :style="
                  `background: url(${item.avatar.small ||
                    $config.defaultAvatar}) center center / cover;`
                "
              >
              </v-avatar>
            </template>
            <template v-slot:[`item.display_name`]="{ item }">
              <span :class="{isDisabled: !item.isActive}">{{ item.display_name ? item.display_name : "-" }}</span>
            </template>
            <template v-slot:[`item.username`]="{ item }">
              <span :class="{isDisabled: !item.isActive}">{{ item.username }}</span>
            </template>
            <template v-slot:[`item.name`]="{ item }">
              <span :class="{isDisabled: !item.isActive}">{{ item.name }}</span>
            </template>
            <template v-slot:[`item.group`]="{ item }">
              <span :class="{isDisabled: !item.isActive}">{{ item.group }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="editItem(item)">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
    <!-- <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title
          >Add User
          <v-spacer></v-spacer>
          <v-icon @click="dialog = false">mdi-close</v-icon></v-card-title
        >
        <AddUser></AddUser>
      </v-card>
    </v-dialog> -->

    <v-dialog persistent v-model="Editdialog" max-width="500px">
      <v-card>
        <v-card-title
          >Edit User
          <v-spacer></v-spacer>
          <v-icon @click="close()">mdi-close</v-icon></v-card-title
        >
        <div class="pa-3">
          <v-form ref="form">
            <div class="d-flex px-3 justify-content-between flex-column flex-sm-row">
              <div class="">
                <v-text-field
                  label="Display Name"
                  v-model="editedItem.display_name"
                  outlined
                ></v-text-field>
              </div>
              <div class="">
                <v-text-field
                  label="Username"
                  v-model="editedItem.username"
                  outlined
                ></v-text-field>
              </div>
            </div>
            <div class="d-flex px-3  justify-content-between flex-column flex-sm-row">
              <div class="">
                <v-text-field
                  label="Given Name"
                  v-model="editedItem.given_name"
                  outlined
                ></v-text-field>
              </div>
              <div class="">
                <v-text-field
                  label="Family Name"
                  v-model="editedItem.family_name"
                  outlined
                ></v-text-field>
              </div>
            </div>

            <div class="d-flex justify-content-center flex-column">
              <div class="px-3">
                <v-text-field label="Email" v-model="editedItem.email" outlined></v-text-field>
              </div>
            </div>

            <div
              class="d-flex justify-content-center flex-column"
              v-if="editedItem.group !== 'admin'"
            >
              <div class="px-3">
                <v-select
                  :items="items"
                  v-model="editedItem.group"
                  label="Group"
                  outlined
                ></v-select>
              </div>
            </div>
            <div class="d-flex justify-content-center flex-column" v-else>
              <div class="px-3">
                <v-select
                  :items="['admin']"
                  v-model="editedItem.group"
                  label="Group"
                  outlined
                  disabled
                ></v-select>
              </div>
            </div>

            <v-select
              class="px-3"
              label="Linked Instructor"
              :items="instructors"
              outlined
              v-model="editedItem.linked_instructor"
              item-text="name"
              return-object
            >
              <template v-slot:selection="data">
                {{ data.item._id ? "" : "-" }}{{ data.item.title }} {{ data.item.name }}
              </template>
              <template v-slot:item="data">
                {{ data.item._id ? "" : "-" }}{{ data.item.title }} {{ data.item.name }}
              </template>
            </v-select>

            <div class="d-flex justify-content-start align-items-center mx-4" v-if="editedItem.linked_instructor ? editedItem.linked_instructor.name ? true : false : false ">
              <!-- <label>Advisor</label> -->
              <v-switch
                class="v-input--reverse v-input--expand w-100"
                v-model="editedItem.isAdvisor"
                hint="Activate Advisor will provide more features to this account"
                persistent-hint
              >
                <template #label>
                  <span class="me-3" style="color: rgba(0, 0, 0, 0.87)">Advisor:</span> {{ editedItem.isAdvisor ? 'Yes' : 'No' }}
                </template>
              </v-switch>
            </div>

            <div class="d-flex justify-content-start align-items-center mx-4 mt-4" v-if="editedItem.group !== 'admin'">
              <!-- <label>Account Status</label> -->
              <v-switch
                class="v-input--reverse v-input--expand w-100"
                v-model="editedItem.isActive"
                :disabled="$currentUser._id === editedItem._id"
                hint="Disable the account will not allow this user to access the website"
                persistent-hint
              >
                <template #label>
                  <span class="me-3" style="color: rgba(0, 0, 0, 0.87)">Account Status:</span> {{ editedItem.isActive ? 'Active' : 'Disable' }}
                </template>
              </v-switch>
            </div>
            <div class="d-flex justify-content-start mx-4 mt-4" v-else>
              <label class="me-3">Account Status</label>
              <span style="color: rgb(153, 153, 153);">{{ `${ editedItem.isActive ? 'Active' : 'Disable' }` }}</span>
            </div>
            <div class="d-flex justify-content-between ms-4" style="margin-top: 30px">
              <div class="d-flex align-items-center">
                LINE: <v-chip class="ms-4" v-if="editedItem.lineUID" color="success">Connected</v-chip><v-chip class="ms-4" v-else>Not Registered</v-chip>
              </div>
              <div class="flex-shrink-1 align-items-center" v-if="editedItem.lineUID"><v-btn text small color="red" @click="unlinkedDialog = true">Unlinked</v-btn></div>
            </div>
          </v-form>

        </div>
        <v-card-actions class="py-4">
          <v-spacer></v-spacer>
          <v-btn class="py-3" style="min-width: 120px" color="primary" @click="confirm1 = true">submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirm1" max-width="450px">
      <v-card>
        <v-card-title class="headline grey lighten-2"> Confirm edit </v-card-title><br />
        <v-card-text
          >Are you sure you want to edit: <br />
          Display name: <b>{{ editedItem.display_name || "-" }}</b><br />
          Username: <b>{{ editedItem.username || "-" }}</b><br />
          Given name: <b>{{ editedItem.given_name || "-" }}</b><br />
          Family name: <b>{{ editedItem.family_name || "-" }}</b><br />
          Email:<b>{{ editedItem.email || "-" }}</b><br />
          Linked Instructor: <b>{{ editedItem.linked_instructor ? editedItem.linked_instructor.name ? editedItem.linked_instructor.title + " " + editedItem.linked_instructor.name : "-" : "-" }}</b><br />
          Advisor: <b>{{ editedItem.isAdvisor ? "Yes" : "No" }}</b><br />
          Group: <b>{{ editedItem.group || "-" }}</b>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="gray" @click="confirm1 = false">No</v-btn>
            <v-btn color="primary" style="min-width: 100px" @click="save()">Yes</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="unlinkedDialog" max-width="450px">
      <v-card>
        <v-card-title class="headline grey lighten-2">Unlink LINE Account?</v-card-title
        ><br />
        <v-card-text>
          Unlink LINE account from this user will prevent he/she from using some features
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="gray" @click="unlinkedDialog = false">No</v-btn>
            <v-btn color="primary" @click="unlink()">Yes</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar centered v-model="snackbar" :timeout="1000">
      {{ snackbartext }}
    </v-snackbar>
    <WKFooter></WKFooter>
  </v-container>
</template>

<script>
import AddUser from "./components/add_user";
import WKFooter from './components/footer';
export default {
  components: { AddUser, WKFooter },
  data() {
    return {
      search: "",
      headers: [
        { sortable: false, value: "avatar.small", width: "1%" },
        { text: "Username", sortable: false, value: "username", width: "9%" },
        { text: "Name", sortable: false, value: "name", width: "9%" },
        { text: "Group", sortable: false, value: "group", width: "9%" },
        { text: "Edit", sortable: false, value: "actions", width: "1%" },
      ],
      users: [],
      total: 0,
      dialog: false,
      confirm1: false,
      Editdialog: false,
      unlinkedDialog: false,
      editedIndex: -1,
      editedItem: {
        _id: "",
        display_name: "",
        username: "",
        given_name: "",
        family_name: "",
        linked_instructor: {
          _id: "",
          title: "",
          name: "",
        },
        lineUID: '',
        isAdvisor: false,
        email: "",
        group: "",
        isActive: true,
      },
      Info: [],
      items: ["coordinator", "program director", "lecturer"],
      snackbar: false,
      snackbartext: "success",
      instructors: []
    };
  },
  mounted() {
    this.getUser();
    this.getInstructors();
  },
  methods: {
    getUser() {
      let query = `
              {
                users (getConnectedApps: true) {
                    total
                    users {
                      _id
                      display_name
                      username
                      given_name
                      family_name
                      email
                      group
                      lineUID
                      createdAt
                      isAdvisor
                      linked_instructor {
                        _id
                        title
                        name
                      }
                      isActive
                      avatar {
                          small
                          medium
                          large
                      }
                    }
                }
              }
          `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.total = res.data.data.users.total;
          this.users = res.data.data.users.users;
          this.Info = res.data.data.users.users;
          this.users.forEach((user) => {
            user["name"] = [user.given_name, user.family_name].join(" ");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getInstructors() {
      let query = `
            {
              instructors {
                total
                instructors {
                  _id
                  title
                  name
                }
              }
            }
          `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.instructors = [ this.instructors, ...res.data.data.instructors.instructors ]
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editItem(item) {
      this.editedIndex = this.Info.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // eslint-disable-next-line no-console
      console.log(item);
      this.Editdialog = true;
    },
    close() {
      this.Editdialog = false;
      this.confirm1 = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      let query = `
          mutation {
            updateAccount(id: "${this.editedItem._id}", userInput: {
              username: "${this.editedItem.username}"
              given_name: "${this.editedItem.given_name}",
              family_name:"${this.editedItem.family_name}",
              display_name: "${this.editedItem.display_name || ''}",
              isAdvisor: ${this.editedItem.linked_instructor ? this.editedItem.linked_instructor._id ? this.editedItem.isAdvisor : false : false },
              linked_instructor: ${this.editedItem.linked_instructor ? (this.editedItem.linked_instructor._id ? '"' + this.editedItem.linked_instructor._id + '"' : null) : null },
              email:"${this.editedItem.email}",
              group:"${this.editedItem.group}",
              isActive: ${this.editedItem.isActive}
            }) {
              _id
              given_name
              family_name
              username
              group
            }
          }
        `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          if (this.editedIndex > -1) {
            if(this.editedItem.linked_instructor) {
              if(!this.editedItem.linked_instructor._id) {
                this.editedItem.linked_instructor = null
                this.editedItem.isAdvisor = false
              }
            }
            Object.assign(this.Info[this.editedIndex], this.editedItem);
          } else {
            this.Info.push(this.editedItem);
          }
          this.close();
          console.log(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    adduser(newValue) {
      this.users.unshift(newValue)
    },
    unlink() {
      let query = `
        mutation {
          unlinkUserUID(searchInput: {_id: "${this.editedItem._id}"}) {
            success
            message
          }
        }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.editedItem.lineUID = null
          this.unlinkedDialog = false
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>

<style>
.isDisabled {
  opacity: 0.4;
}
</style>