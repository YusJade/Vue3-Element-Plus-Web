#### `emit`、`defineEmits`
 > [📖 子组件与父组件通信](https://blog.csdn.net/weixin_47192158/article/details/138181804)

#### `el-table`封装、`slot`
> [📖 CSDN：Vue3.0使用Element-ui制作table组件，操作列动态渲染按钮](https://blog.csdn.net/Cocoon_Xu/article/details/136155300)

#### 使自己的组件兼容`v-model`
> [📖 CSDN：给自己封装的组件添加v-model（vue3）](https://blog.csdn.net/m0_43599959/article/details/121807838)

在组件 `props` 中定义 `modelValue`


`Proxy` 和 `Object` 是 JavaScript 中用于处理对象的两种方式，它们的功能和用途有所不同。以下是对 `Proxy` 和 `Object` 的区别和各自用途的详细解释。

### `Object` 
`Object` 是 JavaScript 的基础数据类型之一，用于创建和操作对象。对象是属性的集合，每个属性都有一个键（属性名）和一个值。你可以直接通过 `Object` 来创建和操作对象。

**创建对象的示例：**

```javascript
const person = {
  name: 'Alice',
  age: 30
};

console.log(person.name); // 输出: Alice
person.age = 31;
console.log(person.age); // 输出: 31
```

**主要特点：**

- **静态特性**：直接通过对象字面量或 `Object` 构造函数创建对象，操作对象时没有额外的行为控制。
- **基本用途**：用于存储键值对，作为数据的容器。

### `Proxy`
`Proxy` 是 ES6 引入的一个高级功能，允许你为对象创建一个代理对象，并定义特定的行为（拦截）来控制对象的基本操作。`Proxy` 可以用于监听和修改对象的底层操作，例如读取属性、设置属性、删除属性等。

**使用 `Proxy` 的示例：**

```javascript
const handler = {
  get: function(target, property) {
    console.log(`Getting property ${property}`);
    return property in target ? target[property] : 'Property not found';
  },
  set: function(target, property, value) {
    console.log(`Setting property ${property} to ${value}`);
    target[property] = value;
    return true;
  }
};

const person = new Proxy({ name: 'Alice', age: 30 }, handler);

console.log(person.name); // 输出: Getting property name 然后输出: Alice
person.age = 31;          // 输出: Setting property age to 31
console.log(person.age);  // 输出: Getting property age 然后输出: 31
console.log(person.height); // 输出: Getting property height 然后输出: Property not found
```

**主要特点：**

- **动态特性**：`Proxy` 可以拦截并自定义对象的基本操作（如读取属性、设置属性、删除属性等），这使得它可以用于实现一些高级功能，如数据绑定、属性验证、访问控制等。
- **高级用途**：`Proxy` 常用于创建库或框架，提供额外的行为控制和功能扩展。例如，Vue.js 中的响应式系统就使用了 `Proxy` 来监听对象的变化。

### 区别总结

- **基本操作**：`Object` 是 JavaScript 的基础构造，直接用于定义和操作对象。`Proxy` 则是对对象的封装和扩展，用于拦截和自定义对象的操作行为。
- **灵活性**：`Object` 的操作行为是固定的，而 `Proxy` 可以自定义这些行为，从而使对象操作更加灵活和可控。
- **复杂性**：`Object` 使用简单直接，适合大多数普通场景。`Proxy` 则适合需要动态拦截和定制行为的复杂场景，但相对来说使用也更复杂。

### 何时使用 `Proxy`？

- **数据绑定/响应式系统**：如在 Vue.js 中，`Proxy` 用于实现数据的双向绑定和响应式更新。
- **属性验证和访问控制**：你可以使用 `Proxy` 来实现对象属性的验证，限制某些属性的访问或修改。
- **调试和日志**：`Proxy` 可以用来在对象操作时插入日志或进行调试。
- **实现陷阱或钩子函数**：通过 `Proxy`，可以在对象操作中插入自定义逻辑，例如在属性读取时自动格式化数据。

总的来说，`Object` 适用于日常的对象操作，而 `Proxy` 则用于实现更高级和动态的行为控制。