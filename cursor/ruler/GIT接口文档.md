# Git命令接口文档

## 1. 数据库表结构

```sql
DROP TABLE IF EXISTS aaa_hbyd.git_command_management;
CREATE TABLE aaa_hbyd.git_command_management (
    id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
    command_name varchar(100) NOT NULL COMMENT 'Git命令名称',
    command_content text NOT NULL COMMENT 'Git命令内容',
    description text COMMENT '命令描述',
    category_code tinyint(2) DEFAULT 1 COMMENT '分类代码，1-常用命令 2-分支操作 3-提交管理 4-远程仓库 5-高级操作',
    usage_scenario varchar(255) DEFAULT NULL COMMENT '使用场景',
    is_favorite tinyint(1) DEFAULT 0 COMMENT '是否收藏，0-否 1-是',
    is_composite tinyint(1) DEFAULT 0 COMMENT '是否组合命令，0-否 1-是',
    execution_count int DEFAULT 0 COMMENT '执行次数',
    author varchar(100) DEFAULT NULL COMMENT '创建者',
    status tinyint(1) NOT NULL DEFAULT 1 COMMENT '状态，0-无效，1-有效',
    create_dt datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_dt datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_category_code (category_code),
    INDEX idx_is_favorite (is_favorite),
    INDEX idx_is_composite (is_composite),
    INDEX idx_create_dt (create_dt),
    UNIQUE KEY uk_command_name_author (command_name, author)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Git命令管理表';

-- 组合命令子命令表
CREATE TABLE aaa_hbyd.git_command_detail (
    id bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
    command_id bigint(20) NOT NULL COMMENT '主命令ID，关联git_command_management.id',
    sub_command_content text NOT NULL COMMENT '子命令内容',
    sequence_number int NOT NULL COMMENT '命令执行顺序',
    description varchar(255) DEFAULT NULL COMMENT '子命令描述',
    status tinyint(1) NOT NULL DEFAULT 1 COMMENT '状态，0-无效，1-有效',
    create_dt datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_dt datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX idx_command_id (command_id),
    INDEX idx_sequence_number (sequence_number)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Git组合命令明细表';
```

## 2. API 接口详细说明

### 2.1 查询Git命令列表

**接口说明**：根据条件查询Git命令列表，支持分页、分类筛选和关键词搜索

**请求路径**：`/api/git/command/search`

**请求方式**：`POST`

**请求参数**：
```json
{
  "username": "string",    // 用户名，必填
  "categoryCode": 0,       // 分类代码，0表示全部，1-常用命令 2-分支操作 3-提交管理 4-远程仓库 5-高级操作，可选，默认0
  "keyword": "string",     // 关键词搜索，可选，默认空字符串
  "isFavorite": false,     // 是否只查询收藏，可选，默认false
  "isComposite": null,     // 是否只查询组合命令，null表示全部，true表示组合命令，false表示普通命令，可选，默认null
  "page": 1,               // 页码，可选，默认1
  "pageSize": 20           // 每页数量，可选，默认20
}
```

