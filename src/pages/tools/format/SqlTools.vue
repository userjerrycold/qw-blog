<template>
  <PageLayout :rightSidebar="ToolsRightSidebar">
    <div class="sql-tools-container">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">SQL 工具</h1>
        <n-button @click="router.push('/tools')" size="small">
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          返回工具列表
        </n-button>
      </div>

      <n-tabs type="line" animated>
        <!-- SQL 格式化 -->
        <n-tab-pane name="format" tab="格式化SQL">
          <n-card title="SQL 格式化工具" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                智能美化SQL语句，支持多种SQL方言，使SQL代码更易读
              </n-alert>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">输入 SQL</h3>
                  <div class="flex gap-2">
                    <n-button size="small" @click="loadSampleSql">加载示例</n-button>
                    <n-button size="small" @click="resetSqlInput">清空</n-button>
                  </div>
                </div>
                <n-input
                  v-model:value="sqlInput"
                  type="textarea"
                  :autosize="{ minRows: 12, maxRows: 20 }"
                  placeholder="在此输入 SQL 语句"
                />
                <div class="flex gap-2 mt-2">
                  <n-button type="primary" @click="formatSql">格式化</n-button>
                  <n-button @click="minifySql">压缩</n-button>
                  <n-button @click="pasteFromClipboard">从剪贴板粘贴</n-button>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">格式化结果</h3>
                  <div class="flex gap-2">
                    <n-select 
                      v-model:value="sqlDialect" 
                      :options="dialectOptions" 
                      size="small" 
                      style="width: 120px"
                    />
                    <n-button size="small" @click="copyToClipboard(sqlOutput)">复制结果</n-button>
                  </div>
                </div>
                <div class="sql-display-container">
                  <pre class="sql-output">{{ sqlOutput }}</pre>
                </div>
              </div>
            </div>
          </n-card>
        </n-tab-pane>

        <!-- SQL 常用模板 -->
        <n-tab-pane name="templates" tab="SQL模板">
          <n-card title="常用 SQL 模板" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                提供常用SQL语句模板，可根据需求快速生成标准SQL语句
              </n-alert>
            </div>

            <n-tabs type="segment">
              <!-- 增删改查 -->
              <n-tab-pane name="crud" tab="基础CRUD">
                <div class="template-grid">
                  <div v-for="(template, index) in crudTemplates" :key="index" class="template-card">
                    <div class="template-header">
                      <h3>{{ template.name }}</h3>
                      <n-button text size="small" @click="copyToClipboard(template.sql)">
                        复制
                      </n-button>
                    </div>
                    <div class="template-content">
                      <pre>{{ template.sql }}</pre>
                    </div>
                    <div class="template-description">
                      {{ template.description }}
                    </div>
                  </div>
                </div>
              </n-tab-pane>

              <!-- 表管理 -->
              <n-tab-pane name="table" tab="表管理">
                <div class="template-grid">
                  <div v-for="(template, index) in tableTemplates" :key="index" class="template-card">
                    <div class="template-header">
                      <h3>{{ template.name }}</h3>
                      <n-button text size="small" @click="copyToClipboard(template.sql)">
                        复制
                      </n-button>
                    </div>
                    <div class="template-content">
                      <pre>{{ template.sql }}</pre>
                    </div>
                    <div class="template-description">
                      {{ template.description }}
                    </div>
                  </div>
                </div>
              </n-tab-pane>

              <!-- 高级查询 -->
              <n-tab-pane name="advanced" tab="高级查询">
                <div class="template-grid">
                  <div v-for="(template, index) in advancedTemplates" :key="index" class="template-card">
                    <div class="template-header">
                      <h3>{{ template.name }}</h3>
                      <n-button text size="small" @click="copyToClipboard(template.sql)">
                        复制
                      </n-button>
                    </div>
                    <div class="template-content">
                      <pre>{{ template.sql }}</pre>
                    </div>
                    <div class="template-description">
                      {{ template.description }}
                    </div>
                  </div>
                </div>
              </n-tab-pane>
            </n-tabs>
          </n-card>
        </n-tab-pane>

        <!-- SQL 优化建议 -->
        <n-tab-pane name="optimization" tab="优化建议">
          <n-card title="SQL 性能优化指南" class="mb-4">
            <n-collapse>
              <n-collapse-item title="索引优化" name="1">
                <div class="optimization-content">
                  <h4 class="font-medium text-base mb-2">索引使用原则</h4>
                  <ul class="list-disc list-inside space-y-2">
                    <li>在WHERE和JOIN条件中出现的列上创建索引</li>
                    <li>索引字段避免使用函数或表达式</li>
                    <li>选择性高（唯一值较多）的列适合建索引</li>
                    <li>复合索引遵循最左前缀原则</li>
                    <li>避免冗余和重复索引</li>
                  </ul>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">示例</h4>
                  <div class="code-block">
                    <pre><code>-- 创建高效索引
