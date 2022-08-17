import request from "@/utils/request.js";

// GET /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, methods: 'get', params: { category3Id } })

//获取Spu基本信息 
//GET /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => request.get(`/admin/product/getSpuById/${spuId}`);
//获取品牌基本信息 
//GET  /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () => request.get(`/admin/product/baseTrademark/getTrademarkList`);
//获取Spu图片的接口
//GET /admin/product/spuImageList/{spuId}
export const reqImage = (spuId) => request.get(`/admin/product/spuImageList/${spuId}`);
//获取平台的销售属性 ---------整个平台一共三个销售属性
//GET /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => request.get(`/admin/product/baseSaleAttrList`);
//修改SPU || 添加SPU 对于修改和添加的操作 ,携带给服务器的参数是一样的 唯一的区别就是添加不带id 修改带id
export const reqAddOrUpdate=(spuInfo)=>{
    if(spuInfo.id){
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo});
    }else{
        return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo});
    }
}
//删除Spu  /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu=(spuId)=>request.delete(`admin/product/deleteSpu/${spuId}`);


//SkuFrom  模块 请求 



//获取图片的数据
///admin/product/spuImageList/{spuId}  get
export const reqSpuImageLIst = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'});


//获取销售属性的数据
///admin/product/spuSaleAttrList/{spuId}  get
export const reqSpuSaleAttrList = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'});


//获取平台属性的数据
//GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} 
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});


//添加SKU
///admin/product/saveSkuInfo  post
export const reqAddSku = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo});


//获取SKU列表数据的接口
//GET /admin/product/findBySpuId/{spuId}  
export const reqSkuList = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'});