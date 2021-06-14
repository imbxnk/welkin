<template>
  <v-container class="mx-auto">
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <AddUser></AddUser>
      </div>
      <div class="p-2 bd-highlight">
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
                :style="
                  `background: url(${item.avatar.small ||
                    $config.defaultAvatar}) center center / cover;`
                "
              >
              </v-avatar>
            </template>
            <template v-slot:[`item.display_name`]="{ item }">
              {{ item.display_name ? item.display_name : "-" }}
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
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title
          >Add User
          <v-spacer></v-spacer>
          <v-icon @click="dialog = false">mdi-close</v-icon></v-card-title
        >
        <AddUser></AddUser>
      </v-card>
    </v-dialog>

    <v-dialog v-model="Editdialog" max-width="500px">
      <v-card>
        <v-card-title
          >Edit User
          <v-spacer></v-spacer>
          <v-icon @click="close()">mdi-close</v-icon></v-card-title
        >
        <div class="pa-3">
          <v-form ref="form">
            <div class="d-flex px-3 justify-content-between flex-column flex-sm-row">
              <div class=" ">
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
                Group: <span style="color: #999; margin-left: 20px">{{ editedItem.group }}</span>
              </div>
            </div>
            <div class="d-flex justify-content-start align-items-center mx-4" v-if="editedItem.group !== 'admin'">
              <label>Account Status:</label>
              <v-switch
                class="ms-4"
                v-model="editedItem.isActive"
                inset
                :label="`${ editedItem.isActive ? 'Active' : 'Disable' }`"
              ></v-switch>
            </div>
            <div class="d-flex justify-content-start mx-3" v-else>
              <label class="me-3">Account Status: </label>
              <span style="color: rgb(153, 153, 153);">{{ `${ editedItem.isActive ? 'Active' : 'Disable' }` }}</span>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="confirm1 = true">submit</v-btn>
            </v-card-actions>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirm1" max-width="450px">
      <v-card>
        <v-card-title class="headline grey lighten-2"> Confirm edit </v-card-title><br />
        <v-card-text
          >Are you sure you want to edit: <br />Display name:
          <b>{{ editedItem.display_name || "-" }}</b>
          <br />Username:
          <b>{{ editedItem.username || "-" }}</b>
          <br />Given name:
          <b>{{ editedItem.given_name || "-" }}</b>
          <br />Family name:
          <b>{{ editedItem.family_name || "-" }}</b>
          <br />Email:
          <b>{{ editedItem.email || "-" }}</b>
          <br />Group:
          <b>{{ editedItem.group || "-" }}</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="confirm1 = false">No</v-btn>
          <v-btn text color="success" @click="save()">Yes</v-btn>
        </v-card-actions></v-card
      >
    </v-dialog>

    <v-snackbar centered v-model="snackbar" :timeout="1000">
      {{ snackbartext }}
    </v-snackbar>
  </v-container>
</template>

<script>
import AddUser from "./components/add_user";
export default {
  components: { AddUser },
  data() {
    return {
      search: "",
      headers: [
        { sortable: false, value: "avatar.small", width: "1%" },
        { text: "Display Name", sortable: false, value: "display_name", width: "9%" },
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
      editedIndex: -1,
      editedItem: {
        display_name: "",
        username: "",
        given_name: "",
        family_name: "",
        email: "",
        group: "",
        isActive: true,
      },
      Info: [],
      items: ["coordinator", "program director", "lecturer"],
      snackbar: false,
      snackbartext: "success",
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      let query = `
              {
                users {
                    total
                    users {
                    display_name
                    username
                    given_name
                    family_name
                    email
                    group
                    createdAt
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
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res.data.data.users);
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
      // eslint-disable-next-line no-console
      console.log(this.Info[this.editedIndex]);
      let query = `
          mutation {
            updateAccount(username: "${this.editedItem.username}", userInput: {
              username: "${this.editedItem.username}"
              given_name: "${this.editedItem.given_name}",
              family_name:"${this.editedItem.family_name}",
              display_name: "${this.editedItem.display_name}"
              email:"${this.editedItem.email}"
              group:"${this.editedItem.group}"
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
  },
};
</script>

<style></style>
