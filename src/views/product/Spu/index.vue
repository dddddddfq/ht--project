<template>
	<div>
		<el-card style="margin: 20px 0px">
			<Category
				@getCategory="getCategory"
				:disabled="!isShow"
				:show="!isShow"
			></Category>
		</el-card>
		<el-card>
			<div v-show="sence == 0">
				<el-button type="primary" icon="el-icon-plus" @click="addSpu"
					>添加Spu</el-button
				>
				<el-table :data="records" style="width: 100%; margin: 20px 0" border>
					<el-table-column type="index" label="序号" width="80" align="center">
					</el-table-column>
					<el-table-column prop="spuName" label="Spu名称" width="width">
					</el-table-column>
					<el-table-column prop="description" label="Spu描述" width="width">
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
						<template slot-scope="{ row, $index }">
							<HitButton
								type="success"
								icon="el-icon-plus"
								title="添加sku"
								@click="addSku(row)"
								size="mini"
							></HitButton>
							<HitButton
								type="warning"
								icon="el-icon-edit"
								size="mini"
								title="修改spu"
								@click="editSpu(row)"
							></HitButton>
							<HitButton
								type="info"
								icon="el-icon-info"
								size="mini"
								title="查看当前spu全部sku列表"
								@click="handle(row)"
							></HitButton>
							<el-popconfirm
								title="这是一段内容确定删除吗？"
								@onConfirm="deleteSpu(row)"
							>
								<HitButton
									slot="reference"
									type="danger"
									icon="el-icon-delete"
									size="mini"
									title="删除spu"
								></HitButton>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
				<el-dialog :title='`${spu.spuName}的sku列表`' :visible.sync="dialogTableVisible" :before-close="close" >
				<el-table
					:data="skuList"
					style="width: 100%" border v-loading="loading">
					<el-table-column
						prop="skuName"
						label="名称"
						width="width">
					</el-table-column>
					<el-table-column
						prop="price"
						label="价格"
						width="width">
					</el-table-column>
					<el-table-column
						prop="weight"
						label="重量(kg)"
						width="width"
						>
					</el-table-column>
					<el-table-column
						label="默认图片"
						width="width">
						<template slot-scope="{row,$index}">
							<img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
						</template>
					</el-table-column>
				</el-table>
				</el-dialog>
				<!--
      每页展示数据发生变化时调用 
      @size-change="handleSizeChange"
      当前页发生变化时调用
      @current-change="handleCurrentChange"
      -->

				<el-pagination
					style="text-align: center"
					@current-change="getSpuList"
					@size-change="handleSizeChange"
					:current-page="page"
					:page-sizes="[3, 5, 10]"
					:page-size="limit"
					layout="prev, pager, next, jumper,->,sizes,total"
					:total="total"
				>
				</el-pagination>
			</div>
			<SpuFrom
				v-show="sence == 1"
				@changeSence="changeSence"
				ref="spu"
			></SpuFrom>
			<SkuFrom
				v-show="sence == 2"
				ref="sku"
				@changeSence="changeSence"
			></SkuFrom>
		</el-card>
	</div>
</template>

<script>
import SkuFrom from "./SkuFrom/index.vue";
import SpuFrom from "./SpuFrom/index.vue";
export default {
	name: "Spu",
	data() {
		return {
			category1Id: "",
			category2Id: "",
			category3Id: "",
			isShow: true,
			page: 1,
			limit: 3,
			//产品的Spu列表
			records: [],
			total: 0,
			sence: 0, // 0代表展示spu列表 2代表展示SkuFrom  1 代表 展示SpuFrom
			//控制dialog是否展示
			dialogTableVisible: false,
			spu:{},
			skuList:[],
			loading:true,
		};
	},
	components: {
		SkuFrom,
		SpuFrom,
	},
	methods: {
		//自定义事件获取1,2,3级菜单id
		getCategory(categoryId, level) {
			if (level == 1) {
				this.category1Id = categoryId;
				this.category2Id = "";
				this.category3Id = "";
			} else if (level == 2) {
				this.category2Id = categoryId;
				this.category3Id = "";
			} else {
				this.category3Id = categoryId;
				this.getSpuList();
			}
		},
		//发请求获取spu列表  和  页码改变的事件  默认pages=1
		async getSpuList(pages = 1) {
			this.page = pages;
			let { page, limit, category3Id } = this;
			let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
			if (result.code == 200) {
				this.records = result.data.records;
				//获取总的条数
				this.total = result.data.total;
			}
		},
		//每页要展示的条数发生变化时调用
		handleSizeChange(limit) {
			this.limit = limit;
			this.getSpuList();
		},
		//添加Spu
		addSpu() {
			this.sence = 1;
			this.$refs.spu.addSpu(this.category3Id);
		},
		//修改Spu
		editSpu(row) {
			this.sence = 1;
			//点击修改按钮发请求
			this.$refs.spu.init(row);
		},
		changeSence({ sence, flag }) {
			this.sence = sence;
			if (flag == "修改") {
				this.getSpuList(this.page);
			} else {
				this.getSpuList();
			}
		},
		//删除spu的回调
		async deleteSpu(row) {
			let result = await this.$API.spu.reqDeleteSpu(row.id);
			if (result.code == 200) {
				this.$message({
					type: "success",
					message: "删除成功!",
				});
				this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
			}
		},
		//添加Sku回调
		addSku(row) {
			this.sence = 2;
			this.$refs.sku.getData(this.category1Id, this.category2Id, row);
		},
		//弹出sku列表回调
		async handle(row) {
			//展示dialog对话框
			this.dialogTableVisible = true;
			this.spu=row;
			//获取sku列表信息
			let result = await this.$API.spu.reqSkuList(row.id);
			if(result.code==200){
				this.skuList=result.data;
				this.loading=false;
			}
		},
		//关闭dialog回调 
		close(done){
			//重置loading加载属性
			this.loading=true;
			// 重置sku列表
			this.skuList=[];
			//放行
			done()
		}
	},
};
</script>

<style>
</style>