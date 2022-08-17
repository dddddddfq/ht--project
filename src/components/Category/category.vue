<template>
	<el-form :inline="true" class="demo-form-inline" :model="cForm">
		<el-form-item label="一级分类">
			<el-select
				placeholder="请输入"
				v-model="cForm.caregory1Id"
				@change="handle" 
				:disabled="show"
			>
				<el-option
					:label="c1.name"
					:value="c1.id"
					v-for="(c1, index) in list1"
					:key="c1.id"
				></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="二级分类">
			<el-select
				placeholder="请输入"
				v-model="cForm.caregory2Id"
				:disabled="show"
				@change="handle1"
			>
				<el-option
					:label="c2.name"
					:value="c2.id"
					v-for="(c2, index) in list2"
					:key="c2.id"
				></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="三级分类">
			<el-select
				placeholder="请输入"
				v-model="cForm.caregory3Id"
				:disabled="show"
				@change="handle2"
			>
				<el-option
					:label="c3.name"
					:value="c3.id"
					v-for="(c3, index) in list3"
					:key="c3.id"
				></el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button type="primary">查询</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
export default {
	name: "Category",
	props:['show'],
	data() {
		return {
			list1: [],
			list2: [],
			list3: [],
			cForm: {
				caregory1Id: "",
				caregory2Id: "",
				caregory3Id: "",
			},
			
		};
	},
	methods: {
		async getCaregory1() {
			let result = await this.$API.attr.reqCategory1List();
			if (result.code == 200) {
				this.list1 = result.data;
			}
		},
		//如果一级菜单发生变化 调用函数
		async handle() {
			this.list2 = [];
			this.list3 = [];
			this.cForm.caregory2Id = "";
			this.cForm.caregory3Id = "";
			let { caregory1Id } = this.cForm;
			let result = await this.$API.attr.reqCategory2List(caregory1Id);
			if (result.code == 200) {
				this.list2 = result.data;
			}
			//给父组件传递参数
			this.$emit("getCategory", caregory1Id, 1);
		},
		// 获取到二级id 调用函数
		async handle1() {
			this.list3 = [];
			this.cForm.caregory3Id = "";
			let { caregory2Id } = this.cForm;
			let result = await this.$API.attr.reqCategory3List(caregory2Id);
			if (result.code == 200) {
				this.list3 = result.data;
			}
			this.$emit("getCategory", caregory2Id, 2);
		},
		//当选择三级菜单 调用函数
		handle2() {
			let { caregory3Id } = this.cForm;
			this.$emit("getCategory", caregory3Id, 3);
		},
	},
	mounted() {
		this.getCaregory1();
	},
};
</script>

<style>
</style>