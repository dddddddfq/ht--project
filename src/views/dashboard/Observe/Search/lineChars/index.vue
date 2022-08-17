<template>
    <div>
        <div class="header">
            <span class="search-header">搜索用户数</span>
            <svg t="1637478175000" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="2179" width="26" height="26">
                <path
                    d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z"
                    p-id="2180" fill="#8a8a8a"></path>
            </svg>
        </div>
        <div class="main">
            <span class="main-title">12321</span>
            <span class="main-content">17.1</span>
            <svg t="1652869181525" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="2046" width="22" height="22">
                <path
                    d="M509.92 795.84c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m-2.448-400.704h16a16 16 0 0 1 16 16v201.728a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V459.136a16 16 0 0 1 16-16z m0-100.176h16a16 16 0 0 1 16 16v23.648a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-23.648a16 16 0 0 1 16-16z"
                    p-id="2047" fill="#cdcdcd"></path>
            </svg>

        </div>
        <div class="footer">
            <div class="charts" ref="charts"></div>
        </div>
    </div>
</template>

<script>
import *as echarts from "echarts";
export default {
    name: '',
    mounted() {
        //初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts);
        //配置数据
        lineCharts.setOption({
            xAxis: {
                //隐藏x轴
                show: false,
                type: "category",
            },
            yAxis: {
                //隐藏y轴
                show: false,
            },
            //系列
            series: [
                {
                    smooth: true,
                    type: "line",
                    data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
                    //拐点的样式的设置
                    itemStyle: {
                        opacity: 0,
                    },
                    //线条的样式
                    lineStyle: {
                        color: "blue",
                    },
                    //填充颜色设置
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: "blue", // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: "#fff", // 100% 处的颜色
                                },
                            ],
                            global: false, // 缺省为 false
                        },
                    },
                },
            ],
            //布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
        });
    },
}
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
}

.search-header {
    margin-right: 20px;
}

.main {
    margin: 10px 0px;
}

.main-title {
    margin-right: 30px;
}

.main-content {
    margin-right: 10px;
}

.charts {
    width: 100%;
    height: 50px;
}
</style>