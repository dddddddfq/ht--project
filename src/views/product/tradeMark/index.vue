<template>
	<div>
		<!-- 按钮 -->
		<el-button
			type="primary"
			icon="el-icon-plus"
			style="margin: 10px 0px"
			@click="showDialog"
			>添加</el-button
		>
		<!-- 
      表格 
      label 显示标题
      align 对齐方式
      width  每列宽度
      elementUI中的table组件,展示的数据是以一列一列来显示的
    -->
		<el-table style="width: 100%" border :data="pageList">
			<el-table-column type="index" label="序号" width="80px" align="center">
			</el-table-column>
			<el-table-column prop="tmName" label="品牌名称" width="width">
			</el-table-column>
			<el-table-column prop="logoUrl" label="品牌LOGO" width="width">
				<template slot-scope="{ row, $index }">
					<img :src="row.logoUrl" style="width: 100px; height: auto" />
				</template>
			</el-table-column>
			<el-table-column prop="prop" label="操作" width="width">
				<template slot-scope="{ row, $index }">
					<el-button
						type="warning"
						icon="el-icon-edit"
						@click="updateTrademark(row)"
						>修改</el-button
					>
					<el-button
						type="danger"
						icon="el-icon-delete"
						@click="deleteTradeMark(row)"
						>删除</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<!-- page-size 每页个数
     :page-sizes="[3, 5, 10]"  设置每页显示几条数据
     total 总数据
     :pager-count='7'
     @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
    -->
		<el-pagination
			style="margin-top: 20px; text-align: center"
			:pager-count="7"
			:current-page="page"
			:page-sizes="[3, 5, 10]"
			:page-size="limit"
			layout=" prev, pager, next, jumper,->,total, sizes"
			:total="total"
			@current-change="getPageList"
			@size-change="handleSizeChange"
		>
		</el-pagination>
		<!--dialog消息框-->

		<el-dialog
			:title="tmForm.id ? '修改品牌' : '添加品牌'"
			:visible.sync="dialogFormVisible"
		>
			<!-- 
      :rules='rules' 表单验证规则   
      ref='ruleFrom'  给要验证的表单打上一个标签
     -->
			<el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
				<el-form-item label="品牌名称" label-width="100px" prop="tmName">
					<el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
				</el-form-item>
				<el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
					<!-- 
						:on-success="handleAvatarSuccess" 上传图片成功之后会调用一次
						:before-upload="beforeAvatarUpload" 上传图片之前会调用一次
           -->
					<el-upload
						class="avatar-uploader"
						action="/dev-api/admin/product/fileUpload"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload"
					>
						<img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<div slot="tip" class="el-upload__tip">
							只能上传jpg/png文件，且不超过500kb
						</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrUpdataTradeMark"
					>确 定</el-button
				>
			</div>
		</el-dialog>
		<!-- 删除弹窗 -->
	</div>
</template>

<script>
export default {
	name: "TradeMark",
	data() {
		//自定义表单验证规则
		let validateUrl = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请上传logo图片"));
			} else {
				callback();
			}
		};
		let validateTmName = (rule, value, callback) => {
			if (value.length < 2 || value.length > 10) {
				callback(new Error("请填写2-10位品牌名称"));
			} else {
				callback();
			}
		};
		return {
			total: 0,
			page: 2,
			limit: 3,
			// 总页码数
			pages: 0,
			pageList: [],
			//是否显示隐藏dialog
			dialogFormVisible: false,
			// 图片地址
			tmForm: {
				tmName: "",
				logoUrl: "",
			},
			//表单验证校验规则
			rules: {
				tmName: [
					//required 是否必填项  message 提示信息  trigger 事件名称
					{ required: true, validator: validateTmName, trigger: "change" },
				],
				logoUrl: [{ required: true, validator: validateUrl, trigger: "blur" }],
			},
		};
	},
	methods: {
		async getPageList(pager = 2) {
			this.page = pager;
			let { page, limit } = this;
			let result = await this.$API.tradeMark.reqGetTradeMark(page, limit);
			if (result.code == 200) {
				this.total = result.data.total; //展示数据的总条数
				this.pageList = result.data.records; //要展示的数据
				this.pages = result.data.pages;
			} else {
				alert(result.message);
			}
		},
		handleSizeChange(limit) {
			this.limit = limit;
			this.getPageList();
		},
		//添加品牌
		showDialog() {
			//删除id  修改弹窗的标题
			delete this.tmForm.id;
			//清空品牌名称
			this.tmForm.tmName = "";
			// 清空logo图片地址
			this.tmForm.logoUrl = "";
			//显示dialog
			this.dialogFormVisible = true;
		},
		//修改品牌
		updateTrademark(row) {
			//添加展示的标题 和 logo图片
			this.tmForm = { ...row };
			//显示dialog
			this.dialogFormVisible = true;
		},
		//上传图片成功的回调函数
		handleAvatarSuccess(res, file) {
			this.tmForm.logoUrl = res.data;
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === "image/jpeg";
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$message.error("上传头像图片只能是 JPG 格式!");
			}
			if (!isLt2M) {
				this.$message.error("上传头像图片大小不能超过 2MB!");
			}
			return isJPG && isLt2M;
		},
		// reqAddOrUpdateTradeMark
		//添加或者修改品牌
		addOrUpdataTradeMark(ruleForm) {
			this.$refs.ruleForm.validate(async (valid) => {
				if (valid) {
					try {
            // 隐藏弹窗
						this.dialogFormVisible = false;
            // 发请求
						let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
							this.tmForm
						);
						if (result.code == 200) {
							this.$message.success(
								this.tmForm.id ? "修改品牌信息成功" : "添加品牌信息成功"
							);
							this.getPageList(this.tmForm.id ? this.page : 2);
						}
						delete this.tmForm.id;
					} catch (error) {
						this.$message.error("系统数据请勿修改!!!");
					}
				} else {
					return false;
				}
			});
		},
		//删除品牌
		deleteTradeMark(row) {
			this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        // 确定按钮文字
				confirmButtonText: "确定",
        // 取消按钮文字
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(async () => {
					try {
						let result = await this.$API.tradeMark.deleteTradeMark(row.id);
						if (result.code == 200) {
							this.$message.success("删除数据成功");
							this.getPageList(this.page);
						}
					} catch (error) {
            // 抛出错误弹窗
						this.$message.error("系统数据请勿删除!!!");
					}
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除",
					});
				});
		},
	},
	created() {
    // 发请求获取数据
		this.getPageList();
	},
};
</script>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}
.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>