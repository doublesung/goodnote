<template>
  <div class="d-flex flex-column w-100 h-100 overflow-auto">
    <!-- 筆記標題 -->
    <div class="d-flex flex-wrap justify-content-between align-items-center border-bottom m-4">
      <div class="d-flex flex-wrap align-items-center mw-100">
        <h1 class="fs-3 mb-0 me-3 fw-bold text-truncate mb-2">{{ notebook.data.name }}</h1>
        <button 
          type="button" 
          class="btn btn-light mb-2"
          @click="setStart"
        >
          <i v-if="!notebook.data.isStart" class="ri-star-line"></i>
          <i v-else class="ri-star-fill text-warning"></i>
        </button>
      </div>
      <div class="d-flex flex-wrap">
        <div class="dropdown d-flex flex-shrink-0 me-2 mb-2">
          <div 
            id="dropdownTagNone" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <button
              type="button" 
              class="btn" 
              :class="tagIdFilter ? 'btn-primary rounded-0 rounded-start' : 'btn-light'"
            >
              <i class="ri-filter-3-line me-2"></i>
              <span>{{ tagIdFilter ? '標籤篩選中' : '標籤篩選' }}</span>
            </button>
          </div>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownTagNone">
            <template v-if="notebook.data.tags">
              <li 
                class="dropdown-item pointer"
                :class="{ 'active': tagIdFilter === tagKey }"
                v-for="(tag, tagKey) in notebook.data.tags" :key="tagKey"
                @click="tagIdFilter = tagKey"
              >
                <i class="ri-price-tag-line me-1"></i>
                {{ tag }}
              </li>
            </template>
            <li v-else class="text-nowrap px-3">尚未添加任何標籤</li>
          </ul>
          <button 
            v-if="tagIdFilter"
            type="button" 
            class="btn btn-primary rounded-0 rounded-end p-0 px-1 border-start" 
            @click="tagIdFilter = null"
          >
            <i class="ri-close-line fs-5"></i>
          </button>
        </div>
        <div class="dropdown mb-2">
          <button 
            type="button" 
            class="btn btn-light" 
            id="dropdownTagList" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <i class="ri-more-fill"></i>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownTagList">
            <li class="dropdown-item pointer" @click="deleteNotebook">
              <i class="ri-delete-bin-line fs-5 me-1"></i>
              刪除
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex-fill d-flex align-items-start overflow-auto h-auto px-4 pb-4">
      <!-- 區段 -->
      <div 
        class="bg-light p-2 rounded border me-4 list-width mh-100 d-flex flex-column"
        v-for="(list, listKey) in notebook.data.lists" 
        :key="listKey"
      >
        <!-- 標題 -->
        <div class="d-flex align-items-center mb-2 w-100 px-2">
          <button 
            class="text-truncate btn border border-light text-start w-100"
            :class="{ 'd-none': controlListRenameInputVisible(listKey) }"
            @click="showListRenameInput(listKey)"
          >
            {{ list.name }}
          </button>
          <input 
            class="form-control me-2" 
            :class="{ 'd-none': !controlListRenameInputVisible(listKey) }"
            type="text" 
            placeholder="新列表" 
            v-model="list.name"
            :ref="el => setListRenameInputRefs(el, listKey)"
            @blur="handleListRenameInput(listKey, list.name)"
          >
          <button 
            type="button" 
            class="btn btn-light p-0 px-1"
            id="dropdownMenuList" 
            data-bs-toggle="dropdown" 
            data-bs-auto-close="true" 
            aria-expanded="false"
          >
            <i class="ri-more-fill fs-5"></i>
          </button>
          <ul 
            class="dropdown-menu" 
            aria-labelledby="dropdownMenuList"
            @click="deleteList(listKey)"
          >
            <li class="dropdown-item pointer">
              <i class="ri-delete-bin-line fs-5 me-1"></i>
              刪除
            </li>
          </ul>
        </div>
        <div class="list-items mh-100 overflow-auto px-2">
          <!-- 記事 -->
          <template v-for="(item, itemKey) in list.items" :key="itemKey">
            <div 
              v-if="filterItem(item.tags)"
              class="mb-3 mh-100 overflow-auto"
              type="button" 
              data-bs-toggle="modal" 
              data-bs-target="#itemModal"
              @click="setTargetId(listKey, itemKey)"
            >
              <div 
                class="bg-white rounded p-3 item-hover"
              > 
                <!-- 標題 -->
                <div class="mb-1 fs-5 text-break">{{ item.title }}</div>
                <!-- 標籤 -->
                <div 
                  class="d-inline rounded-pill bg-primary py-1 px-2 me-2"
                  v-for="(tag, tagKey) in item.tags" :key="tagKey"
                >
                  <small class="me-1 text-white">{{ tag }}</small>
                </div>
                <!-- 截止日 -->
                <div v-if="item.deadline" class="d-inline-block me-2">
                  <i class="ri-time-line"></i>
                  {{ item.deadline.date }}
                </div>
                <!-- 筆記 -->
                <i v-if="item.note" class="ri-align-left me-2"></i>
                <!-- 待辦清單 -->
                <div v-if="item.checklists" class="d-inline-block me-2">
                  <i class="ri-checkbox-line"></i>
                  {{ countCheckedNumber(item.checklists) }}
                </div>
                <!-- 檔案 -->
                <div v-if="item.files" class="d-inline-block">
                  <i class="ri-attachment-line"></i>
                  {{ Object.keys(item.files).length }}
                </div>
              </div>
            </div>
          </template>
          <!-- 新增記事 -->
          <div class="d-grid gap-2">
            <button 
            type="button"
              class="btn btn-light text-reset py-0" 
              :class="{ 'd-none': controlItemAddSectionVisible(listKey) }"
              :ref="el => setItemAddSectionRefs(el, listKey, 'showButton')"
              @click="showItemAddTextarea(listKey)"
            >
              <i class="ri-add-fill fs-5 me-1"></i>
              <span>新增記事</span>
            </button>
          </div>
          <textarea 
            class="form-control my-3 border"
            :class="{ 'd-none': !controlItemAddSectionVisible(listKey) }"
            placeholder="增加項目" 
            rows="2"
            :ref="el => setItemAddSectionRefs(el, listKey, 'textarea')"
            @blur="handleItemAddSection(listKey)"
            @keypress.enter="handleItemAddSection(listKey)"
          ></textarea>
        </div>
      </div>
      <!-- 新增區段 -->
      <form>
        <button
          type="button" 
          class="btn btn-light border list-width"
          :class="{ 'd-none': listAddSectionRefs.isEdit }"
          :ref="el => listAddSectionRefs.showButton = el" 
          @click="showListAddInputWrapper"
        > 
          <i class="ri-add-fill fs-5"></i>
          新增其他列表
        </button>
        <div 
          class="list-width"
          :class="{ 'd-none': !listAddSectionRefs.isEdit }"
        >
          <input 
            type="text" 
            class="form-control mb-3" 
            placeholder="增加項目"
            :ref="el => listAddSectionRefs.input = el"
            v-model="listAddSectionRefs.inputValue"
          >
          <button 
            type="button" 
            class="btn btn-primary me-2" 
            :ref="el => listAddSectionRefs.addButton = el" 
            @click="addList"
          >
            新增
          </button>
          <button type="button" class="btn">取消</button>
        </div>
      </form>
    </div>
    
    <ItemModal :notebook="notebook" @setTargetId="setTargetId"/>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { reactive, computed, ref, nextTick, watch } from 'vue'
