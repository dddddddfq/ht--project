<template>
	<div>
		<el-form ref="form" label-width="80px">
			<el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
			<el-form-item label="SKU名称">
				<el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
			</el-form-item>
			<el-form-item label="价格(元)">
				<el-input
					placeholder="价格(元)"
					type="number"
					v-model="skuInfo.price"
				></el-input>
			</el-form-item>
			<el-form-item label="重量(kg)">
				<el-input placeholder="重量(kg)" v-model="skuInfo.weight"></el-input>
			</el-form-item>
			<el-form-item label="规格描述">
				<el-input
					type="textarea"
					rows="4"
					placeholder=""
					v-model="skuInfo.skuDesc"
				></el-input>
			</el-form-item>
			<el-form-item label="平台属性">
				<el-form :inline="true" ref="form" label-width="80px">
					<el-form-item
						:label="attr.attrName"
						v-for="(attr, index) in attrInfoList"
						:key="attr.id"
					>
						<el-select placeholder="请选择" v-model="attr.idInfo">
							<el-option
								:label="attrValue.valueName"
								:value="`${attr.id}:${attrValue.id}`"
								v-for="(attrValue, index) in attr.attrValueList"
								:key="attrValue.id"
							></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-form-item>
			<el-form-item label="销售属性">
				<el-form :inline="true" ref="form" label-width="80px">
					<el-form-item
						:label="saleAttr.saleAttrName"
						v-for="(saleAttr, index) in sale"
						:key="saleAttr.id"
					>
						<el-select placeholder="请选择" v-model="saleAttr.idInfo">
							<el-option
								:label="saleAttrValue.saleAttrValueName"
								:value="`${saleAttr.id}:${saleAttrValue.id}`"
								v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
								:key="saleAttrValue.id"
							></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-form-item>
			<el-form-item label="图片列表">
				<el-table
					:data="img"
					@selection-change="handleSelectionChange"
					style="width: 100%"
				>
					<el-table-column
						type="selection"
						prop="prop"
						label="label"
						width="80"
					>
					</el-table-column>
					<el-table-column prop="prop" label="图片" width="width">
						<template slot-scope="{ row, $index }">
							<img
								:src="row.imgUrl"
								alt=""
								style="width: 100px; height: 100px"
							/>
						</template>
					</el-table-column>
					<el-table-column prop="imgName" label="名称" width="width">
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
						<template slot-scope="{ row, $index }">
							<el-button
								type="primary"
								size="mini"
								v-if="row.isDefault == 0"
								@click="changeDefault(row)"
								>设为默认</el-button
							>
							<el-button size="mini" v-else>默认</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item label="">
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			//图片数据
			img: [],
			//平台销售属性数据
			sale: [],
			//平台属性数据
			attrInfoList: [],
			//sku数据详情
			skuInfo: {
				//第一类收集的数据：父组件给的数据
				category3Id: 0,
				spuId: 0,
				tmId: 0,
				//第二类：需要通过数据双向绑定v-model收集
				skuName: "",
				price: 0,
				weight: "",
				skuDesc: "",
				//第三类：需要自己书写代码
				//默认图片
				skuDefaultImg: "",
				//收集图片的字段
				skuImageList: [
					// {
					//   id: 0,
					//   imgName: "string",
					//   imgUrl: "string",
					//   isDefault: "string",
					//   skuId: 0,
					//   spuImgId: 0,
					// },
				],
				//平台属性
				skuAttrValueList: [
					// {
					//   attrId: 0,
					//   valueId: 0,
					// },
				],
				//销售属性
				skuSaleAttrValueList: [
					// {
					//   id: 0,
					//   saleAttrId: 0,
					//   saleAttrName: "string",
					//   saleAttrValueId: 0,
					//   saleAttrValueName: "string",
					//   skuId: 0,
					//   spuId: 0,
					// },
				],
			},
			spu: {},
			//收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
			imageList: [],
		};
	},
	methods: {
		async getData(c1, c2, row) {
			console.log(c1, c2, row); //category3Id
			this.skuInfo.category3Id = row.category3Id;
			this.skuInfo.spuId = row.id;
			this.skuInfo.tmId = row.tmId;
			this.spu = row;
			//发请求获取图片数据
			let result = await this.$API.spu.reqSpuImageLIst(row.id);
			if (result.code == 200) {
				let list = result.data;
				list.forEach((item) => {
					item.isDefault = 0;
				});
				this.img = list;
			}
			//发请求获取销售属性
			let result1 = await this.$API.spu.reqSpuSaleAttrList(row.id);
			if (result1.code == 200) {
				this.sale = result1.data;
			}
			//发请求获取平台属性
			let result2 = await this.$API.spu.reqAttrInfoList(
				c1,
				c2,
				row.category3Id
			);
			if (result2.code == 200) {
				this.attrInfoList = result2.data;
			}
		},
		//修改是否默认属性
		changeDefault(row) {
			//排他 所有数组的isDefault项重置为0
			this.img.forEach((item) => {
				item.isDefault = 0;
			});
			//收集默认图片地址
			this.skuInfo.skuDefaultImg = row.imgUrl;
			row.isDefault = 1;
			console.log(this.skuInfo);
		},
		//勾选复选框的回调事件
		handleSelectionChange(row) {
			//勾选的数据收集给imageList这个数组
			this.imageList = row;
		},
		//取消按钮回调
		cancel() {
			//场景切换
			this.$emit("changeSence", { sence: 0, flag: "" });
			//清除数据
			Object.assign(this._data, this.$options.data());
		},
		//保存按钮的回调
		async save() {
			const { skuInfo, attrInfoList, sale,imageList } = this;

			//            -------------- 方法1
			// let arr=[];
			// attrInfoList.forEach((item)=>{
			// 	if(item.idInfo){
			// 		const [attrId,valueId]=item.idInfo.split(':');
			// 		let obj={attrId,valueId}
			// 		arr.push(obj)
			// 	}
			// })
			// console.log(arr);
			//---------------------方法2  reduce  手机平台销售属性数据
			this.skuInfo.skuAttrValueList = attrInfoList.reduce((prve, item) => {
				if (item.idInfo) {
					const [attrId, valueId] = item.idInfo.split(":");
					let obj = { attrId, valueId };
					prve.push(obj);
				}
				return prve;
			}, []);
			//收集sale数据
			this.skuInfo.skuSaleAttrValueList = sale.reduce((prev, item) => {
				
				if (item.idInfo) {
					const [saleAttrId, saleAttrValueId] = item.idInfo.split(":");
					prev.push({ saleAttrId, saleAttrValueId });
				}
				return prev;
			}, []);

			//收集图片数据 
			this.skuInfo.skuImageList=imageList.map((item)=>{
				return{
					imgName:item.imgName,
					imgUrl:item.imgUrl,
					isDefault:item.isDefault,
					spuImgId:item.id
				}
			});
			//发请求
			let result  =  await this.$API.spu.reqAddSku(this.skuInfo);
			if(result.code==200){
				this.$message({
					type:'success',
					message:'添加sku成功!'
				});
				this.$emit('changeSence',{sence:0,flag:''});
			}
		},
	},
};
</script>

<style>
</style>