CREATE INDEX idx_user_email ON users(email);

-- 复合索引（遵循最左前缀）
CREATE INDEX idx_user_name_age ON users(last_name, first_name, age);

-- 查看索引是否被使用
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';</code></pre>
                  </div>
                </div>
              </n-collapse-item>
              
              <n-collapse-item title="查询优化" name="2">
                <div class="optimization-content">
                  <h4 class="font-medium text-base mb-2">查询优化技巧</h4>
                  <ul class="list-disc list-inside space-y-2">
                    <li>避免使用SELECT *，只查询需要的列</li>
                    <li>使用LIMIT限制结果集大小</li>
                    <li>避免在WHERE子句中使用函数</li>
                    <li>使用JOIN代替子查询</li>
                    <li>使用EXISTS代替IN（当子查询结果集较大时）</li>
                    <li>合理使用临时表或表变量</li>
                  </ul>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">优化前后对比</h4>
                  <div class="code-block">
                    <pre><code>-- 优化前
SELECT * 
FROM orders 
WHERE customer_id IN (SELECT id FROM customers WHERE region = 'North');

-- 优化后
SELECT o.* 
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.region = 'North';</code></pre>
                  </div>
                </div>
              </n-collapse-item>
              
              <n-collapse-item title="表结构优化" name="3">
                <div class="optimization-content">
                  <h4 class="font-medium text-base mb-2">表设计原则</h4>
                  <ul class="list-disc list-inside space-y-2">
                    <li>选择合适的数据类型，节省空间</li>
                    <li>适当进行表拆分，避免过宽的表</li>
                    <li>使用范式化设计减少数据冗余</li>
                    <li>考虑适当反范式化以提高查询性能</li>
                    <li>为大表添加分区策略</li>
                  </ul>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">示例</h4>
                  <div class="code-block">
                    <pre><code>-- 表分区示例
CREATE TABLE sales (
    id INT NOT NULL,
    sale_date DATE NOT NULL,
    amount DECIMAL(10,2)
)
PARTITION BY RANGE (YEAR(sale_date)) (
    PARTITION p0 VALUES LESS THAN (2020),
    PARTITION p1 VALUES LESS THAN (2021),
    PARTITION p2 VALUES LESS THAN (2022),
    PARTITION p3 VALUES LESS THAN MAXVALUE
);</code></pre>
                  </div>
                </div>
              </n-collapse-item>
              
              <n-collapse-item title="执行计划分析" name="4">
                <div class="optimization-content">
                  <h4 class="font-medium text-base mb-2">使用EXPLAIN分析查询</h4>
                  <p>通过EXPLAIN可以查看SQL语句的执行计划，识别潜在的性能问题。</p>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">主要关注点</h4>
                  <ul class="list-disc list-inside space-y-2">
                    <li>查看是否使用了索引（type列不是ALL）</li>
                    <li>检查扫描的行数（rows列）</li>
                    <li>是否出现了临时表或文件排序（Extra列）</li>
                    <li>关注JOIN类型（是否是嵌套循环）</li>
                  </ul>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">示例</h4>
                  <div class="code-block">
                    <pre><code>-- MySQL执行计划分析
EXPLAIN SELECT u.name, o.order_date
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active';</code></pre>
                  </div>
                </div>
              </n-collapse-item>
            </n-collapse>
          </n-card>
        </n-tab-pane>

        <!-- SQL 语法参考 -->
        <n-tab-pane name="syntax" tab="语法参考">
          <n-card title="SQL 语法参考" class="mb-4">
            <n-tabs type="segment">
              <n-tab-pane name="mysql" tab="MySQL">
                <div class="syntax-content">
                  <h4 class="font-medium text-base mb-4">MySQL特有语法</h4>
                  
                  <div class="syntax-section">
                    <h5 class="font-medium mb-2">LIMIT 语法</h5>
                    <div class="code-block">
                      <pre><code>-- 限制结果集
SELECT * FROM users LIMIT 10;

