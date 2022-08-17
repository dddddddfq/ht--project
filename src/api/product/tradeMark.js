import request from '@/utils/request'

// GET /admin/product/baseTrademark/{page}/{limit}
// 获取品牌列表接口
export const reqGetTradeMark = (page, limit) => request.get(`/admin/product/baseTrademark/${page}/${limit}`);
//POST /admin/product/baseTrademark/save   新增品牌  携带两个参数 一个品牌名称 一个品牌logo 
// PUT /admin/product/baseTrademark/update  修改品牌  携带三个参数 一个 id 一个名称 一个logo图片

export const reqAddOrUpdateTradeMark = (tradeMark) => {
        // 修改品牌
        if (tradeMark.id) {
            return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
        } else {
            //新增品牌
            return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
        }
    }
    // DELETE /admin/product/baseTrademark/remove/{id} 删除品牌参数 携带一个参数 id
export const deleteTradeMark = (id) => { return request.delete(`/admin/product/baseTrademark/remove/${id}`) }