export const options = [{
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州',
    children: [
      {
        value: 'xihu',
        label: '西湖',
      },
      {
        value: 'shangcheng',
        label: '上城',
      }],
  }],
}, {
  value: 'jiangsu',
  label: '江苏',
  children: [
    {
      value: 'nanjing',
      label: '南京',
      children: [
        {
          value: 'zhonghuamen',
          label: '中华门',
        },
        {
          value: 'subei',
          label: '苏北',
        },
      ],
    },
    {
      value: 'suzhou',
      label: '苏州',
    },
  ],
}];