-- 分页：跳过20条，取10条
SELECT * FROM users LIMIT 20, 10;
-- 或者
SELECT * FROM users LIMIT 10 OFFSET 20;</code></pre>
                    </div>
                  </div>
                  
                  <div class="syntax-section mt-6">
                    <h5 class="font-medium mb-2">AUTO_INCREMENT</h5>
                    <div class="code-block">
                      <pre><code>CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);</code></pre>
                    </div>
                  </div>
                  
                  <div class="syntax-section mt-6">
                    <h5 class="font-medium mb-2">日期函数</h5>
                    <div class="code-block">
                      <pre><code>-- 当前日期时间
SELECT NOW();

-- 日期格式化
SELECT DATE_FORMAT(order_date, '%Y-%m-%d') FROM orders;

-- 日期计算
SELECT DATE_ADD(order_date, INTERVAL 7 DAY) FROM orders;</code></pre>
                    </div>
                  </div>
                </div>
              </n-tab-pane>
              
              <n-tab-pane name="postgresql" tab="PostgreSQL">
                <div class="syntax-content">
                  <h4 class="font-medium text-base mb-4">PostgreSQL特有语法</h4>
                  
                  <div class="syntax-section">
                    <h5 class="font-medium mb-2">数组类型</h5>
                    <div class="code-block">
                      <pre><code>-- 创建带数组的表
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  tags TEXT[]
);

-- 插入数组数据
INSERT INTO products (name, tags) 
VALUES ('Laptop', ARRAY['electronics', 'computer', 'portable']);</code></pre>
                    </div>
                  </div>
                  
                  <div class="syntax-section mt-6">
                    <h5 class="font-medium mb-2">JSON支持</h5>
                    <div class="code-block">
                      <pre><code>-- JSON字段
CREATE TABLE config (
  id SERIAL PRIMARY KEY,
  data JSONB
);

-- 查询JSON数据
SELECT * FROM config WHERE data->>'name' = 'settings';
SELECT * FROM config WHERE data @> '{"active": true}'::jsonb;</code></pre>
                    </div>
                  </div>
                </div>
              </n-tab-pane>
              
              <n-tab-pane name="sqlserver" tab="SQL Server">
                <div class="syntax-content">
                  <h4 class="font-medium text-base mb-4">SQL Server特有语法</h4>
                  
                  <div class="syntax-section">
                    <h5 class="font-medium mb-2">TOP 语法</h5>
                    <div class="code-block">
                      <pre><code>-- 限制结果集
SELECT TOP 10 * FROM users;

-- 带百分比
SELECT TOP 5 PERCENT * FROM users;</code></pre>
                    </div>
                  </div>
                  
                  <div class="syntax-section mt-6">
                    <h5 class="font-medium mb-2">CTE（公共表达式）</h5>
                    <div class="code-block">
                      <pre><code>WITH UserOrders AS (
  SELECT 
    u.name,
    COUNT(o.id) AS order_count
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
  GROUP BY u.name
)
SELECT * FROM UserOrders
WHERE order_count > 5;</code></pre>
                    </div>
                  </div>
                </div>
              </n-tab-pane>
              
              <n-tab-pane name="oracle" tab="Oracle">
                <div class="syntax-content">
                  <h4 class="font-medium text-base mb-4">Oracle特有语法</h4>
                  
                  <div class="syntax-section">
                    <h5 class="font-medium mb-2">ROWNUM 和 ROWID</h5>
                    <div class="code-block">
                      <pre><code>-- 使用ROWNUM限制结果
SELECT * FROM users WHERE ROWNUM <= 10;

-- 分页查询
SELECT * FROM (
  SELECT a.*, ROWNUM rn FROM (
    SELECT * FROM users ORDER BY name
  ) a WHERE ROWNUM <= 20
) WHERE rn > 10;</code></pre>
                    </div>
                  </div>
                  
                  <div class="syntax-section mt-6">
                    <h5 class="font-medium mb-2">序列</h5>
                    <div class="code-block">
                      <pre><code>-- 创建序列
CREATE SEQUENCE user_seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE;

-- 使用序列
INSERT INTO users (id, name)
VALUES (user_seq.NEXTVAL, 'John Doe');</code></pre>
                    </div>
                  </div>
                </div>
              </n-tab-pane>
            </n-tabs>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  NCard, NButton, NTabs, NTabPane, NForm, NFormItem, 
  NInput, NAlert, NCollapse, NCollapseItem, NSelect 
} from 'naive-ui'
// @ts-ignore
import PageLayout from '@/components/layout/PageLayout.vue'
// @ts-ignore
import ToolsRightSidebar from '@/components/layout/ToolsRightSidebar.vue'

const router = useRouter()
const message = useMessage()

