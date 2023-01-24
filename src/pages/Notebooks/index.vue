<template>
  <div class="w-100 h-100 mx-4 pt-4 overflow-auto">
    <div style="min-width: 310px">
      <h1 class="fs-3 mb-4 fw-bold">我的筆記</h1>
      <div class="border-bottom w-100 d-flex justify-content-between mb-4 pb-2">
        <div>{{ Object.keys(notebooks.data).length }}個筆記</div>
        <div class="d-flex align-items-center">
          <button 
            type="button" 
            class="border-0 bg-transparent me-2 text-reset" 
            data-bs-toggle="modal" 
            data-bs-target="#NotebookCreateModal"
          >
            <strong>
              <i class="ri-add-circle-line" style="vertical-align: -5%"></i>
              創建筆記
            </strong>
          </button>
        </div>
      </div>
      <div v-if="Object.keys(notebooks.data).length">
        <router-link 
          class="nav-link"
          :to="'/' + notebook.name + '/' + index" 
          v-for="(notebook, index) in notebooks.data" :key="index"  
        >
          <div class="list-item rounded-3 border py-2 px-3 mb-3">
            <i class="ri-file-text-fill pe-2"></i>
            {{ notebook.name }}
          </div>
        </router-link>
      </div>
      <div v-else>還沒建立任何筆記</div>
    </div>

    <NotebookCreateModal/>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'

import NotebookCreateModal from '../../components/NotebookCreateModal'

export default {
  name: 'Notebooks',
  components: {
    NotebookCreateModal
  },
  setup() {
    const db = getDatabase()
    const notebooksRef = dbRef(db, 'notebooks')
    const notebooks = reactive({ data: {} })

    onValue(notebooksRef, (snapshot) => {
      notebooks.data = snapshot.val()
    })

    return {
      notebooks,
    }
  }
}
</script>

<style scoped lang='scss'>

  $bg-color-hover: #eceff1;

  .list-item {
    transition: .3s ease;

    &:hover {
      background-color: $bg-color-hover;
    }
  }

</style>
