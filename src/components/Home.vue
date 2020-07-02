<template>
  <b-container fluid>
    <b-row class="mb-5">
      <b-col>
        Your time zone is {{clientTimezone}}
        <h1 class="currentTime mt-3"><ISO8601Timestamp :timestamp="currentTime" :showCopyIcon="false"/></h1>
        <h1 v-if="clientTimezone" class="currentTime"><ISO8601Timestamp :timestamp="currentTime" :timezone="clientTimezone" :showCopyIcon="false"/></h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="8" lg="6" offset-md="2" offset-lg="3">
        <b-form-input v-model="userProvidedDate" placeholder="Paste an ISO8601 date" size="lg"></b-form-input>
        <table v-if="userProvidedDateInTimeZones" class="table mt-3 convertedTimes">
          <tr>
            <th></th>
            <th>Local Time</th>
            <th>Offset ISO8601</th>
          </tr>
          <tr v-for="timezone in userProvidedDateInTimeZones" :key="timezone.name">
            <th class="timezone"><b-icon v-if="clientTimezone === timezone.name" icon="flag-fill" />{{timezone.name}} <cite>{{timezone.offset}}</cite></th>
            <td>{{timezone.localReadableTime}}</td>
            <td><ISO8601Timestamp :timestamp="userProvidedDate" :timezone="timezone.name"/></td>
          </tr>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import moment from 'moment-timezone'
import ISO8601Timestamp from './ISO8601Timestamp'

export default {
  name: 'Home',
  components: {
    ISO8601Timestamp
  },
  data(){
    return {
      clientTimezone: moment.tz.guess(),
      currentTime: null,
      userProvidedDate: null,
      userProvidedDateInTimeZones: null,
      moment
    }
  },
  mounted(){
    this.currentTime = new Date().toISOString()
    setInterval( () => {
      this.currentTime = new Date().toISOString()
    }, 1000 )
  },
  watch: {
    userProvidedDate( value ){
      const m = moment( value );

      if( !m.isValid() ){
        this.userProvidedDateInTimeZones = null
        return
      }

      const timezones = ['Etc/UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'] //moment.tz.zonesForCountry('US', true)

      const convertedTimes = {};
      for( let timezone of timezones ){

        convertedTimes[timezone] = {
          name: timezone,
          offset: m.tz(timezone).format('Z'),
          localIso8601Time: m.tz(timezone).format(),
          utcIso8601Time: m.tz(timezone).toISOString(),
          localReadableTime: m.tz(timezone).format('lll')
        };
      }

      this.userProvidedDateInTimeZones = convertedTimes
    }
  }
}
</script>

<style lang="scss" scoped>
.currentTime {
  font-size: 80px;
}

.timezone {
  text-align: right;

  cite {
    color: #666;
    font-weight: 100;
  }
}
</style>
