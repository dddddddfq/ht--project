import request from '@/utils/request'

//   获取一级菜单          GET /admin/product/getCategory1
export const reqCategory1List = () => request.get('/admin/product/getCategory1')


//  获取二级菜单列表       GET /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id) => request.get(`/admin/product/getCategory2/${category1Id}`);

//  获取三级菜单列表       GET /admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id) => request.get(`/admin/product/getCategory3/${category2Id}`);


// 获取商品属性列表  GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id, category2Id, category3Id) => request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)


// 添加属性与属性值接口 POST /admin/product/saveAttrInfo
export const reqAddOrUpdate = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data })
    /* {
        "attrName": "string",  //属性名
        "attrValueList": [  // 属性名称中的属性值 属性值可以是多个 所以需要的是数组
          {
            "attrId": 0,   // 属性 id 
            "valueName": "string"  //属性值的属性名称
          }
        ],
        "categoryId": 0,   category3Id
        "categoryLevel": 3,
      } */