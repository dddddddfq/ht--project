<template>
	<div>
		<el-table style="width: 100%" border :data="skuList">
			<el-table-column type="index" label="序号" width="80" align="center">
			</el-table-column>
			<el-table-column prop="skuName" label="名称" width="width">
			</el-table-column>
			<el-table-column prop="skuDesc" label="描述" width="width">
			</el-table-column>
			<el-table-column label="默认图片" width="110">
				<template slot-scope="{ row, $index }">
					<img
						:src="row.skuDefaultImg"
						alt=""
						style="width: 100px; height: 100px"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="weight" label="重量(kg)" width="80">
			</el-table-column>
			<el-table-column prop="price" label="价格(元)" width="80">
			</el-table-column>
			<el-table-column label="操作" width="width">
				<template slot-scope="{ row, $index }">
					<el-button
						type="success"
						icon="el-icon-top"
						size="mini"
						@click="sale(row)"
						v-if="row.isSale == 0"
					></el-button>
					<el-button
						icon="el-icon-bottom"
						size="mini"
						@click="cancel(row)"
						v-else
					></el-button>
					<el-button
						type="primary"
						icon="el-icon-edit"
						size="mini"
						@click="edit"
					></el-button>
					<el-button
						type="info"
						icon="el-icon-info"
						size="mini"
						@click="getSkuInfo(row)"
					></el-button>
					<el-button
						type="danger"
						icon="el-icon-delete"
						size="mini"
					></el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--     @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
		<el-pagination
			style="text-align: center"
			@current-change="getData"
			@size-change="handleSizeChange"
			:current-page="page"
			:page-sizes="[3, 5, 10]"
			:page-size="limit"
			layout="prev, pager, next, jumper,->,total, sizes "
			:total="total"
		>
		</el-pagination>

		<!-- 抽屉组件 -->
		<el-drawer :visible.sync="drawer" :show-close="false" size="50%">
			<el-row>
				<el-col :span="5">名称:</el-col>
				<el-col :span="16">{{ skuInfo.skuName }}</el-col>
			</el-row>
			<el-row>
				<el-col :span="5">描述:</el-col>
				<el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
			</el-row>
			<el-row>
				<el-col :span="5">价格:</el-col>
				<el-col :span="16">{{ skuInfo.price }}元</el-col>
			</el-row>
			<el-row>
				<el-col :span="5">平台属性:</el-col>
				<el-col :span="16">
					<el-tag
						type="success"
						size="mini"
						v-for="(attr, index) in skuInfo.skuAttrValueList"
						:key="attr.id"
						>{{ attr.attrId }}-{{ attr.valueId }}</el-tag
					>
				</el-col>
			</el-row>
		     <el-row>
      <el-col :span="5">商品图片</el-col>
      <el-col :span="16">
        <el-carousel height="300px" :interval="3000">
         <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id" style="text-align:center">  
               <img :src="item.imgUrl" style="width:auto;height:300px">
        </el-carousel-item>
    </el-carousel>
      </el-col>
    </el-row>
		</el-drawer>
	</div>
</template>

<script>
export default {
	name: "Sku",
	data() {
		return {
			page: 1,
			limit: 10,
			total: 0,
			skuList: [],
			skuInfo: {},
			drawer: false,
		};
	},
	updated() {
		window.scroll(0, 0);
	},
	mounted() {
		this.getData();
	},
	methods: {
		async getData(pages = 1) {
			this.page = pages;
			const { page, limit } = this;
			let result = await this.$API.sku.reqSkuList(page, limit);
			console.log(result);
			if (result.code == 200) {
				this.total = result.data.total;
				this.skuList = result.data.records;
			}
		},
		handleSizeChange(limit) {
			this.limit = limit;
			this.getData();
		},
		//上架商品
		async sale(row) {
			let result = await this.$API.sku.reqSale(row.id);
			if (result.code == 200) {
				this.$message({
					type: "success",
					message: "上架成功!",
				});
				row.isSale = 1;
			}
		},
		//下架
		async cancel(row) {
			let result = await this.$API.sku.reqCancel(row.id);
			if (result.code == 200) {
				this.$message("下架成功!");
				row.isSale = 0;
			}
		},
		//修改
		edit() {
			this.$message({
				type: "warning",
				message: "正在开发中 ^_^",
			});
		},
		async getSkuInfo(row) {
			this.drawer = true;
			let result = await this.$API.sku.reqSkuById(row.id);
			console.log(result);
			if (result.code == 200) {
				this.skuInfo = result.data;
			}
		},
	},
};
</script>

<style>
.el-col.el-col-5 {
	text-align: right;
	color: black;
	font-weight: 700;
}
.el-col.el-col-16 {
	margin-left: 5px;
}
.el-row {
	margin-top: 20px;
}
.el-tag {
	margin-left: 5px;
}
.el-carousel__button{
	height: 5px;
	background-color: #333;
}
</style>