<template>
<v-container class="mx-auto">
  <div class="d-flex flex-column p-2 bd-highlight">
    <div class="p-2 bd-highlight">
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
                    :disabled="loading"
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
      <v-card style="max-width: auto">
        <div class="d-flex align-items-center mx-4 pt-4">
          <div class="d-flex flex-column flex-grow-1">
            <h5 class="m-0">Announcements</h5>
            <span style="font-size: 0.9rem; opacity: 0.8">Manage the announcements</span>
          </div>
        </div>
        <v-container>
          <div class="m-0 d-flex flex-wrap flex-column">
            <v-data-table
              :headers="announcements.headers"
              :items="announcements.items"
              mobile-breakpoint="0"
              class="px-3 pb-3"
              hide-default-footer
            >
              <template v-slot:[`item.user`]="{ item }">
                {{ item.user.display_name || item.user.username }}
              </template>
              <template v-slot:[`item.duration`]="{ item }">
                {{ getDuration(item.endDate, item.startDate) }}
              </template>
            </v-data-table>
          </div>
        </v-container>
      </v-card>
    </div>
  </div>
</v-container>
</template>

<script>
export default {
  data: () => ({
    batches: {
      items: [],
      loading: false,
      selected: [],
    },
    announcements: {
      headers: [
        { text: "Title", sortable: false, value: "title", width: "20%" },
        { text: "Content", sortable: false, value: "content", width: "60%" },
        { text: "Duration", sortable: false, value: "duration", width: "1%" },
        { text: "Creator", sortable: false, value: "user", width: "1%" },
      ],
      items: [],
      loading: false,
    }
  }),

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
          this.announcements.items = res.data.data.announcements.announcements
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
      let end = this.moment(parseInt(endDate))
      let duration = this.moment.duration(start.diff(end))
      return this.moment.utc(duration.as('milliseconds')).format('DD') + ' days'
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
</style>