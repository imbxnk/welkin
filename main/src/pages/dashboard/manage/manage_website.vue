<template>
<v-container class="mx-auto">
  <div class="d-flex flex-column p-2 bd-highlight">
    <div class="p-2 bd-highlight">
      <!-- SELECTED BATCHES -->
      <v-card style="max-width: auto">
          <div class="d-flex align-items-center mx-4 pt-4">
            <div class="d-flex flex-column flex-grow-1">
              <h5 class="m-0">Batches</h5>
              <span style="font-size: 0.9rem; opacity: 0.8">Select the batches to show on the website</span>
            </div>
            <v-btn
              icon
              @click="updateSelectedBatches()"
            >
              <v-icon v-if="!batches.loading">mdi-check</v-icon>
              <div v-else class="wk-spinner mx-auto my-4"></div>
            </v-btn>
          </div>

          <v-container>
            <div
              class="m-0 d-flex flex-wrap flex-column"
              style="background: #efefef6e; border-radius: 20px; padding: 5px"
            >
              <div style="color: #999; font-size: 0.9rem; padding: 0 5px" v-if="batches.selected.length === 0">No batches selected</div>
              <div style="color: #666; font-size: 0.8rem; padding: 0 5px" v-else>Selected Batches</div>
              <div class="d-flex flex-wrap">
                <template
                  v-for="(selection, i) in selections"
                >
                  <div :key="selection" class="wk-chip">
                    <v-chip
                      :disabled="batches.loading"
                      close
                      @click:close="batches.selected.splice(i, 1)"
                    >
                      <span class="wk-chip-text">{{ selection }}</span>
                    </v-chip>
                  </div>
                </template>
              </div>
            </div>
          </v-container>
          <v-divider v-if="!allSelected"></v-divider>
          <v-container class="pt-0" v-if="!allSelected">
            <div style="font-size: 0.8rem; color: #666; padding: 0 5px" v-if="!allSelected">Available Batches</div>
            <div class="d-flex align-items-center">
              <template v-for="item in batches.items">
                <div v-if="!batches.selected.includes(item)" class="wk-chip" :key="item">
                  <v-chip
                    :disabled="batches.loading"
                    @click="batches.selected.push(item); batches.selected.sort()"
                  >
                    <span class="wk-chip-text">{{ item }}</span>
                  </v-chip>
                </div>
              </template>
            </div>
          </v-container>
          <v-card-actions>
          </v-card-actions>
      </v-card>

      <v-divider></v-divider>
      <!-- ANNOUNCEMENT -->
      <v-card style="max-width: auto">
        <div class="d-flex align-items-center mx-4 pt-4">
          <div class="d-flex flex-column flex-grow-1">
            <h5 class="m-0">Announcements</h5>
            <span style="font-size: 0.9rem; opacity: 0.8">Manage the announcements</span>
          </div>
          <v-btn
              icon
              @click="announcements.addDialog = true"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
        </div>
        <v-container>
          <div class="m-0 d-flex flex-wrap flex-column">
            <v-data-table
              :headers="announcements.headers"
              :items="announcements.items"
              mobile-breakpoint="0"
              :hide-default-footer="announcements.items.length <= 5"
            >
              <template v-slot:[`item.title`]="{ item }">
                <div class="text-truncate" style="max-width: 100px;">
                  {{ item.title }}
                </div>
              </template>
              <template v-slot:[`item.content`]="{ item }">
                <div class="text-truncate" style="max-width: 400px;">
                  {{ item.content }}
                </div>
              </template>
              <template v-slot:[`item.user`]="{ item }">
                {{ item.user.display_name || item.user.username }}
              </template>
              <template v-slot:[`item.duration`]="{ item }">
                {{ getDuration(item.startDate, item.endDate) }}
              </template>
              <template v-slot:[`item.edit`]="{ item }">
                <v-icon small @click="editItem(item, announcements.items.indexOf(item))">
                  mdi-pencil
                </v-icon>
              </template>
              <template v-slot:[`item.delete`]="{ item }">
                <v-icon small @click="confirmDelete(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </div>
        </v-container>
      </v-card>

      <v-dialog persistent v-model="announcements.addDialog" max-width="500px">
        <v-card>
          <v-card-title
            >Add Announcement
            <v-spacer></v-spacer>
            <v-icon @click="announcements.addDialog = false" tabindex="-1">mdi-close</v-icon></v-card-title
          >
          <v-card-text class="mt-4">
            <v-text-field
              v-model="announcements.newAnnouncement.title"
              label="Subject"
              outlined
              dense
            ></v-text-field>

            <v-menu
              ref="startDateMenu"
              v-model="announcements.startDateMenu"
              :close-on-content-click="false"
              :return-value.sync="announcements.newAnnouncement.range"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateRangeText"
                  label="Duration"
                  append-outer-icon="mdi-calendar"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="announcements.newAnnouncement.range"
                no-title
                range
                :allowed-dates="disablePastDates"
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="#999"
                  @click="announcements.startDateMenu = false; announcements.newAnnouncement.range = []"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  :disabled="announcements.newAnnouncement.range.length < 2"
                  @click="$refs.startDateMenu.save(announcements.newAnnouncement.range)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
            <WYSIWYG v-model="announcements.newAnnouncement.content" placeholder="Content"></WYSIWYG>
          </v-card-text>
          <v-card-actions class="pb-4 d-flex justify-content-end">
            <v-btn
              :disabled="announcements.newAnnouncement.content.length <= 7 || announcements.newAnnouncement.title.length == 0 || announcements.newAnnouncement.range.length < 2"
              color="primary"
              @click="addAnnouncement"
            >Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- DELETE ANNOUNCEMENT DIALOG -->
      <v-dialog v-model="announcements.deleteDialog" max-width="500px">
        <v-card>
          <v-card-title
            >Are you sure you want to delete?
            <v-spacer></v-spacer>
            <v-icon @click="announcements.deleteDialog = false" tabindex="-1">mdi-close</v-icon></v-card-title
          >
          <v-card-text class="mt-4">
            Warning! This cannot be undone.
            <div class="mt-3">
              Title: <strong>{{ announcements.deletedItem.title }}</strong>
              <div class="p-2 wk-del-content" v-html="announcements.deletedItem.content">
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="pb-4 d-flex justify-content-end">
            <v-btn
              color="gray"
              text
              @click="announcements.deleteDialog = false"
            >Cancel</v-btn>
            <v-btn
              color="error"
              @click="deleteAnnouncement"
            >Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- EDIT ANNOUNCEMENT DIALOG -->
      <v-dialog persistent v-model="announcements.editDialog" max-width="500px">
        <v-card>
          <v-card-title>
            Edit Announcement
            <v-spacer></v-spacer>
            <v-icon @click="announcements.editDialog = false" tabindex="-1">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="mt-4">
            <v-text-field
              v-model="announcements.editedItem.title"
              label="Subject"
              outlined
              dense
            ></v-text-field>
            <div class="d-flex">
              <v-menu
                v-model="announcements.startDateMenuEdit"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startDateRangeText"
                    label="Start Date"
                    outlined
                    readonly
                    append-icon="mdi-calendar"
                    dense
                    v-bind="attrs"
                    v-on="on"
                    class="me-2"
                  ></v-text-field>
                </template>
                <v-date-picker
                  no-title
                  v-model="startDateRangeText"
                  @input="announcements.startDateMenuEdit = false"
                  :allowed-dates="disablePastDates"
                ></v-date-picker>
              </v-menu>

              <v-menu
                v-model="announcements.endDateMenuEdit"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDateRangeText"
                    label="End Date"
                    outlined
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    append-icon="mdi-calendar"
                    dense
                    class="ms-2"
                  ></v-text-field>
                </template>
                <v-date-picker
                  no-title
                  v-model="endDateRangeText"
                  @input="announcements.endDateMenuEdit = false"
                  :allowed-dates="disablePastDates"
                ></v-date-picker>
              </v-menu>
            </div>
            <WYSIWYG v-model="announcements.editedItem.content" placeholder="Content"></WYSIWYG>
          </v-card-text>
          <v-card-actions class="pb-4 d-flex justify-content-end">
            <v-btn
              :disabled="announcements.editedItem.content.length <= 7 || announcements.editedItem.title.length == 0"
              color="primary"
              @click="updateAnnouncement"
            >Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</v-container>
