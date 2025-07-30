<template>
  <div class="tools-container">
    <div class="content-container">
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

        <!-- SQL 优化技巧 -->
        <n-tab-pane name="optimization" tab="优化技巧">
          <n-card title="SQL 优化技巧" class="mb-4">
            <n-collapse>
              <n-collapse-item title="索引优化" name="1">
                <div class="tip-content">
                  <h4 class="tip-title">合理使用索引</h4>
                  <ul class="tip-list">
                    <li>为经常用于查询条件的列创建索引（WHERE 子句）</li>
                    <li>为经常用于连接的列创建索引（JOIN 子句）</li>
                    <li>为经常用于排序的列创建索引（ORDER BY 子句）</li>
                    <li>避免在低基数列上创建索引（如性别列）</li>
                    <li>考虑复合索引时将选择性高的列放在前面</li>
                  </ul>

                  <div class="code-example">
                    <h5>索引示例：</h5>
                    <pre>-- 为单一列创建索引
CREATE INDEX idx_user_email ON users(email);

-- 创建复合索引（联合索引）
CREATE INDEX idx_user_name_age ON users(last_name, first_name, age);

-- 创建唯一索引
CREATE UNIQUE INDEX idx_user_username ON users(username);</pre>
                  </div>
                </div>
              </n-collapse-item>

              <n-collapse-item title="查询优化" name="2">
                <div class="tip-content">
                  <h4 class="tip-title">查询性能优化</h4>
                  <ul class="tip-list">
                    <li>避免使用 SELECT *，只查询需要的列</li>
                    <li>使用 LIMIT 限制返回行数</li>
                    <li>使用 EXPLAIN 分析查询执行计划</li>
                    <li>使用覆盖索引减少回表查询</li>
                    <li>避免在 WHERE 子句中使用函数，会阻止使用索引</li>
                  </ul>

                  <div class="code-example">
                    <h5>优化前：</h5>
                    <pre>SELECT * FROM users WHERE YEAR(birth_date) = 1990;</pre>
                    <h5>优化后：</h5>
                    <pre>SELECT id, name, email FROM users 
WHERE birth_date BETWEEN '1990-01-01' AND '1990-12-31';</pre>
                  </div>
                </div>
              </n-collapse-item>

              <n-collapse-item title="JOIN 优化" name="3">
                <div class="tip-content">
                  <h4 class="tip-title">JOIN 操作优化</h4>
                  <ul class="tip-list">
                    <li>小表驱动大表（从小表开始JOIN）</li>
                    <li>确保 JOIN 列上有索引</li>
                    <li>避免多表 JOIN（超过3个表的JOIN通常需要重新设计）</li>
                    <li>考虑使用子查询替代某些 JOIN</li>
                  </ul>

                  <div class="code-example">
                    <h5>优化前：</h5>
                    <pre>SELECT u.*, o.* 
FROM orders o 
JOIN users u ON o.user_id = u.id 
WHERE o.status = 'completed';</pre>
                    <h5>优化后：</h5>
                    <pre>SELECT u.name, u.email, o.order_number, o.total 
FROM (SELECT * FROM orders WHERE status = 'completed') o
JOIN users u ON o.user_id = u.id;</pre>
                  </div>
                </div>
              </n-collapse-item>

              <n-collapse-item title="分页优化" name="4">
                <div class="tip-content">
                  <h4 class="tip-title">大数据分页优化</h4>
                  <ul class="tip-list">
                    <li>避免使用 OFFSET 进行深度分页</li>
                    <li>使用"延续分页"模式（记住上次查询的最后一个ID）</li>
                    <li>考虑使用覆盖索引优化分页查询</li>
                  </ul>

                  <div class="code-example">
                    <h5>优化前（低效率深度分页）：</h5>
                    <pre>SELECT * FROM products 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 10000;</pre>
                    <h5>优化后（使用延续模式）：</h5>
                    <pre>-- 假设上次查询返回的最后一条记录ID是9876，创建时间是'2023-01-01 12:00:00'
SELECT * FROM products 
WHERE (created_at &lt; '2023-01-01 12:00:00' OR 
       (created_at = '2023-01-01 12:00:00' AND id &lt; 9876))
ORDER BY created_at DESC, id DESC 
LIMIT 20;</pre>
                  </div>
                </div>
              </n-collapse-item>
            </n-collapse>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  NCard, NButton, NTabs, NTabPane, NInput, 
  NAlert, NSelect, NCollapse, NCollapseItem 
} from 'naive-ui'

const router = useRouter()
const message = useMessage()

// SQL 格式化部分
const sqlInput = ref('')
const sqlOutput = ref('')
const sqlDialect = ref('mysql')

