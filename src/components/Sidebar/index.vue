<template>
  <div 
    class="sidebar bg-primary text-white fs-5 d-flex flex-column" 
    :style="{ width: isShowSidebar ? '260px' : '0px'}"
  >
    <div class="d-flex align-items-center justify-content-between m-4">
      <router-link class="nav-link" to="/Notebooks">
        <p class="fs-4 fw-bold m-0">Goodnote</p>
      </router-link>
      <div 
        class="arrow d-flex rounded pointer" 
        @click="isShowSidebar = !isShowSidebar"
      >
        <i class="px-1 ri-menu-fold-line"></i>
      </div>
    </div>
    <div class="d-grid gap-2 mx-4 mb-4">
      <button 
        type="button" 
        class="btn btn-light text-primary rounded-pill btn-block text-nowrap "
        data-bs-toggle="modal" 
        data-bs-target="#NotebookCreateModal"
      >
        <i class="ri-add-fill fs-5"></i>
        <span class="fw-bold">創建筆記</span>
      </button>
    </div>
    <div class="flex-fill px-2" style="overflow-x: hidden">
      <div class="mb-3">
        <div 
          class="py-2 px-3 d-flex justify-content-between rounded sidebar-item pointer"
          data-bs-toggle="collapse" 
          data-bs-target="#collapseStart" 
          aria-expanded="true" 
          aria-controls="collapseStart"
          @click="toggleCllapse($event, 'start')"
        > 
          <div>
            <i class="ri-heart-fill pe-2"></i>
            <span class="fw-bold">最愛</span>
          </div>
          <div class="arrow d-flex rounded">
            <i 
              class="px-1 rounded ri-arrow-down-s-line transition"
              :class="{ 'arrow-rotate': arrowRotateFlag.start }"
            ></i>
          </div>
        </div>

        <ul class="collapse fs-6 show" id="collapseStart">
          <template 
            v-for="(notebook, notebookKey) in notebooks.data" 
            :key="notebookKey"
          >
            <li v-if="notebook.isStart" >
              <router-link
                class="nav-link w-100 py-1 px-4 rounded sidebar-item"
                :class="{ 'sidebar-start-item-active': controlSidebarItemActive == notebookKey }"
                :to="'/' + notebook.name + '/' + notebookKey"
              >
                <i class="ri-file-text-line pe-2"></i>
                {{ notebook.name }}
              </router-link>
            </li>
          </template>
        </ul>
      </div>
      <div class="">
        <router-link
          class="nav-link d-flex justify-content-between w-100 py-2 px-3 rounded sidebar-item"
          :class="{ 'sidebar-item-active': controlSidebarItemActive == 'Notebooks' }"
          to="/Notebooks"
        > 
          <div>
            <i class="ri-file-text-fill pe-2"></i>
            <span class="fw-bold">我的筆記</span>
          </div>
          <div 
            class="arrow d-flex rounded"
            data-bs-toggle="collapse" 
            data-bs-target="#collapseNotebooks" 
            aria-expanded="true" 
            aria-controls="collapseNotebooks"
            @click.prevent="toggleCllapse($event, 'notebooks')"
          >
            <i 
              class="px-1 ri-arrow-down-s-line transition"
              :class="{ 'arrow-rotate': arrowRotateFlag.notebooks }"
            ></i>
          </div>
        </router-link>
        <ul class="collapse fs-6 show" id="collapseNotebooks">
          <li 
            v-for="(notebook, notebookKey) in notebooks.data" 
            :key="notebookKey"
          >
            <router-link
              class="nav-link w-100 py-1 px-4 rounded sidebar-item"
              :class="{ 'sidebar-item-active': controlSidebarItemActive == notebookKey }"
              :to="'/' + notebook.name + '/' + notebookKey"
            >
              <i class="ri-file-text-line pe-2"></i>
              {{ notebook.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="sidebar-footer p-2 d-flex flex-column align-items-center">
      <a 
        class="text-decoration-none fs-4 text-white" 
        href="https://github.com/doublesung/goodnote"
      >
        <i class="ri-github-fill"></i>
      </a>
      <p class="fs-6 m-0 text-nowrap">© 2023 Goodnote</p>
    </div>
  </div>
  <div v-show="!isShowSidebar" class="h-100">
    <div 
      class="border-end d-flex flex-column align-items-center bg-light h-100" 
      style="width: 20px"
    >
      <button 
        type="button" 
        class="btn btn-light border p-0 fs-5 ms-4 mt-2"
        style="z-index: 10"
        @click="isShowSidebar = !isShowSidebar"
      >
        <i class="px-1 ri-menu-unfold-line"></i>
      </button>
    </div>
  </div>
  
  <NotebookCreateModal/>
</template>

<script>
  import { useRoute } from 'vue-router'
  import { computed, ref, reactive } from 'vue'
  import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
  
  import NotebookCreateModal from '../NotebookCreateModal'

  export default {
    name: 'Sidebar',
    components: {
      NotebookCreateModal
    },
    setup() {
      const route = useRoute()
      const db = getDatabase()

      const notebooksRef = dbRef(db, 'notebooks')
      const notebooks = reactive({ data: {} })

      onValue(notebooksRef, (snapshot) => {
        notebooks.data = snapshot.val()
      })              
            
      const controlSidebarItemActive = computed(() => {
        if(route.name === 'Notebooks') {
          return 'Notebooks'
        }else {
          return route.params.key
        }
      })

      const arrowRotateFlag = reactive({
        start: true,
        notebooks: true
      })
      
      const toggleCllapse = (event, key) => {
        const isShow = event.currentTarget.getAttribute('aria-expanded')

        arrowRotateFlag[key] = isShow === 'true' 
      }

      const isShowSidebar = ref(true)

      return {
        notebooks,
        controlSidebarItemActive,
        arrowRotateFlag,
        toggleCllapse,
        isShowSidebar
      }
    }
  }
</script>

<style scoped lang='scss'>

  $bg-color-hover: #eceff1;
  $file-edit-hover: #ced1d3;
  $light-color: #f8f9fa;

  ul {
    padding: 0;
    margin: 0;
  }
  
  .sidebar {
    width: 260px;
    height: 100%;
    overflow: hidden;
    flex-shrink: 0;
    transition: ease .3s;

    .sidebar-item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: ease .3s;

      .arrow-rotate {
        transform: rotate(180deg);
      }

      .arrow {
        transition: ease .3s;
        
        &:hover {
          background-color: rgba($color: $bg-color-hover, $alpha: .15);
        }
      }

      &:hover {
        background-color: rgba($color: $bg-color-hover, $alpha: .15);
      }
    }

    .sidebar-footer {
      border-top: 1px solid rgba($color: $bg-color-hover, $alpha: .5);
    }

    .sidebar-item-active {
      background-color: rgba($color: $bg-color-hover, $alpha: .3) !important;
    }

    .sidebar-start-item-active {
      background-color: rgba($color: $bg-color-hover, $alpha: .15) !important;
    }

    ::-webkit-scrollbar {
      width: 6px;
    }

    ::-webkit-scrollbar-thumb {
      background: $file-edit-hover;
      border-radius: 10px;
    }
  }
  
  .transition {
    transition: ease .3s;
  }

  .btn:focus {
    outline: none !important;
    box-shadow: none !important;
    background-color: $light-color;
  }
</style>