</template>

<script>
import WYSIWYG from './components/editor.vue'
export default {
  data: () => ({
    batches: {
      items: [],
      loading: false,
      selected: [],
    },
    announcements: {
      headers: [
        { text: "Title", sortable: false, value: "title", width: "10%" },
        { text: "Content", sortable: false, value: "content", width: "60%" },
        { text: "Status", sortable: false, value: "duration", width: "10%", align: "center" },
        { text: "Creator", sortable: false, value: "user", width: "10%" },
        { text: "Edit", sortable: false, value: "edit", width: "1%", align: "center" },
        { text: "Delete", sortable: false, value: "delete", width: "1%", align: "center" },
      ],
      items: [],
      addDialog: false,
      deleteDialog: false,
      editDialog: false,
      startDateMenu: false,
      startDateMenuEdit: false,
      newAnnouncement: {
        title: '',
        content: '',
        range: [],
      },
      editedIndex: -1,
      editedItem: {
        _id: '',
        title: '',
        content: '',
        startDate: '0',
        endDate: '0',
      },
      deletedItem: {
        _id: '',
        title: '',
        content: '',
        range: [],
      },
      loading: false,
    }
  }),

  components: {
    WYSIWYG
  },

  mounted() {
    this.getBatches()
    this.batches.selected = this.$config.selectedBatches
    this.getAnnouncements()
  },

  computed: {
    allSelected() {
      return this.batches.selected.length === this.batches.items.length
    },
    selections() {
      const selections = []

      for (const selection of this.batches.selected) {
        selections.push(selection)
      }

      return selections
    },
    dateRangeText () {
      return this.announcements.newAnnouncement.range.join(' to ')
    },
    startDateRangeText: {
      get: function () {
        return this.moment(parseInt(this.announcements.editedItem.startDate)).utcOffset(7).format('YYYY-MM-DD')
      },
      set: function (newValue) {
        this.announcements.editedItem.startDate = this.moment(newValue, 'YYYY-MM-DD').format('x')
      }
    },
    endDateRangeText: {
      get: function () {
        return this.moment(parseInt(this.announcements.editedItem.endDate)).utcOffset(8).format('YYYY-MM-DD')
      },
      set: function (newValue) {
        this.announcements.editedItem.endDate = this.moment(newValue, 'YYYY-MM-DD').format('x')
      }
    },
  },

  watch: {
  },

  methods: {
    getBatches() {
      let query = `
          {
            batches {
              total
              batches
            }
          }
      `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.batches.items = res.data.data.batches.batches
        })
        .catch((err) => {
          // this.loading = false;
        });
    },
    getAnnouncements() {
      let query = `
          {
            announcements {
              announcements {
                _id
                title
                content
                user {
                  display_name
                  username
                }
                createdAt
                startDate
                endDate
              }
            }
          }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.announcements.items = [...res.data.data.announcements.announcements]
        })
        .catch((err) => {
          // this.loading = false;
        });
    },
    updateSelectedBatches() {
      this.batches.loading = true
      let query = `
          mutation {
            updateConfig(configInput: {
              selectedBatches: ${JSON.stringify(this.batches.selected)}
            }) { success }
          }
      `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.batches.loading = false
          if (res.data.data.updateConfig.success) {
            this.$config.selectedBatches = this.batches.selected
          }
        })
        .catch((err) => {
          this.batches.loading = false
        });
    },
    getDuration(startDate, endDate) {
      let start = this.moment(parseInt(startDate))
      let now = this.moment()
      let end = this.moment(parseInt(endDate))
      let duration = this.moment.duration(end.diff(now)).asDays()
      if(start > now && end > now) return 'Scheduled'
      return now < end ? (~~duration+1) + ' days' : 'End'
    },
    disablePastDates(val) {
      let current = this.moment().utcOffset(7).format('YYYY-MM-DD')
      return val >= current
    },
    confirmDelete(item) {
      this.announcements.deleteDialog = true
      this.announcements.deletedItem = item
    },
    addAnnouncement() {
      this.announcements.loading = true
      let startDate = this.moment(this.announcements.newAnnouncement.range[0]).format('x')
      let endDate = this.moment(this.announcements.newAnnouncement.range[1]).format('x')
      if(startDate > endDate) {
        let tmp = startDate
        startDate = endDate
        endDate = tmp
      }
      let query = `
          mutation {
            createAnnouncement(announcementInput: {
              title: "${this.announcements.newAnnouncement.title}",
              content: "${this.announcements.newAnnouncement.content.replaceAll(`"`,`'`)}",
              startDate: "${startDate}"
              endDate: "${endDate}"
            }) {
              _id
              title
              content
              user {
                display_name
                username
              }
              createdAt
              startDate
              endDate
            }
          }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res.data.data.createAnnouncement)
          this.announcements.loading = false;
          this.announcements.addDialog = false;
          this.announcements.startDateMenu = false;
          this.announcements.items.unshift(res.data.data.createAnnouncement)
          this.announcements.newAnnouncement = {
            title: '',
            content: '',
            range: [],
          }
        })
        .catch((err) => {
          console.log(err)
          this.announcements.loading = false;
        });
    },
    deleteAnnouncement() {
      this.announcements.loading = true
      let query = `
          mutation {
            deleteAnnouncement(id: "${this.announcements.deletedItem._id}") {
              success
              message
            }
          }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res.data)
          this.announcements.loading = false;
          this.announcements.deleteDialog = false;
          this.announcements.items.splice(this.announcements.items.indexOf(this.announcements.deletedItem), 1)
        })
        .catch((err) => {
          console.log(err)
          this.announcements.loading = false;
        });
    },
    editItem(item, index) {
      this.editedIndex = index
      this.announcements.editedItem = Object.assign({}, item)
      this.announcements.editDialog = true
    },
    updateAnnouncement() {
      this.announcements.loading = true
      let editAnnouncement = this.announcements.editedItem
      // let startDate = this.moment(editAnnouncement.startDate).format('x')
      // let endDate = this.moment(editAnnouncement.endDate).format('x')
      let startDate = editAnnouncement.startDate
      let endDate = editAnnouncement.endDate
      if(startDate > endDate) {
        let tmp = startDate
        startDate = endDate
        endDate = tmp
      }
      let query = `
        mutation {
          editAnnouncement(id: "${editAnnouncement._id}", announcementInput: {
            title: "${editAnnouncement.title}",
            content: "${editAnnouncement.content.replaceAll(`"`,`'`)}",
            startDate: "${startDate}",
            endDate: "${endDate}"
          }) {
            success
            message
          }
        }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          if(this.editedIndex > -1) {
            Object.assign(this.announcements.items[this.editedIndex], this.announcements.editedItem)
          } else {
            this.announcements.items.push(this.announcements.editedItem)
          }
          this.announcements.loading = false;
          this.announcements.editDialog = false;
        })
        .catch((err) => {
          console.log(err)
          this.announcements.loading = false;
        });
    }
  },
}
</script>

<style scoped>
.wk-chip {
  padding: 4px;
}

.wk-chip .v-chip .v-chip__content .wk-chip-text {
  max-width: 124px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.wk-spinner {
	pointer-events: none;
	width: 1.5em;
	height: 1.5em;
	border: 0.3em solid transparent;
	border-color: #eee;
	border-top-color: #3E67EC;
	border-radius: 50%;
	animation: loadingspin 1s linear infinite;
}

h5 {
  font-weight: 700;
}

@keyframes loadingspin {
	100% {
		transform: rotate(360deg)
	}
}

.v-picker--date, .v-menu__content {
  border-radius: 20px !important;
}

.wk-del-content {
  background: rgb(249, 249, 249); border-radius: 10px;
}

.wk-del-content >>> p {
  margin: 0 !important
}
</style>