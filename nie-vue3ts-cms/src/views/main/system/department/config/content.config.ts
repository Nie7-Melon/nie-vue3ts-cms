const contentConfig = {
  pageName: 'department',
  listHeader: {
    title: '部门列表',
    btnTitle: '添加部门'
  },
  listBody: [
    { type: 'selection', label: '选择', width: '80px' },
    { type: 'index', label: '序号', width: '80px' },

    { type: 'normal', label: '部门名称', prop: 'name', width: '150px' },
    { type: 'normal', label: '部门领导', prop: 'leader', width: '150px' },
    { type: 'normal', label: '上级部门', prop: 'parentId', width: '150px' },

    { type: 'timer', label: '创建时间', prop: 'createAt' },
    { type: 'timer', label: '更新时间', prop: 'updateAt' },
    { type: 'handler', label: '操作', width: '150px' }

    // {
    //   type: 'custom',
    //   label: '部门领导',
    //   prop: 'leader',
    //   width: '150px',
    //   slotName: 'leader'
    // },
    // {
    //   type: 'custom',
    //   label: '上级部门',
    //   prop: 'parentId',
    //   width: '150px',
    //   slotName: 'parent'
    // },
  ]
}
export default contentConfig