**响应参数**：
```json
{
  "code": 200,             // 状态码，200表示成功
  "msg": "success",        // 状态描述
  "data": {
    "list": [              // Git命令列表
      {
        "id": 1,                             // 命令ID
        "commandName": "提交并推送",          // 命令名称
        "commandContent": "git commit -m \"message\" && git push", // 命令内容
        "description": "提交更改并推送到远程仓库", // 描述
        "categoryCode": 1,                   // 分类代码
        "categoryName": "常用命令",           // 分类名称
        "usageScenario": "提交本地更改到远程", // 使用场景
        "isFavorite": true,                  // 是否收藏
        "isComposite": false,                // 是否组合命令
        "executionCount": 5,                 // 执行次数
        "author": "qianhu",                  // 创建者
        "createDt": "2023-07-28 09:30:00",   // 创建时间
        "updateDt": "2023-07-28 09:30:00"    // 更新时间
      },
      {
        "id": 2,                             // 命令ID
        "commandName": "拉取并合并更新",       // 命令名称
        "commandContent": "组合命令：拉取并合并远程更新", // 命令内容描述
        "description": "从远程拉取代码并合并到本地分支", // 描述
        "categoryCode": 2,                   // 分类代码
        "categoryName": "分支操作",           // 分类名称
        "usageScenario": "代码同步",          // 使用场景
        "isFavorite": false,                 // 是否收藏
        "isComposite": true,                 // 是否组合命令
        "subCommands": [                     // 子命令列表，仅当isComposite=true时返回
          {
            "id": 10,                        // 子命令ID
            "subCommandContent": "git fetch origin", // 子命令内容
            "sequenceNumber": 1,             // 执行顺序
            "description": "拉取远程更新"      // 子命令描述
          },
          {
            "id": 11,
            "subCommandContent": "git merge origin/main",
            "sequenceNumber": 2,
            "description": "合并远程更新到当前分支"
          }
        ],
        "executionCount": 3,                 // 执行次数
        "author": "qianhu",                  // 创建者
        "createDt": "2023-07-28 10:30:00",   // 创建时间
        "updateDt": "2023-07-28 10:30:00"    // 更新时间
      }
    ],
    "total": 12,           // 总记录数
    "page": 1,             // 当前页码
    "pageSize": 20         // 每页数量
  }
}
```

### 2.2 创建Git命令

**接口说明**：创建一条新的Git命令记录

**请求路径**：`/api/git/command/create`

**请求方式**：`POST`

**请求参数**：
```json
{
  "commandName": "string",      // 命令名称，必填
  "commandContent": "string",   // 命令内容，必填
  "description": "string",      // 描述，可选
  "categoryCode": 1,            // 分类代码，1-常用命令 2-分支操作 3-提交管理 4-远程仓库 5-高级操作，必填
  "usageScenario": "string",    // 使用场景，可选
  "isFavorite": false,          // 是否收藏，可选，默认false
  "isComposite": false,         // 是否为组合命令，可选，默认false
  "subCommands": [              // 子命令列表，当isComposite=true时必填
    {
      "subCommandContent": "git fetch origin", // 子命令内容，必填
      "sequenceNumber": 1,      // 执行顺序，必填
      "description": "拉取远程更新" // 子命令描述，可选
    },
    {
      "subCommandContent": "git merge origin/main",
      "sequenceNumber": 2,
      "description": "合并远程更新到当前分支"
    }
  ],
  "author": "string"            // 创建者，必填
}
```

**响应参数**：
```json
{
  "code": 200,             // 状态码，200表示成功
  "msg": "success",        // 状态描述
  "data": {
    "id": 13               // 新创建的命令ID
  }
}
```

### 2.3 更新Git命令

**接口说明**：更新已有的Git命令记录

**请求路径**：`/api/git/command/update`

**请求方式**：`POST`

**请求参数**：
```json
{
  "id": 1,                     // 命令ID，必填
  "commandName": "string",     // 命令名称，必填
  "commandContent": "string",  // 命令内容，必填
  "description": "string",     // 描述，可选
  "categoryCode": 1,           // 分类代码，1-常用命令 2-分支操作 3-提交管理 4-远程仓库 5-高级操作，必填
  "usageScenario": "string",   // 使用场景，可选
  "isFavorite": false,         // 是否收藏，必填
  "isComposite": false,        // 是否为组合命令，必填
  "subCommands": [             // 子命令列表，当isComposite=true时必填
    {
      "id": 10,                // 子命令ID，已存在的子命令必填，新增子命令不填
      "subCommandContent": "git fetch origin", // 子命令内容，必填
      "sequenceNumber": 1,     // 执行顺序，必填
      "description": "拉取远程更新" // 子命令描述，可选
    },
    {
      "subCommandContent": "git merge origin/main",
      "sequenceNumber": 2,
      "description": "合并远程更新到当前分支"
    }
  ]
}
```

**响应参数**：
```json
{
  "code": 200,             // 状态码，200表示成功
  "msg": "success",        // 状态描述
  "data": true             // 操作结果，true表示成功，false表示失败
}
```

### 2.4 删除Git命令

**接口说明**：删除指定ID的Git命令记录