const dialectOptions = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'SQL Server', value: 'sqlserver' },
  { label: 'Oracle', value: 'oracle' }
]

function loadSampleSql() {
  sqlInput.value = `SELECT u.id, u.username, u.email, p.title, p.content
FROM users u 
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.status = 'active' AND p.published_date > '2023-01-01'
ORDER BY p.published_date DESC
LIMIT 10;`
}

function resetSqlInput() {
  sqlInput.value = ''
  sqlOutput.value = ''
}

function formatSql() {
  try {
    // 这里是一个简单的 SQL 格式化实现
    // 真实应用应该使用专门的 SQL 解析和格式化库
    let formatted = sqlInput.value
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*=\s*/g, ' = ')
      .replace(/\s*>\s*/g, ' > ')
      .replace(/\s*<\s*/g, ' < ')
      .replace(/\s*;\s*/g, ';')
      
    // 处理关键字
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
                      'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 
                      'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'AND', 'OR']
                      
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      formatted = formatted.replace(regex, '\n' + keyword.toUpperCase())
    }
    
    // 特殊处理一些子句的缩进
    formatted = formatted
      .replace(/\nFROM/g, '\nFROM')
      .replace(/\nJOIN/g, '\n  JOIN')
      .replace(/\nLEFT JOIN/g, '\n  LEFT JOIN')
      .replace(/\nRIGHT JOIN/g, '\n  RIGHT JOIN')
      .replace(/\nINNER JOIN/g, '\n  INNER JOIN')
      .replace(/\nWHERE/g, '\nWHERE')
      .replace(/\nAND/g, '\n  AND')
      .replace(/\nOR/g, '\n  OR')
      .replace(/\nGROUP BY/g, '\nGROUP BY')
      .replace(/\nORDER BY/g, '\nORDER BY')
      .replace(/\nHAVING/g, '\nHAVING')
      .replace(/\nLIMIT/g, '\nLIMIT')
    
    sqlOutput.value = formatted.trim()
    message.success('SQL 格式化成功')
  } catch (error) {
    sqlOutput.value = `错误: ${(error as Error).message}`
    message.error('SQL 格式化失败')
  }
}

function minifySql() {
  try {
    // 压缩 SQL（移除多余空格和换行）
    const minified = sqlInput.value
      .replace(/\s+/g, ' ')
      .trim()
      
    sqlOutput.value = minified
    message.success('SQL 压缩成功')
  } catch (error) {
    sqlOutput.value = `错误: ${(error as Error).message}`
    message.error('SQL 压缩失败')
  }
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    sqlInput.value = text
    message.success('已从剪贴板粘贴')
  } catch (error) {
    message.error('无法访问剪贴板')
  }
}

// SQL 模板
const crudTemplates = [
  {
    name: '查询 - 基础 SELECT',
    sql: `SELECT column1, column2, column3
FROM table_name
WHERE condition
ORDER BY column1 DESC
LIMIT 10;`,
    description: '基础查询语句，包含选择、条件过滤、排序和限制结果数'
  },
  {
    name: '插入 - INSERT',
    sql: `INSERT INTO table_name (column1, column2, column3)
VALUES (value1, value2, value3);`,
    description: '向表中插入一行新数据'
  },
  {
    name: '批量插入 - Multiple INSERT',
    sql: `INSERT INTO table_name (column1, column2, column3)
VALUES 
  (value1_1, value1_2, value1_3),
  (value2_1, value2_2, value2_3),
  (value3_1, value3_2, value3_3);`,
    description: '向表中一次性插入多行数据'
  },
  {
    name: '更新 - UPDATE',
    sql: `UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;`,
    description: '更新表中满足条件的行'
  },
  {
    name: '删除 - DELETE',
    sql: `DELETE FROM table_name
WHERE condition;`,
    description: '从表中删除满足条件的行'
  },
  {
    name: '连接查询 - JOIN',
    sql: `SELECT t1.column1, t1.column2, t2.column1
FROM table1 t1
JOIN table2 t2 ON t1.column3 = t2.column3
WHERE t1.column4 = value;`,
    description: '通过外键连接两个表查询相关数据'
  }
]

