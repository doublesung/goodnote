<template>
  <div 
    class="modal fade" 
    id="NotebookCreateModal" 
    tabindex="-1" 
    aria-labelledby="NotebookCreateModalLabel" 
    aria-hidden="true"
    :ref="el => setModalRef(el)"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="NotebookCreateModalLabel">創建一個新的筆記</h5>
          <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
         <form>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                <small>名稱</small>
              </label>
              <input 
                type="text" 
                class="form-control" 
                id="exampleInputEmail1" 
                aria-describedby="emailHelp"
                v-model="notebookName"
              >
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-primary"
            @click="createNotebook"
          >
            創建
          </button>
          <button 
            type="button" 
            class="btn btn-secondary" 
            ata-bs-dismiss="modal"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Modal } from 'bootstrap'
import { useRouter } from 'vue-router'
import { getDatabase, ref as dbRef, push, update, child } from 'firebase/database'

export default {
  name: 'NotebookCreateModal',
  setup() {
    const db = getDatabase()
    const router = useRouter()

    const notebookName = ref(null)

    const createNotebook = () => {
      if(notebookName.value) {
        const newKey = push(child(dbRef(db), 'notebooks')).key

        update(dbRef(db), {
          ['notebooks/' + newKey]: {
            name: notebookName.value,
            lists: '',
            isStart: false
          }
        })

        hideModal()
        
        router.push({ 
          path: '/' + notebookName.value + '/' + newKey
        })
      }
    }

    const modalRef = ref(null)
    
    const setModalRef = (el) => {
      if(el) {
        if(!modalRef.value) modalRef.value = new Modal(el)
      }
    }

    const hideModal = () => {
      modalRef.value.hide()
    }

    return {
      createNotebook,
      notebookName,
      setModalRef
    }
  }
}
</script>

<style></style>