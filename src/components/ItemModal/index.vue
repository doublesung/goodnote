<template>
  <div 
    class="modal fade" 
    id="itemModal" 
    tabindex="-1" 
    aria-hidden="true" 
    :ref="el => setModalRef(el)"
    @click="hideCheckTextareaWrapper($event)"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down">
      <div class="modal-content border-0 overflow-visible" style="min-height: 550px">
        <div class="modal-header">
          <textarea
            class="w-100 border-0 fs-3" 
            placeholder="標題" 
            rows="1"
            v-model="itemData.title"
            @input="autosizeTextarea($event)"
          ></textarea>
        </div>
        <div class="overflow-auto p-3 flex-grow-1">
          <!-- 標籤 -->
          <div v-if="itemData.tags">
            <div>標籤</div>
            <div class="d-flex flex-wrap mb-3 mt-2">
              <div 
                class="my-2 me-2"
                v-for="(tag, tagKey) in itemData.tags" 
                :key="tagKey"
              >
                <div class="d-flex align-items-center rounded-pill bg-primary py-1 px-2">
                  <small class="me-1 text-white">{{ tag }}</small>
                  <div @click="removeTag(tagKey)">
                    <i class="tag-close ri-close-line"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 截止日 -->
          <div v-if="itemData.deadline">
            <div>截止日</div>
            <div class="d-flex align-items-center mt-2 mb-3">
              <input 
                class="form-check-input mt-0 me-2" 
                type="checkbox"
                v-model="itemData.deadline.completed"
                @change="DateDropdownRef.setDeadlineCompleted(itemData.deadline.completed)"
              >
              <button
                type="button" 
                class="btn btn-light border"
                id="dateDropdownButton"
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside" 
                aria-expanded="false"
                :ref="el => setdropdownRefs(el, 'dateDropdownButton')"
                @click="DateDropdownData.id = 'dateDropdownButton'"
              >
                {{ itemData.deadline.date }}
              </button>
              <DateDropdown 
                ref="DateDropdownRef"
                :DateDropdownData="DateDropdownData" 
                @toggleDropdown="toggleDropdown" 
              />
            </div>
          </div>
          <!-- 記事 -->
          <div class="mb-3">
            <div class="mb-3">
              <i class="ri-align-left fs-5 fw-bold me-2"></i>
              <span class="fs-5 fw-bold">記事</span>
            </div>
            <div 
              class="w-100 text-break pointer" 
              contenteditable="true"
              role="textbox"
              placeholder="新增記事..."
              @blur="updateNote($event)"
            >
              {{ itemData.note }}
            </div>
          </div>
          <!-- 待辦清單 -->
          <div 
            class="mb-3" 
            v-for="(checklist, checklistKey) in itemData.checklists" 
            :key="checklistKey"
          >
            <!-- 標題 -->
            <div class="mb-3 d-flex justify-content-between align-items-center">
              <div>
                <i class="ri-checkbox-line fs-5 fw-bold me-2"></i>
                <span class="fs-5 fw-bold">{{ checklist.name }}</span>
              </div>
              <button
                type="button" 
                class="btn btn-light border"
                id="dropdownMenuList" 
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside"
                aria-expanded="false"
                :ref="el => setdropdownRefs(el, checklistKey)"
              >
                刪除
              </button>
              <div class="dropdown-menu p-0" aria-labelledby="dropdownMenuList">
                <div class="border-bottom px-3 py-2 m-0">要刪除 {{ checklist.name }} 嗎?</div>
                <div class="px-3 pt-2">
                  <small>刪除之後將無法復原。</small>
                </div>
                <div class="p-3 d-flex justify-content-between align-items-center">
                  <button 
                    type="button" 
                    class="btn btn-danger btn-sm"
                    @click="deleteChecklist(checklistKey)"
                  >
                    刪除
                  </button>
                  <button 
                    class="border-0 bg-transparent" 
                    type="button" 
                    @click="toggleDropdown(checklistKey)"
                  >
                    <small>關閉</small>
                  </button>
                </div>
              </div>
            </div>
            <!-- 項目 -->
            <div 
              class="check-item ps-2 rounded" 
              v-for="(checkbox, checkboxKey) in checklist.checks" 
              :key="checkboxKey"
            >
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  style="margin-top: .7em"
                  v-model="checkbox.checked"
                  @change="setCheckbox(checkbox.checked, checklistKey, checkboxKey)"
                >
                <div 
                  class="w-100 py-2"
                  :class="{ 'd-none': controlCheckHandleSectionVisible(checkboxKey) }"
                  :ref="el => setCheckHandleSectionRefs(el, checkboxKey, 'showButton')"
                  @click="showCheckTextareaWrapper(checkboxKey)"
                >
                  {{ checkbox.name }}
                </div>
                <div 
                  class="p-2" 
                  :class="{ 'd-none': !controlCheckHandleSectionVisible(checkboxKey) }"
                >
                  <textarea 
                    class="form-control mb-2"
                    placeholder="增加項目" 
                    rows="1"
                    v-model="checkbox.name"
                    :ref="el => setCheckHandleSectionRefs(el, checkboxKey, 'textarea')"
                    @input="setCheck(checkbox.name, checklistKey, checkboxKey)"
                  ></textarea>
                  <div class="d-flex justify-content-end">
                    <button 
                      type="button"
                      class="btn btn-sm" 
                      :ref="el => setCheckHandleSectionRefs(el, checkboxKey, 'setButton')"
                      @click="deleteCheck(checklistKey, checkboxKey)"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- 按鈕 -->
            <button
              type="button" 
              class="btn btn-light border mt-2"
              :class="{ 'd-none': controlCheckHandleSectionVisible(checklistKey) }"
              :ref="el => setCheckHandleSectionRefs(el, checklistKey, 'showButton')"
              @click="showCheckTextareaWrapper(checklistKey)"
            >
              增加項目
            </button>
            <div 
              class="mt-2"
              :class="{ 'd-none': !controlCheckHandleSectionVisible(checklistKey) }"
            >
              <textarea 
                class="form-control mb-3" 
                placeholder="增加項目" 
                rows="1"
                :ref="el => setCheckHandleSectionRefs(el, checklistKey, 'textarea')"
              ></textarea>
              <button
                type="button" 
                class="btn btn-primary me-2"
                :ref="el => setCheckHandleSectionRefs(el, checklistKey, 'setButton')"
                @click="addCheck(checklistKey)"
              >
                新增
              </button>
              <button type="button" class="btn">取消</button>
            </div>
          </div>
          <!-- 附件 -->
          <div v-if="itemData.files" class="mb-3">
            <div class="mb-3">
              <i class="ri-attachment-line fs-5 fw-bold me-2"></i>
              <span class="fs-5 fw-bold">附件</span>
            </div>
            <div 
              class="fs-5 mb-1" 
              v-for="(file, fileKey) in itemData.files" 
              :key="fileKey"
            >
              <div 
                class="d-flex justify-content-between align-items-center file-item rounded p-1"
              >
                <span>
                  <i class="ri-file-line me-1"></i>
                  {{ file.name }}
                </span>
                <div 
                  class="icon-button-hover rounded-circle d-flex justify-content-center align-items-center" 
                  type="button" 
                  id="dropdownMenuCheck" 
                  data-bs-toggle="dropdown" 
                  data-bs-auto-close="outside" 
                  aria-expanded="false"
                  :ref="el => setdropdownRefs(el, fileKey)"
                >
                  <i class="ri-more-fill text-muted"></i>
                </div>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuCheck">
                  <li class="dropdown-item pointer" @click="downloadFile(fileKey, file.name)">
                    <i class="ri-download-2-line fs-5 me-1"></i>
                    下載
                  </li>
                  <li class="dropdown-item pointer" @click="deleteFile(fileKey, file.name)">
                    <i class="ri-delete-bin-line fs-5 me-1"></i>
                    刪除
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between border-top p-3">
          <div class="fs-4 d-flex">
            <!-- 標籤 -->
            <div>
              <div 
                class="icon-button-hover rounded-circle d-flex justify-content-center align-items-center" 
                type="button" 
                id="dropdownTag" 
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside" 
                aria-expanded="false"
                :ref="el => setdropdownRefs(el, 'dropdownTag')"
                @click="initTagDropdown"
              >
                <i class="ri-price-tag-line"></i>
              </div>
              <div class="dropdown-menu p-0" aria-labelledby="dropdownTag">
                <h5 class="border-bottom p-3 m-0">為記事加標籤</h5>
                <div class="p-3">
                  <input 
                    type="text" 
                    class="form-control"
                    placeholder="輸入標籤名稱"
                    spellcheck="false"
                    :ref="el => tagInputRef.input = el"
                    v-model="tagInputRef.value"
                  >
                </div>
                <ul class="p-0 overflow-auto" style="max-height: 150px">
                  <li 
                    class="dropdown-item pointer d-flex align-items-center"
                    v-for="(tag, tagIndex) in tagList" :key="tagIndex"
                  >
                    <div class="form-check w-100">
                      <input 
                        class="form-check-input pointer" 
                        type="checkbox" 
                        :id="tag.id"
                        :checked="tag.checked"
                        @change="handleTag($event, tag)"
                      >
                      <label class="form-check-label w-100 pointer" :for="tag.id">
                        {{ tag.name }}
                      </label>
                    </div>
                  </li>
                </ul>
                <div 
                  v-if="tagInputRef.value"
                  class="border-top p-3 d-flex justify-content-center"
                >
                  <button 
                    type="button" 
                    class="btn btn-primary"
                    @click="addTag"
                  >
                    創建新標籤
                  </button>
                </div>
              </div>
            </div>
            <!-- 待辦事項 -->
            <div>
              <div 
                class="icon-button-hover rounded-circle d-flex justify-content-center align-items-center" 
                type="button" 
                id="dropdownChecklist"
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside" 
                aria-expanded="false"
                :ref="el => setdropdownRefs(el, 'dropdownChecklist')"
                @click="checklistAddInputRef.focus"
              >
                <i class="ri-checkbox-line"></i>
              </div>
              <div class="dropdown-menu p-0" aria-labelledby="dropdownChecklist">
                <h5 class="border-bottom p-3 m-0">新增待辦清單</h5>
                <div class="d-flex flex-column px-3" >
                  <div class="my-3">
                    <label for="checklistName" class="form-label">標題</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="checklistName" 
                      ref="checklistAddInputRef"
                    >
                  </div>
                </div>
                <div class="border-top p-3 d-flex justify-content-between align-items-center">
                  <button type="button" class="btn btn-primary" @click="addChecklist">新增</button>
                  <div type="button" @click="toggleDropdown('dropdownChecklist')">關閉</div>
                </div>
              </div>
            </div>
            <!-- 檔案 -->
            <div>
              <div 
                class="icon-button-hover rounded-circle d-flex justify-content-center align-items-center" 
                type="button" 
                id="dropdownFile" 
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside" 
                aria-expanded="false"
                :ref="el => setdropdownRefs(el, 'dropdownFile')"
                @click="clearFormFile"
              >
                <i class="ri-attachment-line"></i>
              </div>
              <div class="dropdown-menu p-0" aria-labelledby="dropdownFile">
                <h5 class="border-bottom p-3 m-0">新增待辦清單</h5>
                <div class="d-flex flex-column px-3" >
                  <small class="mt-2">
                    <span>檔案上限為5MB</span>
                  </small>
                  <input 
                    class="form-control mt-2" 
                    type="file" 
                    ref="formFileRef" 
                    @change="setIsFileOversize"
                  >
                  <small v-if="isFileOversize" class="mt-2 text-danger">
                    <span>檔案超過限制大小！</span>
                  </small>
                </div>
                <div class="border-top mt-3 p-3 d-flex justify-content-between align-items-center">
                  <button 
                    type="button" 
                    class="btn btn-primary"
                    @click="uploadFile"
                  >
                    上傳
                  </button>
                  <div type="button">關閉</div>
                </div>
              </div>
            </div>
            <!-- 期限 -->
            <div>
              <div 
                class="icon-button-hover rounded-circle d-flex justify-content-center align-items-center" 
                id="dateDropdownIcon"
                type="button" 
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside" 
                aria-expanded="false"
                :ref="el => setdropdownRefs(el, 'dateDropdownIcon')"
                @click="DateDropdownData.id = 'dateDropdownIcon'"
              >
                <i class="ri-time-line"></i>
              </div>
              <DateDropdown 
                :DateDropdownData="DateDropdownData" 
                @toggleDropdown="toggleDropdown" 
              />
            </div>
            <!-- 刪除 -->
            <div>
              <div 
                class="icon-button-hover rounded-circle d-flex justify-content-center align-items-center" 
                type="button" 
                id="dropdownDelete" 
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside" 
                aria-expanded="false"
                :ref="el => setdropdownRefs(el, 'dropdownDelete')"
              >
                <i class="ri-delete-bin-line"></i>
              </div>
              <div class="dropdown-menu p-0" aria-labelledby="dropdownDelete">
                <h5 class="border-bottom p-3 m-0">刪除一則記事</h5>
                <div class="p-3 d-flex justify-content-between align-items-center">
                  <button type="button" class="btn btn-danger" @click="removeItem">刪除</button>
                  <div type="button" @click="toggleDropdown('dropdownDelete')">關閉</div>
                </div>
              </div>
            </div>   
          </div>
          <button 
            class="fs-5 border-0 bg-transparent" 
            type="button" 
            data-bs-dismiss="modal" 
            aria-label="Close"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dropdown, Modal } from 'bootstrap'
