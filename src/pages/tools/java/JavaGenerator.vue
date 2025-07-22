<template>
  <PageLayout :rightSidebar="ToolsRightSidebar">
    <div class="java-generator-container">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Java 类生成器</h1>
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
        <!-- 实体类生成器 -->
        <n-tab-pane name="entity" tab="实体类">
          <n-card title="实体类生成器" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                根据字段定义生成 Java 实体类，支持 Lombok 注解
              </n-alert>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="text-base font-medium mb-2">类配置</h3>
                <n-form>
                  <n-form-item label="类名">
                    <n-input v-model:value="entityConfig.className" placeholder="User" />
                  </n-form-item>
                  
                  <n-form-item label="包名">
                    <n-input v-model:value="entityConfig.packageName" placeholder="com.example.entity" />
                  </n-form-item>

                  <n-form-item label="选项">
                    <div class="flex flex-wrap gap-3">
                      <n-checkbox v-model:checked="entityConfig.useLombok">使用 Lombok</n-checkbox>
                      <n-checkbox v-model:checked="entityConfig.generateGetterSetter">Getter/Setter</n-checkbox>
                      <n-checkbox v-model:checked="entityConfig.generateToString">toString</n-checkbox>
                      <n-checkbox v-model:checked="entityConfig.generateBuilder">Builder</n-checkbox>
                    </div>
                  </n-form-item>
                  
                  <n-form-item label="字段">
                    <n-dynamic-input
                      v-model:value="entityConfig.fields"
                      :on-create="() => ({ name: '', type: 'String', isPrivate: true })"
                    >
                      <template #default="{ value }">
                        <div class="grid grid-cols-12 gap-2">
                          <n-select v-model:value="value.accessLevel" class="col-span-2" :options="accessLevelOptions" />
                          <n-input v-model:value="value.name" class="col-span-4" placeholder="字段名称" />
                          <n-select v-model:value="value.type" class="col-span-4" :options="typeOptions" />
                          <n-checkbox v-model:checked="value.isFinal" class="col-span-2">final</n-checkbox>
                        </div>
                      </template>
                    </n-dynamic-input>
                  </n-form-item>

                  <n-form-item>
                    <n-button type="primary" @click="generateEntityClass">生成实体类</n-button>
                  </n-form-item>
                </n-form>
              </div>

              <div>
                <h3 class="text-base font-medium mb-2">生成结果</h3>
                <div class="code-output">
                  <n-code :code="entityOutput" language="java" show-line-numbers />
                </div>
                <n-button class="mt-2" size="small" @click="copyToClipboard(entityOutput)">
                  复制代码
                </n-button>
              </div>
            </div>
          </n-card>
        </n-tab-pane>

        <!-- DTO 生成器 -->
        <n-tab-pane name="dto" tab="DTO/VO">
          <n-card title="DTO/VO 生成器" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                生成数据传输对象（DTO）或视图对象（VO）
              </n-alert>
            </div>
            
            <div class="flex justify-center items-center py-10">
              <n-empty description="功能开发中，敬请期待" />
            </div>
          </n-card>
        </n-tab-pane>

        <!-- Controller 生成器 -->
        <n-tab-pane name="controller" tab="Controller">
          <n-card title="Controller 生成器" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                生成 Spring MVC Controller 类
              </n-alert>
            </div>
            
            <div class="flex justify-center items-center py-10">
              <n-empty description="功能开发中，敬请期待" />
            </div>
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
  NInput, NSelect, NDynamicInput, NAlert, NCheckbox,
  NEmpty, NCode
} from 'naive-ui'
// @ts-ignore
import PageLayout from '@/components/layout/PageLayout.vue'
// @ts-ignore
import ToolsRightSidebar from '@/components/layout/ToolsRightSidebar.vue'

const router = useRouter()
const message = useMessage()

// 实体类生成器
const entityConfig = ref({
  className: 'User',
  packageName: 'com.example.entity',
  useLombok: true,
  generateGetterSetter: true,
  generateToString: true,
  generateBuilder: false,
  fields: [
    { name: 'id', type: 'Long', accessLevel: 'private', isFinal: false },
    { name: 'username', type: 'String', accessLevel: 'private', isFinal: false },
    { name: 'email', type: 'String', accessLevel: 'private', isFinal: false },
    { name: 'createTime', type: 'LocalDateTime', accessLevel: 'private', isFinal: false }
  ]
})

const accessLevelOptions = [
  { label: 'private', value: 'private' },
  { label: 'protected', value: 'protected' },
  { label: 'public', value: 'public' }
]

