export default {
    reactStrictMode: true,
    experimental: {
      concurrentFeatures: true, // 启用 React 18 并发模式
      reactRoot: true,
    },
    devIndicators: {
      disable: true, // 禁用开发模式下的 React 错误警告
    },
    // 如果你使用了 ES6模块，可以添加其他配置
  };