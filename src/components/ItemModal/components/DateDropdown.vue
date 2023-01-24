<template>
  <div class="dropdown-menu p-0">
    <div class="border-bottom p-3 d-flex justify-content-between align-items-center">
      <div class="m-0 fs-5">日期</div>
      <div>
        <small>截止日 : {{ dateTip }}</small>
      </div>
    </div>
    <div class="d-flex flex-column px-3">
      <div class="my-3">
        <v-calendar 
          ref="calendar" 
          :attributes="[{ highlight: true, dates: date }]"
          @dayclick="value => date = value.date"
        />
      </div>
    </div>
    <div class="border-top p-3 d-flex justify-content-between align-items-center">
      <button 
        type="button" 
        class="btn btn-primary" 
        @click="setDeadline"
      >
        儲存
      </button>
      <div 
        type="button" 
        @click="deleteDeadline"
      >
        移除
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getDatabase, ref as dbRef, update, remove } from 'firebase/database'
import { ref, watch, nextTick, computed, onMounted, toRefs, onUnmounted} from 'vue'

export default {
  name: 'DateDropdown',
  props: {
    DateDropdownData: {
      typs: Object
    }
  },
  setup(props, context) {
    const db = getDatabase()

    const { itemData, itemPath, id } 
            = toRefs(computed(() => props.DateDropdownData).value)

    const date = ref(new Date())
    const dateTip = computed(() => moment(date.value).format('YYYY/MM/DD'))

    const setDate = () => {
      if(itemData.value) {
        const deadline = itemData.value.deadline

        date.value = deadline ? deadline.dateUTC : new Date()

        showPageRange()
      }
    }

    const calendar = ref(null)

    const showPageRange = () => {
      nextTick(() => {
        if(calendar.value && date.value) {
          calendar.value.showPageRange(new Date(date.value), { transition: 'none' })
        }
      })
    }
    
    watch (itemData, setDate, { immediate: true })

    const setDeadline = () => {
      const path = itemPath.value + '/deadline'
      
      update(dbRef(db), {
        [path]: {
          date: moment(date.value).format('YYYY年MM月DD日'),
          dateUTC: date.value,
          completed : false
        }
      })

      context.emit('toggleDropdown', id.value)
    }

    const setDeadlineCompleted = (isCompleted) => {
      const path = itemPath.value + '/deadline'

      update(dbRef(db), {
        [path + '/completed']: isCompleted
      })
    }

    const deleteDeadline = () => {
      const path = itemPath.value + '/deadline'

      remove(dbRef(db, path))

      context.emit('toggleDropdown', id.value)
    }

    const dropdownButton = ref(null)

    onMounted(() => {
      dropdownButton.value = document.getElementById('dateDropdownButton')

      if(dropdownButton.value) {
        dropdownButton.value.addEventListener('hidden.bs.dropdown', showPageRange)
      }else {
        const dropdownIcon =  document.getElementById('dateDropdownIcon')

        dropdownIcon.addEventListener('hidden.bs.dropdown', showPageRange)
      }
    })

    onUnmounted(() => {
      dropdownButton.value.removeEventListener('hidden.bs.dropdown', showPageRange)
    })

    return {
      date,
      dateTip,
      calendar,
      setDeadline,
      setDeadlineCompleted,
      deleteDeadline
    }
  }
}
</script>

<style></style>