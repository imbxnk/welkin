<template>
<div id="app">
  <v-card
    id="batches"
    class="mx-auto"
    max-width="500"
  >
    <div class="d-flex align-items-center mx-4 pt-4">
      <div class="d-flex flex-column flex-grow-1">
        <h5 class="m-0">Batches</h5>
        <span style="font-size: 0.9rem; opacity: 0.8">Select the batches to show on the website</span>
      </div>
      <v-btn
        icon
        @click="updateConfig()"
      >
        <v-icon v-if="!loading">mdi-check</v-icon>
        <div v-else class="wk-spinner mx-auto my-4"></div>
      </v-btn>
    </div>

    <v-container>
      <div
        class="m-0 d-flex flex-wrap flex-column"
        style="background: #efefef6e; border-radius: 20px; padding: 5px"
      >
        <div style="color: #999; font-size: 0.9rem; padding: 0 5px" v-if="selected.length === 0">No batches selected</div>
        <div style="color: #666; font-size: 0.8rem; padding: 0 5px" v-else>Selected Batches</div>
        <div class="d-flex flex-wrap">
          <template
            v-for="(selection, i) in selections"
          >
            <div :key="selection" class="wk-chip">
              <v-chip
                :disabled="loading"
                close
                @click:close="selected.splice(i, 1)"
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
        <template v-for="item in categories">
          <div v-if="!selected.includes(item)" class="wk-chip" :key="item">
            <v-chip
              :disabled="loading"
              @click="selected.push(item)"
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
</div>
</template>

<script>
export default {
  data: () => ({
    items: [],
    loading: false,
    search: '',
    selected: [],
  }),

  mounted() {
    this.getBatches()
    this.selected = this.$config.selectedBatches
  },

  computed: {
    allSelected() {
      return this.selected.length === this.items.length
    },
    categories() {
      const search = this.search.toLowerCase()

      if (!search) return this.items

      return this.items.filter(item => {
        const text = item.toLowerCase()

        return text.indexOf(search) > -1
      })
    },
    selections() {
      const selections = []

      for (const selection of this.selected) {
        selections.push(selection)
      }

      return selections
    },
  },

  watch: {
    selected() {
      this.search = ''
    },
  },

  methods: {
    next() {
      this.loading = true

      setTimeout(() => {
        this.search = ''
        this.selected = []
        this.loading = false
      }, 2000)
    },
    getBatches() {
      let query = `
          query {
            batches {
              total
              batches
            }
          }
      `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.items = res.data.data.batches.batches
        })
        .catch((err) => {
          // this.loading = false;
        });
    },
    updateConfig() {
      this.loading = true
      let query = `
          mutation {
            updateConfig(configInput: {
              selectedBatches: ${JSON.stringify(this.selected)}
            }) { success }
          }
      `;
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.loading = false
          if (res.data.data.updateConfig.success) {
            this.$config.selectedBatches = this.selected
          }
          console.log(res.data)
        })
        .catch((err) => {
          this.loading = false
        });
    },
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