import { ref, reactive, nextTick, computed } from 'vue'
import { getDatabase, ref as dbRef, update, push, child, remove } from 'firebase/database'
import { getStorage, ref as stRef, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage'

import DateDropdown from './components/DateDropdown'

export default {
  name: 'Modal',
  components: {
    DateDropdown
  },
  props: {
    notebook: {
      type: Object
    }
  },
  setup(props, context) {
    const db = getDatabase()
    const storage = getStorage()

    const itemData = computed(() => {
      const { data, listId, itemId } = props.notebook
      
      if(data && itemId) {
        return data.lists[listId].items[itemId]
      }else {
        return {}
      }
    })
    
    const itemPath = computed(() => {
      const { notebookId, listId, itemId } = props.notebook

      if(props.notebook) {
        return `notebooks/${notebookId}/lists/${listId}/items/${itemId}`
      }else {
        return ''
      }
    })

    // 更新記事內容
    const updateNote = (event) => {
      const path = itemPath.value
      const value = event.target.innerText

      update(dbRef(db), {
        [path + '/note']: value
      })
    }

    // textarea的高度隨內容改變
    const autosizeTextarea = (event) => {
      const textarea = event.target
      
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }

    // DateDropdown子組件
    const DateDropdownRef = ref(null)

    const DateDropdownData = reactive({
      itemData,
      itemPath,
      id: '',
    })

    //#region 待辦清單
    const checkHandleSectionRefs = reactive({ editing: '' })

    const checklistAddInputRef = ref(null)
    
    const setCheckHandleSectionRefs = (el, id, elId) => {
      if(el) {
        if(!checkHandleSectionRefs[id]) {
          checkHandleSectionRefs[id] = {
            isEdit: false,
          }
        }else {
          checkHandleSectionRefs[id][elId] = el
        }
      }else {
        delete checkHandleSectionRefs[id]
      }
    }

    const showCheckTextareaWrapper = (checklistId) => {
      const checkHandleSection = checkHandleSectionRefs[checklistId]
      const { editing } = checkHandleSectionRefs

      // 是否還有尚未關閉
      if(editing) editing.isEdit = false

      checkHandleSectionRefs.editing = checkHandleSection
    
      checkHandleSection.isEdit = true

      nextTick(() => {
        checkHandleSection.textarea.focus()
      })
    }

    const hideCheckTextareaWrapper = (event) => {
      let { isEdit, textarea, showButton, setButton } = checkHandleSectionRefs.editing
      
      if(isEdit) {
        const isTextarea = textarea.contains(event.target)
        const isSetButton = setButton.contains(event.target)
        const isShowButton = showButton.contains(event.target)

        if(!isShowButton) {
          if(!isTextarea && !isSetButton) {
            checkHandleSectionRefs.editing.isEdit = false
            checkHandleSectionRefs.editing = ''
          }
        }
      }
    }

    const controlCheckHandleSectionVisible = (checklistId) => {
      const checkHandleSection = checkHandleSectionRefs[checklistId]

      if(checkHandleSection) return checkHandleSection.isEdit
    }

    const addChecklist = () => {
      const input = document.getElementById('checklistName')
      const path = itemPath.value + '/checklists'
      const newId = push(child(dbRef(db), path)).key
      
      if(input.value) {
        update(dbRef(db), {
          [path + '/' + newId]: {
            checks: '',
            name: input.value
          }
        })
        
        toggleDropdown('dropdownChecklist')

        input.value = ''
      }
    }

    const deleteChecklist = (checklistId) => {
      const path = itemPath.value + '/checklists/' + checklistId

      remove(dbRef(db, path))
      toggleDropdown(checklistId)
    }

    const addCheck = (checklistId) => { 
      const { textarea } = checkHandleSectionRefs.editing

      if(textarea.value) {
        const path = itemPath.value + '/checklists/' + checklistId + '/checks'
        const newId = push(child(dbRef(db), path)).key

        update(dbRef(db), {
          [path + '/' + newId]: {
            checked: false,
            name: textarea.value
          }
        })

        textarea.value = ''
        checkHandleSectionRefs.editing.isEdit = false
        checkHandleSectionRefs.editing = ''
      }else {
        textarea.focus()
      }
    }

    const deleteCheck = (checklistId, checkId) => {
      const path = itemPath.value + `/checklists/${checklistId}/checks/${checkId}`

      remove(dbRef(db, path))
    }

    const setCheck = (value, checklistId, checkId) => {
      const path = itemPath.value + `/checklists/${checklistId}/checks/${checkId}`

      update(dbRef(db), {
        [path + '/name']: value
      })
    }

    const setCheckbox = (value, checklistId, checkId) => {
      const path = itemPath.value + `/checklists/${checklistId}/checks/${checkId}`

      update(dbRef(db), {
        [path + '/checked']: value
      })
    } 
    //#endregion

    //#region 上傳檔案
    const formFileRef = ref(null)

    const uploadFile = () => {
      const file = formFileRef.value.files[0]

      if(file) {
        const path = itemPath.value + '/files'
        const newId = push(child(dbRef(db), path)).key;

        update(dbRef(db), {
          [path + '/' + newId]: {
            name: file.name
          }
        })

        const { itemId } = props.notebook
        const storageRef = stRef(storage, `files/${itemId}/${newId}/${file.name}`)

        uploadBytes(storageRef, file).then(() => {
          console.log('Uploaded a blob or file!')
        })

        toggleDropdown('dropdownFile')
      }
    }

    const isFileOversize = ref(false)

    const setIsFileOversize = () => {
      const file = (() => {
        if(formFileRef.value) return formFileRef.value.files[0]
      })()

      const fileSize = (() => {
        if(file) return Math.round(file.size / 1024 / 1024 * 10) / 10
      })()  

      if(file) isFileOversize.value = fileSize >= 5
    }

    const clearFormFile = () => {
      formFileRef.value.value = ''
      isFileOversize.value = false
    }

    const deleteFile = (fileId, name) => {
      const path = itemPath.value + '/files/' + fileId

      remove(dbRef(db, path))

      const { itemId } = props.notebook
      const fileRef = stRef(storage, `files/${itemId}/${fileId}/${name}`)

      deleteObject(fileRef).then(() => {
        console.log('刪除成功')
      }).catch((error) => {
        console.log(error.code)
      })

      toggleDropdown(fileId)
    }

    const downloadFile = (fileId, name) => {
      const { itemId } = props.notebook
      const path = `files/${itemId}/${fileId}/${name}`

      getDownloadURL(stRef(storage, path))
        .then((url) => {
          fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
              const downloadUrl = window.URL.createObjectURL(blob)
              const link = document.createElement("a")
 
              link.href = downloadUrl
              link.download = name
              link.target = "_blank"
              link.style.display = "none"
              link.click()
              // 刪除多餘的 DOM 與 釋放記憶體
              link.remove()
              window.URL.revokeObjectURL(url)
            })
        })

      toggleDropdown(fileId)
    }
    //#endregion

    //#region 下拉表單
    const dropdownRefs = reactive({})

    const setdropdownRefs = (el, id) => {
      // 為了避免獲取不完全 等待DOM更新完畢再創建
      nextTick(() => {
        if(el) {
          if(!dropdownRefs[id]) dropdownRefs[id] = new Dropdown(el)
          
        }else {
          delete dropdownRefs[id]
        }
      })
    }

    const toggleDropdown = (id) => {
      const dropdown = dropdownRefs[id]

      dropdown.toggle()
    }
    //#endregion
    
    //#region 標籤
    const tagInputRef = reactive({
      input: '',
      value: ''
    })

    const tagList = computed(() => {
      const value = tagInputRef.value
      const notebookTags = props.notebook.data.tags
      const itemTags = itemData.value.tags 
      
      const tagArray = (() => {
        if(notebookTags) {
          return Object.keys(notebookTags).map((tagKey) => {
            return {
              id: tagKey,
              name: notebookTags[tagKey],
              checked: itemTags ? itemTags[tagKey] : false
            }
          })
        }
      })()

      if(value) {
        return tagArray.filter((tag) => 
          tag.name.toLowerCase().includes(value.toLowerCase())
        )
      }else {
        return tagArray
      }
    })

    const initTagDropdown = () => {
      tagInputRef.value = ''
      tagInputRef.input.focus()
    }

    const addTag = () => {
      const notebookId = props.notebook.notebookId
      const notebookPath = 'notebooks/' + notebookId + '/tags'
      const newId = push(child(dbRef(db), notebookPath)).key

      update(dbRef(db), {
        [notebookPath + '/' + newId]: tagInputRef.value
      })

      const itemPath = itemPath.value + '/tags'

      update(dbRef(db), {
        [itemPath + '/' + newId]: tagInputRef.value
      })

      initTagDropdown()
    }

    const removeTag = (tagId) => {
      const path = itemPath.value + '/tags/' + tagId

      remove(dbRef(db, path))
    }

    const handleTag = (event, tag) => {
      if(event.target.checked) {
        const path = itemPath.value + '/tags'

        update(dbRef(db), {
          [path + '/' + tag.id]: tag.name
        })
      }else {
        removeTag(tag.id)
      }
    }
    //#endregion

    //#region 刪除item
    const modalRef = reactive({})
    
    const setModalRef = (el) => {
      if(el) {
        if(!modalRef.el) {
          modalRef.el = el
          modalRef.data = new Modal(el)
        }
      }
    }

    const removeItem = () => {
      modalRef.data.hide()
      
      nextTick(() => {
        const path = itemPath.value

        remove(dbRef(db, path))

        context.emit('setTargetId')
      })
    }
    //#endregion  

    return {
      itemData,
      updateNote,
      autosizeTextarea,

      DateDropdownRef,
      DateDropdownData,

      checklistAddInputRef,
      setCheckHandleSectionRefs,
      showCheckTextareaWrapper,
      hideCheckTextareaWrapper,
      controlCheckHandleSectionVisible,
      addChecklist,
      deleteChecklist,
      addCheck,
      deleteCheck,
      setCheck,
      setCheckbox,

      formFileRef,
      uploadFile,
      isFileOversize,
      setIsFileOversize,
      clearFormFile,
      deleteFile,
      downloadFile,
      
      dropdownRefs,
      setdropdownRefs,
      toggleDropdown,

      tagInputRef,
      tagList,
      initTagDropdown,
      addTag,
      removeTag,
      handleTag,

      modalRef,
      setModalRef,
      removeItem
    }
  }
}
</script>

<style scoped lang='scss'>

  $bg-color-hover: #eceff1;
  $file-edit-hover: #ced1d3;
  $tag-color: #ffffff;

  %pointer {
    cursor: pointer;
  }

  %item-hover {
    transition: ease .3s;

    &:hover {
      background-color: $bg-color-hover;
    }
  }

  .modal {

    .icon-button-hover {
      @extend %pointer;
      @extend %item-hover;
      width: 40px;
      height: 40px;
    }
    
    .tag-close {
      width: 16px;
      height: 16px;
      color: $tag-color;
      border-radius: 100%;
      transition: ease .3s;
      @extend %pointer;

      &:hover {
        color: inherit;
        background-color: $tag-color;
      }
    }

    .check-item {
      @extend %item-hover;
      @extend %pointer;
    }

    .file-item {
      @extend %item-hover;

      .icon-button-hover {
        @extend %pointer;
        @extend %item-hover;
        width: 30px;
        height: 30px;
      }
    }

    [contentEditable = true] {
      outline: none;

      &:empty::before {
        content: attr(placeholder);
        opacity: 0.8;
      }
    }

    ::-webkit-scrollbar {
      width: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: $file-edit-hover;
      border-radius: 10px;
    }
  }

</style>