<template>
  <div>
    <a class="githubLogo" href="https://github.com/ponycode/iso8601.info" title="View the source code for this project on GitHub">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <defs/>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    </a>
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
  </div>
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

.githubLogo {
  position: absolute;
  top: 10px;
  right: 10px;

  display: inline-block;
  height: 40px;
  width: 40px;
}
</style>
