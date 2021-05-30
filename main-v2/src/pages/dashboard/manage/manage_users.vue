<template>
  <div>
    <div class="d-flex flex-column p-2 bd-highlight">
      <div class="ml-auto p-2 bd-highlight">
        <v-btn color="primary" @click="dialog = true">Add User<v-icon>mdi-plus</v-icon></v-btn>
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
              {{ item.display_name == null ? "- " : item.display_name }}
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
          <v-icon @click="Editdialog = false">mdi-close</v-icon></v-card-title
        >
        <div class="pa-3">
          <v-form ref="form">
            <div class="d-flex px-3 justify-content-between flex-column flex-sm-row">
              <div class=" ">
                <v-text-field
                  label="display_name"
                  v-model="editedItem.display_name"
                  outlined
                ></v-text-field>
              </div>
              <div class="">
                <v-text-field
                  label="username"
                  v-model="editedItem.username"
                  outlined
                ></v-text-field>
              </div>
            </div>
            <div class="d-flex px-3  justify-content-between flex-column flex-sm-row">
              <div class="">
                <v-text-field
                  label="given_name"
                  v-model="editedItem.given_name"
                  outlined
                ></v-text-field>
              </div>
              <div class="">
                <v-text-field
                  label="Family name"
                  v-model="editedItem.family_name"
                  outlined
                ></v-text-field>
              </div>
            </div>

            <div class="d-flex justify-content-center flex-column">
              <div class="px-3">
                <v-text-field label="email" v-model="editedItem.email" outlined></v-text-field>
              </div>
            </div>
            <div class="d-flex justify-content-center flex-column">
              <div class="px-3">
                <v-select
                  :items="items"
                  v-model="editedItem.group"
                  label="Group"
                  outlined
                ></v-select>
              </div>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary">submit</v-btn>
            </v-card-actions>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
  </div>
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
        { text: "Email", sortable: false, value: "email", width: "9%" },
        { text: "Group", sortable: false, value: "group", width: "9%" },

        { text: "Edit", sortable: false, value: "actions", width: "1%" },
      ],
      users: [],
      total: 0,
      dialog: false,
      Editdialog: false,
      editedIndex: -1,
      editedItem: {
        display_name: "",
        username: "",
        given_name: "",
        family_name: "",
        email: "",
        group: "",
      },
      Info: [],
      items: ["coordinator", "program director", "lecturer"],
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      let query = `
              query {
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
                    avatar {
                        small
                        medium
                        large
                    }
                    }
                }
                }
          `;
      await this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res.data.data.users);
          this.total = res.data.data.users.total;
          this.users = res.data.data.users.users;
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
  },
};
</script>

<style></style>