// SQL 格式化
const sqlInput = ref('')
const sqlOutput = ref('')
const sqlDialect = ref('mysql')

const dialectOptions = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'SQL Server', value: 'sqlserver' },
  { label: 'Oracle', value: 'oracle' }
]

// 加载示例 SQL
function loadSampleSql() {
  sqlInput.value = `SELECT u.user_id, u.username, u.email, u.created_at, COUNT(o.order_id) as total_orders, SUM(o.order_total) as total_spent
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE u.status = 'active' AND u.created_at > '2023-01-01'
GROUP BY u.user_id, u.username, u.email, u.created_at
HAVING COUNT(o.order_id) > 0
ORDER BY total_spent DESC
LIMIT 100;`
  formatSql()
}

// 格式化 SQL
function formatSql() {
  if (!sqlInput.value.trim()) {
    message.warning('请输入 SQL 语句')
    return
  }

  try {
    // 简单的SQL格式化逻辑
    const sql = sqlInput.value

    // 替换多个空格为单个空格
    let formatted = sql.replace(/\s+/g, ' ')
      
    // 在关键字后添加换行
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 
      'HAVING', 'ORDER BY', 'LIMIT', 'JOIN', 'LEFT JOIN', 
      'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'ON', 
      'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 
      'DELETE FROM'
    ]
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      formatted = formatted.replace(regex, `\n${keyword}`)
    })
    
    // 缩进
    formatted = formatted.split('\n').map((line, i) => {
      if (i === 0) return line.trim()
      return '    ' + line.trim()
    }).join('\n')
    
    sqlOutput.value = formatted
    message.success('SQL 格式化成功')
  } catch (error) {
    message.error('SQL 格式化失败，请检查语法')
    sqlOutput.value = error instanceof Error ? `错误: ${error.message}` : '未知错误'
  }
}

// 压缩 SQL
function minifySql() {
  if (!sqlInput.value.trim()) {
    message.warning('请输入 SQL 语句')
    return
  }

  try {
    // 删除所有换行和多余空格
    const minified = sqlInput.value
      .replace(/\s+/g, ' ')
      .trim()
    
    sqlOutput.value = minified
    message.success('SQL 压缩成功')
  } catch (error) {
    message.error('SQL 压缩失败')
    sqlOutput.value = error instanceof Error ? `错误: ${error.message}` : '未知错误'
  }
}

// 从剪贴板粘贴
async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    sqlInput.value = text
    message.success('已从剪贴板粘贴')
  } catch (error) {
    message.error('无法访问剪贴板，请检查权限')
  }
}

// 重置 SQL 输入
function resetSqlInput() {
  sqlInput.value = ''
  sqlOutput.value = ''
}

// 复制到剪贴板
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已复制到剪贴板')
  }).catch(() => {
    message.error('复制失败')
  })
}

// SQL 模板
const crudTemplates = [
  { 
    name: '基础查询', 
    sql: `SELECT column1, column2, column3
FROM table_name
WHERE condition
ORDER BY column1 ASC
LIMIT 10;`,
    description: '基本的SELECT查询语句，包含条件、排序和限制' 
  },
  { 
    name: '插入数据', 
    sql: `INSERT INTO table_name (column1, column2, column3)
VALUES 
  (value1, value2, value3),
  (value4, value5, value6);`,
    description: '向表中插入一条或多条数据' 
  },
  { 
    name: '更新数据', 
    sql: `UPDATE table_name
SET 
  column1 = value1,
  column2 = value2
WHERE condition;`,
    description: '更新表中满足条件的数据' 
  },
  { 
    name: '删除数据', 
    sql: `DELETE FROM table_name
WHERE condition;`,
    description: '删除表中满足条件的数据' 
  },
  { 
    name: '联表查询', 
    sql: `SELECT a.column1, a.column2, b.column1
FROM table1 a
JOIN table2 b ON a.common_column = b.common_column
WHERE a.column1 = value;`,
    description: '多表联查，通过共同字段关联' 
  },
  { 
    name: '分组统计', 
    sql: `SELECT 
  category,
  COUNT(*) as count,
  AVG(price) as avg_price
FROM products
GROUP BY category
HAVING COUNT(*) > 5
ORDER BY count DESC;`,
    description: '按字段分组并计算聚合统计值' 
  }
]

