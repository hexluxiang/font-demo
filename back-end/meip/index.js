const express = require('express');
const fetch = require('node-fetch');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());

// 定义基本数据存储
let data = [{
    name: "ssss"
}];

// 获取所有资源的路由处理函数
app.get('/resources', (req, res) => {
  res.json(data);
  console.log(111);
});

// 创建新资源的路由处理函数
app.post('/resources', (req, res) => {
  const newItem = req.body;
  data.push(newItem);
  res.status(201).json(newItem);
});

// 获取特定资源的路由处理函数
app.get('/resources/:id', (req, res) => {
  const id = req.params.id;
  const item = data.find(item => item.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Resource not found');
  }
});

// 更新特定资源的路由处理函数
app.put('/resources/:id', (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body;
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = { ...updatedItem, id };
    res.json(data[index]);
  } else {
    res.status(404).send('Resource not found');
  }
});

// 删除特定资源的路由处理函数
app.delete('/resources/:id', (req, res) => {
  const id = req.params.id;
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    const deletedItem = data.splice(index, 1)[0];
    res.json(deletedItem);
  } else {
    res.status(404).send('Resource not found');
  }
});

// 启动服务器监听在指定端口
const PORT = 3111;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