const tableTemplates = [
  {
    name: '创建表 - CREATE TABLE',
    sql: `CREATE TABLE table_name (
  id INT PRIMARY KEY AUTO_INCREMENT,
  column1 VARCHAR(100) NOT NULL,
  column2 INT,
  column3 DATE,
  column4 DECIMAL(10, 2),
  CONSTRAINT fk_constraint_name 
    FOREIGN KEY (column2) REFERENCES other_table(id)
);`,
    description: '创建新表，定义列类型、主键、外键等约束'
  },
  {
    name: '添加列 - ADD COLUMN',
    sql: `ALTER TABLE table_name
ADD COLUMN new_column VARCHAR(50);`,
    description: '向现有表中添加新列'
  },
  {
    name: '修改列 - MODIFY COLUMN',
    sql: `ALTER TABLE table_name
MODIFY COLUMN column_name VARCHAR(200) NOT NULL;`,
    description: '修改表中列的数据类型或约束'
  },
  {
    name: '删除列 - DROP COLUMN',
    sql: `ALTER TABLE table_name
DROP COLUMN column_name;`,
    description: '从表中删除不需要的列'
  },
  {
    name: '添加索引 - CREATE INDEX',
    sql: `CREATE INDEX index_name
ON table_name (column1, column2);`,
    description: '在表的列上创建索引以提高查询性能'
  },
  {
    name: '删除表 - DROP TABLE',
    sql: `DROP TABLE table_name;`,
    description: '删除整个表及其所有数据'
  }
]

const advancedTemplates = [
  {
    name: '子查询 - Subquery',
    sql: `SELECT column1, column2
FROM table1
WHERE column3 IN (
  SELECT column3
  FROM table2
  WHERE condition
);`,
    description: '使用子查询筛选满足嵌套查询条件的记录'
  },
  {
    name: '分组聚合 - GROUP BY',
    sql: `SELECT category, COUNT(*) as count, AVG(price) as avg_price
FROM products
WHERE price > 0
GROUP BY category
HAVING COUNT(*) > 5
ORDER BY count DESC;`,
    description: '按类别分组并计算聚合函数，如计数、平均值等'
  },
  {
    name: '通用表表达式 - WITH CTE',
    sql: `WITH ranked_products AS (
  SELECT 
    product_name,
    category,
    price,
    RANK() OVER (PARTITION BY category ORDER BY price DESC) as price_rank
  FROM products
)
SELECT product_name, category, price
FROM ranked_products
WHERE price_rank <= 3;`,
    description: '使用CTE创建临时结果集，简化复杂查询'
  },
  {
    name: '窗口函数 - Window Function',
    sql: `SELECT 
  order_id,
  order_date,
  total_amount,
  SUM(total_amount) OVER (
    PARTITION BY customer_id 
    ORDER BY order_date
  ) as running_total
FROM orders
WHERE order_date >= '2023-01-01';`,
    description: '使用窗口函数进行分析计算，不合并行'
  },
  {
    name: '递归查询 - Recursive CTE',
    sql: `WITH RECURSIVE subordinates AS (
  -- 起始成员
  SELECT employee_id, manager_id, name, 0 as depth
  FROM employees
  WHERE employee_id = 1
  
  UNION ALL
  
  -- 递归部分
  SELECT e.employee_id, e.manager_id, e.name, s.depth + 1
  FROM employees e
  JOIN subordinates s ON e.manager_id = s.employee_id
)
SELECT * FROM subordinates;`,
    description: '使用递归CTE查询分层数据，如组织结构树'
  },
  {
    name: 'CASE 条件表达式',
    sql: `SELECT 
  product_name,
  price,
  CASE 
    WHEN price < 100 THEN 'Budget'
    WHEN price BETWEEN 100 AND 500 THEN 'Mid-range'
    ELSE 'Premium'
  END as price_category
FROM products;`,
    description: '使用CASE表达式进行条件逻辑和分类'
  }
]

// 复制到剪贴板
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已复制到剪贴板')
  }).catch(() => {
    message.error('复制失败')
  })
}

// 设置页面标题
onMounted(() => {
  document.title = '薯条-SQL工具'
})
</script>

<style scoped>
.tools-container {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  background-color: white;
  overflow-y: auto;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
}

.sql-display-container {
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #eee;
  padding: 16px;
  overflow: auto;
  max-height: 400px;
}

.sql-output {
  font-family: monospace;
  white-space: pre;
  font-size: 14px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.template-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.template-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.template-content {
  background-color: #f0f0f0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  overflow: auto;
}

.template-content pre {
  font-family: monospace;
  white-space: pre;
  font-size: 13px;
  margin: 0;
}

.template-description {
  font-size: 13px;
  color: #666;
}

.tip-content {
  padding: 8px;
}

.tip-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.tip-list {
  margin-left: 24px;
  margin-bottom: 16px;
}

.tip-list li {
  margin-bottom: 8px;
}

.code-example {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
}

.code-example h5 {
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 8px;
}

.code-example pre {
  font-family: monospace;
  white-space: pre;
  font-size: 13px;
  background-color: #f0f0f0;
  padding: 12px;
  border-radius: 6px;
  overflow: auto;
}

@media (max-width: 768px) {
  .content-container {
    padding: 15px;
  }
  
  .template-grid {
    grid-template-columns: 1fr;
  }
}
</style> 