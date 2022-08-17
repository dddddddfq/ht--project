<template>
	<div>
		<el-card style="margin: 10px 0">
			<Category @getCategory="getCategory" :disabled="!isShow" :show="!isShow"></Category>
		</el-card>
		<el-card>
			<div v-show="isShow">
				<el-button
					type="primary"
					icon="el-icon-plus"
					:disabled="!category3Id"
					@click="addAttr"
					>添加属性</el-button
				>
				<el-table :data="attrList" style="width: 100%; margin: 20px 0" border>
					<el-table-column type="index" label="序号" align="center" width="80">
					</el-table-column>
					<el-table-column prop="attrName" label="属性名称" width="150">
					</el-table-column>
					<el-table-column prop="prop" label="属性值列表" width="width">
						<template slot-scope="{ row, $index }">
							<el-tag
								type="success"
								v-for="(attrValue, index) in row.attrValueList"
								:key="attrValue.id"
								style="margin: 0px 20px"
								>{{ attrValue.valueName }}</el-tag
							>
						</template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="150">
						<template slot-scope="{ row, $index }">
							<el-button
								type="warning"
								icon="el-icon-edit"
								size="mini"
								@click="updateAttr(row)"
							></el-button>
							<el-button
								type="danger"
								icon="el-icon-delete"
								size="mini"
								@click="deleteAttr($index)"
							></el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div v-show="!isShow">
				<el-form
					:inline="true"
					ref="form"
					label-width="80px"
					style="margin-left: -30px"
					:model="attrInfo"
				>
					<el-form-item label="属性名">
						<el-input
							placeholder="请输入属性名"
							v-model="attrInfo.attrName"
						></el-input>
						<span></span>
					</el-form-item>
				</el-form>
				<el-button
					type="primary"
					icon="el-icon-plus"
					@click="addAttrValueList"
					:disabled="!attrInfo.attrName"
					>添加属性名</el-button
				>
				<el-button @click="isShow = true">取消</el-button>
				<el-table
					style="width: 100%; margin: 20px 0"
					border
					:data="attrInfo.attrValueList"
				>
					<el-table-column type="index" label="序号" width="80">
					</el-table-column>
					<el-table-column prop="prop" label="属性值名称" width="width">
						<template slot-scope="{ row, $index }">
							<el-input
								:ref="$index"
								v-model="row.valueName"
								placeholder="请输入属性名称"
								size="mini"
								v-if="row.flag"
								@blur="toLook(row)"
								@keyup.native.enter="toLook(row)"
							></el-input>
							<span
								v-else
								@click="clickSpan(row, $index)"
								style="display: block"
								>{{ row.valueName }}</span
							>
						</template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
						<template slot-scope="{ row, $index }">
							<el-popconfirm
								:title="`确定要删除${row.valueName}吗?`"
								@onConfirm="deleteValueName($index)"
							>
								<el-button
									slot="reference"
									type="danger"
									icon="el-icon-delete"
									size="mini"
								></el-button>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
				<el-button type="primary" @click="addOrupdate" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
				<el-button @click="isShow = true">取消</el-button>
			</div>
		</el-card>
	</div>
</template>

<script>
//按需引入深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
	name: "Attr",
	data() {
		return {
			category1Id: "",
			category2Id: "",
			category3Id: "",
			attrList: [],
			//是否展示属性值列表
			isShow: true,
			// 收集修改属性值的 参数
			attrInfo: {
				attrName: "", //属性名
				attrValueList: [
					// 属性名称中的属性值 属性值可以是多个 所以需要的是数组
				],
				categoryId: 0, //category3Id
				categoryLevel: 3,
			},
		};
	},
	methods: {
		getCategory(categoryID, num) {
			if (num == 1) {
				this.category1Id = categoryID;
				this.category2Id = "";
				this.category3Id = "";
			} else if (num == 2) {
				this.category2Id = categoryID;
				this.category3Id = "";
			} else {
				this.category3Id = categoryID;
				this.getList();
			}
		},
		async getList() {
			let { category1Id, category2Id, category3Id } = this;
			//发请求获取分类属性值
			let result = await this.$API.attr.reqAttrList(
				category1Id,
				category2Id,
				category3Id
			);
			if (result.code == 200) {
				this.attrList = result.data;
			}
		},
		//添加属性值名称
		addAttrValueList() {
			this.attrInfo.attrValueList.push({
				attrId: this.attrInfo.id, // 属性 id  如果是修改属性 需要带属性 id 这个参数
				valueName: "", //属性值的属性名称
				flag: true, //  是否是编辑模式或者是查看模式
			});
			//点击添加按钮自动获取焦点
			this.$nextTick(() => {
				this.$refs[this.attrInfo.attrValueList.length - 1].focus();
			});
		},
		//添加属性的回调函数
		addAttr() {
			//点击隐藏属性列表
			this.isShow = !this.isShow;
			this.attrInfo = {
				attrName: "", //属性名
				attrValueList: [
					// 属性名称中的属性值 属性值可以是多个 所以需要的是数组
				],
				categoryId: this.category3Id, //category3Id
				categoryLevel: 3,
			};
		},
		//修改属性列表 updateAttr
		updateAttr(row) {
			this.isShow = false;
			//深拷贝对象 防止取消修改导致原数组的改变
			this.attrInfo = cloneDeep(row);
			//给this.attrInfo添加动态的flag 属性 来控制查看模式和编辑模式的切换
			this.attrInfo.attrValueList.forEach((item) => {
				this.$set(item, "flag", false);
			});
		},
		//输入框失去焦点和按下回车的回调事件
		toLook(row) {
			//如果输入的valueName为空 则弹出 退出函数
			if (row.valueName.trim() == "") {
				this.$message({
					message: "输入不能为空!",
					type: "warning",
				});
				return;
			}
			let isReapt = this.attrInfo.attrValueList.some((item) => {
				if (row !== item) {
					return row.valueName == item.valueName;
				}
			});
			//如果有重复的值 退出当前循环
			if (isReapt) {
				this.$message({
					message: "请不要输入重复的属性值哦!",
					type: "warning",
					duration: 1000,
				});
				return;
			}
			row.flag = false;
		},
		//点击span的事件回调
		clickSpan(row, index) {
			row.flag = true;
			this.$nextTick(() => {
				this.$refs[index].focus();
			});
		},
		//气泡确认按钮的回调函数
		deleteValueName(index) {
			this.attrInfo.attrValueList.splice(index, 1);
		},
		// 添加或者修改数据的按钮 回调函数
		async addOrupdate() {
			this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
				(item) => {
					if (item.valueName.trim() != "") {
						delete item.flag;
						return true;
					}
				}
			);
			try {
				// 发请求
				await this.$API.attr.reqAddOrUpdate(this.attrInfo);
				//弹窗 保存成功
				this.$message({ type: "success", message: "保存成功" });
				//获取更新之后的列表
				this.getList();
				// 把表格展现出来
				this.isShow=true
			} catch (error) {
				this.$message({type:'danger',message:'保存失败'})
			}
		},
		deleteAttr(index){
		
		   this.attrList.splice(index,1)
			
		}
	},
	mounted() {},
};
</script>

<style>
</style>