const tableTemplates = [
  { 
    name: '创建表', 
    sql: `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive') DEFAULT 'active',
  CONSTRAINT chk_email CHECK (email LIKE '%@%.%')
);`,
    description: '创建表结构，包含各种字段类型和约束' 
  },
  { 
    name: '添加字段', 
    sql: `ALTER TABLE table_name
ADD COLUMN new_column_name data_type [constraints];`,
    description: '向现有表中添加新的字段' 
  },
  { 
    name: '修改字段', 
    sql: `ALTER TABLE table_name
MODIFY COLUMN column_name new_data_type [constraints];`,
    description: '修改表中已有字段的数据类型或约束' 
  },
  { 
    name: '创建索引', 
    sql: `-- 创建普通索引
CREATE INDEX idx_name ON table_name(column_name);

-- 创建唯一索引
CREATE UNIQUE INDEX idx_unique_name ON table_name(column_name);

-- 创建复合索引
CREATE INDEX idx_composite ON table_name(column1, column2);`,
    description: '在表上创建各种类型的索引以提高查询性能' 
  },
  { 
    name: '创建视图', 
    sql: `CREATE VIEW view_name AS
SELECT 
  column1, 
  column2,
  column3
FROM table_name
WHERE condition;`,
    description: '创建虚拟表视图，简化复杂查询' 
  },
  { 
    name: '删除表', 
    sql: `DROP TABLE [IF EXISTS] table_name;`,
    description: '删除数据表及其所有数据' 
  }
]

const advancedTemplates = [
  { 
    name: '子查询', 
    sql: `SELECT *
FROM products
WHERE category_id IN (
  SELECT id 
  FROM categories 
  WHERE parent_id = 123
);`,
    description: '使用子查询筛选主查询的数据' 
  },
  { 
    name: '公共表表达式(CTE)', 
    sql: `WITH ranked_products AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (
      PARTITION BY category_id 
      ORDER BY price DESC
    ) AS price_rank
  FROM products
)
SELECT * FROM ranked_products
WHERE price_rank <= 3;`,
    description: '使用CTE创建临时结果集，简化复杂查询' 
  },
  { 
    name: '窗口函数', 
    sql: `SELECT
  product_name,
  category,
  price,
  AVG(price) OVER (PARTITION BY category) as category_avg,
  price - AVG(price) OVER (PARTITION BY category) as diff_from_avg,
  RANK() OVER (PARTITION BY category ORDER BY price DESC) as price_rank
FROM products;`,
    description: '使用窗口函数进行高级数据分析' 
  },
  { 
    name: '递归查询', 
    sql: `WITH RECURSIVE category_tree AS (
  -- 基础查询：获取顶级类别
  SELECT id, name, parent_id, 0 as level
  FROM categories
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- 递归部分：获取子类别
  SELECT c.id, c.name, c.parent_id, ct.level + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree
ORDER BY level, name;`,
    description: '使用递归CTE处理分层数据，如树状结构' 
  },
  { 
    name: '条件语句', 
    sql: `SELECT
  product_name,
  price,
  CASE
    WHEN price < 100 THEN '低价'
    WHEN price BETWEEN 100 AND 500 THEN '中价'
    ELSE '高价'
  END as price_category
FROM products;`,
    description: '在查询中使用CASE条件表达式' 
  },
  { 
    name: '透视表', 
    sql: `-- MySQL示例
SELECT 
  product_id,
  SUM(CASE WHEN month = 'Jan' THEN sales ELSE 0 END) as Jan_sales,
  SUM(CASE WHEN month = 'Feb' THEN sales ELSE 0 END) as Feb_sales,
  SUM(CASE WHEN month = 'Mar' THEN sales ELSE 0 END) as Mar_sales
FROM monthly_sales
GROUP BY product_id;`,
    description: '创建透视表转换行数据为列数据' 
  }
]
</script>

<style scoped>
.sql-tools-container {
  padding: 10px;
}

.sql-display-container {
  height: 400px;
  overflow: auto;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #eee;
}

.sql-output {
  font-family: monospace;
  white-space: pre;
  font-size: 13px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 10px;
}

.template-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
}

.template-header {
  background: #f0f0f0;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-header h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.template-content {
  padding: 12px;
  max-height: 180px;
  overflow: auto;
}

.template-content pre {
  font-family: monospace;
  font-size: 12px;
  white-space: pre;
  margin: 0;
}

.template-description {
  padding: 10px;
  font-size: 13px;
  color: #666;
  border-top: 1px solid #eee;
}

.code-block {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
}

.code-block pre {
  font-family: monospace;
  font-size: 12px;
  white-space: pre;
  overflow-x: auto;
  margin: 0;
}

.optimization-content code, .syntax-content code {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 13px;
}

.syntax-section {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .template-grid {
    grid-template-columns: 1fr;
  }
}
</style> 