**请求路径**：`/api/git/command/delete`

**请求方式**：`POST`

**请求参数**：
```json
{
  "id": 1                  // 命令ID，必填
}
```

**响应参数**：
```json
{
  "code": 200,             // 状态码，200表示成功
  "msg": "success",        // 状态描述
  "data": true             // 操作结果，true表示成功，false表示失败
}
```

### 2.5 获取Git命令统计信息

**接口说明**：获取用户Git命令的统计信息，包括总数、分类分布、使用频率等

**请求路径**：`/api/git/command/statistics`

**请求方式**：`POST`

**请求参数**：
```json
{
  "username": "string"     // 用户名，必填
}
```

**响应参数**：
```json
{
  "code": 200,             // 状态码，200表示成功
  "msg": "success",        // 状态描述
  "data": {
    "total": 15,                         // 总命令数
    "favoriteCount": 5,                  // 收藏命令数
    "compositeCount": 3,                 // 组合命令数
    "mostUsedCommands": [                // 最常用命令Top5
      {
        "id": 3,
        "commandName": "查看日志",
        "commandContent": "git log --oneline --graph",
        "executionCount": 20,
        "isComposite": false
      }
      // 更多常用命令...
    ],
    "categoryDistribution": [            // 各分类分布
      { 
        "categoryCode": 1, 
        "categoryName": "常用命令", 
        "count": 6 
      },
      { 
        "categoryCode": 2, 
        "categoryName": "分支操作", 
        "count": 4 
      },
      { 
        "categoryCode": 3, 
        "categoryName": "提交管理", 
        "count": 3 
      },
      { 
        "categoryCode": 4, 
        "categoryName": "远程仓库", 
        "count": 2 
      },
      { 
        "categoryCode": 5, 
        "categoryName": "高级操作", 
        "count": 1 
      }
    ],
    "recentlyAddedCommands": [          // 最近添加的命令
      {
        "id": 15,
        "commandName": "清理未跟踪文件",
        "createDt": "2023-08-01 10:30:00",
        "isComposite": false
      }
      // 更多最近命令...
    ]
  }
}
```

### 2.6 切换命令收藏状态

**接口说明**：快速切换Git命令的收藏状态

**请求路径**：`/api/git/command/toggleFavorite`

**请求方式**：`POST`

**请求参数**：
```json
{
  "id": 1,                 // 命令ID，必填
  "isFavorite": true       // 是否收藏，必填
}
```

**响应参数**：
```json
{
  "code": 200,             // 状态码，200表示成功
  "msg": "success",        // 状态描述
  "data": true             // 操作结果，true表示成功，false表示失败
}
```

### 2.7 记录命令执行

**接口说明**：记录Git命令的执行次数

**请求路径**：`/api/git/command/recordExecution`

**请求方式**：`POST`

**请求参数**：
```json
{
  "id": 1                  // 命令ID，必填
}
```

**响应参数**：
```json
{
  "code": 200,             // 状态码，200表示成功
  "msg": "success",        // 状态描述
  "data": {
    "executionCount": 6    // 更新后的执行次数
  }
}
```

## 3. 前端接口封装示例

