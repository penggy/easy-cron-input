<template>
  <div>
    <div class="cron-select-period">
      <label>选择周期</label>
      <select class="cron-period-select" v-model="period" @change="periodChange">
        <option :value="item" v-for="(item, index) of periodOpts" :key="index">{{item}}</option>
      </select>
    </div>
    <div class="cron-input cron-seconds" v-show="period == '秒'">
      <p>
        每
        <select class="cron-seconds-select" v-model="nsec" @change="onChange">
          <option v-for="(item, index) of 60" :key="index" :value="item">{{item}}</option>
        </select>
        秒
      </p>
    </div>
    <div class="cron-input cron-minutes" v-show="period == '分'">
      <p>
        每
        <select class="cron-minutes-select" v-model="nmin" @change="onChange">
          <option v-for="(item, index) of 60" :key="index" :value="item">{{item}}</option>
        </select>
        分钟
      </p>
    </div>
    <div class="cron-input cron-hourly" v-show="period == '时'">
      <p>
        每
        <select class="cron-hourly-select" v-model="nhour" @change="onChange">
          <option v-for="(item, index) of 24" :key="index" :value="item">{{item}}</option>
        </select>
        小时
      </p>
    </div>
    <div class="cron-input cron-daily" v-show="period == '天'">
      <p>
        每
        <select class="cron-daily-select" v-model="nday" @change="onChange">
          <option v-for="(item, index) of 100" :key="index" :value="item">{{item}}</option>
        </select>
        天
      </p>
    </div>
    <div class="cron-input cron-weekly" v-show="period == '周'">
      <p>
        每周
        <input type="checkbox" name="dayOfWeekMon" v-model="dow" value="0" @change="onChange">一
        <input type="checkbox" name="dayOfWeekTue" v-model="dow" value="1" @change="onChange">二
        <input type="checkbox" name="dayOfWeekWed" v-model="dow" value="2" @change="onChange">三
        <input type="checkbox" name="dayOfWeekThu" v-model="dow" value="3" @change="onChange">四
        <input type="checkbox" name="dayOfWeekFri" v-model="dow" value="4" @change="onChange">五
        <input type="checkbox" name="dayOfWeekSat" v-model="dow" value="5" @change="onChange">六
        <input type="checkbox" name="dayOfWeekSun" v-model="dow" value="6" @change="onChange">日
      </p>
    </div>
    <div class="cron-input cron-monthly" v-show="period == '月'">
      <p>
        每
        <select class="cron-monthly-month" v-model="nmonth" @change="onChange">
          <option v-for="(item, index) of 12" :key="index" :value="item">{{item}}</option>
        </select>
        月
        <select class="cron-monthly-day" v-model="dom" @change="onChange">
          <option v-for="(item, index) of 31" :key="index" :value="item">{{item}}</option>
        </select>
        日
      </p>
    </div>
    <div class="cron-input cron-yearly" v-show="period == '年'">
      <p>
        每年
        <select class="cron-yearly-month" v-model="moy" @change="onChange">
          <option v-for="(item, index) of 12" :key="index" :value="item">{{item}}</option>
        </select>
        月
        <select class="cron-yearly-day" v-model="dom" @change="onChange">
          <option v-for="(item, index) of 31" :key="index" :value="item">{{item}}</option>
        </select>
        日
      </p>
    </div>
    <div class="cron-input cron-start-time" v-show="period == '天' || period == '周' || period == '月' || period == '年'">
        <select class="cron-clock-hour" v-model="hour" @change="onChange">
          <option v-for="(item, index) of 24" :key="index" :value="item - 1">{{('00' + (item - 1)).slice(-2)}}</option>
        </select>
        时
        <select class="cron-clock-minute" v-model="min" @change="onChange">
          <option v-for="(item, index) of 60" :key="index" :value="item - 1">{{('00' + (item - 1)).slice(-2)}}</option>
        </select>
        分
    </div>
  </div>
</template>

