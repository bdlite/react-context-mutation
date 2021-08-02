English | [中文](README_zh.md) 




# NOTE
react-context-mutation is a lighter and more convenient state manager designed for react applications. It aims to replace the Redux in react applications and solve the problems of only one Store in Redux and Non Pluggable state maintenance in the project.




# Install
```
npm install react-context-mutation
```




# Usage
```js
// ./App/context.js
import createAppContext from 'react-context-mutation';
import state from './state'; // initial state tree
import configReducer from './config-reducer'; // pre reduce config function

export default createAppContext(state, configReducer)
```
```js
// ./App/index.js
import AppContext from './context'
import Header from './Header'

const { AppProvider, AppConsumer } = AppContext

export default function App() {
  return (
    <AppProvider>
      <AppConsumer>
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
// ./App/state.js
export default { // initial state tree
  app: {},
  header: {},
  sider: {},
}
```
```js
// ./App/config-reducer.js
export default function configReducer({ app = {}, header = {}, sider = {} }) { // pre reduce config function
  return (state) => ({
    app: mergeAppConfig(app, state.app),
    sider: mergeSiderConfig(sider, state.sider),
    header: mergeHeaderConfig(header, state.header),
  })
}
```
```js
// ./Header/index.js
import createActions from './actions';

export default function Header(props) {
  const { context, useActions } = props;
  const { menu, currentItem } = context.header;
  const actions = useActions(createActions); // actions is immutable

  const handleMenuChange = useCallback((currentItem) => {
    actions.changeCurrent(currentItem)
  }, [actions]); // actions is immutable

  return (
    <header>
      <Menu menu={menu} currentItem={currentItem} onMenuChange={handleMenuChange} />
    </header>
  )
}
```
```js
// ./Header/actions.js
export default (mutation, contextRef) => ({ // `mutation`and`contextRef` from closure
  changeCurrent(currentItem) {
    // you can fetch data hear
    mutation.header(() => ({ currentItem }));
    // await for fetch has done, mutation the header context value then
  }
})
```



# AppProvider
The provider receives a config attribute and passes it to the consumer component. A provider can have corresponding relationships with multiple consumer components. Multiple providers can also be nested, and the data in the inner layer will cover the data in the outer layer.

```
<AppProvider config={/* initial config inner state */}>...</AppProvider>
```


# AppConsumer
The consumer component can subscribe to the change of context. This component allows you to subscribe to context in functional components. useActions return an immutable collection of actions used to change context value.
```
<AppConsumer>
  {({ context, useActions, mutation }) => /* regular context to use */}
</.AppConsumer>
```


# Context
Context provides a way to share such values among components without explicitly passing props layer by layer through the component tree, in order to share the data that is "global" to a component tree.
```
<AppConsumer>
  {({ context }) => // `context` contains the whole tree of state
    <Header context={context} />
  }}
</AppConsumer>

function Header(props) {
  const { context } = props
  const { menu } = context.header // get `header` namespace

  return (
    <header>
      <Menu menu={menu} />
    </header>
  )
}
```

# useActions
useActions is used to obtain the changes of update status in functional components. Accept a closure funtion that provide `mutation` and `contextRef`.
```
const { useActions } = props
const actions = useAction(createActions)
```

# Mutation
Mutation is used to update the status of components.
```
const { mutation } = props
mutation[namespace](reducer)
```
