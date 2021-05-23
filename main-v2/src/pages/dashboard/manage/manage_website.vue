<template>
  <v-card
    class="mx-auto"
    max-width="500"
  >
    <v-toolbar
      flat
      color="transparent"
    >
      <v-toolbar-title>Batches</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="updateConfig()"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container>
      <div style="color: #999;" v-if="selected.length === 0">No batches</div>
      <v-row
        class="m-0"
        align="center"
        justify="start"
      >
        <v-col
          v-for="(selection, i) in selections"
          :key="selection"
          class="shrink wk-chip"
          style="min-width: unset !important;"
        >
          <v-chip
            :disabled="loading"
            close
            @click:close="selected.splice(i, 1)"
          >
            {{ selection }}
          </v-chip>
        </v-col>
      </v-row>
    </v-container>
    <v-divider v-if="!allSelected"></v-divider>
    <v-container class="pt-0" v-if="!allSelected">
      <!-- <v-col
          cols="12"
        >
          <v-text-field
            ref="search"
            v-model="search"
            full-width
            hide-details
            label="Search"
            single-line
          ></v-text-field>
      </v-col> -->
      <!-- <v-list v-if="!allSelected">
        <template v-for="item in categories">
          <v-list-item
            v-if="!selected.includes(item)"
            :key="item"
            :disabled="loading"
            @click="selected.push(item)"
          >
            <v-list-item-title v-text="item"></v-list-item-title>
          </v-list-item>
        </template>
      </v-list> -->

      <div class="d-flex align-items-center">
        <template v-for="item in categories">
          <div class="wk-chip" :key="item">
            <v-chip
              v-if="!selected.includes(item)"
              :disabled="loading"
              @click="selected.push(item)"
            >
              {{ item }}
            </v-chip>
          </div>
        </template>
      </div>
    </v-container>

    <!-- <v-divider v-if="!allSelected"></v-divider> -->



    <!-- <v-divider></v-divider> -->

    <v-card-actions>
    </v-card-actions>
  </v-card>
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
      let query = `
          mutation {
            updateConfig(configInput: {
              selectedBatches: ${JSON.stringify(this.selected)}
            }) { success }
          }
      `;
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          console.log(res.data)
        })
        .catch((err) => {
          // this.loading = false;
        });
    },
  },
}
</script>

<style scoped>
.wk-chip {
  padding: 10px 10px 0 0;
}
</style>