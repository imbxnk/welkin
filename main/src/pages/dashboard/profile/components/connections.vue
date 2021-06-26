<template>
  <div class="wk-security">
    <v-card flat elevation="2">
      <v-card-title style="font-weight: 700">
        Connections
      </v-card-title>
      <v-card-text>
        <div class="d-flex wk-account-form d-flex flex-column">
          <v-expansion-panels v-model="panel" dark multiple accordion>
            <v-expansion-panel expand style="border-radius: 10px; background: #0dbc0d;">
              <v-expansion-panel-header  style="font-weight: 700 !important;">
                <div>LINE</div>
              </v-expansion-panel-header>
              <v-expansion-panel-content v-if="!isLoading" style="background: #fff; color: #666; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                <div class="mt-4 d-flex flex-sm-row flex-column w-100">
                  <div class="flex-grow-1 d-flex justify-content-center justify-content-sm-start mb-4 mb-sm-0 align-items-center">
                    Status: <span class="ms-4"><b>{{ authorizedApp.line ? 'Connected' : 'Not Connected'}}</b></span>
                  </div>
                  <div class="flex-shrink-1 d-flex align-items-center justify-content-center">
                    <label class="mb-0 flex-sm-grow-1 flex-shrink d-flex justify-content-end">Secret Code</label>
                    <v-text-field color="gray" readonly dense rounded outlined hide-details light v-model="secretcode.line"
                      append-icon="mdi-content-copy"
                      @click:append="copyText($refs.lineSecretCode)"
                      class="flex-grow-1 flex-sm-shrink-1 wk-line-secret-code-text ms-3 mt-0" ref="lineSecretCode">
                    </v-text-field>
                  </div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Connections',
  mounted() {
    this.getSecretcode()
  },
  data() {
    return {
      isLoading: true,
      isSuccess: false,
      error: '',
      authorizedApp: {
        line: null,
      },
      secretcode: {
        line: null,
      },
      panel: [0]
    }
  },
  methods: {
    getSecretcode() {
      let query = `
        {
          getSecretCode {
            lineUID
            lineSecretCode
          }
        }
      `
      query = query.replace(/\s+/g, ' ').trim()
      this.axios
        .post(process.env.VUE_APP_GRAPHQL_URL, { query }, { withCredentials: true })
        .then((res) => {
          this.secretcode.line = res.data.data.getSecretCode.lineSecretCode
          this.authorizedApp.line = res.data.data.getSecretCode.lineUID
          this.isLoading = false
        })
        .catch((err) => {
          this.isLoading = false
        });
    },
    copyText(ref) {
      console.log(ref)
      let textToCopy = ref.$el.querySelector('input')
      textToCopy.select()
      document.execCommand("copy");
    }
  },
}
</script>

<style scoped>

input, button {
  box-shadow: none !important;
}

button:disabled {
  cursor: not-allowed;
}

.wk-btn {
  width: 150px;
}

.wk-error {
  color: #e24056;
  margin-left: 10px;
}

.v-expansion-panel--active .v-item--active button {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.wk-line-secret-code-text {
  font-size: 1rem;
  font-weight: bold;
  max-width: 200px;
  text-align: center;
}

.wk-line-secret-code-text .v-input__control .v-input__slot input {
  outline: none !important;
}
</style>