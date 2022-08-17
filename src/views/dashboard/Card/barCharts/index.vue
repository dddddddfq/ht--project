<template>
	<!-- 容器 -->
	<div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import * as echarts from "echarts";
export default {
	name: "",
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
					type: "bar",
					//设置折现平滑度
					smooth: true,
					data: [12,24,12,56,23,56,21,78,90,32,45],
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
};
</script>

<style scoped>
.charts {
	width: 100%;
	height: 100%;
}
</style>