```typescript
// src/services/gitApi.ts

// Git子命令接口类型
export interface GitSubCommand {
  id?: number;
  subCommandContent: string;
  sequenceNumber: number;
  description?: string;
}

// Git命令接口类型
export interface GitCommand {
  id: number;
  commandName: string;
  commandContent: string;
  description?: string;
  categoryCode: number;
  categoryName?: string;
  usageScenario?: string;
  isFavorite: boolean;
  isComposite: boolean;
  subCommands?: GitSubCommand[];  // 子命令列表，仅当isComposite=true时有效
  executionCount: number;
  author: string;
  createDt: string;
  updateDt: string;
}

// Git命令搜索参数
export interface GitCommandSearchParams {
  username: string;
  categoryCode?: number;
  keyword?: string;
  isFavorite?: boolean;
  isComposite?: boolean;  // 是否只查询组合命令
  page?: number;
  pageSize?: number;
}

// Git子命令创建参数
export interface GitSubCommandCreateParams {
  subCommandContent: string;
  sequenceNumber: number;
  description?: string;
}

// Git子命令更新参数
export interface GitSubCommandUpdateParams {
  id?: number;  // 已存在的子命令必填，新增子命令不填
  subCommandContent: string;
  sequenceNumber: number;
  description?: string;
}

// Git命令创建参数
export interface GitCommandCreateParams {
  commandName: string;
  commandContent: string;
  description?: string;
  categoryCode: number;
  usageScenario?: string;
  isFavorite?: boolean;
  isComposite?: boolean;
  subCommands?: GitSubCommandCreateParams[];  // 当isComposite=true时必填
  author: string;
}

// Git命令更新参数
export interface GitCommandUpdateParams {
  id: number;
  commandName: string;
  commandContent: string;
  description?: string;
  categoryCode: number;
  usageScenario?: string;
  isFavorite: boolean;
  isComposite: boolean;
  subCommands?: GitSubCommandUpdateParams[];  // 当isComposite=true时必填
}

// 分类统计接口
export interface CategoryStat {
  categoryCode: number;
  categoryName: string;
  count: number;
}

// 常用命令统计
export interface MostUsedCommand {
  id: number;
  commandName: string;
  commandContent: string;
  executionCount: number;
  isComposite: boolean;
}

// 最近添加命令
export interface RecentCommand {
  id: number;
  commandName: string;
  createDt: string;
  isComposite: boolean;
}

// Git命令统计响应接口
export interface GitCommandStatistics {
  total: number;
  favoriteCount: number;
  compositeCount: number;
  mostUsedCommands: MostUsedCommand[];
  categoryDistribution: CategoryStat[];
  recentlyAddedCommands: RecentCommand[];
}

// 搜索Git命令
export function searchGitCommands(params: GitCommandSearchParams) {
  return request({
    url: '/api/git/command/search',
    method: 'post',
    data: params
  });
}

// 创建Git命令
export function createGitCommand(params: GitCommandCreateParams) {
  return request({
    url: '/api/git/command/create',
    method: 'post',
    data: params
  });
}

// 更新Git命令
export function updateGitCommand(params: GitCommandUpdateParams) {
  return request({
    url: '/api/git/command/update',
    method: 'post',
    data: params
  });
}

// 删除Git命令
export function deleteGitCommand(id: number) {
  return request({
    url: '/api/git/command/delete',
    method: 'post',
    data: { id }
  });
}

// 获取Git命令统计
export function getGitCommandStatistics(username: string) {
  return request({
    url: '/api/git/command/statistics',
    method: 'post',
    data: { username }
  });
}

// 切换收藏状态
export function toggleGitCommandFavorite(id: number, isFavorite: boolean) {
  return request({
    url: '/api/git/command/toggleFavorite',
    method: 'post',
    data: { id, isFavorite }
  });
}

// 记录命令执行
export function recordGitCommandExecution(id: number) {
  return request({
    url: '/api/git/command/recordExecution',
    method: 'post',
    data: { id }
  });
}
```

## 4. 错误码定义

| 错误码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突(如命令名称重复) |
| 500 | 服务器内部错误 |

## 5. 接口实现建议

1. 使用Spring Boot框架实现后端接口
2. 使用Mybatis-Plus进行数据库操作
3. 实现统一的响应格式和异常处理机制
4. 对重要操作增加日志记录
5. 考虑使用Redis缓存热门命令和统计数据，提高访问性能
6. 实现命令搜索时的模糊匹配和关键词高亮功能
7. 在前端实现命令一键复制和执行功能
8. 考虑添加Git命令模板功能，支持参数化配置

## 6. 组合命令实现建议

1. 组合命令的执行应该按照子命令的sequence_number顺序依次执行
2. 前端可以提供组合命令的可视化编辑界面，支持拖拽排序
3. 每个子命令执行后应该检查返回值，决定是否继续执行下一条子命令
4. 考虑增加子命令之间的依赖关系，支持条件执行
5. 提供组合命令执行日志，方便用户排查问题
6. 组合命令可以考虑支持参数化，允许在运行时传入变量 