const typeOptions = [
  { label: 'String', value: 'String' },
  { label: 'Integer', value: 'Integer' },
  { label: 'Long', value: 'Long' },
  { label: 'Boolean', value: 'Boolean' },
  { label: 'Double', value: 'Double' },
  { label: 'Float', value: 'Float' },
  { label: 'BigDecimal', value: 'BigDecimal' },
  { label: 'LocalDate', value: 'LocalDate' },
  { label: 'LocalDateTime', value: 'LocalDateTime' },
  { label: 'Date', value: 'Date' },
  { label: 'List<String>', value: 'List<String>' },
  { label: 'Map<String, Object>', value: 'Map<String, Object>' }
]

const entityOutput = ref(`package com.example.entity;

import java.time.LocalDateTime;
import lombok.Data;

/**
 * User 实体类
 */
@Data
public class User {
    private Long id;
    private String username;
    private String email;
    private LocalDateTime createTime;
}`)

function generateEntityClass() {
  const { className, packageName, useLombok, generateGetterSetter, generateToString, generateBuilder, fields } = entityConfig.value
  
  // 收集需要导入的包
  const imports = new Set<string>()
  
  // 检查字段类型是否需要导入
  fields.forEach(field => {
    if (field.type === 'LocalDate' || field.type === 'LocalDateTime') {
      imports.add('java.time.' + field.type)
    } else if (field.type === 'Date') {
      imports.add('java.util.Date')
    } else if (field.type === 'BigDecimal') {
      imports.add('java.math.BigDecimal')
    } else if (field.type.startsWith('List')) {
      imports.add('java.util.List')
    } else if (field.type.startsWith('Map')) {
      imports.add('java.util.Map')
    }
  })
  
  // Lombok 相关导入
  if (useLombok) {
    if (generateGetterSetter) imports.add('lombok.Data')
    else {
      if (generateGetterSetter) {
        imports.add('lombok.Getter')
        imports.add('lombok.Setter')
      }
      if (generateToString) imports.add('lombok.ToString')
    }
    if (generateBuilder) imports.add('lombok.Builder')
  }
  
  // 生成代码
  let code = `package ${packageName};\n\n`
  
  // 导入语句
  const sortedImports = Array.from(imports).sort()
  if (sortedImports.length > 0) {
    sortedImports.forEach(imp => {
      code += `import ${imp};\n`
    })
    code += '\n'
  }
  
  // 类注释
  code += `/**\n * ${className} 实体类\n */\n`
  
  // 类注解
  if (useLombok) {
    if (generateGetterSetter) code += '@Data\n'
    else {
      if (generateGetterSetter) code += '@Getter\n@Setter\n'
      if (generateToString) code += '@ToString\n'
    }
    if (generateBuilder) code += '@Builder\n'
  }
  
  // 类定义
  code += `public class ${className} {\n`
  
  // 字段
  fields.forEach(field => {
    const finalModifier = field.isFinal ? 'final ' : ''
    code += `    ${field.accessLevel} ${finalModifier}${field.type} ${field.name};\n`
  })
  
  // 如果不使用 Lombok，生成 getter 和 setter
  if (!useLombok && generateGetterSetter) {
    code += '\n'
    fields.forEach(field => {
      const capitalizedName = field.name.charAt(0).toUpperCase() + field.name.slice(1)
      
      // Getter
      code += `    public ${field.type} get${capitalizedName}() {\n`
      code += `        return ${field.name};\n`
      code += `    }\n\n`
      
      // Setter (只有非 final 字段才生成 setter)
      if (!field.isFinal) {
        code += `    public void set${capitalizedName}(${field.type} ${field.name}) {\n`
        code += `        this.${field.name} = ${field.name};\n`
        code += `    }\n\n`
      }
    })
  }
  
  // 如果不使用 Lombok，生成 toString
  if (!useLombok && generateToString) {
    code += `    @Override\n`
    code += `    public String toString() {\n`
    code += `        return "${className}{" +\n`
    
    fields.forEach((field, index) => {
      if (index === 0) {
        code += `            "${field.name}=" + ${field.name}`
      } else {
        code += ` +\n            ", ${field.name}=" + ${field.name}`
      }
    })
    
    code += ` +\n            "}";\n`
    code += `    }\n`
  }
  
  code += '}'
  
  entityOutput.value = code
  message.success('实体类生成成功')
}

// 复制到剪贴板
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已复制到剪贴板')
  }).catch(() => {
    message.error('复制失败')
  })
}
</script>

<style scoped>
.java-generator-container {
  padding: 10px;
}

.code-output {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: auto;
  max-height: 500px;
}
</style> 