<script>
export default {
  name: "easy-cron-input",
  props: {
    value: {
      type: String,
      default: "* * * * * *"
    }
  },
  data() {
    return {
      periodOpts: ["秒", "分", "时", "天", "周", "月", "年"],
      nthWeekOpts: ["第一个", "第二个", "第三个", "第四个"],
      dayOfWeekOpts: ["一", "二", "三", "四", "五", "六", "日"],
      period: "秒",
      dow: [],
      dom: 1,
      moy: 1,
      min: 0,
      hour: 0,
      nsec: 1,
      nmin: 1,
      nhour: 1,
      nday: 1,
      nmonth: 1
    };
  },
  mounted() {
    this.setExpress(this.value);
    this.onChange();
  },
  methods: {
    periodChange() {
      this.dow = [];
      this.dom = 1;
      this.moy = 1;
      this.min = 0;
      this.hour = 0;
      this.nsec = 1;
      this.nmin = 1;
      this.nhour = 1;
      this.nday = 1;
      this.nmonth = 1;
      this.onChange();      
    },
    onChange() {
      this.$emit('input', this.getExpress(), this.getText());
    },
    getExpress() {
      var sec = 0; // ignoring seconds by default
      var year = "*"; // every year by default
      var dow = "*",
        dom = "*",
        moy = "*";
      var hour = this.hour,
        min = this.min;
      switch (this.period) {
        case "秒":
          if (this.nsec > 1) {
            sec = "*/" + this.nsec;
          } else {
            sec = "*";
          }
          hour = "*";
          min = "*";
          break;
        case "分":
          if (this.nmin > 1) {
            min = "*/" + this.nmin;
          } else {
            min = "*";
          }
          hour = "*";
          break;
        case "时":
          if (this.nhour > 1) {
            hour = "*/" + this.nhour;
          } else {
            hour = "*";
          }
          min = 0;
          break;
        case "天":
          if (this.nday > 1) {
            dom = "*/" + this.nday;
          }
          break;
        case "周":
          if (this.dow.length > 0 && this.dow.length < 7) {
            dow = this.dow.sort().join(",");
          }
          break;
        case "月":
          if (this.nmonth > 1) {
            moy = "*/" + this.nmonth;
          }
          dom = this.dom;
          break;
        case "年":
          moy = this.moy;
          dom = this.dom;
          break;
        default:
          break;
      }
      return [sec, min, hour, dom, moy, dow].join(" ");
    },
    setExpress(express) {
      express = express || "* * * * * *";
      var crons = express.split(/\s+/);
      if (crons.length == 6) {
        if (crons[0] == "*") {
          this.period = '秒';
          this.nsec = 1;
          return;
        }
        if (crons[0].split("/").length == 2) {
          this.period = '秒';
          this.nsec = crons[0].split('/')[1];
          return;
        }
        if (crons[1] == "*") {
          this.period = '分';
          this.nmin = 1;
          return;
        }
        if (crons[1].split("/").length == 2) {
          this.period = '分';
          this.nmin = crons[1].split('/')[1];
          return;
        }
        if (crons[2] == "*") {
          this.period = '时';
          this.nhour = 1;
          return;
        }
        if (crons[2].split("/").length == 2) {
          this.period = '时';
          this.nhour = crons[2].split('/')[1];
          return;
        }
        if (crons[3] == "*" && crons[5] == "*") {
          this.period = '天';
          this.nday = 1;
          this.hour = crons[2];
          this.min = crons[1];
          return;
        }
        if (crons[3] == "*" && crons[5] != "*") {
          this.period = '周';
          this.dow = crons[5].split(',');
          this.hour = crons[2];
          this.min = crons[1];     
          return;   
        }
        if (crons[3].split("/").length == 2) {
          this.period = '天';
          this.nday = crons[3].split('/')[1];
          this.hour = crons[2];
          this.min = crons[1];  
          return;      
        }
        if (crons[4] == "*") {
          this.period = '月';
          this.nmonth = 1;
          this.dom = crons[3];
          this.hour = crons[2];
          this.min = crons[1];
          return;        
        }
        if (crons[4].split("/").length == 2) {
          this.period = '月';
          this.moy = crons[4].split('/')[1];
          this.dom = crons[3];
          this.hour = crons[2];
          this.min = crons[1];
          return;          
        }
        if (/\d+/.test(crons[4])) {
          this.period = '年';
          this.moy = crons[4];
          this.dom = crons[3];
          this.hour = crons[2];
          this.min = crons[1];
          return;        
        }
      }      
    },
    getText() {
      var text = "";
      switch(this.period) {
        case '秒':
        text += "每";
        text += this.nsec;
        text += "秒";
        break;
        case '分':
        text += "每";
        text += this.nmin;
        text += "分钟";
        break;
        case '时':
        text += "每";
        text += this.nhour;
        text += "分钟";        
        break;
        case '天':
        text += "每";
        text += this.nday;
        text += "天";   
        text += ("00" + this.hour).slice(-2);
        text += "时";
        text += ("00" + this.min).slice(-2);
        text += "分";     
        break;
        case '周':
        if(this.dow.length > 0 && this.dow.length < 7) {
          text += "每周";
          var _dow = this.dow.sort().map(v => {
            return this.dayOfWeekOpts[v];
          })
          text += _dow.join(",");          
        } else {
          text += "每天";
        }
        text += ("00" + this.hour).slice(-2);
        text += "时";
        text += ("00" + this.min).slice(-2);
        text += "分";         
        break;
        case '月':
        text += "每";
        text += this.nmonth;
        text += "月";
        text += this.dom;   
        text += "日";
        text += ("00" + this.hour).slice(-2);
        text += "时";
        text += ("00" + this.min).slice(-2);
        text += "分";         
        break;
        case '年':
        text += "每年";
        text += this.moy;
        text += "月";
        text += this.dom;
        text += "日";   
        text += ("00" + this.hour).slice(-2);
        text += "时";
        text += ("00" + this.min).slice(-2);
        text += "分";         
        break;
        default:
        break;
      }
      return text;
    }    
  }
};
</script>

<style lang="less" scoped>
.cron-select-period {
  padding: 5px 5px 0px 5px;
  display: inline-block;
}

.cron-input {
  padding: 5px 5px 0px 5px;
  display: inline-block;
}

.cron-select-period select,
.cron-input select,
.cron-input input[type="radio"],
.cron-input input[type="checkbox"] {
  margin-left: 5px;
  margin-right: 5px;
}
</style>

