[English](README.md) | 中文  




# 引言

react-context-mutation是一个为react应用设计的、更为轻量、便捷的context状态管理器，旨在部分替换react应用内的redux，解决项目中redux单一数据源的初始化问题，可同时与redux一起使用，并且更轻松的去拔插组件需要的上下文。



# 安装

```
npm install react-context-mutation
```



# 使用

```js
// App.js
import { AppConsumer, AppProvider } = from 'react-context-mutation'
import Header from './header';

export default function App() {
  return (
    <AppProvider> // 生产者
      <AppConsumer> // 消费者
        {({ context, useActions }) => 
            <Header context={context} useActions={useActions} />
            <Layout>
              <Sider context={context} useActions={useActions} />
              <Content>
                <Router />
              </Content>
            </Layout>
          )
        }
      </AppConsumer>
    </AppProvider>
  )
}
```

```js
// ./header/index.js
import createActions from './actions';

export default function Header(props) {
  const { context, useActions } = props;
  const { menu, currentItem } = context.header;
  const actions = useActions(createActions); // actions 是不可变的

  const handleMenuChange = useCallback((currentItem) => {
    actions.changeCurrent(currentItem)
  }, [actions]); // actions 是不可变的

  return (
    <header>
      <Menu menu={menu} currentItem={currentItem} onMenuChange={handleMenuChange} />
    </header>
  )
}
```

```js
// ./header/actions.js
export default (mutation, contextRef) => ({
  changeCurrent(currentItem) {
    // 你可以在这里请求数据，异步处理context值
    mutation.header(() => ({ currentItem }));
    // 请求结束后，置状态等等
  }
})
```



# AppProvider

Provider 接收一个 config 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

这里有一些对业务常用的抽象设计，需要一些篇幅展开介绍，后续文档会加上，请期待...

```
<AppProvider config={/* 状态树中的某些配置 */}>...</AppProvider>
```


# AppConsumer

Consumer可以订阅 context 的变更，此组件可以让你在函数式组件中可以订阅 context。

这里有对原context的扩充，增加了`useActions`和`mutation`，文档后续也会展开介绍，请期待...

```
<AppConsumer>
  {({ context, useActions, mutation }) => /* 普通的 context 可供使用 */}
</.AppConsumer>
```


# Context

Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props，为了共享那些对于一个组件树而言是“全局”的数据。

```
<AppConsumer>
  {({ context }) => // `context` 包含整个状态树
    <Header context={context} />
  }}
</AppConsumer>

function Header(props) {
  const { context } = props
  const { menu } = context.header // 读取`header`命名空间中的数据

  return (
    <header>
      <Menu menu={menu} />
    </header>
  )
}
```

# useActions

useActions用于获取actions集合的hook，接收一个闭包环境的函数，提供`mutation`函数和`contextRef`对象。

文档后续会展开介绍具体用法和设计初衷...

```
const { useActions } = props
const actions = useAction(createActions)
```

# Mutation

Mutation用于组件更新指定命名空间状态。

```
const { mutation } = props
mutation[namespace](reducer)
```