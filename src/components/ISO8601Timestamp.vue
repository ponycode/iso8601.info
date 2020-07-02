<template>
  <span v-if="timestamp" class="timestamp mb-2">
      <span class="date">{{date}}</span>
      <span class="t">T</span>
      <span class="time">{{time}}</span>
      <span class="timezone">{{printableTimezone}}</span>
      <b-icon class="clipboard" icon="clipboard" @click="copy" />
  </span>
</template>

<script>
import moment from 'moment-timezone'

export default {
  name: 'ISO8601Timestamp',
  props: {
      timestamp: {
          type: String,
          required: false
      },
      timezone: {
          type: String,
          required: false,
          default: 'Z'
      }
  },
  computed: {
      moment(){
          const m = moment( this.timestamp )
          if( !m.isValid() ) return null
          return this.timezone !== 'Z' ? m.tz( this.timezone ) : m.utc()
      },
      date(){
          if( !this.moment ) return null
          return this.moment.format('YYYY-MM-DD')
      },
      time(){
          if( !this.timestamp ) return null
         return this.moment.format('HH:mm:ss.SSS')
      },
      printableTimezone(){
          if( this.timezone === 'Z' ) return  'Z'
          return this.moment.format('Z') // convert to -XX:XX
      }
  },
  methods: {
      copy(){
          alert('copy')
      }
  }
}
</script>

<style lang="scss" scoped>
.timestamp{
    display: inline-block;
    cursor: pointer;
}

.t, .z {
    color: #333;
    opacity: 0.3;
    margin: 0 .1em;
}

.clipboard{
    font-size: 0.8em;
    margin-left: 0.2em;
}

.date {
    font-weight: 500;
    color: #333;
    background-color: rgba(0, 150, 192, 0.05);
    padding: 0 0.2em;
    border-radius: .2em;
    transition: all 0.2s;

    &:hover {
         background-color: rgba(0, 150, 192, 0.3);
    }
}

.time {
    font-weight: 500;
    color: #333;
    background-color: rgba(0, 179, 131, 0.05);
    padding: 0 0.2em;
    border-radius: .2em;
    transition: all 0.2s;

    &:hover {
         background-color: rgba(0, 179, 131, 0.3);
    }
}

.timezone {
    font-weight: 500;
    color: #333;
    background-color: rgba(235, 179, 131, 0.05);
    padding: 0 0.2em;
    border-radius: .2em;
    transition: all 0.2s;
    
    &:hover {
        background-color: rgba(235, 179, 131, 0.3);
    }
}
</style>