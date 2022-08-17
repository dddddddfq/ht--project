<template>
	<div>
		<el-form ref="form" label-width="80px" :data="spu">
			<el-form-item label="Spu名称">
				<el-input placeholder="请输入Spu名称" v-model="spu.spuName"> </el-input>
			</el-form-item>
			<el-form-item label="品牌">
				<el-select placeholder="请选择品牌" v-model="spu.tmId">
					<el-option
						:label="tm.tmName"
						:value="tm.id"
						v-for="(tm, index) in trademarkList"
						:key="tm.id"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="SPU描述">
				<el-input
					placeholder="Spu描述"
					type="textarea"
					rows="4"
					v-model="spu.description"
				></el-input>
			</el-form-item>
			<el-form-item label="Spu图片">
				<!-- 上传图片   on-preview 是上传图片的回调函数  on-remove 是删除图片的回调 list-type是图片的类型  on-success 图片上传成功时的回调 file-list 上传的文件列表-->
				<el-upload
					action="/dev-api/admin/product/fileUpload"
					list-type="picture-card"
					:file-list="imgList"
					:on-preview="handlePictureCardPreview"
					:on-remove="handleRemove"
					:on-success="handleSuccess"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img width="100%" :src="dialogImageUrl" alt="" />
				</el-dialog>
			</el-form-item>
			<el-form-item label="销售属性">
				<el-select
					:placeholder="`还有${unseleteList.length}项未选择`"
					v-model="saleInfo"
				>
					<el-option
						:label="unselete.name"
						:value="`${unselete.id}:${unselete.name}`"
						v-for="(unselete, index) in unseleteList"
						:key="unselete.id"
					></el-option>
				</el-select>
				<el-button
					type="primary"
					icon="el-icon-plus"
					size="mini"
					style="height: 40px; margin: 0 20px; font-size: 14px"
					:disabled="!saleInfo"
					@click="addSale"
					>添加销售属性</el-button
				>
				<el-table
					style="width: 100%; margin: 20px 0"
					border
					:data="spu.spuSaleAttrList"
				>
					<el-table-column type="index" label="序号" width="80" align="center">
					</el-table-column>
					<el-table-column prop="saleAttrName" label="属性名" width="150">
					</el-table-column>
					<el-table-column prop="prop" label="属性值名称列表" width="width">
						<template slot-scope="{ row, $index }">
							<!-- @close="handleClose(tag)" -->
							<el-tag
								:key="tag.id"
								v-for="(tag, index) in row.spuSaleAttrValueList"
								closable
								:disable-transitions="false"
								@close="row.spuSaleAttrValueList.splice(index, 1)"
							>
								{{ tag.saleAttrValueName }}
							</el-tag>
							<!--  @keyup.enter.native="handleInputConfirm"
							@blur="handleInputConfirm"
							 -->
							<el-input
								class="input-new-tag"
								v-if="row.inputVisible"
								v-model="row.inputValue"
								ref="saveTagInput"
								size="small"
								@keyup.enter.native="$event.target.blur()"
								@blur="handleInputConfirm(row, $event)"
							>
							</el-input>
							<!-- 	@click="showInput" -->
							<el-button
								v-else
								class="button-new-tag"
								size="small"
								@click="addSaleValue(row)"
								>添加</el-button
							>
						</template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="80">
						<template slot-scope="{ row, $index }">
							<el-button
								type="danger"
								icon="el-icon-delete"
								size="mini"
								@click="spu.spuSaleAttrList.splice($index, 1)"
							></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item label="">
				<el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			dialogImageUrl: "",
			dialogVisible: false,
			//Spu基本信息
			spu: {
				//三级分类id
				category3Id: 0,
				//描述
				description: "",
				//收集图片的信息
				spuImageList: [],
				///spu名称
				spuName: "",
				//平台属性和属性值的收集
				spuSaleAttrList: [],
				//平台的id
				tmId: "",
			},
			//品牌列表
			trademarkList: [],
			//图片列表
			imgList: [],
			//平台销售属性
			SaleAttrList: [],
			//saleInfo 售卖属性id 和 name
			saleInfo: "",
			//收集后的图片列表信息
			spuImgList: [],
		};
	},
	methods: {
		//上传照片墙成功的回调
		handleSuccess(response, file, fileList) {
			//response 上传服务器成功返回的信息
			//file 上传图片的信息
			//fileList 上传完图片的列表
			this.spuImgList = fileList;
		},
		//删除照片墙的回调函数
		handleRemove(file, fileList) {
			//file 删除的图片信息
			//删除后的图片列表
			//收集删除后的图片列表信息
			this.spuImgList = fileList;
		},
		//预览照片墙图片的回调函数
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		//取消按钮的回调 因为是子组件修改父组件的参数 所以用自定义事件
		cancel() {
			this.$emit("changeSence", { sence: 0, flag: "" });
			//Object.assign方法是sc6新增合并对象方法
			Object.assign(this._data, this.$options.data());
		},
		//发请求 初始化页面
		async init(spu) {
			//发请求获取Spu基本信息
			let Spuresult = await this.$API.spu.reqSpu(spu.id);
			if (Spuresult.code == 200) {
				this.spu = Spuresult.data;
			}

			//发请求获取品牌的基本信息
			let TrademarkListResult = await this.$API.spu.reqTrademarkList();
			if (TrademarkListResult.code == 200) {
				this.trademarkList = TrademarkListResult.data;
			}
			//发请求获取SPu图片信息
			let ImgResult = await this.$API.spu.reqImage(spu.id);
			if (ImgResult.code == 200) {
				let listArr = ImgResult.data;
				listArr.forEach((item) => {
					item.name = item.imgName;
					item.url = item.imgUrl;
				});
				this.imgList = listArr;
			}
			//发请求获取平台属性
			let reqBaseSaleAttrList = await this.$API.spu.reqBaseSaleAttrList();
			if (reqBaseSaleAttrList.code == 200) {
				this.SaleAttrList = reqBaseSaleAttrList.data;
			}
		},
		//添加销售属性
		addSale() {
			const [baseSaleAttrId, saleAttrName] = this.saleInfo.split(":");

			let newSaleAttr = {
				baseSaleAttrId,
				saleAttrName,
				spuSaleAttrValueList: [],
			};
			this.spu.spuSaleAttrList.push(newSaleAttr);
			//置空平台销售属性的id和name
			this.saleInfo = "";
		},
		//添加销售属性值
		addSaleValue(row) {
			//添加一个响应式的inputVisible属性 实现input 和 button 的切换
			this.$set(row, "inputVisible", true);
			this.$set(row, "inputValue", "");

			this.$nextTick(() => {
				this.$refs.saveTagInput.focus();
			});
		},

		//失去焦点回调
		handleInputConfirm(row) {
			const { baseSaleAttrId, inputValue } = row;
			if (inputValue.trim() == "") {
				this.$message.error("输入不能为空!");
				return;
			}
			//通过数组的some方法判断是否有输入值重复
			let result = row.spuSaleAttrValueList.some((item) => {
				return inputValue == item.saleAttrValueName;
			});
			if (result) {
				this.$message({
					message: "属性值重复,请重新输入!",
					type: "warning",
				});
				return;
			}
			row.inputVisible = false;
			let obj = { baseSaleAttrId, saleAttrValueName: inputValue };
			row.spuSaleAttrValueList.push(obj);
		},
		//保存数据
		async addOrUpdateSpu() {
			//整理参数
			//把imglist修改一下
			this.spu.spuImageList = this.spuImgList.map((item) => {
				return {
					imgName: item.name,
					imgUrl: (item.response && item.response.data) || item.url,
				};
			});
			console.log(this.spu);
			let result = await this.$API.spu.reqAddOrUpdate(this.spu);
			console.log(result);
			if (result.code == 200) {
				this.$message({ type: "success", message: "保存成功!" });
			}
			this.$emit("changeSence", {
				sence: 0,
				flag: this.spu.id ? "修改" : "添加",
			});
		},
		//添加数据的函数
		async addSpu(id) {
			//清除数据
			Object.assign(this._data, this.$options.data());
			this.spu.category3Id = id;
			//发请求获取品牌的基本信息
			let TrademarkListResult = await this.$API.spu.reqTrademarkList();
			if (TrademarkListResult.code == 200) {
				this.trademarkList = TrademarkListResult.data;
			}
			//发请求获取平台属性
			let reqBaseSaleAttrList = await this.$API.spu.reqBaseSaleAttrList();
			if (reqBaseSaleAttrList.code == 200) {
				this.SaleAttrList = reqBaseSaleAttrList.data;
			}
		},
	},
	computed: {
		//计算未选择的平台销售属性
		unseleteList() {
			//通过过滤器 返回true 就是想要的数据 返回 false 就是不需要的数据
			let list = this.SaleAttrList.filter((item) => {
				// every方法返回true 或者false 如果其中有一个为false 返回值全都是false  类似于双重for循环
				return this.spu.spuSaleAttrList.every((item1) => {
					// 如果平台售卖属性的名称 不等于 spu平台售卖属性里面的id 就返回真 返回的数据是我们想要的
					return item.name != item1.saleAttrName;
				});
			});
			//返回出过滤出的数组
			return list;
		},
	},
};
</script>

<style>
.el-tag + .el-tag {
	margin-left: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>