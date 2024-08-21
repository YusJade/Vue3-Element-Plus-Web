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

`v-model:model-value` 是 Vue 3 中用于双向绑定的语法。在 Vue 3 中，`v-model` 指令比 Vue 2 中更灵活和强大，可以自定义绑定的 prop 和事件。`v-model:model-value` 这种形式允许你在组件中自定义 `v-model` 的绑定属性和事件名称。

### 基本概念

在 Vue 2 中，`v-model` 是固定绑定到 `value` 属性和 `input` 事件的：

```vue
<template>
  <input v-model="inputValue" />
</template>

<script>
export default {
  data() {
    return {
      inputValue: ''
    };
  }
};
</script>
```

在 Vue 3 中，你可以通过 `v-model:model-value` 来绑定一个名为 `modelValue` 的属性，并且这个属性名是可以自定义的。

### 自定义 `v-model` 在 Vue 3 中的使用

假设你有一个自定义组件，你希望通过 `v-model` 绑定一个属性而不是默认的 `value`，那么你可以使用 `v-model:model-value` 的形式。

**父组件：**

```vue
<template>
  <CustomInput v-model:model-value="inputValue" />
</template>

<script>
export default {
  data() {
    return {
      inputValue: ''
    };
  }
};
</script>
```

**子组件 (`CustomInput.vue`)：**

```vue
<template>
  <input :value="modelValue" @input="onInput" />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.value);
    }
  }
};
</script>
```

### 详细解释

1. **`modelValue` Prop**：在子组件中定义一个 `modelValue` 的 prop，用于接收父组件通过 `v-model` 传递过来的值。

2. **自定义事件 `update:modelValue`**：当输入值发生变化时，通过 `$emit` 触发 `update:modelValue` 事件，将新值传递回父组件。

3. **父组件的使用**：在父组件中使用 `v-model:model-value` 绑定，这会自动将 `modelValue` 传递给子组件，同时子组件的 `update:modelValue` 事件也会更新父组件中的 `inputValue`。

### 多个 `v-model`

Vue 3 中你还可以为同一个组件定义多个 `v-model`，每个 `v-model` 绑定不同的 prop。例如：

```vue
<template>
  <CustomComponent v-model:title="title" v-model:content="content" />
</template>

<script>
export default {
  data() {
    return {
      title: '',
      content: ''
    };
  }
};
</script>
```

在这种情况下，`CustomComponent` 可以接收并发出 `title` 和 `content` 的双向绑定。

### 总结

- **`v-model:model-value`** 是 Vue 3 中自定义双向绑定的一种方式，可以指定要绑定的 prop 和事件。
- **灵活性**：允许在一个组件中使用多个 `v-model` 绑定不同的属性。
- **事件名**：子组件通过 `$emit('update:propName', value)` 来触发更新事件，propName 是 `v-model` 中的属性名。

这种设计使 Vue 3 的组件更灵活，可以在各种场景下进行自定义数据绑定。


在 Vue 3 中，`$emit('update:propName', value)` 是用来触发自定义事件的一种方式，通常用于实现双向绑定。当你在组件中使用 `v-model` 时，Vue 会自动监听一个名为 `update:propName` 的事件，并将传入的值更新到父组件的相应数据中。

### 解释

- **`propName`**：这是你希望双向绑定的属性名。例如，如果你在组件中有一个 `prop` 名叫 `modelValue`，那么你需要触发 `update:modelValue` 事件来更新这个属性的值。

- **`value`**：这是你希望传递给父组件的新值。当事件被触发时，父组件的数据会被这个值更新。

### 例子

假设你有一个自定义输入组件，你希望通过 `v-model` 来双向绑定输入框的值。你可以这样实现：

#### 子组件 (CustomInput.vue)

```vue
<template>
  <input :value="modelValue" @input="onInput" />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  methods: {
    onInput(event) {
      // 当输入框的值发生变化时，触发 update:modelValue 事件，将新值传递给父组件
      this.$emit('update:modelValue', event.target.value);
    }
  }
};
</script>
```

#### 父组件

```vue
<template>
  <CustomInput v-model="inputValue" />
</template>

<script>
export default {
  data() {
    return {
      inputValue: ''
    };
  }
};
</script>
```

### 工作原理

