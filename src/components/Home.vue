<template>
  <b-container>
    <b-row class="mb-5">
      <b-col>
        Your time zone is {{clientTimezone}}
        <h1 class="currentTime">{{currentTime}}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-input v-model="userProvidedDate" placeholder="Paste an ISO8601 date"></b-form-input>
        <table v-if="userProvidedDateInTimeZones" class="mt-3 convertedTimes">
          <tr>
            <th>Timezone</th>
            <th>Local Time</th>
            <th>Local ISO8601</th>
          </tr>
          <tr v-for="timezone in userProvidedDateInTimeZones" :key="timezone.name" :class="{ 'current': clientTimezone === timezone.name }">
            <td>{{timezone.name}}, {{timezone.offset}}</td>
            <td>{{timezone.localReadableTime}}</td>
            <td>{{timezone.localIso8601Time}}</td>
          </tr>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import moment from 'moment-timezone'

export default {
  name: 'Home',
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
    this.currentTime = new Date().toISOString();
    setInterval( () => {
      this.currentTime = new Date().toISOString();
    }, 1000 );
  },
  watch: {
    userProvidedDate( value ){
      const timezones = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles']; //moment.tz.zonesForCountry('US', true);

      const convertedTimes = {};
      for( let timezone of timezones ){
        const m = moment( value );

        convertedTimes[timezone] = {
          name: timezone,
          offset: m.tz(timezone).format('Z'),
          localIso8601Time: m.tz(timezone).format(),
          utcIso8601Time: m.tz(timezone).toISOString(),
          localReadableTime: m.tz(timezone).format('lll')
        };
      }

      this.userProvidedDateInTimeZones = convertedTimes;
    }
  },
  methods: {
    copy( element ){
        element.select();

        let copied;
        try{
            copied = document.execCommand('copy');
        }catch(ex){
            copied = false;  
        }
        return copied;
    }
  }
}
</script>

<style lang="scss" scoped>
.currentTime {
  font-size: 80px;
}

.convertedTimes {
  th {
    padding: 6px 12px;
    text-align: left;
  }

  td {
    padding: 6px 12px;
    text-align: left;
  }

  tr.current {
    background-color: rgba(203, 242, 242, 0.5);
  }
}
</style>
