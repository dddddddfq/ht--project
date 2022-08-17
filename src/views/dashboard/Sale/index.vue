<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix toubu">
      <!--  v-model="activeName" @tab-click="handleClick" -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- v-model="value1" -->
        <el-date-picker class="date" size="mini" type="daterange" range-separator="-" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="yyyy-MM-dd" v-model="date">
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 容器 -->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div class="title-2">
            门店{{ title }}排名
          </div>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span class="rname">肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span class="rname">肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span class="rname">肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span class="rinde">4</span>
              <span class="rname">肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li>
              <span class="rinde">5</span>
              <span class="rname">肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li><span class="rinde">6</span>
              <span class="rname">肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li><span class="rinde">7</span>
              <span class="rname">肯德基</span>
              <span class="rvalue">12345</span>
            </li>
            <li><span class="rinde">8</span>
              <span class="rname">肯德基</span>
              <span class="rvalue">12345</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
const dayjs = require('dayjs');
import * as echarts from 'echarts';
import { mapState } from 'vuex';
export default {
  name: "",
  data() {
    return {
      activeName: 'sale',
      mycharts: null,
      date: []
    }
  },
  computed: {
    title() {
      return this.activeName == 'sale' ? '销售额' : '访问量'
    },
    ...mapState({
      listState: state => state.home.list
    })
  },
  watch: {
    activeName() {
      this.mycharts.setOption({
        title: {
          text: `${this.title}趋势`
        },
        xAxis: {
          data: this.activeName == 'sale' ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis
        },
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            type: "bar",
            barWidth: "60%",
            data: this.activeName == 'sale' ? this.listState.orderFullYear : this.listState.userFullYear,
            color: "green",
          },
        ],
      })
    },
    listState() {
      this.mycharts.setOption({
        title: {
          text: `${this.title}趋势`
        },
        xAxis: {
          data: this.listState.orderFullYearAxis
        },
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            type: "bar",
            barWidth: "60%",
            data: this.listState.orderFullYear,
            color: "green",
          },
        ],
      })
    }
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD');
      const end = dayjs().day(7).format('YYYY-MM-DD');
      this.date = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD');
      const end = dayjs().endOf('month').format('YYYY-MM-DD');
      this.date = [start, end];
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD');
      const end = dayjs().endOf('year').format('YYYY-MM-DD');
      this.date = [start, end];
    }
  },
  mounted() {
    //初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts);
    //配置数据
    this.mycharts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          type: "bar",
          barWidth: "60%",
          data: [],
          color: "green",
        },
      ],
    });
  }
};
</script>

<style scoped>
.toubu {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.tab {
  width: 100%;
}

>>>.el-card__header {
  border-bottom: 0;
}

.date {
  width: 250px;
  cursor: pointer;
}

.right {
  position: absolute;
  right: 0;
}

.right span {
  margin: 0 15px;
  font-size: 14px;
  cursor: pointer;
}

.charts {
  width: 100%;
  height: 300px;
}

.title-2 {
  width: 180px;
  height: 30px;
  font-size: 20px;
  font-weight: 700;
  position: relative;
  top: 0;
  left: -20px;
  margin-bottom: 20px;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

ul li {
  margin: 15px 0;
}

.rindex {
  float: left;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
}

.rname {
  margin-left: 25px;

}

.rinde {
  float: left;
  width: 18px;
  height: 18px;
  color: black;
  text-align: center;
}

.rvalue {
  float: right;
}
</style>
