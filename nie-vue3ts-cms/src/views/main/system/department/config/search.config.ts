const searchConfig = {
  pageName: 'department',
  formItems: [
    {
      //这里增加类型因为不止有input类型，可能还有日期选择等
      prop: 'name',
      type: 'input',
      label: '部门名称',
      placeholder: '请输入查询的部门名称',
      initialValue: '我是默认填进去的值'
    },
    {
      type: 'input',
      prop: 'leader',
      label: '部门领导',
      placeholder: '请输入查询的领导名称'
    },
    {
      type: 'date-picker',
      prop: 'createAt',
      label: '创建时间'
    }
  ]
}

export default searchConfig
