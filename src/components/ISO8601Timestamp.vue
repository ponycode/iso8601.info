<template>
  <span v-if="timestamp" class="timestamp mb-2">
      <span class="date">{{date}}</span>
      <span class="t">T</span>
      <span class="time">{{time}}</span>
      <span class="timezone">{{printableTimezone}}</span>
      <b-icon v-if="showCopyIcon" class="clipboard" icon="clipboard" @click="copy" />
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
      },
      showCopyIcon: {
          type: Boolean,
          default: true
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
      },
      convertedTimestamp(){
          return this.moment.toISOString( true )
      }
  },
  methods: {
      copy(){
        const el = document.createElement('textarea')
        el.value = this.convertedTimestamp
        el.setAttribute('readonly', '')
        el.style.position = 'absolute'
        el.style.left = '-9999px'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)

        this.$bvToast.toast(`'${this.convertedTimestamp}' copied to clipboard.`, {
          title:'Copied to clipboard',
          autoHideDelay: 3000,
          variant: 'primary',
          toaster: 'b-toaster-bottom-center',
          append: false
        })
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

@media (prefers-color-scheme: dark) {
    .date{
        color: rgba(237, 237, 237, 1.0);
        background-color: rgba(0, 150, 192, 0.1);
    }
    .time{
        color: rgba(237, 237, 237, 1.0);
        background-color: rgba(0, 179, 131, 0.1);
    }
    .timezone{
        color: rgba(237, 237, 237, 1.0);
        background-color: rgba(235, 179, 131, 0.1);
    }
}

</style>