import { 
  getDatabase, ref as dbRef, onValue, push, child, update, remove
} from 'firebase/database'

import ItemModal from '../../components/ItemModal'

export default {
  name: 'Notebook',
  components: {
    ItemModal
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const db = getDatabase()
    const notebookId = computed(() => route.params.key)

    //#region notebook處理
    const notebook = reactive({ 
      data: {},
      notebookId: notebookId,
      listId: '',
      itemId: ''
    })

    watch(notebookId, () => { setTargetId() })

    watch(notebookId, () => {
      const notebookRef = dbRef(db, 'notebooks/' + notebookId.value)

      onValue(notebookRef, (snapshot) => {
        notebook.data = snapshot.val() ? snapshot.val() : {}
      })
    }, { immediate: true })

    // 目標id
    const setTargetId = (listId, itemId) => {
      notebook.listId = listId
      notebook.itemId = itemId
    }

    const deleteNotebook = () => {
      const path = 'notebooks/' + notebookId.value

      remove(dbRef(db, path))

      router.push({ name: 'Notebooks' })
    }
    //#endregion

    //#region 列表處理
    const listAddSectionRefs = reactive({
      isEdit: false,
      showButton: '',
      input: '',
      inputValue: '',
      addButton: ''
    })

    const showListAddInputWrapper = () => {
      listAddSectionRefs.isEdit = true
      
      const app = document.getElementById('app')

      const hideListAddInputWrapper = (event) => {
        let { isEdit, input, addButton, showButton } = listAddSectionRefs
        
        if(isEdit) {
          const isInput = input.contains(event.target)
          const isAddButton = addButton.contains(event.target)
          const isShowButton = showButton.contains(event.target)

          if(!isShowButton) {
            if(!isInput && !isAddButton) {
              listAddSectionRefs.isEdit = false
              
              app.removeEventListener('click', hideListAddInputWrapper)
            }
          }
        }
      }
      
      app.addEventListener('click', hideListAddInputWrapper)

      nextTick(() => {
        listAddSectionRefs.input.focus()
      })
    }

    const addList = () => {
      const { inputValue, input } = listAddSectionRefs

      if(inputValue) {
        const path = 'notebooks/' + notebookId.value + '/lists'
        const newKey = push(child(dbRef(db), path)).key

        update(dbRef(db), {
          [path + '/' + newKey]: {
            name: inputValue,
            items: ''
          }
        })

        listAddSectionRefs.isEdit = false
        listAddSectionRefs.inputValue = ''
      }else {
        input.focus()
      }
    }

    const deleteList = (listKey) => {
      const path = 'notebooks/' + notebookId.value + '/lists/' + listKey

      remove(dbRef(db, path))
    }

    const listRenameInputRefs = reactive({})

    const setListRenameInputRefs = (el, id) => {
      if(el) {
        if(!listRenameInputRefs[id]) {
          listRenameInputRefs[id] = {
            isEdit: false,
            input: el
          }
        }
      }else {
        delete listRenameInputRefs[id]
      }
    }

    const controlListRenameInputVisible = (listId) => {
      const listRenameInput = listRenameInputRefs[listId]

      if(listRenameInput) return listRenameInput.isEdit
    }

    const showListRenameInput = (id) => {
      listRenameInputRefs[id].isEdit = true

      nextTick(() => {
        listRenameInputRefs[id].input.focus()
      })
    }

    const handleListRenameInput = (id, value) => {
      renameList(id, value)

      listRenameInputRefs[id].isEdit = false
    }

    const renameList = (id, value) => {
      const path = 'notebooks/' + notebookId.value + '/lists/' + id + '/name'

      update(dbRef(db), {
        [path]: value
      })
    }
    //#endregion

    //#region 新增記事
    const itemAddSectionRefs = reactive({})

    const setItemAddSectionRefs = (el, listId, elId) => {
      if(el) {
        if(!itemAddSectionRefs[listId]) {
          itemAddSectionRefs[listId] = {
            isEdit: false
          }
        }else {
          itemAddSectionRefs[listId][elId] = el
        }
      }else {
        delete itemAddSectionRefs[listId]
      }
    }
    
    const controlItemAddSectionVisible = (listId) => {
      const itemAddSection = itemAddSectionRefs[listId]

      if(itemAddSection) return itemAddSection.isEdit
    }

    const showItemAddTextarea = (listId) => {
      itemAddSectionRefs[listId].isEdit = true 

      nextTick(() => {
        const textarea = itemAddSectionRefs[listId].textarea
        const divWrapper = textarea.parentNode

        textarea.focus()
        
        divWrapper.scrollTop = divWrapper.scrollHeight
      })
    }

    const handleItemAddSection = (listId) => {
      itemAddSectionRefs[listId].isEdit = false 

      const value = itemAddSectionRefs[listId].textarea.value

      addItem(value, listId)
    }

    const addItem = (value, listId) => {
      if(value) {
        const path = 'notebooks/' + notebookId.value + '/lists/' + listId + '/items'
        const newKey = push(child(dbRef(db), path)).key

        update(dbRef(db), {
          [path + '/' + newKey]: {
            title: value,
            note: '',
            tags: ''
          }
        })

        itemAddSectionRefs[listId].textarea.value = ''
      }
    }
    //#endregion

    //#region 標籤篩選
    const tagIdFilter = ref(null)

    const filterItem = (tags) => {
      if(tagIdFilter.value) {
        return tags[tagIdFilter.value]
      }else {
        return true
      }
    }
    //#endregion
    
    // 星號處理
    const setStart = () => {
      const path = 'notebooks/' + notebookId.value

      update(dbRef(db), {
        [path + '/isStart']: !notebook.data.isStart
      })
    }

    const countCheckedNumber = (checklists) => {
      let allChecks = 0
      let allChecked = 0
      const checksArray = Object.values(checklists)

      for (let i = 0; i < checksArray.length; i++) {
        const checkArray = Object.values(checksArray[i].checks)

        allChecks += checkArray.length

        for (let j = 0; j < checkArray.length; j++) {
          if(checkArray[j].checked) allChecked++
        }
      }

      return allChecked + '/' + allChecks
    }

    return {
      notebook,
      setTargetId,
      deleteNotebook,
      listAddSectionRefs,
      showListAddInputWrapper,
      addList,
      deleteList,
      listRenameInputRefs,
      setListRenameInputRefs,
      controlListRenameInputVisible,
      showListRenameInput,
      handleListRenameInput,
      itemAddSectionRefs,
      setItemAddSectionRefs,
      showItemAddTextarea,
      controlItemAddSectionVisible,
      handleItemAddSection,
      filterItem,
      tagIdFilter,
      setStart,
      countCheckedNumber
    }
  }
}
</script>

<style scoped lang='scss'>
  $bg-color-hover: #eceff1;
  $border-color: #dee2e6;
  $border-color-hover: #929597;
  $start-color: #ffc107;
  $file-edit-hover: #ced1d3;

  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;   
  }
  
  .list-width {
    width: 320px;
    min-width: 320px;

    .list-items {
      &::-webkit-scrollbar {
        width: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: $file-edit-hover;
        border-radius: 10px;
      }
    }
  }

  .button-hover {
    cursor: pointer;
    transition: ease .3s;

    &:hover {
      background-color: $bg-color-hover;
    }
  }

  .item-hover {
    transition: ease .3s;
    border: 1px solid $border-color;

    &:hover {
      border: 1px solid $border-color-hover;
    }
  }
</style>