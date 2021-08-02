[English](README.md) | 中文  




# 引言

react-context-mutation是一个为react应用设计的、更为轻量、便捷的状态管理器，旨在替换react应用内的redux，解决项目中redux过于庞大、状态不易维护管理的问题




# 安装
```
npm install react-context-mutation
```




# 使用

```js
// App.js
import reactContextMutation from "react-context-mutation"
const { AppConsumer, AppProvider } = reactContextMutation

// Header
function Header(props) {
  const { ctx } = props
  const { mutation, context, useActions } = ctx

  handleButtonClick() {
    mutation.setTitle("哈哈")
  }

  return (
    <>
      <header>
        {ctx.context.title}
      </header>
      <button onClick={handleButtonClick}>点我设置标题为“哈哈”</button>
    </>
  )
}

// 生产者
<AppProvider>
// 消费者
  <AppConsumer>
    {(ctx) => {
      // ctx中包含 context mutation useActions
      return (
        <Header ctx={ctx}></Header>
      )
    }}
  </AppConsumer>
</AppProvider>
```




# AppProvider
Provider 接收一个 config 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

```
<AppProvider config={/* 某个值 */}>...</AppProvider>
```




# AppConsumer
Consumer可以订阅 context 的变更，此组件可以让你在函数式组件中可以订阅 context


```
<AppConsumer>
  {value => /* 基于 context 值进行渲染*/}
</.AppConsumer>
```




# Context
Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props,为了共享那些对于一个组件树而言是“全局”的数据
```
<AppConsumer>
  {(ctx) => {
    // ctx contain context mutation useActions
    return (
      <Header ctx={ctx}></Header>
    )
  }}
</AppConsumer>

function Header(props) {
  const { ctx } = props
  const { context } = ctx

  return (
    <header>
      {context.title}
    </header>
  )
}

```




# Mutation
Mutation用于组件更新状态
```
const { mutation } = ctx
mutation([type](newState))
```




# useActions
useActions用于函数式组件中获取更新状态的mutations
```
const { useActions } = ctx
const action = useAction()
```