1. **父组件中的 `v-model`**：当你在父组件中使用 `v-model="inputValue"` 时，Vue 实际上会在子组件上绑定 `modelValue` 属性和 `update:modelValue` 事件。

2. **子组件中的 `props`**：`modelValue` 被作为 `props` 传递给子组件，用于初始化输入框的值。

3. **触发事件**：当输入框的值发生变化时，子组件会调用 `this.$emit('update:modelValue', newValue)`，其中 `newValue` 是输入框的新值。

4. **更新父组件的值**：Vue 监听到 `update:modelValue` 事件后，会自动更新父组件中 `inputValue` 的值，使得输入框的值和父组件的数据保持同步。

### 自定义绑定的灵活性

在 Vue 3 中，你不仅可以绑定默认的 `modelValue`，还可以绑定其他属性：

```vue
<template>
  <CustomComponent v-model:title="title" v-model:content="content" />
</template>

<script>
export default {
  data() {
    return {
      title: '',
      content: ''
    };
  }
};
</script>
```

在 `CustomComponent` 中，你可以通过 `$emit('update:title', newTitle)` 和 `$emit('update:content', newContent)` 来分别更新 `title` 和 `content`。

### 总结

- **`$emit('update:propName', value)`**：用于触发一个事件，这个事件告诉父组件更新 `propName` 对应的数据。
- **双向绑定**：通过在子组件中监听输入事件并触发 `update` 事件，父组件的数据能够自动与子组件的输入值保持同步。
- **灵活性**：允许自定义 `v-model` 的绑定属性名，支持多个 `v-model` 绑定不同的属性。


## 前者有响应式，后者无
```html
      <ValidatedInput v-else size="small" id="username" :clearable="false"
                      v-model:model-value="user.username"
                      :validate="validateUsernameLogined">
      </ValidatedInput>
    </el-descriptions-item>
    <el-descriptions-item label="电话">
      <span v-if="!isEditState"> {{ userStore.userInfo.phone }} </span>
      <ValidatedInput v-else size="small" id="phone" :clearable="false"
                      :model-value="user.phone" :validate="validatePhone"
                      </ValidatedInput>
```

当归还按钮点击并成功归还后，按钮需要立即消失，需要 `v-if` 绑定一个响应式属性，但要为每个数据项配置一个响应式变量吗？可否用计算属性




如果 `click` 函数不是返回一个 `Promise`，而是一个普通的同步或异步函数，那么我们可以手动将其转换为 `Promise`，以便能够使用 `then` 和 `await` 等异步控制流工具。

### 修改后的代码

你可以使用 `Promise.resolve()` 将 `click` 函数的结果封装为一个 `Promise`，即使它原本不是异步的。这样，代码可以一致地处理同步和异步操作。

```typescript
const refreshableClick = async (row: unknown, isRefresh: boolean, click: (row: unknown) => unknown) => {
  // 将 click(row) 的结果封装为 Promise，以便使用 then 方法
  await Promise.resolve(click(row)).then((res) => {
    if (isRefresh) {
      getTableData();
    }
  });
};
```

### 关键点解释

1. **`Promise.resolve()`**: 这个方法会将 `click(row)` 的结果封装为一个 `Promise` 对象。如果 `click(row)` 已经是一个 `Promise`，它将直接返回这个 `Promise`。如果 `click(row)` 是一个普通的值（同步函数的返回值），它会返回一个已成功解析的 `Promise`。

2. **`await` 和 `then`**: 通过 `await` 和 `then`，你可以确保 `getTableData()` 只在 `click(row)` 的操作完成后才被调用，无论 `click(row)` 是同步还是异步。

### 示例用法

```typescript
const handleClick = (row: unknown) => {
  console.log('Click operation for row:', row);
  // 这里返回一个普通的值，而不是 Promise
  return 'Operation Success';
};

const getTableData = async () => {
  console.log('Refreshing table data...');
};

// 使用示例
refreshableClick(someRow, true, handleClick);
```

### 总结

通过使用 `Promise.resolve()`，你可以确保 `refreshableClick` 函数能够处理 `click` 的结果，无论它是同步还是异步操作。这样做可以统一处理逻辑，避免因为 `click` 的类型不同而导致的异步控制流问题。