<template>
  <div>
    <b-card>
      <validation-observer ref="simpleRules">
        <b-form>
          <b-row>
            <!-- Increment Group ID -->
            <b-col cols="12">
              <b-form-group
                  label=" Increment Group ID"
                  label-for="v-title"
              >
                <validation-provider
                    #default="{ errors }"
                    name="Entert Increment Group ID"
                    rules="required"
                >
                  <b-form-input
                      id="v-title"
                      v-model="post_values.title"
                      placeholder="Title"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <!-- Employee LIst -->
            <b-col cols="12">
              <b-form-group
                  label=" Employee LIst"
                  label-for="v-department"
              >
                <div>
                  <b-form
                      ref="form"
                      :style="{height: trHeight}"
                      class="repeater-form"
                      @submit.prevent="repeateAgain"
                  >

                    <!-- Row Loop -->
                    <b-row
                        v-for="(item, index) in items"
                        :id="item.id"
                        :key="item.id"
                        ref="row">

                      <!-- Item Name -->
                      <b-col md="4">

                        <b-form-input
                            id="item-name"
                            v-model="item.name"
                            placeholder="Employee Name"
                            type="text"
                        />
                      </b-col>

                      <!-- Remove Button -->
                      <b-col
                          class="mb-50"
                          lg="2"
                          md="3"
                      >
                        <b-button
                            v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                            class="mt-0 mt-md-2"
                            variant="outline-danger"
                            @click="removeItem(index)"
                        >
                          <feather-icon
                              class="mr-25"
                              icon="XIcon"
                          />
                          <span>Delete</span>
                        </b-button>
                      </b-col>
                      <b-col cols="12">
                        <hr>
                      </b-col>
                    </b-row>

                  </b-form>
                </div>
                <b-button
                    v-b-modal.modal-select2
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="primary"
                >
                  <feather-icon
                      class="mr-25"
                      icon="PlusIcon"
                  />
                  <span>Add Employee</span>
                </b-button>
              </b-form-group>
            </b-col>

          </b-row>
        </b-form>
      </validation-observer>
      <b-modal
          id="modal-select2"
          cancel-variant="outline-secondary"
          centered
          ok-title="submit"
          size="lg"
          title="Employee List"
      >
        <good-table-basic/>
      </b-modal>
    </b-card>

  </div>

</template>

<script>
import BCardCode from '@core/components/b-card-code/BCardCode.vue'
import vSelect from 'vue-select'
import {ValidationObserver, ValidationProvider} from 'vee-validate'
import {required} from '@validations'
import {VueGoodTable} from 'vue-good-table'
import {
  BAvatar,
  BButton,
  BCard,
  BCardText,
  BForm,
  BFormCheckbox,
  BFormFile,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BListGroup,
  BListGroupItem,
  BModal,
  VBModal,
} from 'bootstrap-vue'
import eResourcesAPI from '@/api/e_resources'
import Ripple from 'vue-ripple-directive'
import GoodTableBasic from './vue-good-table/GoodTableBasic'
/* eslint-disable */
export default {
  name: 'createResources',
  components: {
    BCardCode, VueGoodTable, GoodTableBasic,
    BAvatar, BModal,
    ValidationProvider,
    ValidationObserver,
    BFormTextarea,
    BButton,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BFormFile,
    BListGroup,
    BListGroupItem,
    BCardText,
    BCard,
    vSelect,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  /* eslint-disable */
  data() {
    return {
      pageLength: 3,
      dir: false,
      columns: [
        {
          label: 'Name',
          field: 'fullName',
        },
        {
          label: 'Email',
          field: 'email',
        },
        {
          label: 'Date',
          field: 'startDate',
        },
        {
          label: 'Salary',
          field: 'salary',
        },
        {
          label: 'Status',
          field: 'status',
        },
        {
          label: 'Action',
          field: 'action',
        },
      ],
      rows: [],
      searchTerm: '',
      status: [{
        1: 'Current',
        2: 'Professional',
        3: 'Rejected',
        4: 'Resigned',
        5: 'Applied',
      },
        {
          1: 'light-primary',
          2: 'light-success',
          3: 'light-danger',
          4: 'light-warning',
          5: 'light-info',
        }],
      addEmployeePopupActive: false,
      items: [{
        id: 1,
        name: 'male',
        prevHeight: 0,
      }],
      nextTodoId: 2,
      file: '',
      id_back: '',
      doc: {
        resource_name: '',
        cover_name: ''
      },
      post_values: {
        author: '',
        department: '',
        title: '',
        resource: '',
        type: '',
        description: ''
      },
      model: {
        file: '',
        coverPhoto: '',
        resource: '',
        department: '',
        departmentOptions: ['Nursing', 'BMS', 'Psychology', 'Marketing', 'Acupuncture', 'IT', 'HR', 'Accounting'],
        type: ['Book', 'Journal', 'Magazine', 'PDF', 'Article'],
        resourceOptions: ['Thesis', 'General'],
        option: [{title: 'Square'}, {title: 'Rectangle'}, {title: 'Rombo'}, {title: 'Romboid'}],
      }
    }
  },
  computed: {
    statusVariant() {
      const statusColor = {
        /* eslint-disable key-spacing */
        Current: 'light-primary',
        Professional: 'light-success',
        Rejected: 'light-danger',
        Resigned: 'light-warning',
        Applied: 'light-info',
        /* eslint-enable key-spacing */
      }

      return status => statusColor[status]
    },
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = true
        return this.dir
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = false
      return this.dir
    },
  },
  created() {
    this.$http.get('/good-table/basic')
        .then(res => {
          this.rows = res.data
        })
  },
  setup() {
    return {
      required,
    }
  },
  methods: {
    repeateAgain() {
      this.addEmployeePopupActive = true;
      this.items.push({
        id: this.nextTodoId += this.nextTodoId,
      })

      this.$nextTick(() => {
        this.trAddHeight(this.$refs.row[0].offsetHeight)
      })
    },
    removeItem(index) {
      this.items.splice(index, 1)
      this.trTrimHeight(this.$refs.row[0].offsetHeight)
    },

    validationForm() {
      this.$refs.simpleRules.validate()
          .then(success => {
            if (success) {

              this.submit()
            }
          })
    },
    async submit() {
      this.flipIn()
      await eResourcesAPI.create(this.post_values)
          .then((response) => {
            console.log('update')
            // toast("Order removed successfully", "success");
            this.submitFile(response)
          })
          .catch(({response}) => {
            this.error = response.data.error
            console.log(this.error)
          })
    },
    handleFileUpload(event) {
      this.model.file = event.target.files[0]
    },
    handleFileUploadCoverPhoto(event) {
      this.model.coverPhoto = event.target.files[0]
    },

    async submitFile(response) {
      var id = response.data.id
      let formData = new FormData()
      formData.append('files', this.model.file)
      formData.append('cover', this.model.coverPhoto)
      await eResourcesAPI.fileUpload(formData, id)
          .then(response => {
            this.$router.go(-1)
          })
          .catch(({response}) => {
            this.error = response.data.error
            console.log(this.error)
            console.log('FAILURE!!')
          })
    },
    flipIn() {
      this.$swal({
        title: 'Please wait uploading the document',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        showClass: {
          popup: 'animate__animated animate__flipInX',
        },
        buttonsStyling: false,
      })
    },
  },
}

</script>

<style scoped>

</style>
